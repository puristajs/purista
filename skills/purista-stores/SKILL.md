---
name: purista-stores
description: Teach untrained models how PURISTA separates config, secret, state, conversation, and run-state stores and how those stores are wired into running service and agent instances.
topics: [stores, state, secrets]
phases: [architecture, implementation]
---

# PURISTA Stores

## When to use this skill
Use this skill when the design involves persistent configuration, secrets, workflow state, or conversation history.

## What this component/package is for
PURISTA distinguishes config, secret, state, conversation, and run-state storage so operational data does not get mixed with model context.

## Core PURISTA concept
Stores are runtime infrastructure, not prompt memory. Builders define whether a service or agent needs a given store surface, and the running instance receives the concrete store implementation.

## Builder lifecycle
1. Decide what kind of persisted data exists.
2. Keep the builder definition explicit about the capability that needs that data.
3. Instantiate the service or agent with the correct runtime store implementations.
4. Use the matching context surface at runtime.

## Hard rules
- Use `context.states` or `context.runState` for workflow state.
- Use `context.conversation` only for chat memory.
- Keep secrets and config in their dedicated stores.
- Do not hide operational state in prompts or ad hoc files.

## Decision rules
- Use run-state for user-visible execution progress and resumable work.
- Use conversation store for dialogue context.
- Use config and secret stores for operational configuration, not domain state.

## Definition pattern
- Decide store usage as part of service or agent design.
- Keep store responsibilities separate even if the same backend technology eventually implements them.

## Implementation pattern
- Read config, secrets, state, conversation, and run-state through the typed runtime context.
- Keep workflow checkpoints out of prompts and out of handler-local globals.

## Configuration pattern
- Builders decide that the capability exists.
- Runtime bootstrap decides which concrete store implementations back that capability.

## Instantiation / runtime wiring
- Running services and agents receive store implementations at instance creation time.
- Missing store implementations are runtime wiring issues, not something handlers should emulate by storing state elsewhere.

## Verification cues
- The design can name which store surface each piece of data belongs to.
- Durable workflow state is not kept in conversation memory.
- Runtime wiring can identify the store implementations passed to the running instance.

## Common mistakes / anti-patterns
- Treating chat history as workflow state.
- Storing secrets in config or prompts.
- Writing ad hoc files instead of using the appropriate store surface.
- Explaining store usage without showing where the running instance gets those stores.

## How this connects to other PURISTA concepts
Stores support services, agents, queue workers, conversation management, run-state, and configuration-backed resources.

## Read if needed
- `website/doc/handbook/2_building_business-logic/agent/run-state.md`
- `website/doc/handbook/2_building_business-logic/agent/handler-context.md`
- `packages/ai/src/runtime/context.ts`
- `specs/20-agents/50-observability-governance.md`
- `specs/25-voyage/10-identity/00-tenancy-and-access.md`
