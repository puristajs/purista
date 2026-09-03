---
title: Reliability
description: Design explicit timeout, retry, idempotency, shutdown, and recovery behavior for every service path.
order: 1030
---

Reliability comes from the composed system. A command, bridge, queue, resource, store, and deployment must agree on what happens when a request times out, a process restarts, or a side effect may already have happened.

Start by naming the failure that matters. A retry setting alone cannot make a side effect safe, and a durable queue alone cannot decide whether replay is acceptable.

```mermaid title="At-least-once work must make the business effect idempotent"
flowchart LR
  M[Message or leased job] --> K[Load stable business key]
  K --> D{Effect already recorded?}
  D -->|Yes| A[Acknowledge]
  D -->|No| E[Perform and record effect]
  E --> A
  E -. process fails before acknowledgement .-> M
```

The duplicate path exists even with a durable broker: a process can complete a
side effect and fail before acknowledging it. The stable business key and
recorded outcome make that replay safe; a random attempt ID does not.

| When this can happen | Design decision | Guide |
| --- | --- | --- |
| A caller loses the response or a broker redelivers a message | State the delivery contract and make the business side effect idempotent | [Delivery semantics](/handbook/framework/secure-and-operate/reliability/delivery-semantics/) and [retries, timeouts, and idempotency](/handbook/framework/secure-and-operate/reliability/retries-timeouts-and-idempotency/) |
| A dependency is slow or temporarily unavailable | Bound each attempt, choose a retry budget, and expose a safe failure to the caller or worker | [Retries, timeouts, and idempotency](/handbook/framework/secure-and-operate/reliability/retries-timeouts-and-idempotency/) |
| A process starts with an unhealthy dependency, or a deployment is replaced | Fail closed before readiness; on shutdown stop ingress, finish or release owned work, then close adapters in dependency order | [Graceful startup and shutdown](/handbook/framework/secure-and-operate/reliability/graceful-shutdown/) |
| Work reaches a dead-letter queue or a checkpoint must be resumed | Give an operator ownership, a bounded replay scope, and an audit trail | [Recovery and replay](/handbook/framework/secure-and-operate/reliability/recovery-and-replay/) |

Do not retry validation failures, permission denials, or non-idempotent external actions blindly. These are product and operational decisions, not generic transport errors.
