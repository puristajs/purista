---
name: purista-queue-worker-builder
description: Teach untrained models how to define PURISTA queue workers with getQueueWorkerBuilder, handler setup, concurrency policy, and service-level runtime wiring.
topics: [workers, queues, run-state]
phases: [implementation]
---

# PURISTA Queue Worker Builder

## When to use this skill
Use this skill when implementing the actual durable worker logic behind a queue.

## What this component/package is for
Queue workers perform durable execution with retries, leases, checkpointing, and controlled side effects.

## Core PURISTA concept
A queue worker is a builder-defined execution unit for a named queue. It defines how jobs are handled, with what concurrency and mode, and becomes active only when its definition is registered on a service that runs with a queue bridge.

## Builder lifecycle
1. Start from the owning service builder and related queue name.
2. Create the worker builder with `getQueueWorkerBuilder(queueName, workerName)`.
3. Configure worker mode and concurrency with `setMode(...)`, `setIntervalMs(...)`, and `setMaxParallelHandlers(...)` when needed.
4. Add guard hooks if required.
5. Implement execution with `setHandler(...)`.
6. Call `getDefinition()`.
7. Register the definition with `addQueueWorkerDefinition(...)`.
8. Instantiate the owning service with a runtime `queueBridge`.

## Hard rules
- Keep worker side effects idempotent or guarded.
- Make progress and checkpoint updates explicit.
- Fail with classified errors, not generic text blobs.
- Never assume a worker runs only once.

## Decision rules
- Use checkpoints for multi-step work.
- Use locks or idempotency keys when concurrent duplicate execution is possible.
- Keep worker-specific concurrency policy on the worker builder, not in random helper code.

## Definition pattern
```text
src/service/<service-name>/v1/worker/<worker-name>/
  <workerName>QueueWorkerBuilder.ts
  implementation.ts  # optional helper module if the logic is not kept inline
```

## Implementation pattern
- Load durable state or run-state first.
- Execute one logical step at a time and checkpoint after success.
- Use `setHandler(...)` in the builder file or delegate to a nearby builder-owned implementation module when the logic grows.
- Keep before/after guard hooks explicit when worker preconditions matter.

## Configuration pattern
- Worker execution policy such as mode, interval, and max parallel handlers belongs on the worker builder.
- Queue transport and runtime stores are injected when the service instance is created.

## Instantiation / runtime wiring
- Workers do not run standalone; they are definitions registered on a service and executed through a runtime `queueBridge`.
- The owning service must add both the queue definition and worker definition before `getInstance(...)`.
- Runtime wiring must supply the queue bridge and any required resources or stores.

## Verification cues
- The worker is attached to a concrete queue name.
- `getDefinition()` is registered with `addQueueWorkerDefinition(...)`.
- The service instance that owns the worker can name the runtime `queueBridge`.
- Handler logic is safe to retry or explicitly guarded.

## Common mistakes / anti-patterns
- Making irreversible external calls before local state is consistent.
- Hiding long loops inside one worker attempt without heartbeats or state updates.
- Returning user-facing prose instead of structured durable work results.
- Showing only worker handler logic without queue definition, service registration, and runtime queue wiring.

## How this connects to other PURISTA concepts
Workers connect queue definitions, queue bridges, stores, run-state, sandbox execution, and durable agent orchestration.

## Related skills
- `purista-queue-builder` for queue contract and lifecycle definition
- `purista-queue-bridges` for runtime leasing and retries
- `purista-stores` for durable state and checkpoints
- `purista-observability` for telemetry and failure visibility
- `purista-sandbox` for isolated worker-side execution

## Read if needed
- `packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts`
- `examples/quickstart/src/service/ping/v1/pingV1Service.ts`
- `packages/ai/src/builder/AgentBuilder.ts`
- `specs/15-async-queues/30-core-interfaces.md`
- `website/doc/handbook/2_building_business-logic/agent/run-state.md`
