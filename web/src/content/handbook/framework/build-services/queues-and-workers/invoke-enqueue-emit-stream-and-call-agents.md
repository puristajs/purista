---
title: Invoke, enqueue, emit, consume streams, and call agents
description: Declare every dependency a worker uses, then choose synchronous, streaming, durable, event, or agent composition deliberately.
order: 354
---

Queue workers receive only the clients they declare. This keeps a worker's
dependencies reviewable and gives those declared clients their own types.
Choose the interaction from the business boundary—not simply because another
capability exists. Queue payload and service-resource inference is currently
not propagated into a fluent worker handler; validate the raw message with the
same declared schema before using it, rather than adding a cast.

| Builder declaration | Handler client | Use it when |
| --- | --- | --- |
| [`canInvoke(service, version, target, output?, payload?, parameter?)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#caninvoke) | `context.service[service][version][target](payload, parameter)` | A command result is needed now. |
| [`canConsumeStream(service, version, target, chunk?, payload?, parameter?, final?, validateChunk?, validateFinal?)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#canconsumestream) | `context.stream[...]` async stream plus final result | Progressive upstream output is useful and the EventBridge supports it. |
| [`canEnqueue(queue, payload?, parameter?)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#canenqueue) | `context.queue.enqueue.queue(...)` / `scheduleAt.queue(...)` | Work can be decoupled and retried. |
| [`canEmit(event, schema)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#canemit) | `context.emit(event, payload)` | Another service should react independently. |
| [`canInvokeAgent(agent, version, schemas?)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#caninvokeagent) | `context.agent['agent.version'].run(payload, parameter?)` | A same-service attached agent owns the next decision. |

```ts title="src/service/report/v1/queue-worker/generateReport.ts"
export const composedGenerateReportWorkerBuilder = generateReportWorkerBuilder
  .canInvoke('Archive', '1', 'storeReport', archiveResultSchema, archivePayloadSchema)
  .canEnqueue('notifyReport', notificationPayloadSchema)
  .canEmit('report.archived', reportArchivedSchema)
  .canInvokeAgent('summarizeReport', '1', { outputSchema: summarySchema })
  .setHandler(async function (context, message) {
    const report = archivePayloadSchema.parse(message.payload)
    const stored = await context.service.Archive[1].storeReport(report, {})
    await context.queue.enqueue.notifyReport({ reportId: stored.reportId })
    await context.emit('report.archived', { reportId: stored.reportId })
    const summary = await context.agent['summarizeReport.1'].run({ reportId: stored.reportId })
    return { status: 'success', output: summary }
  })
```

[`setHandler(handler)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#sethandler)
is the worker’s required execution boundary. Its `async function (context,
message)` receives the leased job message; the capability clients on `context`
are only those declared earlier in the same chain. Return `undefined` or `{ status: 'success', output?,
headers? }` for normal acknowledgement; return `retry` or `fail` only when the
recovery path must change. Use a `function` rather than an arrow when the
implementation needs the service instance as `this`. `getDefinition()` rejects
a worker that has no handler, and a capability declaration alone never invokes
anything.

Command and agent calls couple the current lease to another live request.
Enqueueing and event emission are separate operations, not transactions with
the current acknowledgement. Keep event payloads safe and establish an
idempotency boundary on every durable side effect.

Stream invocation depends on EventBridge stream capability; see
[Streams](/handbook/framework/build-services/streams/). Agent invocation also
requires that the named attached agent is registered on the service and that
its Harness/provider prerequisites are configured; see [Build AI-powered services](/handbook/framework/build-ai-powered-services/).

For exact overloads, see [QueueWorkerBuilder](/handbook/api/classes/_purista_core.QueueWorkerBuilder/).
