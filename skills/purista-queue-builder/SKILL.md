---
name: purista-queue-builder
description: Design queue-backed durable workloads with explicit initiation commands, retry policy, telemetry, and recovery semantics.
topics: [queues, durable, background-work]
phases: [architecture, implementation]
---

# PURISTA Queue Builder

## When to use this skill
Use this skill when work must be durable, asynchronous, throttled, or resilient across process restarts.

## What this component/package is for
Queues model durable background work with retry, leasing, visibility control, worker pools, and telemetry.

## Hard rules
- Treat queues as the default for long-running and restart-sensitive work.
- Separate enqueue/initiation from actual worker execution.
- Make retry behavior explicit.
- Emit enough telemetry to debug waiting time, concurrency, and failure reasons.

## Decision rules
- Choose a queue when the operation can outlive the incoming request.
- Use a direct command only if the work is short, synchronous, and failure handling is simple.

## Recommended file/folder structure
```text
src/service/<service-name>/v1/queue/
src/service/<service-name>/v1/worker/
```

## Common implementation patterns
- Use an initiating command to validate input and enqueue the workload.
- Persist checkpoint or run-state information for user-visible progress.
- Normalize errors so retries and poison-message handling stay deterministic.

## Common mistakes / anti-patterns
- Running long workflows inline because “it usually finishes fast”.
- Forgetting lease/heartbeat policy for long AI or sandbox tasks.
- Treating queue retries as business retries without idempotency.

## How this connects to other PURISTA concepts
Queues connect queue bridges, workers, telemetry, durable agents, sandbox execution, and HTTP attach-and-stream patterns.

## Read if needed
- `specs/15-async-queues/00-requirements.md`
- `specs/15-async-queues/50-queue-bridge-abstraction.md`
- `specs/15-async-queues/60-error-telemetry.md`
