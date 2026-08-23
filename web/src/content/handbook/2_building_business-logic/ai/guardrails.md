---
title: Guardrails for Harness Agents
description: Add typed, observable input, output, retrieval, tool, and skill guardrails to PURISTA AI agents.
order: 207025
---

# Guardrails for Harness agents

`@purista/harness-guardrails` is an optional addon for the Harness default
agent loop. It adapts the portable configuration vocabulary used by NVIDIA NeMo
Guardrails while preserving PURISTA's ownership boundaries: application code
owns providers, credentials, business authorization, retrieval stores, and
side effects.

Use it with, not instead of, Zod schemas, explicit tool allowlists, Harness
permissions, Harness governance, and deterministic PURISTA business rules.

## Install

::: code-group

```bash [npm]
npm install @purista/harness-guardrails
```

```bash [pnpm]
pnpm add @purista/harness-guardrails
```

:::

The normal `@purista/harness` and the chosen provider adapter remain separate
dependencies.

## What an attached rail covers

`rails.attach(...)` appends a fail-closed interceptor to a **default-loop
Harness agent**.

| Path | Coverage | Timing |
| --- | --- | --- |
| Agent input | Automatic | After input schema validation; before instructions, transcript, or model call. |
| Agent output | Automatic | After provider response; before output validation, persistence, or tool dispatch. |
| TypeScript, MCP, and built-in tool input | Automatic | Before permissions, governance, tool schema validation, and side effects. |
| Tool output | Automatic | Before the tool result is returned to the model. |
| Skill use | Automatic through `read` | Skills are mounted files; the rail governs the built-in tool invocation that opens one. |
| Workflow → attached agent | Automatic for the inner agent | The workflow and agent continue under one correlated trace context. |
| Workflow-owned retrieval | Explicit | Call `filterRetrievedChunks(...)` before passing chunks to an agent. |

`attach(...)` intentionally rejects custom-handler agents. A custom agent
handler or a direct `ctx.models.*` call owns the model/tool lifecycle and is
not silently given partial interception coverage. Keep model/tool work in an
attached default-loop agent when the standard rail lifecycle is required.

## Minimal configuration

Create `guardrails/config.yaml`:

```yaml
models:
  - type: main
    engine: harness
    model: assistant
  - type: safety
    engine: harness
    model: safety

rails:
  input:
    flows: [remove-secret-marker, safety-check]
  output:
    flows: [redact-contact-details]
  tool_input:
    flows: [approve-transfer]
```

Implement the named actions in reviewed, typed application code:

```ts
import { defineGuardrails, loadGuardrailsConfig, modelCheckRail } from '@purista/harness-guardrails'

const rails = defineGuardrails({
  config: await loadGuardrailsConfig('./guardrails'),
  modelAliases: { main: 'assistant', safety: 'safety' },
  actions: {
    'remove-secret-marker': {
      evaluate: ({ value }) => {
        if (typeof value !== 'string') return { decision: 'allow' }

        return {
          decision: 'transform',
          target: 'user_message',
          value: value.replaceAll('[internal-secret]', '[redacted]'),
          reasonCode: 'secret_redacted',
        }
      },
    },
    'safety-check': modelCheckRail({
      model: 'safety',
      instructions: 'Return allow=false for unsafe requests.',
    }),
    'redact-contact-details': {
      evaluate: ({ value }) => typeof value === 'string'
        ? { decision: 'transform', target: 'bot_message', value: redact(value), reasonCode: 'pii_redacted' }
        : { decision: 'allow' },
    },
    'approve-transfer': {
      evaluate: ({ value }) => isApprovedTransfer(value)
        ? { decision: 'allow' }
        : { decision: 'block', reasonCode: 'approval_required' },
    },
  },
})
```

Actions return one of:

- `{ decision: 'allow' }`
- `{ decision: 'block', reasonCode? }`
- `{ decision: 'transform', target, value, reasonCode? }`

`reasonCode` is optional, deployment-controlled lower-case snake case. It is
safe to record in telemetry and logs; never derive it from user content.

## Attach the agent in a PURISTA service

The attached definition remains an ordinary Harness agent definition, so pass
it to `setHarnessAgent(...)` on the PURISTA agent builder:

```ts
const guardedTicketClassifier = rails.attach({
  model: 'assistant',
  input: z.object({ ticketId: z.string(), text: z.string() }),
  output: z.object({ priority: z.enum(['low', 'normal', 'high']), reason: z.string() }),
  tools: ['transfer_money'],
  skills: ['refund_policy'],
  builtinTools: ['read'],
  instructions: 'Classify and help safely using approved policy.',
})

const agent = await supportV1ServiceBuilder
  .getAgentQueueBuilder('guardedSupport', 'Handles support requests safely')
  .addPayloadSchema(guardedTicketClassifier.input)
  .addOutputSchema(guardedTicketClassifier.output)
  .addModel('assistant', { model: 'support-model', capabilities: ['object', 'tool_use'] })
  .addModel('safety', { model: 'safety-model', capabilities: ['object'] })
  .setHarnessAgent(guardedTicketClassifier)
  .getDefinition()
```

The runtime still binds model providers with `ai.models`, and normal PURISTA
queue/command/stream behavior is unchanged. A block stops the affected inner
agent execution before the main model call or tool side effect; the outer
queue and command surface receives the resulting typed failure.

## Workflows, retrieval, and skills

For a tightly coupled Harness workflow, attach rails to every inner agent that
may call models or tools. A workflow calling one of those agents gets coverage
for that invocation automatically.

Keep retrieval outside the addon and filter only the chunks that application
code has already obtained:

```ts
const safeChunks = await rails.filterRetrievedChunks(chunks, {
  workflowId: ctx.workflowId,
  runId: ctx.runId,
  sessionId: ctx.sessionId,
  models: ctx.models,
  signal: ctx.signal,
  logger: ctx.log,
})

return ctx.agents.support({ question: ctx.input.question, context: safeChunks })
```

The addon never creates or queries a vector store. This keeps tenant isolation,
authorization, source retention, and citations in the owning PURISTA service.

Skills are mounted directories, not prompt text. Allowlist each skill on its
agent and retain the `read` built-in tool. A tool-input rail can reject an
unexpected skill read before it happens, and a tool-output rail can sanitize a
returned file value before it becomes model context. Do not treat a rail as a
substitute for the sandbox's path and capability restrictions.

## Tool mutations and approval

Use a `tool_input` rail for content/control checks before a mutation tool.
The rail runs before normal Harness permissions and governance, so a transformed
value is what those systems and the tool's Zod input schema receive. A block
means no tool span, tool handler, MCP request, or side effect occurs.

Keep a permission or governance policy for authority decisions. Guardrails can
classify or gate a proposed operation, but they must never be the only control
that decides whether a principal may transfer money, modify a record, or invoke
an external system.

## OpenTelemetry, cost, and audit evidence

Every evaluation emits an `evaluate_guardrail {rail.id}` span with
`openinference.span.kind=GUARDRAIL`, a content-free rail ID/phase/outcome, and
an optional reason code. It also emits:

- `harness.guardrail.evaluations`
- `harness.guardrail.duration`

A block is a successful guardrail decision (span status `UNSET`); an action
failure, invalid action result, or timeout has error status and fails closed.
Structured logs record blocks, transformations, and failures without content.

`modelCheckRail(...)` invokes a registered Harness model within the guardrail
span. Its nested normal LLM span carries the selected alias, provider/model,
and reported `gen_ai.usage.*` / `llm.token_count.*` token fields plus the
normal token-usage metric. This gives observability systems the correct safety
model cost attribution without duplicating token values on the parent rail
span. Pricing stays in the application's cost model or observability backend;
the addon does not guess prices.

## Production checklist

- Keep `telemetry({ contentCaptureMode: 'NO_CONTENT' })` in production.
- Make every action deterministic where possible, narrow, timeout-aware, and
  independently tested with fake model providers.
- Use controlled reason codes, never user-derived error strings, in logs and
  telemetry.
- Keep tool schemas, tool allowlists, permissions, governance, and PURISTA
  authorization enabled.
- Pass run-scoped model, signal, logger, and identity context to retrieval
  rails so traces, cancellation, and cost attribution remain correlated.
- Treat NeMo Python actions, Colang, dialog/execution rails, servers, and
  implicit vector stores as unsupported: the addon rejects them rather than
  executing unreviewed code.

Continue with [Harness agents and workflows](./harness-agents-and-workflows.md)
and [Test an agent](./test-an-agent.md).
