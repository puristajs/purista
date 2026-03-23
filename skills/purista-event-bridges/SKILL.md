---
name: purista-event-bridges
description: Use EventBridge correctly for commands, subscriptions, tracing propagation, and service integration.
topics: [event-bridge, messaging, tracing]
phases: [architecture, implementation]
---

# PURISTA Event Bridges

## When to use this skill
Use this skill when integrating services, commands, subscriptions, or custom event flows.

## What this component/package is for
EventBridge is PURISTA’s runtime transport for commands, events, and tracing-aware service integration.

## Hard rules
- Keep EventBridge wiring infrastructure-level, not business-level.
- Preserve message metadata for tracing, tenancy, and principal propagation.
- Treat unconsumed messages as a design signal, not harmless noise.

## Decision rules
- Use direct EventBridge invocation for service-to-service interaction.
- Use queues when the execution must be durable or throttled.

## Recommended file/folder structure
```text
src/index.ts
src/service/
```

## Common implementation patterns
- Start the EventBridge once at application bootstrap.
- Register all service instances before exposing HTTP or other transports.
- Use typed service definitions so command names stay valid.

## Common mistakes / anti-patterns
- Publishing arbitrary custom messages no service consumes.
- Losing trace metadata when constructing messages manually.
- Treating EventBridge as a domain model.

## How this connects to other PURISTA concepts
EventBridge underpins commands, subscriptions, agent invocation, sandbox service calls, and observability.

## Read if needed
- `packages/core/src/DefaultEventBridge/DefaultEventBridge.impl.ts`
- `specs/20-agents/10-platform-architecture.md`
- `specs/15-async-queues/50-queue-bridge-abstraction.md`
