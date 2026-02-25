# Implementation Outline (AI-Executable)

## 0) Preconditions

- Queue specs approved; streaming feature already merged (so ServiceBuilder returns streams today).
- Decide which provider to implement first (Redis core lists/BRPOPLPUSH recommended because they already satisfy pull + lease semantics without forcing Redis Streams).

## 1) Core types (packages/core)

1. Create `packages/core/src/core/types/queue/` with:
   - `QueueMessage.ts`, `QueueLease.ts`, `QueueEnqueueOptions.ts`, `QueueHandlerResult.ts`, `QueueMetrics.ts`.
   - Type guards (`isQueueMessage`, `isQueueLease`).
2. Add `packages/core/src/core/QueueBridge/types/QueueBridge.ts` plus helper interfaces for capabilities and config.
3. Extend `ContextBase` consumers to import new queue-specific helper types and expose `.queue` namespace in mocks/test helpers.

## 2) QueueDefinition + QueueWorker builders (packages/core)

1. Create `packages/core/src/QueueDefinitionBuilder/*` mirroring command builder patterns (schemas, hooks, HTTP exposure metadata, canInvoke/canEnqueue tracking).
2. Create `packages/core/src/QueueWorkerBuilder/*` with handler hooks, schedule config, concurrency limits, error hooks.
3. Update `packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts` to:
   - hold queue + worker definition lists
   - expose `.addQueueDefinition()` / `.addQueueWorker()` / `.getQueueBuilder()`
   - resolve queue definitions as part of `resolveDefinitions()` result.
4. Update `packages/core/src/core/types/ServiceClassTypes.ts` (and related) so service instances carry queue metadata.

## 3) Runtime integration (packages/core)

1. Update `packages/core/src/core/Service/Service.impl.ts` to:
   - instantiate QueueBridge (from injected resource or default factory)
   - register queue definitions with the bridge (for provider-specific setup)
   - spawn worker loops per `QueueWorkerDefinition`.
2. Add queue context helpers to `CommandFunctionContext`, `SubscriptionFunctionContext`, and `StreamFunctionContext` (files under `packages/core/src/core/types/*`).
3. Update mocks for tests under `packages/core/src/mocks/` (e.g., `getCommandContext.mock.ts`, `getSubscriptionContext.mock.ts`, `getStreamContext.mock.ts`) to include queue stubs plus a reusable `getQueueContext.mock.ts` for worker handlers.
4. Extend `packages/core/src/core/Service/startService.impl.ts` (or equivalent) to wait for queue bridge readiness during boot.

## 4) QueueBridge base implementation (packages/core)

1. Add `packages/core/src/core/QueueBridge/InMemoryQueueBridge.impl.ts` for dev/tests.
2. Provide common helper utilities (retry wrapper, lease timers) inside `packages/core/src/core/QueueBridge/helper/*`.
3. Ensure bridge exposes `isReady()`/`isHealthy()` so `packages/core/src/core/types/ServiceHealth.ts` can incorporate queue signals.

## 5) Provider packages

1. Create `packages/redis-queue-bridge` (or extend existing Redis modules if appropriate):
   - connection manager
   - Lua helpers implementing BRPOPLPUSH + lease metadata in side keys (visibility, attempt counters)
   - translate queue definitions into Redis list names, set TTL/retention + dead-letter suffix conventions.
2. Update `packages/natsbridge` (or create `packages/nats-queue-bridge`) leveraging JetStream pull consumers.
3. Add SQS/Azure queue packages only if the provider natively supports pull, visibility timeouts, and DLQ routing—push-centric transports (classic RabbitMQ fanout, MQTT) remain unsupported.
4. Each provider exports a factory aligning with `QueueBridge` interface and updates documentation under `docs/`, reusing any shared connection pools from the corresponding EventBridge module while keeping the queue abstraction isolated.

## 6) HTTP servers & client exposure

1. Update `packages/httpserver` and `packages/hono-http-server` to detect queue HTTP exposure metadata and expose POST/GET endpoints that enqueue jobs and return `{ jobId }`.
2. Extend `packages/core/src/ClientBuilder` to include queue enqueue helpers when exporting typed clients.
3. Update OpenAPI generation (`packages/httpserver/src/openApi`) to include `202 Accepted` responses and schema for `jobId`.

## 7) CLI tooling

1. Extend `packages/cli` with:
   - `purista add queue`: prompts for queue name/description, whether to scaffold producer command (default yes), queue worker mode, and HTTP exposure. Generates queue definition, worker skeleton, and optional producer command wired with `.canEnqueue`.
   - `purista add queue-worker`: lists existing queues, prompts for worker mode (continuous/interval/sequential), concurrency, and resource injection, then scaffolds handler + registration snippet.
2. Update templates in `packages/create-purista` so new projects can opt into queue support out of the box, including sample producer/worker pair and documentation links.
3. Ensure CLI updates service manifest/exports automatically so new queues are registered with `ServiceBuilder`.

## 8) Telemetry & errors

1. Add new error classes under `packages/core/src/core/Error/`.
2. Introduce OpenTelemetry span helpers in `packages/core/src/core/telemetry/` (or existing location) and ensure queue handlers wrap execution accordingly.
3. Update logging formats to include `queueName`, `jobId`, `attempt` in structured logs.

## 9) Tests

- Unit tests for builders (schema inference, `.canEnqueue` typing).
- In-memory bridge tests (enqueue, delay, retry, dead-letter) under `packages/core/src/core/QueueBridge/__test__`.
- Integration tests per provider (Redis/NATS) executed via existing integration test harness (update `test/integration` setup to spin up required services).
- HTTP exposure tests verifying `202` responses and SSE (if we stream job status in future).

## 10) Documentation

- Update `website/doc/handbook/` with queue concepts, when to use them, and CLI instructions.
- Add examples under `examples/queue-worker` demonstrating enqueue from command + worker processing.
- Expand `specs/README.md` to list the new `15-async-queues` folder for discoverability.
