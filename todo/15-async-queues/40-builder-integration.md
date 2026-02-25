# Builder Integration

## ServiceBuilder extensions

1. Add `queueDefinitionList` + `queueWorkerDefinitionList` properties mirroring commands/subscriptions/streams.
2. `ServiceBuilder.addQueueDefinition()` registers producer-side metadata (schemas, preprocess hooks).
3. `ServiceBuilder.addQueueWorker()` registers one or more worker configs per queue (pull strategy, concurrency, resources needed).
4. `resolveDefinitions()` returns `{ commands, subscriptions, streams, queues, queueWorkers }` so runtime + CLI exports remain consistent.
5. `Service.getInstance(...)` accepts `{ queueBridge }` exactly like `{ eventBridge }`, defaulting to the in-memory implementation when omitted. The bridge is instantiated even when the current service has no queues yet so `.canEnqueue` contexts remain consistent, but the runtime only starts worker loops if definitions exist.
6. Event bridges never reference queues. Queue bridges are injected independently, allowing deployments such as “RabbitMQ for commands/subscriptions + Redis for queues” without any conditional logic inside provider packages.

## QueueDefinitionBuilder API sketch

```ts
serviceBuilder
  .getQueueBuilder('orderProcessing', 'Durable async order pipeline')
  .setPayloadSchema(orderPayloadSchema)
  .setParameterSchema(orderMetaSchema)
  .setRetryStrategy({ maxAttempts: 5, initialIntervalMs: 1_000, backoff: 'exponential' })
  .setLeaseOptions({ ttlMs: 15 * 60 * 1000, autoExtend: true })
  .setDeadLetter({ queueName: 'orderProcessing.dlq', emitEvent: 'OrderProcessingFailed' })
  .setPreprocessHook(async function beforeEnqueue(context, payload, parameter) {
    const normalized = await context.wrapInSpan('queue.preprocess', {}, async () => normalize(payload))
    return { payload: normalized, parameter }
  })
  .allowInvoker(builder => builder.canInvoke('PaymentService', '1', 'reserveFunds'));
```

- Builder inherits tagging, summary, and deprecation metadata so docs/OpenAPI can describe the queue.
- `.setLifecycleConfig` is optional; when not invoked we fall back to the default lifecycle state machine values. Builders can override a subset (e.g., just `visibilityTimeoutMs`) without redefining the full contract.
- `.allowInvoker(...)` ensures only services/commands explicitly declaring `.canEnqueue('orderProcessing', ...)` can call into the queue (typed client generation + runtime guard).

## QueueWorkerBuilder API sketch

```ts
serviceBuilder
  .getQueueWorkerBuilder('orderProcessingWorker')
  .forQueue('orderProcessing')
  .setMode('continuous')
  .setMaxParallel(4)
  .setBatchSize(10)
  .setVisibilityTimeoutMs(20 * 60 * 1000)
  .setBeforeGuardHooks({
    auth: async function (context, message) {
      await ensureTenantAccess(context, message)
    },
  })
  .setAfterGuardHooks({
    audit: async function (_context, result) {
      await publishAuditEvent(result)
    },
  })
  .setHandler(async function orderProcessingHandler(context, payload, parameter) {
    await context.service.Inventory[1].reserve(payload.items)
    const invoice = await context.service.Billing[1].issueInvoice(payload)
    return { status: 'success', output: { invoiceId: invoice.id } }
  })
  .onError(async (context, err) => {
    context.logger.error({ err }, 'queue handler crashed')
    return err.fatal ? { status: 'fail', reason: err.message, fatal: true } : { status: 'retry' }
  })
```

- Workers reuse hook pattern: `beforeGuard`, `afterGuard`, `transformInput`, `onResult` just like commands.
- Workers reuse hook pattern: `beforeGuard` and `afterGuard` hooks mirror command/subscription security so policies run outside the business logic; hooks execute in parallel per worker instance and throw `HandledError` to block execution.
- Builder enforces that the referenced queue exists (even across files) and auto-wires typed payloads/params.
- Additional DSL for scheduling: `.setSchedule({ kind: 'interval', everyMs: 5000 })` or `.setSchedule({ kind: 'onCompletion' })`.
- Worker context exposes the same `context.service`, `context.emit`, and resource helpers that commands have, so queue handlers can still invoke commands, emit events, or enqueue more work while respecting `.canInvoke`/`.canEmit` guardrails.

## Context exposure

- `CommandDefinitionBuilder`, `SubscriptionDefinitionBuilder`, and `StreamDefinitionBuilder` gain `.canEnqueue(queueName, payloadSchema, parameterSchema)` to declare typed enqueue helpers.
- Generated context includes `context.queue.enqueue.<queueName>` and `context.queue.scheduleAt.<queueName>` functions with inferred payload/parameter types, matching the ergonomics of `context.service` and `context.emit`.
- Test helpers (`getCommandContext.mock.ts`, `getSubscriptionContext.mock.ts`, `getStreamContext.mock.ts`) expose stubbed `queue` namespaces so unit tests can assert enqueue behavior without booting a bridge.
- CLI templates add `context.queue` usage examples when scaffolding commands to highlight asynchronous options.
- Queue definitions may opt into emitting custom events when jobs dead-letter (`.setDeadLetterEvent('OrderQueueDeadLettered')`), but by default we rely on OpenTelemetry metrics/logs so teams without remediation flows are not forced to handle extra traffic.
- `.canEnqueue` entries participate in the same guard pipeline as `.canInvoke`/`.canEmit`: builder metadata feeds the generated auth checks, and runtime refuses to enqueue if the handler lacks the declared capability. CLI scaffolds therefore include sample `.canEnqueue` usage so new services inherit security best practices automatically.

## HTTP and ClientBuilder integration

- HTTP bridges support `mode: 'async'` metadata inside `HttpExposedServiceMeta`. When enabled, HTTP handlers call `.enqueue` and return `202` plus `jobId` (and optionally `statusUrl`).
- Server adapters reuse the same auth/guard pipeline as commands; `.setHttpExposure({ mode: 'async', secure: true, tags: [...] })` inherits scope/role checks automatically.
- ClientBuilder exports `client.queue.orderProcessing.enqueue(payload, params, opts)` so external services can enqueue via HTTP or direct invocation.

## CLI scaffolding

- `purista add queue` wizard flow:
  1. Prompt for queue name/description.
  2. Ask whether to scaffold a producer command (default **Yes**, optional **No** for queues fed only by existing logic).
  3. Always scaffold at least one worker (can be disabled only if user confirms they have an external consumer).
  4. Generate files:
     - `services/<service>/<queue>/<queue>.queue.ts` (definition builder)
     - `services/<service>/<queue>/<queue>.worker.ts` (handler skeleton)
     - Optional producer command referencing `.canEnqueue`.
- Wizard also updates the parent service index to register the queue/worker and, when the producer is created, inserts `.canEnqueue` declarations so the new command has typed helpers immediately.
- When the wizard exposes the queue via HTTP, it scaffolds an async endpoint returning `202 Accepted` with `{ jobId, queueId, statusUrl }` and documents follow-up polling codes (`200/202/303/410/500`) to enforce the standard contract.
- `purista add queue-worker` attaches another worker to an existing queue, prompting for mode, concurrency, and HTTP exposure details when relevant.
- CLI updates the service manifest to include queues/workers, ensuring `ServiceBuilder` registration happens automatically.
- Sample `purista add queue` prompt flow:

```
? Queue id (kebab-case): order-processing
? Description: Durable order pipeline
? Scaffold producer command now? (Y/n) Y
? Select worker mode (continuous/interval/sequential): sequential
? Interval in ms (only for interval mode): 0
? Max parallel jobs per worker: 1
? Expose HTTP async endpoint returning 202 Accepted? (Y/n) Y
? Should the CLI create a queue worker file now? (Y/n) Y
```

Generated artifacts reference these answers when naming files and wiring `.canEnqueue` hooks.

## Configuration & resources

- `serviceBuilder.defineResource('queueBridge', QueueBridge)` allows per-service injection of specialized bridges (e.g., JetStream vs SQS) while still defaulting to global config.
- Service config schema should accept `queueBridge` settings (prefetch, maxWorkers) to allow runtime tuning without redeploying code.
- Builders reuse the `DefinitionEventBridgeConfig` naming style via a new `DefinitionQueueBridgeConfig` (durable flag implied, but `prefetch`, `orderingGuarantee`, `shared` replicate semantics for familiarity).
