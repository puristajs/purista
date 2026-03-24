# AI Basic Example

This example shows the two agent execution styles side by side:

- `triageAgent` runs **inline** for fast classification.
- `supportAgent` runs as a **queued durable agent** with `run-state`, checkpoints, recovery, and attach-and-stream HTTP behavior.

The React UI renders `data-run-state` separately from chat so the composer can be locked while a durable run is active.

It also demonstrates the PURISTA AI flow:

- define agent behavior in the builder
- provide models and skills at `getInstance(...)`
- use skills from the handler context
- adapt tools for AI SDK only at the external runtime boundary

## Quick Start

Install dependencies:

```bash
npm install
```

Run the backend:

```bash
npm run start -w @purista/example-ai-basic
```

Build the frontend into `public/`:

```bash
npm run frontend:build -w @purista/example-ai-basic
```

Required environment:

- `OPENAI_API_KEY`
- `PORT` (optional, default `3000`)

Open [http://localhost:3000/index.html](http://localhost:3000/index.html)

## What The Example Demonstrates

### Runtime bootstrap

- `src/index.ts`
  - creates the shared `EventBridge`
  - creates a `DefaultQueueBridge`
  - starts `triageAgent` inline
  - starts `supportAgent` in queued durable mode
  - exposes both agents and service endpoints through `honoV1Service`

### Agents

- `src/agents/triageAgent/v1/triageAgent.ts`
  - inline JSON classification
  - best for quick, deterministic routing

- `src/agents/supportAgent/v1/supportAgent.ts`
  - queued durable execution
  - `.useSkills(['spec-elicitation', 'support-workflow'])`
  - `context.memory.run` planning, checkpoints, and task updates
  - `context.ai.skills.loadAvailable()` and `context.ai.skills.loadReferences(...)`
  - attach-and-stream HTTP behavior
  - optional delegation to `triageAgent`

- `src/agents/bridgeDemoAgent/v1/bridgeDemoAgent.ts`
  - `.useSkills(['spec-elicitation', 'tool-loop-discipline'])`
  - `context.ai.models['openai:gpt-4o-mini'].generateText(...)` for the model-owned adapter path
  - explicit `context.invoke.expose.tools(...)` bindings for commands

### Frontend

- `src/frontend/App.tsx`
  - listens for `data-run-state`
  - renders progress tasks and recovery metadata
  - disables input while the durable run is active
  - keeps the final assistant answer in chat

## Execution Modes

Use the simplest mode that fits the job:

- **Inline**: short, fast, user-facing classification or formatting.
- **Queued durable**: long-running work that should survive restarts, support checkpoints, and keep progress visible in the UI.

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

- The example intentionally uses deterministic tests and mock model replies.
- `attach-and-stream` keeps the HTTP endpoint responsive while the queue worker does the durable work.
- Progress belongs in run-state, not in the chat transcript.
