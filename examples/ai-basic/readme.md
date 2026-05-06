# AI Basic Example

`examples/ai-basic` is now a **Developer Desk showcase** for `@purista/ai`.

Instead of forcing one single scenario to demonstrate every feature, the example is organized as one polished split-pane app with multiple intentional flows:

- **Chat**
  - attached-agent chat with conversation memory and real text streaming
- **Research**
  - tool-backed and skill-aware research flow with visible tool lifecycle
- **Planner**
  - worker + delegates planning with `context.plan.generate(...)` and `context.plan.execute(plan)`
- **Structured Output**
  - direct schema-first `streamObject(...)` example with progressive sections and final validated output
- **Reflection**
  - propose / reflect / refine loop with reflection artifacts and final synthesis
- **Interop**
  - MCP and A2A projections are still available, but now shown as secondary interoperability views

The browser UI is intentionally split:

- **left / center**
  - live interaction, transcript, tools, plan/task progress, artifacts, protocol stream
- **right**
  - permanent explanation pane that describes what is being demonstrated, how it works, where the code lives, which protocol lanes are involved, and how to extend it

## Quick Start

```bash
npm install
OPENAI_API_KEY=... npm run dev -w @purista/example-ai-basic
```

Optional environment:

- `PORT` defaults to `3001` in dev for the backend
- `VITE_API_PROXY_TARGET` defaults to `http://localhost:3001`

Open [http://localhost:3000](http://localhost:3000)

### Dev Mode

`npm run dev -w @purista/example-ai-basic` starts:

- Vite frontend dev server on `http://localhost:3000`
- backend with `tsx watch` on `http://localhost:3001`
- Vite proxying `/api` to the backend

This is the canonical local development workflow.

### Built Mode

```bash
npm run build -w @purista/example-ai-basic
OPENAI_API_KEY=... npm run start -w @purista/example-ai-basic
```

In built mode, the backend serves the compiled frontend from `public/` and defaults to `http://localhost:3000`.

## Key Runtime Pieces

- `src/service/desk/v1/agent/deskChatAgent/deskChatAgentBuilder.ts`
  - direct stream-first attached agent with conversation history
- `src/service/desk/v1/agent/researchAgent/researchAgentBuilder.ts`
  - demonstrates typed tool invokes plus optional skill references
- `src/service/desk/v1/agent/architectureReviewAgent/architectureReviewAgentBuilder.ts`
  - demonstrates schema-first `streamObject(...)`
- `src/service/desk/v1/agent/deliveryPlannerAgent/deliveryPlannerAgentBuilder.ts`
  - demonstrates planner-first worker + delegates + child-agent delegation
- `src/service/desk/v1/agent/reflectionAgent/reflectionAgentBuilder.ts`
  - demonstrates `context.ai.reflect.run(...)`
- `src/frontend/App.tsx`
  - renders the scenario switcher, transcript, live operational lanes, interop panes, and permanent explanation pane
- `src/frontend/lib/showcase.ts`
  - repo-owned scenario metadata for the explanation pane
- `packages/ai/src/runtime/context.ts`
  - now also provides `context.ai.replyObject(...)` for conversation-aware structured finalization

## What This Example Emphasizes

- direct attached-agent HTTP endpoints are the primary product-facing path
- planner generation and execution are separate phases
- `purista-ai:*` artifacts are the live UX contract for plan/task rendering
- `purista-ai:workflow-stage` is used for post-plan synthesis instead of stretching planner run-state
- final machine-readable results come from the canonical `output` artifact
- child-agent forwarding preserves child identity
- UI rendering stays protocol-aware instead of inventing a parallel event model

## Tests

```bash
npm run test -w @purista/example-ai-basic
```

The example includes frontend, backend, and integration tests with deterministic model fixtures so the showcase stays stable as `@purista/ai` evolves.
