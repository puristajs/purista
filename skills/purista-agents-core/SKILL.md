---
name: purista-agents-core
description: Decide when PURISTA agents are appropriate and how they relate to services, queues, resources, and protocols.
topics: [agents, orchestration, protocol]
phases: [architecture, implementation]
---

# PURISTA Agents Core

## When to use this skill
Use this skill when the design involves conversational flows, tool loops, planners, or model-driven orchestration.

## What this component/package is for
PURISTA agents are first-class runtime units that share EventBridge, queues, stores, observability, and service contracts with the rest of the framework.

## Hard rules
- Keep services and resources as the deterministic backbone.
- Use agents for model-driven reasoning and orchestration, not as generic replacements for application services.
- Separate inline from queued durable execution deliberately.
- Emit protocol-safe progress and errors.

## Decision rules
- Use inline agents for short, low-risk turns.
- Use queued durable agents for architecture, planning, simulation, or any long-running flow.
- Use sub-agent invocation when one agent owns a distinct decision or synthesis concern.

## Recommended file/folder structure
```text
src/agents/<agent-name>/v1/
  <agentName>.ts
  prompt.md
  *.test.ts
```

## Common implementation patterns
- Wrap deterministic resources and commands around the model loop.
- Keep prompt construction explicit and testable.
- Use run-state and queue-backed execution for durable agents.

## Common mistakes / anti-patterns
- Letting an agent own hidden application state.
- Using one monolithic agent for every workflow.
- Treating tool execution as unbounded shell access.

## How this connects to other PURISTA concepts
Agents depend on resources, commands, external runtime bindings, queues, run-state, and sandbox-backed tool execution.

## Read if needed
- `website/doc/handbook/2_building_business-logic/agent/index.md`
- `specs/20-agents/00-requirements.md`
- `specs/20-agents/10-platform-architecture.md`
