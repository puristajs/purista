# Queue Bridge Abstraction

## Contract layering

- `QueueBridge` lives beside `EventBridge` under `packages/core/src/core/QueueBridge`.
- Shared helpers (`createLease`, `withRetry`, `serializeEnvelope`) ship in `packages/core/src/core/QueueBridge/helper` and can be reused by provider implementations.
- Service runtime requests both bridges from dependency injection when a service declares commands/subscriptions/streams (EventBridge) and queues/workers (QueueBridge). Either bridge can be omitted to keep lightweight services lean.

## Capabilities handshake

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

- Builders compile-time check capability flags and **fail fast** when a required feature is missing. We do not emulate leases/delay semantics on transports that lack them; instead, we simply do not offer a QueueBridge for those providers.
- Runtime re-check occurs during service startup to guard against misconfigured deployments (bridge configured differently than expected).
- For providers with partial support (e.g., no native dead-letter queue), the bridge must implement the missing piece within Purista (such as persisting failed jobs in our own DLQ store) while still honoring the pull/lease contract and updating `defaultDeadLetterPrefix`/`defaultDeadLetterSuffix`/`deadLetterInspectable` hints accordingly.
- Providers may expose additional provider-specific knobs (e.g., Redis key prefix, SQS FIFO group) but may **not** attempt to emulate missing capabilities. If a required capability is unavailable, the bridge must fail service startup loudly so teams can pick a different provider rather than running with degraded guarantees.

## Provider targets

| Provider                    | Implementation notes                                                                                           |
|-----------------------------|------------------------------------------------------------------------------------------------------------------|
| Redis (Lists / BRPOPLPUSH)  | Use blocking pop against lists (or BRPOPLPUSH) for strict pull semantics; implement visibility/lease tokens via Lua + metadata. We intentionally stay away from Redis Streams to keep the mental model close to classic queues.|
| NATS JetStream              | Use pull-based consumers, leverage Ack/Nak with delay, map partition key to stream subjects.                     |
| AWS SQS / SQS FIFO          | Native pull API with visibility timeout + delay; FIFO variant provides ordering/dedup via `MessageGroupId`.      |
| Azure Storage Queues        | Supports pull semantics with visibility timeout; implement retries/dead-letter via storage queues.              |
| Purista Default QueueBridge | Development/testing only; deterministic behavior with manual timers for leases/delay and in-memory DLQ store.   |

Push-only brokers such as classic AMQP/RabbitMQ fanout or MQTT are intentionally **out of scope** for QueueBridge, because they cannot guarantee the sequential pull model this design requires.

We also decline to emulate features (delayed delivery, leases, acknowledgement) on top of providers that do not support them natively; instead we document the gap and avoid shipping a bridge for that transport.

Each provider lives in its own package (e.g., `packages/redis-queue-bridge`, `packages/nats-queue-bridge`). We can reuse naming conventions from `*-state-store` modules. When we already ship an EventBridge adapter for a provider (Redis, JetStream, SQS), the QueueBridge package reuses the shared connection/client plumbing but keeps queue semantics isolated per Muldar guidelines.

## Default bridge + repo structure

- `DefaultQueueBridge` under `packages/core` is opt-in for production (documented as dev/test only) but always available so examples, tests, and CLI scaffolds can run without infra.
- Queue bridge modules mirror the EventBridge folder structure: `packages/<provider>-event-bridge` keeps pub/sub, while `packages/<provider>-queue-bridge` holds pull-based queue logic. They can reuse connection helpers but must keep the abstractions isolated, satisfying the "isolated things" rule from the Purista architecture guide.
- For every EventBridge provider that also satisfies queue requirements we plan to ship the queue module in the same release train so projects maintain alignment between synchronous and async transports.

## Info channel + discovery

- Similar to the HTTP info messages for commands/subscriptions, queue workers announce themselves via `InfoServiceQueueAdded` and `InfoServiceQueueWorkerAdded` messages. HTTP servers can consume these to expose documentation endpoints.
- CLI uses the info channel when generating typed clients for queue enqueue endpoints.

## Interaction with EventBridge

- EventBridge remains the transport for commands/subscriptions/custom events.
- QueueBridge can optionally emit events (e.g., `QueueJobDeadLettered`) through EventBridge so other services can react. This emission path is part of the core runtime, not the provider, ensuring consistent telemetry.
- For providers that **are** already message brokers (NATS, AMQP), we still treat queue operations as a separate concern because leasing semantics differ from event pub/sub. Implementations may share the underlying connection but must keep APIs separate to honor the Muldar isolation principle.

## Local + test story

- Provide `DefaultQueueBridge` (in-memory) in `packages/core`, mirroring `DefaultEventBridge` semantics and intended for dev/test scenarios. It stores messages in memory, supports configurable delay/lease simulation, and exposes hooks so tests can await queue drains.
- Optionally expose a `TestQueueHarness` helper that can fast-forward time, inspect queue depth, or inject failures.
- Document how to swap bridges in integration tests via `ServiceBuilder.defineResource('queueBridge', ...)`.

## Dead-letter naming & observability defaults

- Every `QueueBridge` must publish its default dead-letter naming convention (e.g., exposed as `defaultDeadLetterPrefix`/`defaultDeadLetterSuffix` so services can compute `<queue>:dlq` for Redis or `<queue>-dlq` for in-memory) and honor overrides supplied by queue definitions.
- Dead-letter metrics are mandatory; emitting EventBridge events is optional and opt-in. When enabled, the default event name is `queue.<queueName>.deadLettered`, but bridges may append provider-specific metadata in the event body for downstream observability pipelines.
- Providers that expose native DLQs must surface the location/identifier via `QueueBridgeCapabilities` so operators know where to inspect failures; bridges lacking native DLQs must persist failures internally and expose read APIs for tooling.
