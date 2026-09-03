---
title: Recovery and replay
description: Recover failed message and queue work through adapter-supported repair paths with idempotency and audit controls.
order: 1034
---

Recovery starts with evidence: inspect the failed message/job, its contract
version, attempt history, and business side-effect state. Repair invalid data
or configuration before replaying; repeated replay cannot fix a permanent
schema or authorization failure.

## Inspect, repair, then replay a bounded set

Redis and NATS queue bridges support dead-letter inspection and redrive. Read
messages without changing them first, and replay a limited, known-safe set only
after the permanent cause and side-effect deduplication have been verified.

```ts title="scripts/inspectInvoiceEmailDeadLetters.ts"
import type { Logger, QueueBridge } from '@purista/core'

export async function inspectAndRedriveInvoiceEmailDeadLetters(
  queueBridge: QueueBridge,
  logger: Logger,
) {
  const messages = await queueBridge.peekDeadLetter('sendInvoiceEmail', { limit: 20 })

  for (const message of messages) {
    logger.info({ jobId: message.id, attempt: message.attempt }, 'dead-letter candidate')
  }

  // Run only after the cause is fixed and a reviewer approves the scope.
  const replayed = await queueBridge.redriveDeadLetter('sendInvoiceEmail', { limit: 5 })
  logger.info({ replayed }, 'dead-letter jobs redriven')
}
```

The code intentionally logs only a job identifier and attempt—not the payload,
headers, credentials, or customer data that could have been stored in the
message. Call this operation from the application composition that has already
started the selected `QueueBridge`; the function accepts the public bridge
contract so it works with the adapter that owns the affected queue. Capture the
operator, incident/reference, selected queue and count, before/after metrics,
and idempotency evidence in your runbook.

| Failure class | Repair before replay | Usually safe to replay? |
| --- | --- | --- |
| Transient provider outage | Provider/configuration is healthy; downstream call is idempotent | Yes, bounded |
| Bad payload or old contract | Transform/migrate or quarantine it | Not unchanged |
| Authorization/tenant failure | Identity/policy and tenant scope are corrected | Only after review |
| Unknown side-effect state | Reconcile using the business key | Never blindly |

Use the selected adapter's DLQ/replay facilities where implemented. Record who
approved a replay for regulated operations, scope it to a known-safe job set,
and verify idempotency before reintroducing work. Purging a DLQ is a separate,
destructive retention decision—export/audit the relevant evidence first.

## Choose replay options deliberately

| Method | Options | Use it for | Adapter boundary |
| --- | --- | --- | --- |
| [`peekDeadLetter(queueName, { limit?, offset? })`](/handbook/api/interfaces/_purista_core.QueueBridge/#peekdeadletter) | `limit` bounds the batch; `offset` selects a later page. | Inspect a small, stable set before any repair action. | The Default QueueBridge, Redis, and NATS implement inspection; the Default QueueBridge keeps that data only in process memory. |
| [`redriveDeadLetter(queueName, { limit?, delayMs? })`](/handbook/api/interfaces/_purista_core.QueueBridge/#redrivedeadletter) | `limit` bounds replay; `delayMs` requests deferred replay when the adapter implements it. | Reintroduce an approved, repaired batch. | Redis currently honors `limit` but not `delayMs`; NATS uses a default limit of 50 and does not use `delayMs`. Test deferred replay against the selected adapter. |

Do not use `purgeDeadLetter` as a retry shortcut. It deletes recovery evidence;
export the required audit record and follow the retention policy first.

Next: [chapter overview](/handbook/framework/secure-and-operate/reliability/).
