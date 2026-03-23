---
name: purista-queue-bridges
description: Teach untrained models how builder-defined queues and workers are executed through QueueBridge with explicit runtime policy, leases, retries, and worker concurrency.
topics: [queue-bridge, queues, durability]
phases: [architecture, implementation]
---

# PURISTA Queue Bridges

## When to use this skill
Use this skill when durable execution needs a queue transport or when worker concurrency and retry behavior matter.

## What this component/package is for
Queue bridges provide the transport abstraction for durable jobs, workers, leases, retries, and attach-and-stream semantics.

## Core PURISTA concept
QueueBridge is runtime infrastructure for builder-defined queues and workers. Queue and worker builders describe what durable execution requires; QueueBridge provides the transport that makes it run.

## Builder lifecycle
1. Define queues with `getQueueBuilder(...)`.
2. Define workers with `getQueueWorkerBuilder(...)`.
3. Register queue and worker definitions on the service.
4. Instantiate the service with a concrete `queueBridge`.

## Hard rules
- Keep queue policy explicit: attempts, lease TTL, heartbeat, and concurrency.
- Match queue settings to workload duration and side-effect model.
- Prefer queue-backed execution for long-running AI and sandbox tasks.

## Decision rules
- Use a queue bridge whenever work must continue after the caller disconnects.
- Tune heartbeat and lease behavior for long tool or model runs.
- Keep business retry meaning separate from transport retry meaning.

## Definition pattern
- Queue lifecycle and worker concurrency are declared in queue and worker builders.
- QueueBridge selection itself is runtime wiring.

## Implementation pattern
- Keep worker logic idempotent.
- Use queue lifecycle config and worker settings to match the real workload.
- Treat dead-letter handling and retry policy as first-class implementation behavior.

## Configuration pattern
- Builder definitions carry lifecycle and bridge config metadata.
- The actual queue transport implementation is chosen and configured by runtime bootstrap.

## Instantiation / runtime wiring
- Services with queue definitions are incomplete until a runtime `queueBridge` is supplied to `getInstance(...)`.
- Queue-backed agents and services should name the bridge, worker process shape, and any store dependencies explicitly.

## Verification cues
- The queue and worker definitions are present and registered.
- Runtime bootstrap can identify the concrete queue bridge used by the service or agent.
- Lease and retry policy match workload duration and failure semantics.

## Common mistakes / anti-patterns
- Treating queue configuration as an implementation detail that can be deferred indefinitely.
- Running durable work without a clear lease and retry story.
- Confusing worker concurrency with business idempotency.
- Describing queue transport without showing the underlying queue and worker builders plus `getInstance(...)` wiring.

## How this connects to other PURISTA concepts
Queue bridges execute queue and worker builders and power durable agents, sandbox tasks, and long-running workflows.

## Read if needed
- `specs/15-async-queues/50-queue-bridge-abstraction.md`
- `packages/core/test/helpers/queueBridgeContractSuite.ts`
- `packages/core/src/DefaultQueueBridge/DefaultQueueBridge.impl.ts`
- `packages/ai/src/builder/AgentBuilder.ts`
- `examples/quickstart/src/service/ping/v1/pingV1Service.ts`
