---
name: purista-agents-core
description: Teach untrained models when PURISTA agents belong in an application and how agent builders compose with services, queues, resources, and protocol-safe runtime execution.
topics: [agents, orchestration, protocol]
phases: [architecture, implementation]
---

# PURISTA Agents Core

## When to use this skill
Use this skill when the design involves conversational flows, tool loops, planners, or model-driven orchestration.

## What this component/package is for
PURISTA agents are first-class runtime units that share EventBridge, queues, stores, observability, and explicit skill resources with the rest of the framework.

## Core PURISTA concept
Agents extend the builder model instead of replacing it. They are model-driven runtime units that must still be attached to services, resources, skills, stores, and runtime policies explicitly.

## Builder lifecycle
1. Decide whether the workflow needs an agent or a deterministic service path.
2. Define the owning agent builder and any service builders it depends on.
3. Declare models, skills, tools, resources, stores, and execution policy on the agent definition.
4. Wire the agent into commands, streams, queues, or external runtimes.
5. Create the running agent instance with explicit runtime resources and bridges.

## Hard rules
- Keep services and resources as the deterministic backbone.
- Use agents for model-driven reasoning and orchestration, not as generic replacements for application services.
- Separate inline from queued durable execution deliberately.
- Emit protocol-safe progress and errors.

## Decision rules
- Use inline agents for short, low-risk turns.
- Use queued durable agents for planning, simulation, long-running tool loops, or resumable work.
- Keep deterministic business invariants in services, commands, queues, and resources even when an agent is involved.

## Definition pattern
- Define agents as explicit runtime units with declared skills, tools, resources, and execution policy.
- Keep the service layer visible around the agent so the model-driven part has a deterministic boundary.

## Implementation pattern
- Let agents orchestrate tools, services, child agents, and skills.
- Keep business side effects behind commands, services, queues, or allowlisted runtime bindings.
- Use explicit protocol or stream surfaces for user-visible progress.

## Configuration pattern
- Agent model aliases, skill names, conversation persistence, run-state, and runtime bindings are part of definition.
- Concrete skills, resources, stores, queue bridges, and providers are attached at runtime.

## Instantiation / runtime wiring
- Agents become real only when instantiated with runtime resources such as providers, skill resources, stores, EventBridge, and optional queue bridges.
- Inline and queued execution both depend on explicit runtime policy rather than hidden prompt behavior.

## Verification cues
- The design can explain why an agent exists instead of a plain command or queue.
- The agent’s deterministic dependencies are explicit.
- Runtime wiring can list declared skills, providers, stores, and bridges.
- User-visible progress is emitted through protocol-safe channels rather than ad hoc logs.

## Common mistakes / anti-patterns
- Treating the agent as the whole application.
- Hiding durable workflow state in chat memory.
- Letting provider SDK details define the architecture.
- Describing an agent loop without its surrounding services, resources, or runtime wiring.

## How this connects to other PURISTA concepts
Agents rely on service builders, resources, stores, skills, external runtime bindings, queue execution, HTTP delivery, and observability.

## Read if needed
- `specs/20-agents/00-requirements.md`
- `specs/20-agents/30-builder-integration.md`
- `website/doc/handbook/2_building_business-logic/agent/index.md`
- `packages/ai/src/builder/AgentBuilder.ts`
- `examples/ai-basic/src/agents/supportAgent/v1/supportAgent.ts`
