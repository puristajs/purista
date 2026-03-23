---
name: purista-observability
description: Apply PURISTA tracing, telemetry, protocol, and error-classification patterns to services, queues, agents, and sandbox execution.
topics: [observability, tracing, telemetry]
phases: [architecture, simulation, planning]
---

# PURISTA Observability

## When to use this skill
Use this skill when the design or implementation needs logs, traces, metrics, protocol artifacts, or failure diagnostics.

## What this component/package is for
Observability in PURISTA spans EventBridge tracing, queue telemetry, run-state artifacts, agent protocol frames, and startup diagnostics.

## Hard rules
- Preserve trace metadata through service, queue, and sandbox boundaries.
- Emit structured telemetry, not only prose logs.
- Classify handled versus unhandled failures explicitly.

## Decision rules
- Use protocol artifacts for user-visible progress.
- Use run-state for durable execution visibility.
- Use startup diagnostics for runtime prerequisites such as sandbox image availability.

## Recommended file/folder structure
```text
src/index.ts
src/agents/
src/service/
```

## Common implementation patterns
- Log phase transitions with project and conversation identifiers.
- Emit tool events and telemetry frames for model or sandbox work.
- Add preflight checks for external runtime dependencies.

## Common mistakes / anti-patterns
- Swallowing queue or sandbox failures behind generic 500 errors.
- Logging sensitive data directly from prompts or secrets.
- Treating final assistant text as the only success signal.

## How this connects to other PURISTA concepts
Observability spans EventBridge, queue bridges, agent protocol, run-state, stores, and deployment readiness.

## Read if needed
- `specs/20-agents/50-observability-governance.md`
- `specs/15-async-queues/60-error-telemetry.md`
- `packages/ai/src/protocol/index.ts`
