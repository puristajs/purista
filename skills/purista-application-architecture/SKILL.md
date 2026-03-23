---
name: purista-application-architecture
description: Turn user requirements into a PURISTA application structure with bounded services, resources, stores, queues, transports, and agents.
topics: [architecture, services, resources, http-runtime]
phases: [spec, architecture]
---

# PURISTA Application Architecture

## When to use this skill
Use this skill when the user wants an application architecture, service decomposition, or a first technical design from product requirements.

## What this component/package is for
This skill teaches how to map business capabilities to PURISTA services, decide where resources and stores belong, and choose command/subscription/queue/agent boundaries.

## Hard rules
- Start from business capabilities and ownership boundaries, not package names.
- Separate synchronous request paths from durable background execution.
- Keep contracts and schemas explicit at service boundaries.
- Leave provider-specific model choices and infrastructure product names undecided until they are needed.

## Decision rules
- If a workflow must survive restarts, design a queue-backed path.
- If a capability owns state and invariants, it deserves a service boundary.
- If an LLM is only enriching a deterministic workflow, keep the surrounding control flow in PURISTA commands/resources.

## Recommended file/folder structure
```text
src/
  service/
    billing/
    catalog/
    search/
  agents/
  resources/
  config/
  schema/
```

## Common implementation patterns
- Produce a capability map first, then map each capability to a service and version.
- Document the write model, read model, events, durable jobs, and agent entrypoints separately.
- Call out which resources are internal adapters versus shared infrastructure.

## Common mistakes / anti-patterns
- Overfitting the architecture to one HTTP route tree.
- Designing agents before service contracts exist.
- Letting one service become a generic orchestration dump.

## How this connects to other PURISTA concepts
This skill should route to service builder, queue builder, stores, resources, HTTP runtime, sandbox, and agent runtime skills as the design deepens.

## Read if needed
- `website/doc/handbook/2_building_business-logic/service/index.md`
- `website/doc/handbook/3_eco_system/index.md`
- `specs/25-voyage/70-backend/00-backend-architecture.md`
- `specs/26-voyage-refinement/05-architecture-model.md`
