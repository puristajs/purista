---
name: purista-queue-worker-builder
description: Implement idempotent PURISTA queue workers with checkpointing, controlled side effects, and observable progress.
topics: [workers, queues, run-state]
phases: [implementation]
---

# PURISTA Queue Worker Builder

## When to use this skill
Use this skill when implementing the actual durable worker logic behind a queue.

## What this component/package is for
Queue workers perform durable execution with retries, leases, checkpointing, and explicit side-effect control.

## Hard rules
- Keep worker side effects idempotent or guarded.
- Make progress and checkpoint updates explicit.
- Fail with classified errors, not generic text blobs.
- Never assume a worker runs only once.

## Decision rules
- Use checkpoints for multi-step work.
- Use locks or idempotency keys when concurrent duplicate execution is possible.
- Move user-facing status into run-state or emitted events, not ad hoc logs only.

## Recommended file/folder structure
```text
src/service/<service-name>/v1/worker/<worker-name>/
  <workerName>QueueWorkerBuilder.ts
  handler.ts
```

## Common implementation patterns
- Load the durable record or run-state snapshot first.
- Execute one logical step at a time and checkpoint after success.
- Emit telemetry about wait time, run time, and retry count.

## Common mistakes / anti-patterns
- Making irreversible external calls before the local checkpoint is consistent.
- Hiding long loops inside one worker attempt without heartbeats or state updates.
- Returning user-facing prose instead of structured worker results.

## How this connects to other PURISTA concepts
Workers are where queue durability meets stores, sandbox execution, external resources, and agent orchestration.

## Read if needed
- `specs/15-async-queues/30-core-interfaces.md`
- `specs/15-async-queues/90-implementation-outline.md`
- `website/doc/handbook/2_building_business-logic/agent/run-state.md`
