---
name: purista-stores
description: Use config, secret, state, conversation, and run-state storage with the right responsibility boundaries.
topics: [stores, state, secrets]
phases: [architecture, implementation]
---

# PURISTA Stores

## When to use this skill
Use this skill when the design involves persistent configuration, secrets, workflow state, or conversation history.

## What this component/package is for
PURISTA distinguishes config, secret, state, conversation, and run-state storage so operational data does not get mixed with model context.

## Hard rules
- Use `context.states` or `context.runState` for workflow state.
- Use `context.conversation` only for chat memory.
- Keep secrets and config in their dedicated stores.
- Do not hide operational state in prompts or ad hoc files.

## Decision rules
- Use run-state for user-visible execution progress and resumable work.
- Use conversation store for dialogue context.
- Use resources or domain stores for business records.

## Recommended file/folder structure
```text
src/resources/
src/agents/
src/service/
```

## Common implementation patterns
- Run-state checkpoints for durable agents and workers.
- State stores for locks and resumable workflow metadata.
- Secret/config lookup through typed store access.

## Common mistakes / anti-patterns
- Storing workflow plans inside conversation messages.
- Treating config as mutable operational state.
- Using one store key for multiple unrelated scopes.

## How this connects to other PURISTA concepts
Stores connect services, queue workers, durable agents, sandbox ownership, and observability.

## Read if needed
- `website/doc/handbook/2_building_business-logic/agent/run-state.md`
- `website/doc/handbook/2_building_business-logic/agent/memory-and-retrieval.md`
- `packages/core/src/core/StateStore/StateStoreBaseClass.impl.ts`
