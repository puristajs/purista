---
title: Connect MCP tools
description: Use an explicit MCP boundary for separately operated tool servers.
order: 430
---

Use MCP only when the tool already belongs to a separately operated server. In
this example, a support agent searches an approved knowledge service; it does
not receive database credentials or direct network authority.

Install the optional MCP client before registering an MCP tool. This is a peer
dependency of the Harness application, not a package installed by core:

```bash title="Install the remote MCP and OpenAI providers"
npm install @modelcontextprotocol/client @purista/harness-openai
```

Choose `mcp_http` for an existing streamable-HTTP server. Choose `mcp_stdio`
only for a local command running inside a spawn-capable sandbox. Core does not
install this optional peer, and an exec-only sandbox cannot run stdio MCP.

```ts title="src/harness/supportKnowledge.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { openai } from '@purista/harness-openai'
import { z } from 'zod'

const apiKey = process.env.OPENAI_API_KEY
const knowledgeUrl = process.env.KNOWLEDGE_MCP_URL
const knowledgeToken = process.env.KNOWLEDGE_MCP_TOKEN
if (!apiKey || !knowledgeUrl || !knowledgeToken) {
	throw new Error('OPENAI_API_KEY, KNOWLEDGE_MCP_URL, and KNOWLEDGE_MCP_TOKEN are required.')
}

export const supportKnowledgeHarness = defineHarness({ name: 'support-knowledge' })
	.sandbox(inMemorySandbox())
	.models({
		assistant: {
			provider: openai({ apiKey }),
			model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
			capabilities: ['object', 'tool_use'],
		},
	})
	.tools({
		knowledge: {
			kind: 'mcp_http',
			description: 'Search approved support knowledge.',
			url: knowledgeUrl,
			auth: { kind: 'bearer', token: knowledgeToken },
			tool: 'knowledge.search',
		},
	})
	.agent('support', {
		model: 'assistant',
		input: z.object({ question: z.string() }),
		output: z.object({ answer: z.string() }),
		tools: ['knowledge'],
		instructions: 'Use knowledge only for approved support information.',
	})
	.build()
```

Set `OPENAI_API_KEY`, `KNOWLEDGE_MCP_URL`, and `KNOWLEDGE_MCP_TOKEN` through
the application's secret configuration; the code intentionally contains no
credential values. A successful first run produces the agent's validated
`answer` object and an MCP tool span. A `HarnessConfigError` identifies a
missing MCP client; server authentication and tool authorization remain the
server's responsibility.

| Call or field | What it establishes | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts the named composition responsible for the agent's registry and diagnostics. | The name defaults to `agent-harness`; it does not become an MCP credential, tenant, or authorization scope. |
| [`.sandbox(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | The local filesystem/process boundary. | `mcp_http` does not need process execution; `mcp_stdio` requires a sandbox whose declared capabilities include `sandbox.spawn`. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | The provider alias used by the agent. | `tool_use` is required before the default agent loop can call `knowledge`. Other model capabilities should remain absent unless the agent needs them. |
| [`.tools(record)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#tools) | Registers the reusable MCP catalog under `knowledge`. | Use it for `mcp_http` or `mcp_stdio`; register an inline TypeScript handler separately with `.tool(id, definition)`. |
| [`kind: 'mcp_http'`](/handbook/api/interfaces/_purista_harness.McpHttpToolDefinition/) | Connects to one Streamable HTTP MCP server. | Prefer it when the remote service owns authentication and authorization. Network, authentication, protocol, and schema failures fail the call. |
| [`auth`](/handbook/api/interfaces/_purista_harness.McpHttpToolDefinition/#auth) | Sends declared HTTP authentication for the MCP connection. | Use a short-lived, task-scoped credential from secret configuration; never put it in instructions or tool input. |
| [`tools: ['knowledge']`](/handbook/api/types/_purista_harness.AgentDefinition/#signature) | Grants only this agent access to the registered MCP tool. | Omit it to deny the remote call. The remote service must still reauthorize each request. |
| [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | Registers `support` after the model and MCP tool ID exist. | This order makes `assistant` and `knowledge` checked literal references in the inline definition. A missing tool or model alias is rejected before a session can execute. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the full composition and produces the session-facing Harness. | It checks registry references and capability requirements, but it does not contact the MCP server; connection, server authentication, and protocol failures occur when the tool is used. |

## Select a transport deliberately

| Transport | Requires | Recovery boundary |
| --- | --- | --- |
| `mcp_http` | Running Streamable HTTP server; app-owned authentication | Handle network/auth/protocol failure and retry only safe calls. |
| `mcp_stdio` | Optional client and sandbox `spawn` capability | A dead server fails the call; a later call starts a new session. |

The Harness validates MCP schemas and normalizes errors, but it does not own
the server, credentials, or upstream authorization. Keep tokens in secret
configuration, allowlist each MCP tool per agent, and test unavailable server,
bad schema, auth failure, cancellation, and timeout. `mcp_stdio` must never
spawn directly on the host; use an isolating sandbox for untrusted code.

Continue with [secure MCP and isolate data](/handbook/harness/secure-and-govern/mcp-security-and-data-isolation/)
for the complete remote-versus-stdio trust model, credential scope, server-side
authorization, data minimization, sandbox requirements, and negative tests.

For a signed, reviewed package of skills and MCP declarations, see
[agent plugins](/handbook/harness/add-capabilities/agent-plugins/).
