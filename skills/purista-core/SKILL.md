---
name: purista-core
description: Core PURISTA mental model for teaching untrained models how builder definitions become configured runtime instances with services, resources, contracts, queues, and agents.
topics: [core, architecture, service-design]
phases: [spec, architecture, implementation]
---

# PURISTA Core

## When to use this skill
Use this skill first when the model needs the base PURISTA mental model before doing design or implementation work.

## What this component/package is for
PURISTA is a builder-driven framework. Applications are assembled by defining services, resources, commands, subscriptions, streams, queues, workers, and agents first, then turning those definitions into configured runtime instances.

## Core PURISTA concept
PURISTA separates four concerns:
- definition: builders declare contracts, schemas, resources, and capabilities
- implementation: handler functions contain business behavior behind those definitions
- configuration: config schemas, runtime stores, bridges, and resources are attached explicitly
- instantiation: `getInstance(...)` creates the running service or agent with concrete infrastructure

## Builder lifecycle
1. Start from a business capability and create a versioned `ServiceBuilder`.
2. Attach service-level config with `setConfigSchema(...)`.
3. Declare runtime-owned dependencies with `defineResource(...)`.
4. Derive child builders with `getCommandBuilder(...)`, `getSubscriptionBuilder(...)`, `getStreamBuilder(...)`, `getQueueBuilder(...)`, and `getQueueWorkerBuilder(...)`.
5. Add schemas and handler implementations to those child builders.
6. Materialize definitions with `getDefinition()`.
7. Register definitions back onto the service with `addCommandDefinition(...)`, `addSubscriptionDefinition(...)`, `addStreamDefinition(...)`, `addQueueDefinition(...)`, and `addQueueWorkerDefinition(...)`.
8. Create the running instance with `getInstance(eventBridge, options)`.

## Hard rules
- Model business capabilities as versioned services first.
- Put external dependencies behind resources, not ad hoc singletons in handlers.
- Keep schemas explicit for commands, events, streams, queues, and agents.
- Keep runtime concerns explicit: EventBridge, QueueBridge, stores, HTTP exposure, and sandbox are separate from definitions.

## Decision rules
- Use commands for direct business actions.
- Use subscriptions for reacting to events and facts.
- Use streams for incremental delivery.
- Use queues and queue workers for durable background work.
- Use agents when the workflow is model-driven, conversational, or tool-loop oriented.

## Definition pattern
Define a versioned service builder first, then derive child builders from it.

```text
src/
  service/
    <domain>/
      v1/
        <domain>V1ServiceBuilder.ts
        <domain>V1Service.ts
        command/
        subscription/
        stream/
        queue/
        worker/
  resources/
  config/
```

## Implementation pattern
- Keep implementation logic behind builder contracts, either inline in `set*Function(...)` or in explicit handler modules owned by the versioned builder folder.
- Let service builders define structure and let handlers call resources, stores, or other services.
- Use the service module to collect child definitions and expose the assembled service definition.

## Configuration pattern
- Use `setConfigSchema(...)` on the service builder for service-owned runtime config.
- Use `defineResource(...)` for runtime-provided collaborators such as repositories, SDKs, skill resources, or sandbox adapters.
- Pass concrete `resources`, `queueBridge`, `configStore`, `secretStore`, `stateStore`, and similar infrastructure only at instance creation time.

## Instantiation / runtime wiring
- `getInstance(eventBridge, options)` is where definitions become running services.
- Service instances need the EventBridge plus any required runtime infrastructure such as logger, queue bridge, stores, and resources.
- Agents follow the same pattern: builder declaration first, runtime bindings and resources at `getInstance(...)`.

## Verification cues
- A correct design names the service boundary before naming handlers.
- Every handler dependency is reachable through config, resources, context stores, or declared runtime bindings.
- Definitions are collected with `getDefinition()` and re-added to the service before `getInstance(...)`.
- The produced app can explain what is definition vs implementation vs configuration vs runtime wiring.

## Common mistakes / anti-patterns
- Treating agents as a replacement for services and resources.
- Mixing workflow state into prompts or conversation history.
- Putting database clients, SDKs, or filesystem state directly inside handlers.
- Describing only handler code without showing how the service or agent is instantiated.

## How this connects to other PURISTA concepts
This skill is the umbrella for application architecture, service builders, command/subscription/stream/queue patterns, resources, stores, agents, sandbox, transports, and deployment.

## Related skills
- `purista-application-architecture` for turning requirements into service and runtime boundaries
- `purista-service-builder` for the canonical service assembly lifecycle
- `purista-resources` for runtime dependency declaration and injection
- `purista-schema-contracts` for attaching schemas to builders
- `purista-agents-core` for when model-driven orchestration belongs in the system

## Read if needed
- `references/builder-lifecycle.md`
- `website/doc/handbook/2_building_business-logic/builders.md`
- `packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts`
- `examples/client-builder/src/service/pingPong/v1/pingPongV1Service.ts`
- `examples/quickstart/src/service/ping/v1/pingV1Service.ts`
