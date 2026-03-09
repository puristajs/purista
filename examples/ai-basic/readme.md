# AI Basic Example

Minimal but complete PURISTA AI reference:

- typed `canInvoke(...)` command wiring
- agent `generateText` and `generateJson` flows
- streaming over HTTP with protocol interoperability
- command, stream, MCP, and Agent2Agent entry points
- React UI for chat + protocol inspection

## Quick Start

Install:

```bash
npm install
```

Run backend:

```bash
npm run start -w @purista/example-ai-basic
```

Build frontend to `public/`:

```bash
npm run frontend:build -w @purista/example-ai-basic
```

Required env:

- `OPENAI_API_KEY`
- `PORT` (optional, default `3000`)

Open [http://localhost:3000/index.html](http://localhost:3000/index.html)

## Architecture Map

### Runtime bootstrap

- `src/index.ts`
  - builds `AiSdkProvider`
  - starts support service
  - starts `triageAgent`
  - starts `supportAgent`
  - exposes all over `honoV1Service`

### Agents

- `src/agents/triageAgent/v1/triageAgent.ts`
  - strict structured classification via `generateJson`
- `src/agents/supportAgent/v1/supportAgent.ts`
  - tool-assisted support flow
  - optional delegation to `triageAgent`
  - final answer via `generateText` with streaming deltas
  - optional JSON response path via `generateJson`

### Service commands/streams

- `src/service/support/v1/command/runSupportAgent/*`
  - command entry point invoking `supportAgent`
- `src/service/support/v1/stream/runSupportAgentStream/*`
  - streaming endpoint
- `src/service/support/v1/command/runSupportMcp/*`
  - MCP-style invocation
- `src/service/support/v1/command/runSupportA2a/*`
  - Agent2Agent-style invocation

## Model Usage Patterns In This Example

### `generateText` (stream-aware)

Used in `supportAgent` for the normal text answer path:

- sends progressive deltas via `onTextDelta`
- forwards reasoning via `onReasoning`
- persists assistant turn to conversation store

### `generateJson` (structured output)

Used in:

- `triageAgent` for urgency classification
- `supportAgent` optional `responseFormat=json` path

## Streaming & Protocol Endpoints

### Native support stream endpoint

`POST /api/v1/support/ask/stream`

```bash
curl -N -X POST http://localhost:3000/api/v1/support/ask/stream \
  -H "content-type: application/json" \
  -d '{"prompt":"Summarize https://purista.dev and calculate 12*(8+4)"}'
```

### Agent HTTP endpoint

`POST /api/v1/agents/supportAgent`

### Expose different SSE protocols

```ts
new AgentBuilder({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/support/native')
  .setSseProtocol('purista')
  .build()
```

```ts
new AgentBuilder({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/support/ui')
  .setSseProtocol('ai-sdk-ui-message')
  .build()
```

```ts
new AgentBuilder({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/support/responses')
  .setSseProtocol('ai-sdk-responses')
  .build()
```

### MCP reference endpoints

- `GET /api/v1/support/mcp/tools`
- `POST /api/v1/support/mcp/call`

### Agent2Agent reference endpoint

- `POST /api/v1/support/a2a/call`

### Conversation restore endpoint

- `POST /api/v1/support/conversation`

## Frontend Scripts

- `frontend:dev` - Vite dev server for `src/frontend`
- `frontend:build` - build frontend into `public/`
- `frontend:test` - frontend Vitest
- `frontend:check` - frontend typecheck + tests

## Tests

```bash
npm run test -w @purista/example-ai-basic
```

Key tests:

- `src/agents/supportAgent/v1/supportAgent.test.ts`
- `src/service/support/v1/command/runSupportAgent/runSupportAgentCommandBuilder.test.ts`
- `src/integration/httpInteroperability.test.ts`
- `src/frontend/lib/api.test.ts`

## Notes

- This example intentionally uses deterministic tests (no live model calls).
- Protocol adapters (`MCP`, `Agent2Agent`) are reference interoperability layers, not full protocol implementations.
