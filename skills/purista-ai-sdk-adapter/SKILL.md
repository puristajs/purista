---
name: purista-ai-sdk-adapter
description: Adapt provider-neutral PURISTA bindings to Vercel AI SDK tools without making AI SDK the source of truth.
topics: [agents, ai-sdk, tools]
phases: [implementation]
---

# PURISTA AI SDK Adapter

## When to use this skill
Use this skill when the chosen provider loop is Vercel AI SDK and PURISTA bindings need to become AI SDK tools.

## What this component/package is for
The AI SDK adapter is a thin conversion layer from neutral external runtime bindings to AI SDK-compatible tool definitions.

## Hard rules
- Keep `toAiSdkTool` and `toAiSdkTools` as pure adapters.
- Do not move allowlist lookup or queue decisions into the adapter.
- Keep provider-specific metadata out of the neutral contract.

## Decision rules
- Use the adapter only at the provider boundary.
- Keep neutral binding creation inside the runtime context with `context.expose`.

## Recommended file/folder structure
```text
src/agents/<agent-name>/v1/
  <agentName>.ts
```

## Common implementation patterns
- `const bindings = context.expose.tools(...)`
- `const tools = toAiSdkTools(bindings)`
- pass `tools` into `generateText` metadata only after the binding set is complete

## Common mistakes / anti-patterns
- Building AI SDK tools directly from service metadata without neutral bindings.
- Treating the adapter as the place to enforce durable execution policy.
- Hiding binding creation in custom helpers that recreate old bridge abstractions.

## How this connects to other PURISTA concepts
This skill sits on top of external runtime bindings, agent runtime, and provider-specific model invocation.

## Read if needed
- `website/doc/handbook/2_building_business-logic/agent/ai-sdk-adapter.md`
- `packages/ai/src/bridge/aiSdk.ts`
- `packages/ai/src/bridge/externalRuntime.ts`
