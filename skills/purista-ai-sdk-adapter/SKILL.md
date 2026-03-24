---
name: purista-ai-sdk-adapter
description: Teach untrained models how PURISTA adapts neutral external bindings from builder-defined commands and agents into Vercel AI SDK tools without changing the source of truth.
topics: [agents, ai-sdk, tools]
phases: [implementation]
---

# PURISTA AI SDK Adapter

## When to use this skill
Use this skill when the chosen provider loop is Vercel AI SDK and PURISTA bindings need to become AI SDK tools.

## What this component/package is for
The AI SDK adapter is a thin conversion layer from neutral external runtime bindings to AI SDK-compatible tool definitions and stream events.

## Core PURISTA concept
AI SDK tooling is an adapter over builder-defined commands and agents. The neutral binding remains the stable contract; AI SDK is only one runtime surface.

## Builder lifecycle
1. Define commands or agents normally.
2. Expose them as neutral bindings from runtime context.
3. Convert those bindings with `toAiSdkTool(...)` or `toAiSdkTools(...)`.
4. Pass the adapted tools into the AI SDK request.

## Hard rules
- Keep `toAiSdkTool` and `toAiSdkTools` as pure adapters.
- Do not move allowlist lookup, workflow mutation, or queue decisions into the adapter.
- Keep provider-specific metadata out of the neutral contract.
- Do not use the adapter as the business contract. The neutral binding remains the source of truth.

## Decision rules
- Use the adapter only at the provider boundary.
- Keep neutral binding creation inside runtime context with `context.invoke.expose`.
- If the business contract changes, change the underlying builder definition first, not the AI SDK adapter.
- If an agent emits typed deliverables or structured UI artifacts, keep that logic outside the adapter.

## Definition pattern
- Define tools and agents through PURISTA builders and neutral runtime bindings.
- Keep adapter files separate from service and agent definition files.

## Implementation pattern
- Convert neutral bindings late.
- Render skills and references separately from tool conversion.
- Keep prompt/request assembly explicit.
- In grouped agent context, combine adapters with `context.ai.models`, `context.invoke.*`, and `context.io.stream` instead of recreating custom runtime wrappers.

## Configuration pattern
- Provider-specific model settings belong to the provider/runtime layer.
- Tool and command capability boundaries remain defined by PURISTA builders and bindings.

## Instantiation / runtime wiring
- The adapter only has meaningful input after the service or agent instance is running and exposing neutral bindings.
- Runtime wiring must still provide the underlying providers, skill resources, and allowed bindings.

## Verification cues
- The same command or agent can be exposed through a non-AI-SDK runtime because the neutral binding is still present.
- The adapter layer contains conversion, not business logic.
- A reviewer can trace an AI SDK tool back to a PURISTA builder-defined command or agent.
- Tool calls, child-agent forwarding, and final protocol output remain observable with normal PURISTA tracing and protocol helpers.

## Common mistakes / anti-patterns
- Letting AI SDK-specific concerns leak into command or agent definitions.
- Rebuilding tool metadata manually in the adapter.
- Treating the AI SDK adapter as the only exposure path.
- Explaining adapter code without showing the neutral binding and underlying builder-defined capability.

## How this connects to other PURISTA concepts
This skill composes external runtime bindings, agent runtime, skill rendering, and provider runtime integration.

## Read if needed
- `packages/ai/src/bridge/aiSdk.ts`
- `packages/ai/src/providers/runtime/AiSdkProvider.ts`
- `packages/ai/src/builder/AgentBuilder.ts`
- `packages/ai/src/runtime/context.ts`
- `examples/ai-basic/src/service/support/v1/command/getMcpTools/getMcpToolsCommandBuilder.ts`
- `specs/20-agents/30-builder-integration.md`
