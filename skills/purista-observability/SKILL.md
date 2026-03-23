---
name: purista-observability
description: Teach untrained models how builder-defined services, queues, agents, and sandbox workloads emit traces, telemetry, and protocol artifacts once runtime infrastructure is wired in.
topics: [observability, tracing, telemetry]
phases: [architecture, simulation, planning]
---

# PURISTA Observability

## When to use this skill
Use this skill when the design or implementation needs logs, traces, metrics, protocol artifacts, or failure diagnostics.

## What this component/package is for
Observability in PURISTA spans EventBridge tracing, queue telemetry, run-state artifacts, agent protocol frames, and startup diagnostics.

## Core PURISTA concept
Observability is part of runtime composition. Builder-defined services and agents must preserve trace and protocol surfaces when they are instantiated with real bridges, queues, sandbox drivers, and stores.

## Builder lifecycle
1. Define commands, streams, queues, workers, and agents with observable boundaries.
2. Keep progress, errors, and durable state explicit in definitions.
3. Instantiate runtime infrastructure that records traces, telemetry, and diagnostics.

## Hard rules
- Preserve trace metadata through service, queue, and sandbox boundaries.
- Emit structured telemetry, not only prose logs.
- Classify handled versus unhandled failures explicitly.
- Treat protocol frames and run-state as observability artifacts, not only UI artifacts.

## Decision rules
- Use protocol artifacts for user-visible progress.
- Use run-state for durable execution visibility.
- Use startup diagnostics for runtime prerequisites such as sandbox image availability.

## Definition pattern
- Design observable boundaries into commands, streams, queues, and agents.
- Keep tracing and telemetry expectations visible when defining durable or user-visible workflows.

## Implementation pattern
- Emit protocol frames, queue telemetry, and classified errors deliberately.
- Preserve trace context when invoking services, agents, or queue-backed work.

## Configuration pattern
- Trace exporters, metrics backends, and log sinks are runtime concerns.
- The builder-owned responsibility is to preserve the right metadata and event boundaries.

## Instantiation / runtime wiring
- Observability only becomes real when runtime components such as EventBridge, queue bridge, sandbox driver, and provider runtimes are instantiated with tracing/telemetry support.
- Missing diagnostics or spans usually indicate runtime wiring gaps or lost metadata propagation.

## Verification cues
- Long-running flows expose progress through protocol, run-state, or telemetry.
- Queue-backed and sandbox-backed work preserve traceability.
- Error classes and completion signals are observable after instantiation.

## Common mistakes / anti-patterns
- Using only free-form logs for critical workflows.
- Dropping trace metadata at queue or sandbox boundaries.
- Treating protocol frames as optional decoration instead of part of system visibility.
- Describing observability goals without the runtime components that must carry them.

## How this connects to other PURISTA concepts
Observability cuts across services, EventBridge, QueueBridge, agents, streams, sandbox execution, and deployment topology.

## Read if needed
- `specs/20-agents/50-observability-governance.md`
- `specs/15-async-queues/60-error-telemetry.md`
- `packages/ai/src/bridge/aiSdk.ts`
- `packages/ai/src/providers/runtime/AiSdkProvider.ts`
- `packages/core/test/integration.test.ts`
