---
title: Standard Protocols (MCP & A2A)
description: Exposing your agent via MCP or Agent2Agent for seamless interoperability.
order: 299906
---

# Standard AI Protocols (MCP & A2A) (Advanced View)

One of the unique features of PURISTA agents is their ability to speak "standard" protocols. This allows them to be consumed by other AI systems (like Claude Desktop or other agents) without manual code changes.

## 1. Model Context Protocol (MCP)

MCP is an open standard that enables AI models to connect to data sources and tools. You can expose any PURISTA command or agent as an MCP tool.

### Exposing an Agent via MCP

Use `exposeAgentAsMCP` from `@purista/ai` to expose an agent as an MCP server:

```ts
import { exposeAgentAsMCP } from '@purista/ai'
import { supportAgent } from './agents/supportAgent/v1/supportAgent'

const mcpServer = await exposeAgentAsMCP(supportAgent, {
  name: 'support-agent',
  version: '1.0.0',
})
```

### Why use MCP?
- **Universal Access**: Your PURISTA agent can now be a "tool" for any LLM that supports MCP.
- **Data & Tools**: Expose your existing domain services (Order lookup, Customer data) to external AI assistants.
- **Interoperability**: Connect different agent systems together using a standard wire format.

## 2. Agent2Agent (A2A)

A2A is a protocol designed for direct agent-to-agent communication. It focuses on higher-level task hand-offs and collaboration.

### Exposing an Agent via A2A

Agents are automatically exposed via HTTP. A2A support depends on the specific transport implementation.

## 3. How Protocols are Mapped

When you use MCP, PURISTA frames are transformed into MCP tool definitions:

| PURISTA Frame | MCP Mapping |
| :--- | :--- |
| **`message`** | Tool response text |
| **`artifact`** | Tool response data |
| **`error`** | Tool error code |
| **`telemetry`** | Ignored |

## 4. External Runtime Bindings vs Standard Protocols

MCP and A2A are wire protocols for exposing PURISTA capabilities to other systems.

External runtime bindings are different:

- it runs inside your agent handler
- it turns allowlisted PURISTA commands and child agents into neutral bindings first
- adapters then turn those bindings into external SDK tools
- it keeps execution local to PURISTA runtime instead of publishing a public wire protocol

Use external runtime bindings plus an adapter for Vercel AI SDK style tool loops. Use MCP when another process or organization should consume your capabilities over a standard protocol.

## 5. When to use which?

| Use Case | Recommended Protocol |
| :--- | :--- |
| Connecting to **Claude Desktop** or **IDE Assistants** | MCP |
| **B2B Agent collaboration** | A2A |
| **Vercel AI SDK** / **Next.js UI** | HTTP/SSE |
| **Internal PURISTA-to-PURISTA** | Direct invoke |

By leveraging these protocols, your PURISTA agents become part of a larger, global ecosystem of AI agents and tools.