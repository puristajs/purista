# Core Interfaces

## Queue message envelope

```ts
// packages/core/src/core/types/queue/QueueMessage.ts
export type QueueMessage<Payload = unknown, Params = unknown> = {
  id: string
  queueName: string
  payload: Payload
  parameter?: Params
  headers: Record<string, string>
  createdAt: number
  scheduledAt?: number // delayMs produces this
  priority?: number
  attempt: number
  maxAttempts: number
  leaseExpiresAt: number
  leaseTtlMs: number
  traceId?: string
  parentSpanId?: string
  correlationId?: string
  partitionKey?: string
  idempotencyKey?: string
}
```

`headers` must capture framework metadata (e.g., service + version) and user-specified values. Timestamp fields use epoch millis for cross-language compatibility.

## QueueBridge contract

```ts
export interface QueueBridge {
  readonly name: string
  readonly instanceId: string
  readonly capabilities: QueueBridgeCapabilities

  start(): Promise<void>
  destroy(): Promise<void>

  enqueue(options: QueueEnqueueOptions): Promise<QueueEnqueueResult>

  leaseNext(queue: string, opts: LeaseOptions): Promise<QueueLease | undefined>

  extendLease(lease: QueueLease, extensionMs: number): Promise<void>

  ack(lease: QueueLease, result?: QueueAckMetadata): Promise<void>

  nack(lease: QueueLease, error: QueueRetryRequest): Promise<void>

  moveToDeadLetter(queue: string, payload: QueueMessage, reason: DeadLetterReason): Promise<void>

  metrics(queue: string): Promise<QueueMetrics>
}
```

- `QueueBridgeCapabilities` includes booleans (`delayedDelivery`, `fifo`, `exactlyOnce`, `priorityLevels`, `deadLetterNative`) plus descriptive hints (`defaultDeadLetterPrefix`, `defaultDeadLetterSuffix`, `deadLetterInspectable`, `maxBatchSize`). These hints allow builders/ops tooling to show the implicit DLQ target when the queue definition does not override it.
- Example:

```ts
export type QueueBridgeCapabilities = {
  delayedDelivery: boolean
  fifoOrdering: boolean
  partitions: boolean
  priorities: boolean
  deadLetterNative: boolean
  exactlyOnce: boolean
  maxBatchSize: number
  defaultDeadLetterPrefix?: string
  defaultDeadLetterSuffix?: string
  deadLetterInspectable: boolean
}
```
- `QueueLease` carries the job envelope, lease token, and helper to emit heartbeats.
- `QueueMetrics` (pending, inflight, retries, oldestAgeMs) feed the health endpoint.

## QueueDefinition metadata

```ts
export type QueueDefinition = {
  name: string
  description: string
  payloadSchema: Schema
  parameterSchema?: Schema
  preprocess?: QueuePreprocessHook
  beforeExecute?: QueuePreprocessHook
  retryStrategy: QueueRetryStrategy
  defaultDelayMs?: number
  leaseTtlMs: number
  lifecycle?: QueueLifecycleConfig // optional overrides; default lifecycle config applies when omitted
  maxParallelHandlers: number
  partitionKey?: (payload, params) => string | undefined
  deadLetter?: { queueName?: string; emitEvent?: string; eventName?: string } // queueName defaults to <name>.dead-letter if undefined
  eventBridgeConfig: DefinitionQueueBridgeConfig
  httpExposure?: AsyncHttpExposure
}

export type QueueWorkerDefinition = {
  name: string
  queue: string
  mode: 'continuous' | 'interval' | 'sequential'
  intervalMs?: number
  batchSize?: number
  maxParallel?: number
  handler: QueueWorkerHandler
  beforeGuard?: GuardHook
  authorize?: AuthorizeHook
  afterGuard?: GuardHook
}
```

## Builder-facing helper types

```ts
export type QueueEnqueueOptions<Payload, Params> = {
  payload: Payload
  parameter?: Params
  delayMs?: number
  idempotencyKey?: string
  headers?: Record<string, string>
  maxAttempts?: number
  priority?: number
}

export type QueueHandlerResult =
  | { status: 'success'; output?: unknown; headers?: Record<string, string> }
  | { status: 'retry'; reason?: string; delayMs?: number }
  | { status: 'fail'; reason: string; fatal?: boolean }

export type QueueLifecycleConfig = {
  visibilityTimeoutMs: number
  maxLeaseExtensions: number
  heartbeatIntervalMs: number
  retryWindowMs: number
  retryBackoff: QueueRetryStrategy
}
```

Handlers can also throw; core runtime wraps thrown errors and maps them onto `fail` or `retry` depending on builder configuration (`retryOnUnhandledError` flag).

`QueueLifecycleConfig` is optional—if builders omit it we import the canonical defaults from `packages/core/src/core/config/defaultQueueLifecycle.ts`, guaranteeing consistent behavior across CLI scaffolds, tests, and runtime registration. Overriding any property leaves the rest of the defaults intact.

`deadLetter.queueName` is intentionally optional: when it is undefined the runtime derives `<queueName>.dead-letter` and allows the active `QueueBridge` to rewrite it (e.g., append `:dlq` for Redis lists, resolve an ARN for SQS) so teams get sensible defaults without extra boilerplate. `deadLetter.eventName` defaults to `queue.<queueName>.deadLettered` whenever builders opt into EventBridge emission yet can be overridden to match organizational naming schemes or to integrate with environment-specific DLQ processors.

## Context additions

- `CommandFunctionContext`, `SubscriptionFunctionContext`, and `StreamFunctionContext` gain a `queue` namespace:

```ts
context.queue.enqueue.orderProcessing(payload, params, opts?)
context.queue.scheduleAt.orderProcessing(date, payload, params)
```

The namespace is generated from `.canEnqueue('orderProcessing', payloadSchema, parameterSchema)` definitions declared in the respective builders.

- `QueueJobContext` extends `ContextBase` with:
  - `job`: helpers (`complete`, `retry`, `fail`, `extendLease`, `heartbeat`).
  - `message`: resolved `QueueMessage`.
  - `emit`, `service`, `stream`, `resources` consistent with other contexts.
- Queue worker builders reuse the standard Purista guard hooks (`beforeGuard`, `authorize`, `afterGuard`). This ensures queues obey the same security model as commands without boilerplate duplication; workers can inspect auth scopes/tenants carried by the enqueuer or derive policies from queue metadata.
- `QueueWorkerDefinition` stores optional `beforeGuards`/`afterGuards` maps (composed of `QueueWorkerBeforeGuardHook` / `QueueWorkerAfterGuardHook`). The runtime executes these hooks around the handler, wrapping each in spans so auth/auditing logic stays observable.

Test helpers mirror these additions:

- `getCommandContext.mock`, `getSubscriptionContext.mock`, and `getStreamContext.mock` expose deterministic `queue.enqueue.<name>` spies so unit tests can assert enqueue counts/arguments without provisioning a bridge.
- A new `getQueueJobContext.mock` helper fabricates leases + envelopes for worker tests, including default telemetry spans and `.job.complete()` instrumentation. This keeps DX parity with existing helpers for commands/subscriptions.

## Error hierarchy

```ts
export class QueueVisibilityTimeoutError extends PuristaBaseError {}
export class QueuePoisonMessageError extends PuristaBaseError {}
export class QueueBridgeUnavailableError extends PuristaBaseError {}
```

Errors bubble through telemetry and control the auto-retry vs dead-letter decision tree.
