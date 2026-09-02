---
title: Handle missed runs, concurrency, and duplicates
description: Express scheduling intent clearly, then design the target business effect to remain safe when the platform, event path, or queue repeats work.
order: 364
---

Schedule metadata expresses intent. It does not enforce a provider's overlap or
catch-up behavior, and it never makes the business effect exactly once. Put the
idempotency boundary where the durable business record is written.

| Situation | Scheduling intent | Business safeguard |
| --- | --- | --- |
| A previous billing run is still active | `concurrencyPolicy: 'forbid'` | Period-specific durable key; alert/repair rather than silent overlap. |
| One missed run is valid to replay | `missedRunPolicy: 'runOnce'` | Verify that one consolidated catch-up is semantically correct. |
| Every missed period matters | `missedRunPolicy: 'backfill'` + `maxCatchUpCount` | Process each period with bounded operator review and a period key. |
| Timing can be spread safely | `jitterWindowMs` | Ensure the target tolerates delayed rather than exact-time work. |
| The schedule/event/job is delivered twice | Optional schedule/queue key | Worker effect checks/stores a stable business key. |

`concurrencyPolicy: 'replace'` is provider intent, not proof that an existing
job was cancelled safely. `idempotencyKey` on schedule metadata is also only
metadata until a chosen platform implements it. Do not use transient job IDs
or raw event payloads as the business key.

For an event-to-queue binding, use `idempotencyMode: 'strict'` only when the
selected QueueBridge advertises idempotency enforcement and startup validates
the requirement. Even then, protect the downstream side effect; enqueue
deduplication and business-effect deduplication are different boundaries.

Next: [test scheduled behavior](/handbook/framework/build-services/schedule-work/test-scheduled-behavior/).
