---
title: Create a queue and worker
description: Define a typed job contract, register both definitions, and implement one idempotent worker with deliberate execution settings.
order: 351
---

Start with a queue definition and a worker definition. They have different
responsibilities: the queue owns the job contract and delivery policy; the
worker owns execution mode, declared dependencies, guards, and the handler.

## Define and register the job contract

```ts title="src/service/report/v1/queue/generateReport.ts"
export const generateReportQueueBuilder = reportV1ServiceBuilder
  .getQueueBuilder('generateReport', 'Generate one report')
  .addPayloadSchema(reportJobPayloadSchema)
  .addParameterSchema(reportJobParameterSchema)

export const generateReportWorkerBuilder = reportV1ServiceBuilder
  .getQueueWorkerBuilder('generateReport', 'generate-report')
  .setMode('continuous')
  .setMaxParallelHandlers(2)
  .setHandler(async function () {
    // Add the business implementation after declaring the worker's capabilities.
    return { status: 'success' }
  })

export const reportV1Service = reportV1ServiceBuilder
  .addQueueDefinition(generateReportQueueBuilder.getDefinition())
  .addQueueWorkerDefinition(generateReportWorkerBuilder.getDefinition())
```

`addPayloadSchema(...)` and `addParameterSchema(...)` are optional API calls,
but normally define the stable job contract. They validate Framework-mediated
enqueue input; they are not universal broker input validation at worker time.

| Call | Parameters and default | Use it for |
| --- | --- | --- |
| [`getQueueBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getqueuebuilder) | Non-empty TypeScript queue name and reader-facing description | The job contract. |
| [`getQueueWorkerBuilder(queueName, workerName)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getqueueworkerbuilder) | Same queue name plus diagnostic worker name | One execution definition. |
| [`addPayloadSchema(schema)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#addpayloadschema) | Optional Standard Schema; no payload is validated when omitted. | Declare and validate the job body at the Framework enqueue boundary. |
| [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#addparameterschema) | Optional Standard Schema; no parameter object is created when omitted. | Declare selectors/options that are separate from the job body. |
| [`setHandler(fn)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#sethandler) | Required `async function (context, message) {}`; no default. | Install the worker implementation. `getDefinition()` rejects if it is missing. |
| [`addQueueDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addqueuedefinition) | Pending queue definition | Register the contract before service resolution. |
| [`addQueueWorkerDefinition(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addqueueworkerdefinition) | Pending worker definition | Register the executable worker before service resolution. |
| [`getDefinition()`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#getdefinition) | No parameters | Materialize a builder definition; worker builders reject this if no handler is set. |

## Choose worker pacing deliberately

| Setting | Default and runtime behavior | Decision help |
| --- | --- | --- |
| [`setMode('continuous')`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#setmode) | Default; polls again after normal work/idle pacing | Start here for independent jobs. |
| [`setMode('interval')`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#setmode) + [`setIntervalMs(ms)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#setintervalms) | Waits `ms` after a loop; defaults to 1,000 ms if omitted | Pace periodic polling; it is not a general rate limiter. |
| [`setMode('sequential')`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#setmode) | Starts one worker slot | Use only with a real bridge/order design; it does not itself guarantee provider-wide ordering. |
| [`setMaxParallelHandlers(count)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#setmaxparallelhandlers) | Default `1`; runtime uses at least one slot, except sequential stays one | Raise only after downstream capacity is proven. |

The builders do not validate numeric ranges. Treat positive counts and sensible
intervals as application policy, not framework enforcement.

## Know the current type boundary

The queue contract and service resources are available to the worker at runtime,
but the current `ServiceBuilder.getQueueWorkerBuilder(...)` return type does
not inherit either declaration. As a result, a fluent worker handler does not
yet receive inferred `message.payload`, `message.parameter`, or
`context.resources` types. Do not hide that gap with casts or duplicate type
definitions: keep the handler small, prove the runtime shape through a focused
test, and track the Framework type-propagation fix before treating this surface
as compile-time safe. Capability methods declared on the worker—such as
`canInvoke(...)`, `canEnqueue(...)`, and `canEmit(...)`—do retain their own
types.

## Normalize and guard the job

Queue transforms use `(context, payload, parameter)` and return
`{ payload, parameter? }`. They run with base stores, logging/tracing, and
resources—not the handler’s typed command, stream, emit, agent, job, or signal
clients. The transform context does carry a queue client. In the
before-execute transform it is not restricted by the worker's `canEnqueue(...)`
allow-list, so it can reach any queue registered on the service. Do not use
that implementation detail: keep both transforms deterministic and free of
enqueue side effects.

```ts title="src/service/report/v1/queue/generateReport.ts"
export const protectedGenerateReportQueueBuilder = generateReportQueueBuilder
  .setBeforeEnqueueTransform(async function (_context, payload, parameter) {
    return { payload: { ...payload, normalized: true }, parameter }
  })
  .setBeforeExecuteTransform(async function (_context, payload, parameter) {
    return { payload, parameter }
  })

export const guardedGenerateReportWorkerBuilder = generateReportWorkerBuilder
  .setBeforeGuardHooks({
    tenant: async function (_context, message) {
      if (!message.headers['purista.tenantId']) throw new Error('tenant is required')
    },
  })
```

Before guards run after the execute transform; after guards run after the
handler and before implicit settlement. Each named guard map runs in parallel,
so names are identifiers—not order. A thrown guard follows normal recovery.
Use `async function` when the callback needs the service as `this`.

| Method | Callback / inputs | Runtime effect and choice |
| --- | --- | --- |
| [`setBeforeEnqueueTransform(fn)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setbeforeenqueuetransform) | `async function (context, payload, parameter)` returns `{ payload, parameter? }`. | Runs after the declared queue schemas validate and before bridge submission. Use for deterministic normalization; its returned shape is not revalidated. A throw rejects the enqueue. |
| [`setBeforeExecuteTransform(fn)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#setbeforeexecutetransform) | Same callback and return shape. | Runs on the leased job before worker guards and the handler. Use only for replay-safe enrichment; changing the payload affects every retry. |
| [`setBeforeGuardHooks(hooks)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#setbeforeguardhooks) / [`setAfterGuardHooks(hooks)`](/handbook/api/classes/_purista_core.QueueWorkerBuilder/#setafterguardhooks) | A named map of non-arrow service-bound callbacks. Before hooks receive `(context, message)`; after hooks receive `(context, result)`. | Adds policy checks around the handler. Hook names replace an earlier hook with the same name; named hooks in one stage run concurrently, so do not use their names to encode order. |

[`setTags(...)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#settags)
and
[`markAsDeprecated()`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#markasdeprecated)
publish metadata only. They neither block jobs nor migrate callers.
[`addWorkerDefinition(...)`](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/#addworkerdefinition)
stores metadata on a queue definition; use explicit
`addQueueWorkerDefinition(...)` for an executable worker.

For exact signatures, see [QueueDefinitionBuilder](/handbook/api/classes/_purista_core.QueueDefinitionBuilder/) and [QueueWorkerBuilder](/handbook/api/classes/_purista_core.QueueWorkerBuilder/).
