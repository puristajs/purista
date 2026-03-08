# AI basic example

This example demonstrates the current `@purista/ai` integration end-to-end:

- Agent exposed as HTTP endpoint (`POST /api/v1/agents/supportAgent`)
- Stream endpoint invoking an agent (`POST /api/v1/support/ask/stream`)
- Tool calls (`support.lookupFaq`, `support.calculate`, `support.fetchWebsite`)
- Agent-to-agent delegation (`supportAgent` invokes `triageAgent` as a tool)
- Command invoking an agent (`POST /api/v1/support/ask`)
- MCP-style endpoint invoking an agent (`POST /api/v1/support/mcp/call`)
- MCP descriptor endpoint (`GET /api/v1/support/mcp/tools`)
- Agent2Agent-style endpoint invoking an agent (`POST /api/v1/support/a2a/call`)
- Conversation restore via command-owned retrieval (`POST /api/v1/support/conversation`)
- React frontend showcase (stream + MCP + Agent2Agent + protocol inspector) built to `public/`
- Workflow graph visualization powered by React Flow (`@xyflow/react`)
- Rich markdown message rendering via Streamdown

## Install

```bash
npm install
```

```bash
pnpm install
```

```bash
yarn install
```

```bash
bun install
```

## Build frontend (to `public/`)

```bash
npm run frontend:build -w @purista/example-ai-basic
```

```bash
pnpm --filter @purista/example-ai-basic frontend:build
```

```bash
yarn workspace @purista/example-ai-basic frontend:build
```

```bash
bun run --filter @purista/example-ai-basic frontend:build
```

## Run backend + UI

```bash
npm run start -w @purista/example-ai-basic
```

```bash
pnpm --filter @purista/example-ai-basic start
```

```bash
yarn workspace @purista/example-ai-basic start
```

```bash
bun run --filter @purista/example-ai-basic start
```

Environment variables:

- `OPENAI_API_KEY` (required)
- `PORT` (optional, defaults to `3000`)

Open [http://localhost:3000/index.html](http://localhost:3000/index.html).

## Frontend scripts

- `frontend:dev` – runs Vite dev server for `src/frontend`
- `frontend:build` – builds to `public/`
- `frontend:test` – frontend Vitest suite
- `frontend:check` – frontend typecheck + tests

## Test

The example contains deterministic tests (no real LLM calls):

```bash
npm run test -w @purista/example-ai-basic
```

```bash
pnpm --filter @purista/example-ai-basic test
```

Key test files:

- `src/agents/supportAgent/v1/supportAgent.test.ts` – verifies tool calls, agent-to-agent delegation, and protocol frames.
- `src/service/support/v1/command/runSupportAgent/runSupportAgentCommandBuilder.test.ts` – verifies command-level `context.invokeAgent` integration.
- `src/frontend/lib/api.test.ts` – verifies SSE dedupe behavior and command-owned conversation hydration endpoint usage.
- `src/frontend/App.test.tsx` – verifies frontend dedupe and persisted theme behavior.

## Frontend behavior

The React frontend includes:

- top navigation (`Stream Chat`, `MCP Expose`, `Agent2Agent Expose`, `Protocol Inspector`)
- split-pane layout (chat + workflow/protocol panel)
- stream-safe rendering (`chunk` frames rendered once, `complete.final.envelopes` used as fallback only)
- conversation restore by calling `POST /api/v1/support/conversation`
- optional JSON response mode rendered inline in chat
- workflow graph with node/edge visualization for tool and nested agent execution
- suggested starter prompts to onboard users into calculator/fetch/tool workflows
- telemetry includes pool pressure (`activeWorkers`, `waitingWorkers`, `maxConcurrencyPerInstance`, `waitTimeMs`) for external dashboards

Concurrency note:

- `poolConfig.maxConcurrencyPerInstance` is per running process/instance.
- Estimated total slots in deployment: `replicas * maxConcurrencyPerInstance`.

## API quick calls

Stream (SSE):

```bash
curl -N -X POST http://localhost:3000/api/v1/support/ask/stream \
  -H "content-type: application/json" \
  -d '{"prompt":"Summarize https://purista.dev and calculate 12*(8+4)"}'
```

MCP descriptor list:

```bash
curl http://localhost:3000/api/v1/support/mcp/tools
```

MCP reference call (agent tool):

```bash
curl -X POST http://localhost:3000/api/v1/support/mcp/call \
  -H "content-type: application/json" \
  -d '{"name":"supportAgent","arguments":{"prompt":"Fetch https://purista.dev and list the top topics"}}'
```

MCP reference call (command tool):

```bash
curl -X POST http://localhost:3000/api/v1/support/mcp/call \
  -H "content-type: application/json" \
  -d '{"name":"support.1.calculate","arguments":{"expression":"42*17"}}'
```

Agent2Agent reference call:

```bash
curl -X POST http://localhost:3000/api/v1/support/a2a/call \
  -H "content-type: application/json" \
  -d '{"prompt":"Calculate 42*17 and explain when to use queue vs stream"}'
```

Conversation restore (command-owned retrieval):

```bash
curl -X POST http://localhost:3000/api/v1/support/conversation \
  -H "content-type: application/json" \
  -d '{"sessionId":"<existing-session-id>"}'
```

## Protocol consumer and interoperability snippets

### Reference Agent-to-Agent conversion

```ts
import { toAgent2AgentReferenceMessage } from '@purista/ai'

const outgoing = envelopes.map(envelope => toAgent2AgentReferenceMessage(envelope))
```

### Reference MCP conversion

```ts
import { toMcpReferenceToolResult } from '@purista/ai'

const mcpResult = toMcpReferenceToolResult(envelopes)
```

These helpers are reference adapters to simplify bridging; they are not a full official protocol implementation.
