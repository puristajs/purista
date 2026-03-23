---
name: purista-mcp-a2a
description: Expose PURISTA commands and agents to MCP or agent-to-agent integrations without collapsing the neutral runtime boundaries.
topics: [mcp, a2a, agents]
phases: [architecture, implementation]
---

# PURISTA MCP and A2A

## When to use this skill
Use this skill when the system needs MCP exposure, agent-to-agent interoperability, or external agent platform integration.

## What this component/package is for
PURISTA can expose commands and agents over neutral contracts and MCP-oriented surfaces without making one provider protocol the core model.

## Hard rules
- Keep core business logic in services and agents, not in transport shims.
- Use neutral bindings and protocol-safe contracts before exposing them to external agent ecosystems.
- Keep security and allowlists explicit.

## Decision rules
- Use MCP when an external tool ecosystem needs discovery and tool invocation.
- Use direct sub-agent invocation when both sides already live inside PURISTA.

## Recommended file/folder structure
```text
src/agents/
src/service/
```

## Common implementation patterns
- Expose commands with `exposeCommandAsMCP`.
- Expose agents with `exposeAgentAsMCP`.
- Keep the external transport module thin and well-tested.

## Common mistakes / anti-patterns
- Building business logic directly in MCP handlers.
- Confusing MCP transport concerns with internal service boundaries.
- Assuming one provider’s agent protocol is portable everywhere.

## How this connects to other PURISTA concepts
This skill builds on external runtime bindings, services, agents, and explicit schema contracts.

## Read if needed
- `packages/ai/src/mcp/exposeAgentAsMCP.ts`
- `packages/ai/src/mcp/exposeCommandAsMCP.ts`
- `website/doc/handbook/2_building_business-logic/agent/external-runtime-bridge.md`
