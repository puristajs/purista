---
title: Reliability and delivery guarantees
description: Design handlers for timeouts, duplicate delivery, retries, and recovery instead of assuming exactly-once execution.
order: 260
---

Reliability is a property of the whole path: handler, bridge, store, external service, and deployment. A successful local test does not prove durable distributed delivery.

## The minimum rules

- Make externally visible side effects idempotent before enabling retry.
- Use a stable business key, not a random retry attempt, to detect repeated work.
- Set a timeout that fits the caller's contract; move slow work to a queue.
- Return an explicit subscription outcome: acknowledge, retry, dead-letter, drop, or stop the consumer according to the failure.
- Record enough non-sensitive operational context to diagnose a failure without logging payloads or credentials.

| Situation | Safe design |
| --- | --- |
| A notification request times out after the provider may have accepted it | Persist a delivery key and reconcile before retrying. |
| A queue worker crashes after a side effect | Make the provider call idempotent, then allow lease recovery/retry. |
| A subscriber cannot parse a message | Dead-letter or stop according to policy; do not endlessly retry an invalid contract. |

Choose the bridge and queue adapter based on required durability and recovery behavior in [Connect distributed infrastructure](/handbook/framework/connect-distributed-infrastructure/).
