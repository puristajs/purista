# AI basic example

This example demonstrates the current `@purista/ai` integration end-to-end:

- Agent exposed as HTTP endpoint (`POST /api/v1/agents/supportAgent`)
- Stream endpoint invoking an agent (`POST /api/v1/support/ask/stream`)
- Tool calls (`support.lookupFaq` command used from `supportAgent`)
- Agent-to-agent delegation (`supportAgent` invokes `triageAgent` as a tool)
- Command invoking an agent (`POST /api/v1/support/ask`)
- Subscription invoking an agent after event emission (`POST /api/v1/support/follow-up`)
- Static HTML consumer with SSE parsing (`/index.html`)

## Run

```bash
pnpm install
pnpm --filter @purista/example-ai-basic start
```

Set these environment variables:

- `OPENAI_API_KEY` (required)
- `PORT` (optional, defaults to `3000`)

Open [http://localhost:3000/index.html](http://localhost:3000/index.html).

## Test

The example contains deterministic tests (no real LLM calls):

```bash
pnpm --filter @purista/example-ai-basic test
```

Key test files:

- `src/agents/supportAgent/v1/supportAgent.test.ts` – verifies tool calls, agent-to-agent delegation, and protocol frames.
- `src/service/support/v1/command/runSupportAgent/runSupportAgentCommandBuilder.test.ts` – verifies command-level `context.invokeAgent` integration.

## Protocol consumer and interoperability snippets

### Frontend/SSE consumer

`public/index.html` demonstrates reading SSE stream frames from `POST /api/v1/support/ask/stream` and routing by frame kind (`message`, `tool`, `telemetry`, `error`).
For a reusable TypeScript utility you can copy into frontend libraries, see:

- `src/client/protocolConsumer.ts`
- `src/client/protocolConsumer.test.ts`

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
