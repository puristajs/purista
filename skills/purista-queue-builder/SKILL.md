---
name: purista-queue-builder
description: Teach untrained models how to define PURISTA queues with getQueueBuilder, lifecycle and bridge config, queue definitions, and service-level runtime wiring.
topics: [queues, durable, background-work]
phases: [architecture, implementation]
---

# PURISTA Queue Builder

## When to use this skill
Use this skill when work must be durable, asynchronous, throttled, or resilient across process restarts.

## What this component/package is for
Queues model durable background work with retry, leasing, visibility control, worker pools, and telemetry.

## Core PURISTA concept
A queue in PURISTA is a builder-defined durable execution contract. It defines payload shape, retry and lease lifecycle, queue bridge behavior, and the worker definitions that will execute the jobs.

## Builder lifecycle
1. Start from the owning service builder.
2. Create the queue builder with `getQueueBuilder(...)`.
3. Attach payload and parameter schemas with `addPayloadSchema(...)` and `addParameterSchema(...)`.
4. Set lifecycle policy with `setLifecycleConfig(...)`.
5. Set bridge policy with `setQueueBridgeConfig(...)`.
6. Optionally attach worker definitions with `addWorkerDefinition(...)`.
7. Call `getDefinition()`.
8. Register the queue with `addQueueDefinition(...)` and instantiate the service with a runtime `queueBridge`.

## Hard rules
- Treat queues as the default for long-running and restart-sensitive work.
- Separate enqueue/initiation from actual worker execution.
- Make retry behavior explicit.
- Emit enough telemetry to debug waiting time, concurrency, and failure reasons.

## Decision rules
- Choose a queue when the operation can outlive the incoming request.
- Use a direct command only if the work is short, synchronous, and failure handling is simple.
- Use explicit lifecycle settings for lease, heartbeat, attempts, and dead-letter behavior when failure modes matter.

## Definition pattern
```text
src/service/<service-name>/v1/queue/<queue-name>/
  <queueName>QueueBuilder.ts
  schema.ts
```

## Implementation pattern
- Use an initiating command or subscription to enqueue validated work.
- Keep queue definition focused on durable transport semantics; worker logic belongs in worker builders.
- Make dead-letter, transform, and bridge policy explicit when the workload is operationally important.

## Configuration pattern
- Queue policy is definition-time metadata on the queue builder.
- The concrete queue transport implementation is supplied later through the runtime `queueBridge`.
- Any service-owned config influencing queue behavior should still be declared on the owning service builder.

## Instantiation / runtime wiring
- Queue definitions are inert until the service is instantiated with a `queueBridge`.
- The owning service must register the queue definition before `getInstance(...)`.
- Runtime wiring is responsible for the actual queue transport, logger, stores, and resources.

## Verification cues
- The queue is defined from the service builder and re-added with `addQueueDefinition(...)`.
- Lifecycle and bridge config are explicit for durable work.
- The architecture can name the runtime `queueBridge` required by the service instance.
- The queue has a clear relationship to the command or subscription that enqueues it and the worker that executes it.

## Common mistakes / anti-patterns
- Running long workflows inline because “it usually finishes fast”.
- Forgetting lease, heartbeat, or dead-letter policy for long AI or sandbox tasks.
- Treating queue retries as business retries without idempotency.
- Teaching only queue semantics without the service assembly and runtime `queueBridge` wiring.

## How this connects to other PURISTA concepts
Queues connect service builders, queue workers, queue bridges, durable agents, sandbox execution, and attach-and-stream patterns.

## Related skills
- `purista-service-builder` for owning-service assembly
- `purista-queue-worker-builder` for the execution side of the queue
- `purista-queue-bridges` for runtime transport behavior
- `purista-stores` for durable progress or run-state
- `purista-sandbox` for long-running isolated workloads

## Read if needed
- `packages/core/src/QueueDefinitionBuilder/QueueDefinitionBuilder.impl.ts`
- `examples/quickstart/src/service/ping/v1/queue/pingJob/pingJobQueueBuilder.ts`
- `examples/quickstart/src/service/ping/v1/pingV1Service.ts`
- `specs/15-async-queues/50-queue-bridge-abstraction.md`
- `specs/15-async-queues/60-error-telemetry.md`
