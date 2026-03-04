# AI basic example

This example demonstrates the current `@purista/ai` integration end-to-end:

- Agent exposed as HTTP endpoint (`POST /api/v1/agents/supportAgent`)
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
