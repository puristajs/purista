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

### Configure Streamable HTTP

[`McpHttpToolDefinition`](/handbook/api/interfaces/_purista_harness.McpHttpToolDefinition/)
has the complete remote transport contract:

| Field | Required/default | Meaning and boundary |
| --- | --- | --- |
| `kind` | required: `mcp_http` | Selects the current Streamable HTTP client. |
| `description` | required | Local model-facing description. Keep it accurate and free of credentials. |
| `url` | required absolute URL | Server endpoint owned by the application/deployment. Invalid URLs or unavailable servers fail the tool call. |
| `tool` | required | Exact upstream MCP tool name selected after schema discovery. A missing or malformed tool/schema fails before invocation. |
| [`auth`](/handbook/api/types/_purista_harness.McpAuth/) | optional; no authentication | Supports `none`, bearer, OAuth2 access token, API-key header, or basic credentials. Keep values in secret configuration and rotate them outside the model context. |
| `headers` | optional | Additional application-owned headers. Names are normalized; configured `auth` owns its authentication header. Never forward caller headers wholesale. |
| `redirect` | fetch default (`follow`) | Choose `error` when credentials must never follow a redirect. Reviewed Agent Plugin bindings force `error`. `manual` exposes redirect handling to the underlying transport. |
| `inputAdapter`, `outputAdapter` | identity | Explicitly adapt an application value around the discovered MCP schema. They do not bypass input/output validation. |
| `configureHarnessContext` | optional advanced hook | Receives the bounded Harness adapter context during composition. It must not fetch schemas, start a server, or capture request content. |
| `provenance` | normally omitted | Content-free, reviewed Agent Plugin origin metadata. Application code should let the plugin binding create it. |

The connection is reused while healthy and reset after a failed connection.
Every list/call operation receives cancellation and the configured Harness
`toolTimeoutMs`. A `401` or `403` becomes `McpAuthError`; protocol, discovery,
transport, and schema failures remain `McpProtocolError` or validation errors.

### Configure sandboxed stdio

[`McpStdioToolDefinition`](/handbook/api/interfaces/_purista_harness.McpStdioToolDefinition/)
starts a current MCP server through the selected sandbox. It never falls back
to the application host.

| Field | Required/default | Meaning and boundary |
| --- | --- | --- |
| `kind` | required: `mcp_stdio` | Selects the persistent stdio transport. |
| `description`, `tool` | required | Local model-facing description and exact discovered upstream tool name. |
| `command` | required | Sandbox-local executable. It must pass sandbox command policy and run without host credentials. |
| `args` | empty | Fixed sandbox-local arguments; never concatenate model input into a shell string. |
| `cwd` | sandbox default | Working directory inside the sandbox. It cannot escape the sandbox path policy. |
| `env` | empty | Narrow server environment. Do not copy `process.env`; pass only reviewed non-secret values or sandbox-scoped credentials. |
| `install` | omitted | Optional sandbox bootstrap command with its own `command`, `cwd`, `env`, and `timeoutMs`. It requires sandbox `exec`, runs once for the active runner, and retries only after a failed installation. Prefer a prebuilt image in production. |
| `prepareLaunch` | omitted | May stage files and return launch overrides plus an async `cleanup`. It runs within the overall tool timeout; cleanup runs on connect failure and close. |
| `inputAdapter`, `outputAdapter`, `configureHarnessContext`, `provenance` | same roles as HTTP | These adapt the local contract or attach content-free integration metadata; they do not grant sandbox or MCP authority. |

Stdio requires `sandbox.spawn`; `install` additionally requires `sandbox.exec`.
The process, MCP client, and cleanup callback are closed together. Timeout or a
closed transport resets the connection so a later safe call can start a new
server. Test install failure, spawn denial, malformed stdout, bounded stderr,
cancellation, cleanup failure, and process exit.

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
