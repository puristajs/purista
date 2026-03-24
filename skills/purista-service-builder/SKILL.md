---
name: purista-service-builder
description: Teach untrained models how to define versioned PURISTA services with ServiceBuilder, resources, config schemas, child builders, and runtime instance creation.
topics: [services, builders, resources]
phases: [architecture, implementation]
---

# PURISTA Service Builder

## When to use this skill
Use this skill when creating or refactoring a service boundary.

## What this component/package is for
`ServiceBuilder` is the root builder for a versioned PURISTA service. It owns service identity, config schema, declared resources, and the child builders whose definitions are assembled into the running service.

## Core PURISTA concept
The service builder is the boundary between application design and runtime execution. It defines what the service is allowed to own and what must be provided later when the service instance is created.

## Builder lifecycle
1. Create `new ServiceBuilder(serviceInfo)`.
2. Attach service config with `setConfigSchema(...)`.
3. Declare runtime collaborators with `defineResource(...)`.
4. Derive child builders with `getCommandBuilder(...)`, `getSubscriptionBuilder(...)`, `getStreamBuilder(...)`, `getQueueBuilder(...)`, and `getQueueWorkerBuilder(...)`.
5. Call `getDefinition()` on child builders.
6. Add definitions back with `addCommandDefinition(...)`, `addSubscriptionDefinition(...)`, `addStreamDefinition(...)`, `addQueueDefinition(...)`, and `addQueueWorkerDefinition(...)`.
7. Create the running service with `getInstance(eventBridge, options)`.

## Hard rules
- Keep one clear domain responsibility per service.
- Declare resources and config on the service builder, not inside handlers.
- Version services explicitly.
- Avoid leaking transport concerns into the service definition.

## Decision rules
- Add a new service when ownership, state, or integration boundaries differ materially.
- Add a new version when a public contract changes incompatibly.
- Use one service builder as the parent for all command, subscription, stream, queue, and worker builders in that version folder.
- If AI workers need deterministic persistence, keep the worker agent separate from the command that applies its deliverable.

## Definition pattern
- Put the service builder in its own versioned file.
- Keep `serviceInfo`, config schema, and declared resources close to the builder.

```text
src/service/<service-name>/v1/
  <serviceName>V1ServiceBuilder.ts
  <serviceName>V1Service.ts
  command/
  subscription/
  stream/
  queue/
  worker/
```

## Implementation pattern
- Child builder files define schemas and handler implementations.
- The service module imports child builders, collects `getDefinition()` results, and registers them on the service builder.
- Handler bodies stay thin and use typed context, resources, stores, and other declared capabilities.
- Prefer shared application helpers for repeated workflow patching or deliverable application logic instead of copying resource update code across commands.

## Configuration pattern
- Use `setConfigSchema(...)` for service-owned configuration shape.
- Use `defineResource(...)` for runtime-provided adapters and collaborators.
- Supply concrete config values, resources, logger, queue bridge, state store, and other infrastructure only at `getInstance(...)`.

## Instantiation / runtime wiring
- `getInstance(eventBridge, options)` is the handoff from definitions to a running service.
- The options object is where runtime resources, bridges, stores, and logger are injected.
- If a service needs a queue bridge, config store, or resources, the architecture is incomplete until those are named in instance wiring.

## Verification cues
- The service has one builder file and one assembly file.
- Child builders come from the owning service builder rather than being created in isolation.
- Definitions are re-added to the service builder before `getInstance(...)`.
- The runtime wiring can list required resources and bridges explicitly.

## Common mistakes / anti-patterns
- One “misc” service with unrelated business behavior.
- Resource construction inside command handlers.
- Forgetting versioned folder boundaries.
- Writing handlers without showing how the resulting definitions are assembled into a service instance.

## How this connects to other PURISTA concepts
Service builders host command, subscription, stream, queue, and worker builders, and they are instantiated with EventBridge, stores, resources, and runtime bridges.

## Related skills
- `purista-core` for the full builder lifecycle
- `purista-command-builder` for request/response actions
- `purista-subscription-builder` for reactive event handling
- `purista-stream-builder` for incremental delivery
- `purista-queue-builder` and `purista-queue-worker-builder` for durable execution
- `purista-resources` for `defineResource(...)` usage

## Read if needed
- `references/service-builder-lifecycle.md`
- `website/doc/handbook/2_building_business-logic/service/the-service-builder.md`
- `packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts`
- `examples/fullexample/src/service/email/v1/emailV1ServiceBuilder.ts`
- `examples/client-builder/src/service/pingPong/v1/pingPongV1Service.ts`
