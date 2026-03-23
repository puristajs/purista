---
name: purista-external-runtime-bindings
description: Expose commands and agents as provider-neutral external runtime bindings using context.expose and neutral metadata.
topics: [agents, external-runtime, tools]
phases: [architecture, implementation]
---

# PURISTA External Runtime Bindings

## When to use this skill
Use this skill when an external tool loop needs access to PURISTA commands or agents without coupling the core model to one provider SDK.

## What this component/package is for
External runtime bindings are the provider-neutral contract for exposing PURISTA commands and agents to model/tool runtimes.

## Hard rules
- Keep the binding source of truth neutral and provider-agnostic.
- Use `context.expose.tool`, `context.expose.agent`, `context.expose.tools`, and `context.expose.metadata`.
- Put result modes and durable metadata in the neutral binding, not in the provider adapter.

## Decision rules
- Expose commands when the external runtime should call deterministic service behavior.
- Expose agents when an external loop should delegate to another model-driven unit.
- Reject unsupported durable cases early instead of inventing fallback semantics.

## Recommended file/folder structure
```text
src/agents/<agent-name>/v1/
  <agentName>.ts
  prompt.md
```

## Common implementation patterns
- Build bindings from the runtime context inside the handler.
- Convert them to provider tools only at the adapter boundary, for example with `toAiSdkTools`.
- Inspect `context.expose.metadata()` for diagnostics and test assertions.

## Common mistakes / anti-patterns
- Creating provider-native tools as the source of truth.
- Reintroducing old bridge helper names or compatibility aliases.
- Mixing queue policy and allowlist resolution into the provider adapter.

## How this connects to other PURISTA concepts
This skill connects commands, agents, queue durability, tool metadata, and provider adapters such as the AI SDK adapter.

## Read if needed
- `website/doc/handbook/2_building_business-logic/agent/external-runtime-bridge.md`
- `packages/ai/src/bridge/externalRuntime.ts`
- `packages/ai/src/runtime/context.ts`
