---
title: Return results and publish result events
description: Choose a worker outcome, avoid competing settlement paths, and make completion observable with an explicitly configured result policy.
order: 353
---

Every worker outcome settles a lease or asks the runtime to recover it. Prefer
one returned result per handler. Use `context.job` only when execution needs
an explicit mid-handler decision, such as cooperative cancellation or manual
dead-lettering.

| Return value | Runtime result |
| --- | --- |
| `undefined` or `{ status: 'success', output?, headers? }` | Deliver configured success result, then acknowledge. |
| `{ status: 'retry', reason?, delayMs? }` | Retry with lifecycle policy or dead-letter after its limit. |
| `{ status: 'fail', reason, fatal: true }` | Deliver failed result, then dead-letter. |
| `{ status: 'fail', reason, fatal: false, delayMs? }` | Retry or dead-letter with lifecycle policy. |

`context.job.complete`, `retry`, `fail`, and `moveToDeadLetter` settle the
current lease directly. Do not call one and return a conflicting result. After
guards still run when the handler returns, so an explicit control is not a
general replacement for clear handler flow.

## Make completion visible only when a consumer needs it

```ts title="src/service/report/v1/queue/generateReport.ts"
export const observableGenerateReportQueueBuilder = generateReportQueueBuilder
  .setResultPolicy({
    mode: 'state-and-event',
    successEventName: 'report.generated',
    failureEventName: 'report.generationFailed',
    ttlMs: 86_400_000,
    delivery: 'required',
  })
```

| [`setResultPolicy` option](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setresultpolicy) | Purpose |
| --- | --- |
| `mode` | `none`, `event`, `state`, or `state-and-event`. |
| `successEventName`, `failureEventName`, `deadLetterEventName` | Select event names for the generic success, fatal-failure, and dead-letter paths. A fatal failure can publish both `failed` and `dead-lettered` results for the same job, so consumers must be idempotent by job and status. |
| `cancelledEventName`, `progressEventName`, `emitProgressEvents` | Event-name/configuration fields, but the generic worker runtime has no returned cancellation result or progress producer. Do not enable them expecting ordinary worker execution to emit those statuses. |
| `ttlMs` | Retention hint for state results. |
| `delivery` | Defaults to `best-effort`; `required` turns a delivery failure into worker recovery before acknowledgement. |
| `eventId` | Defaults to `jobIdAndStatus`; controls result-event identity strategy. |

[`emitResultAsEvent('report.generated')`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#emitresultasevent) is a convenience for event mode.
Result events are independent EventBridge delivery, not an atomic outbox with
your database update or the queue acknowledgement. Persist the business effect
first and let an idempotent subscriber consume its notification.

State mode needs a `queueJobStore` passed when the service instance is created.
Without that store, the generic runtime has nowhere to persist a result. Verify
the result lookup/retention path with the configured store before advertising a
polling API.

Use [subscriptions](/handbook/framework/build-services/subscriptions/) to
react to a result event, and [configure recovery](/handbook/framework/build-services/queues-and-workers/configure-leases-retries-idempotency-and-dead-letters/)
for retry/DLQ semantics.
