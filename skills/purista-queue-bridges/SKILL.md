---
name: purista-queue-bridges
description: Configure queue bridges, worker pools, leases, and retry semantics for durable PURISTA workloads.
topics: [queue-bridge, queues, durability]
phases: [architecture, implementation]
---

# PURISTA Queue Bridges

## When to use this skill
Use this skill when durable execution needs a queue transport or when worker concurrency and retry behavior matter.

## What this component/package is for
Queue bridges provide the transport abstraction for durable jobs, workers, leases, retries, and attach-and-stream semantics.

## Hard rules
- Keep queue policy explicit: attempts, lease TTL, heartbeat, and concurrency.
- Match queue settings to workload duration and side-effect model.
- Prefer queue-backed execution for long-running AI and sandbox tasks.

## Decision rules
- Use a queue bridge whenever work must continue after the caller disconnects.
- Tune heartbeat and lease behavior for long tool or model runs.

## Recommended file/folder structure
```text
src/index.ts
src/service/
src/agents/
```

## Common implementation patterns
- Start one queue bridge at app bootstrap and inject it into services and agents.
- Size worker pools per workload class.
- Propagate queue telemetry to logs and user-visible run-state.

## Common mistakes / anti-patterns
- Assuming default lease extension budgets are always enough.
- Running queue-backed work without idempotency planning.
- Treating queue visibility timeouts as business deadlines.

## How this connects to other PURISTA concepts
Queue bridges sit under queue builders, queue workers, durable agents, sandbox execution, and attach-and-stream UI patterns.

## Read if needed
- `specs/15-async-queues/30-core-interfaces.md`
- `specs/15-async-queues/50-queue-bridge-abstraction.md`
- `specs/15-async-queues/70-risks-and-mitigations.md`
