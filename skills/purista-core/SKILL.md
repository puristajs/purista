---
name: purista-core
description: Core PURISTA mental model for mapping business requirements into services, resources, contracts, queues, and agents.
topics: [core, architecture, service-design]
phases: [spec, architecture, implementation]
---

# PURISTA Core

## When to use this skill
Use this skill when an agent needs the base PURISTA mental model before doing spec clarification, architecture design, or implementation work.

## What this component/package is for
PURISTA is a builder-driven framework for distributed applications. The stable primitives are services, commands, subscriptions, streams, queue workers, resources, stores, bridges, and agents.

## Hard rules
- Model business capabilities as versioned services first.
- Put external dependencies behind resources, not ad hoc singletons in handlers.
- Use schemas for public contracts and message payloads.
- Keep runtime concerns explicit: EventBridge, QueueBridge, stores, HTTP exposure, and sandbox are separate layers.

## Decision rules
- Use commands for direct business actions.
- Use subscriptions for reacting to domain events.
- Use streams for incremental delivery.
- Use queues and queue workers for durable background work.
- Use agents when the workflow is model-driven, conversational, or tool-loop oriented.

## Recommended file/folder structure
```text
src/
  service/
    <domain>/
      v1/
        <domain>V1Service.ts
        command/
        subscription/
        stream/
        queue/
        worker/
  resources/
  config/
```

## Common implementation patterns
- Start from service boundaries and contracts, then attach resources and transport.
- Keep handler code thin and let domain/resource helpers do the real work.
- Use queues first for long-running or restart-sensitive workflows.

## Common mistakes / anti-patterns
- Treating agents as a replacement for services and resources.
- Mixing workflow state into conversation memory.
- Putting database clients, SDKs, or filesystem state directly inside handlers.

## How this connects to other PURISTA concepts
This skill is the umbrella for service builders, command/subscription/stream patterns, queues, resources, stores, agents, sandbox, and deployment.

## Read if needed
- `website/doc/handbook/index.md`
- `website/doc/handbook/2_building_business-logic/builders.md`
- `website/doc/handbook/2_building_business-logic/service/index.md`
- `website/doc/handbook/2_building_business-logic/agent/index.md`
- `specs/00-context.md`
