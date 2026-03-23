---
name: purista-agent-runtime
description: Implement agent handlers with current PURISTA runtime helpers, conversation state, run-state, context.expose, and explicit skill loading.
topics: [agents, runtime, skills, run-state]
phases: [implementation]
---

# PURISTA Agent Runtime

## When to use this skill
Use this skill when writing or reviewing agent handler code.

## What this component/package is for
The runtime context gives an agent controlled access to models, tools, resources, other agents, conversation memory, run-state, and skills.

## Hard rules
- Use `context.expose.*` for provider-neutral external runtime bindings.
- Keep retrieval and skill loading behind resources and `context.skills`, not hidden prompt magic.
- Use `context.runState` for durable workflow state and `context.conversation` for chat history.
- Keep prompt assembly explicit.

## Decision rules
- Use `context.tools` for declared command invocations.
- Use `context.agents.forward` when child output should be visible to the user.
- Use `context.skills.search`, `context.skills.load`, and `context.skills.loadReferences` only when the handler actually needs those materials.

## Recommended file/folder structure
```text
src/agents/<agent-name>/v1/
  <agentName>.ts
  prompt.md
  helpers.ts
```

## Common implementation patterns
- Search skills by `phases`, `topics`, and user query, then render only the selected skill documents.
- Convert neutral bindings to provider tools at the boundary with `toAiSdkTools`.
- Use `context.stream` and `context.runState` together for long-running user-visible work.

## Common mistakes / anti-patterns
- Reintroducing a knowledgebase abstraction instead of resources and skills.
- Storing workflow checkpoints in conversation history.
- Building provider-specific tools directly inside the agent instead of using `context.expose`.

## How this connects to other PURISTA concepts
This skill depends on external runtime bindings, AI SDK adapters, conversation store, run-state, resources, and sandbox integration.

## Read if needed
- `website/doc/handbook/2_building_business-logic/agent/handler-context.md`
- `website/doc/handbook/2_building_business-logic/agent/runtime.md`
- `website/doc/handbook/2_building_business-logic/agent/run-state.md`
- `packages/ai/src/runtime/context.ts`
