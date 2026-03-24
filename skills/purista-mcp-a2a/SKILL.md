---
name: purista-mcp-a2a
description: Teach untrained models how builder-defined PURISTA commands and agents are exposed to MCP or agent-to-agent runtimes through neutral bindings and explicit runtime wiring.
topics: [mcp, a2a, agents]
phases: [architecture, implementation]
---

# PURISTA MCP and A2A

## When to use this skill
Use this skill when the system needs MCP exposure, agent-to-agent interoperability, or external agent platform integration.

## What this component/package is for
PURISTA can expose commands and agents over neutral contracts and MCP-oriented surfaces without making one provider protocol the core model.

## Core PURISTA concept
MCP and A2A are exposure layers over builder-defined commands and agents. The neutral runtime binding remains primary, and protocol-specific exposure comes later.

## Builder lifecycle
1. Define commands or agents normally.
2. Expose them through neutral runtime bindings.
3. Adapt those bindings into MCP or A2A surfaces.
4. Run the external protocol endpoint alongside the instantiated service or agent runtime.

## Hard rules
- Keep core business logic in services and agents, not in transport shims.
- Use neutral bindings and protocol-safe contracts before exposing them to external agent ecosystems.
- Keep security and allowlists explicit.
- Treat MCP and A2A as exposure layers over already-correct PURISTA runtime contracts, including grouped context usage, trace propagation, and handled/unhandled error semantics.

## Decision rules
- Use MCP when an external tool ecosystem needs discovery and tool invocation.
- Use direct sub-agent invocation when both sides already live inside PURISTA.
- Keep protocol exposure optional; the underlying command or agent should still exist without MCP.
- Prefer deterministic service commands or deliverable-emitting worker agents behind the exposure layer instead of hiding workflow mutation inside the transport adapter.

## Definition pattern
- Define the underlying command or agent first.
- Keep MCP or A2A adapters in exposure-focused code, not inside business handlers.

## Implementation pattern
- Reuse neutral bindings and protocol-safe schemas.
- Keep interoperability wrappers thin and explicit about capabilities, auth, and limits.
- Reuse built-in PURISTA exposure helpers and reference adapters first; add custom protocol glue only where the neutral contract is insufficient and document that gap explicitly.

## Configuration pattern
- Endpoint security, transport settings, and external platform registration are runtime concerns.
- Allowed capabilities remain defined by the underlying PURISTA builders and bindings.

## Instantiation / runtime wiring
- Protocol exposure requires a running service or agent instance plus the protocol adapter/runtime.
- A design is incomplete if it names MCP or A2A exposure but cannot identify the underlying instantiated command or agent.

## Verification cues
- Every exposed capability maps back to a builder-defined command or agent.
- Neutral bindings remain visible in the architecture.
- Security and allowlist rules are explicit.
- External invocations remain observable in traces and do not bypass the same runtime protections used by internal invocation.

## Common mistakes / anti-patterns
- Making protocol shims the main application architecture.
- Exposing hidden or undeclared capabilities.
- Rewriting business contracts specifically for one external protocol.
- Describing MCP or A2A integration without the underlying service or agent instance wiring.
- Treating reference interoperability adapters as proof of full protocol compliance when they are intentionally narrower than the complete external specs.

## How this connects to other PURISTA concepts
This skill builds on commands, agents, external runtime bindings, AI SDK adapters, HTTP/runtime exposure, and observability.

## Related skills
- `purista-external-runtime-bindings` for the neutral binding layer beneath MCP or A2A exposure.
- `purista-ai-sdk-adapter` when the exposed capabilities also need provider SDK adaptation.
- `purista-observability` for spans, correlation, and runtime error semantics across protocol boundaries.

## Read if needed
- `specs/20-agents/20-protocol-and-ui.md`
- `specs/20-agents/40-core-interfaces.md`
- `specs/20-agents/50-observability-governance.md`
- `packages/ai/src/bridge/externalRuntime.test.ts`
- `packages/ai/src/builder/AgentBuilder.ts`
- `packages/ai/src/bridge/aiSdk.ts`
