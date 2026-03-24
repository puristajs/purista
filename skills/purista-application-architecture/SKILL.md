---
name: purista-application-architecture
description: Turn user requirements into a PURISTA application structure that teaches untrained models which services, resources, builders, queues, transports, and agents must exist.
topics: [architecture, services, resources, http-runtime]
phases: [spec, architecture]
---

# PURISTA Application Architecture

## When to use this skill
Use this skill when turning product requirements into a first PURISTA application design.

## What this component/package is for
This skill teaches how to map business capabilities to service builders, resource boundaries, durable workflows, transports, and agent entrypoints before implementation starts.

## Core PURISTA concept
Architecture in PURISTA is a graph of builder-owned capabilities. You decide which service builders exist, which child builders they expose, which resources they require, and which runtime infrastructure must be supplied when instances are created.

For AI-heavy systems, the preferred split is:
- public conductor/orchestrator
- specialist worker agents
- deterministic apply commands
- workflow/readiness/approval state
- UI projections separate from domain truth

## Builder lifecycle
1. Identify business capabilities and ownership boundaries.
2. Create one versioned service builder per bounded capability.
3. Decide which child builders each service should own: command, subscription, stream, queue, worker, or agent-facing entrypoint.
4. Declare required resources and config schemas at the service level.
5. Decide which services need runtime transports such as HTTP, EventBridge, QueueBridge, or sandbox.
6. Plan how those services will be instantiated with `getInstance(...)`.

## Hard rules
- Start from business capabilities and ownership boundaries, not package names or routes.
- Separate synchronous request paths from durable background execution.
- Keep contracts and schemas explicit at service boundaries.
- Keep architecture neutral about provider or infrastructure products until the boundary actually needs them.

## Decision rules
- If a workflow must survive restarts, design a queue-backed path.
- If a capability owns state and invariants, it deserves a service boundary.
- If an LLM only enriches a deterministic workflow, keep the control flow in service builders, commands, queues, and resources.
- If the runtime concern is transport only, keep it out of the service definition.
- If the user-facing flow mixes reasoning and state mutation, split it into deliverables plus deterministic apply commands.

## Definition pattern
- Define a capability map first.
- Translate that capability map into service builders and child builders.
- Make service ownership visible in the folder structure.

```text
src/
  service/
    billing/
      v1/
    catalog/
      v1/
    search/
      v1/
  resources/
  config/
  agents/
```

## Implementation pattern
- Put domain behavior in handlers and resource helpers behind builder-defined boundaries.
- Assemble each service by collecting child builder definitions back into the service module.
- Keep orchestration inside handlers, queues, and agents, not in random bootstrap code.

## Configuration pattern
- Attach service-owned configuration via `setConfigSchema(...)`.
- Declare shared adapters via `defineResource(...)`.
- Leave concrete store, bridge, logger, and resource instances for bootstrap and `getInstance(...)`.

## Instantiation / runtime wiring
- The architecture is only complete when it can name the runtime dependencies for each service instance.
- Every service or agent should be instantiable by listing its required bridges, stores, resources, and optional transport wrappers.
- HTTP, MCP, sandbox, and queue infrastructure wrap or power builder-defined services; they do not replace them.

## Verification cues
- The design can point to the service builder each business capability belongs to.
- The design can explain why a path is command vs subscription vs stream vs queue.
- The design names required runtime resources and bridges for each service instance.
- The design explains where a user-facing request enters and how the running instance is created.

## Common mistakes / anti-patterns
- Overfitting architecture to one route tree.
- Designing agents before service contracts exist.
- Letting one service become a generic orchestration dump.
- Naming handlers and files without first deciding the owning service builder.
- Letting worker agents write project truth directly when a command should own the mutation.

## How this connects to other PURISTA concepts
This skill routes to `purista-core`, `purista-service-builder`, `purista-resources`, queue and stream skills, stores, HTTP runtime, sandbox, and agent runtime.

## Related skills
- `purista-core` for the shared builder mental model
- `purista-service-builder` for service ownership and assembly
- `purista-resources` for dependency boundaries
- `purista-queue-builder` for durable workflows
- `purista-agents-core` for model-driven orchestration choices

## Read if needed
- `website/doc/handbook/2_building_business-logic/service/index.md`
- `specs/25-voyage/70-backend/00-backend-architecture.md`
- `specs/26-voyage-refinement/05-architecture-model.md`
- `examples/ai-basic/src/service/support/v1/supportV1Service.ts`
- `examples/quickstart/src/service/ping/v1/pingV1Service.ts`
