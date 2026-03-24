---
name: purista-external-runtime-bindings
description: Teach untrained models how PURISTA exposes builder-defined commands and agents through provider-neutral runtime bindings and explicit instance wiring.
topics: [agents, external-runtime, tools]
phases: [architecture, implementation]
---

# PURISTA External Runtime Bindings

## When to use this skill
Use this skill when an external tool loop needs access to PURISTA commands or agents without coupling the core model to one provider SDK.

## What this component/package is for
External runtime bindings are the provider-neutral contract for exposing PURISTA commands and agents to model/tool runtimes.

## Core PURISTA concept
Bindings sit on top of builder-defined commands and agents. The service or agent definition remains the source of truth, and the runtime binding only exposes a neutral interface for external loops.

## Builder lifecycle
1. Define commands or agents normally.
2. Create neutral external bindings with `context.invoke.expose.*` from the running agent or service runtime.
3. Adapt those neutral bindings into provider-specific tools only at the provider boundary.

## Hard rules
- Keep the binding source of truth neutral and provider-agnostic.
- Use `context.invoke.expose.tool`, `context.invoke.expose.agent`, `context.invoke.expose.tools`, and `context.invoke.expose.metadata`.
- Put result modes and durable metadata in the neutral binding, not in the provider adapter.
- Preserve trace, tenant, and principal propagation across the neutral binding boundary so external tool loops remain observable and correctly scoped.

## Decision rules
- Expose commands when the external runtime should call deterministic service behavior.
- Expose agents when an external loop should delegate to another model-driven unit.
- Reject unsupported durable cases early instead of inventing fallback semantics.

## Definition pattern
- Define commands and agents first.
- Expose them from runtime context; do not invent parallel binding-only behavior.

## Implementation pattern
- Build neutral bindings from declared commands, agents, and metadata.
- Keep binding creation close to runtime context where allowlists and capabilities are already known.
- Prefer built-in PURISTA binding helpers over custom provider-shaped wrappers so tool metadata, result modes, and runtime semantics stay aligned.

## Configuration pattern
- Allowed tools, agents, and metadata are part of definition.
- Provider-specific adapters and model runtimes are runtime concerns.

## Instantiation / runtime wiring
- Neutral bindings only exist once the service or agent is running with full runtime context.
- Provider adapters consume those bindings after instance creation; they should not become the primary definition surface.

## Verification cues
- The underlying command or agent is still traceable to a builder definition.
- Neutral bindings contain the metadata external runtimes need.
- Provider code only adapts neutral bindings and does not recreate business contracts.
- Tool or agent invocations exposed through bindings remain visible in PURISTA traces and follow the same handled/unhandled error semantics as internal invocation.

## Common mistakes / anti-patterns
- Making the provider adapter the source of truth.
- Smuggling allowlist logic into the provider layer.
- Exposing hidden side effects through bindings that the service definition never declared.
- Teaching provider adaptation without showing the underlying builder-defined command or agent.
- Recreating binding contracts directly from provider SDK primitives instead of starting from PURISTA's neutral exposure helpers.

## How this connects to other PURISTA concepts
This skill builds on commands, agents, `context.invoke.expose`, AI SDK adapters, MCP/A2A exposure, and runtime providers.

## Related skills
- `purista-ai-sdk-adapter` for provider-specific adaptation after the neutral binding is created.
- `purista-mcp-a2a` for protocol exposure over MCP or agent-to-agent transports.
- `purista-observability` for tracing/error propagation across runtime boundaries.

## Read if needed
- `packages/ai/src/builder/AgentBuilder.ts`
- `packages/ai/src/runtime/context.ts`
- `packages/ai/src/bridge/externalRuntime.test.ts`
- `packages/ai/src/runtime/invokeAgent.test.ts`
- `specs/20-agents/40-core-interfaces.md`
- `specs/20-agents/20-protocol-and-ui.md`
