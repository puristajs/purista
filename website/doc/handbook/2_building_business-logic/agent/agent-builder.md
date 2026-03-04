---
title: The Agent Builder
description: Describe agents with the fluent builder API—schemas, resources, tools, concurrency, and HTTP exposure.
order: 203701
---

# The Agent Builder

`new AgentBuilder(...)` mirrors `ServiceBuilder`: you define one agent workload with typed input/output, allowlisted tools, model aliases, and runtime behavior.

Think of this page as the practical handbook entry:

1. create/scaffold
2. define a minimal useful agent
3. add features (tools/history/knowledge/http)
4. wire runtime config in bootstrap

## 1) Scaffold with CLI

::: code-group

```bash [npm]
npx @purista/cli add agent supportAgent
```

```bash [pnpm]
pnpm dlx @purista/cli add agent supportAgent
```

```bash [bun]
bunx @purista/cli add agent supportAgent
```

```bash [yarn]
yarn dlx @purista/cli add agent supportAgent
```

:::

This creates:

- `src/agents/supportAgent/v1/supportAgent.ts`
- `src/agents/supportAgent/v1/supportAgent.test.ts`

## 2) Minimal agent first

```ts title="src/agents/supportAgent/v1/supportAgent.ts"
import { AgentBuilder } from '@purista/ai'
import { extendApi } from '@purista/core'
import { z } from 'zod/v4'

const supportInputSchema = extendApi(
  z.object({
    sessionId: z.string().uuid().optional(),
    prompt: z.string().min(1),
    context: z.string().optional(),
  }),
  { title: 'Support Agent Input' },
)

export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Answers help-desk questions',
})
  .addPayloadSchema(supportInputSchema)
  .defineModel('openai:gpt-5.2-mini')
  .setHandler(async function (context, payload) {
    const model = context.models['openai:gpt-5.2-mini']
    const result = await model.generate({ prompt: payload.prompt, context: payload.context })
    context.stream.sendFinal(result.output)
    return { message: result.output }
  })
  .build()
```

Start simple like this, then add advanced features incrementally.

## 3) Add one capability at a time

After the minimal handler works, add only the features your workload needs.

### 3.1 Allowlist command tools

```ts
const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Answers help-desk questions',
})
  .allowTool({
    serviceName: 'ticketing',
    serviceVersion: '1',
    commandName: 'createTicket',
  })
  .setHandler(async function (context, payload) {
    if (payload.prompt.includes('open ticket')) {
      await context.tools.invoke('ticketing.1.createTicket', { reason: payload.prompt })
    }
    context.stream.sendFinal('Done')
    return { message: 'Done' }
  })
  .build()
```

Only allowlisted commands are available to the handler.

### 3.2 Add history persistence

```ts
const supportAgent = new AgentBuilder({ ... })
  .persistHistory({ storeName: 'aiConversation', maxFrames: 40 })
  .setHandler(async function (context, payload) {
    const history = await context.session.load()
    const prompt = [history?.data?.last, payload.prompt].filter(Boolean).join('\n')

    const result = await context.models['openai:gpt-5.2-mini'].generate({ prompt })
    await context.session.save({
      data: { last: result.output },
      updatedAt: Date.now(),
    })

    context.stream.sendFinal(result.output)
    return { message: result.output }
  })
  .build()
```

### 3.3 Connect a knowledge adapter

```ts
const supportAgent = new AgentBuilder({ ... })
  .useKnowledgeAdapter({ adapterName: 'supportFaq' })
  .setHandler(async function (context, payload) {
    const docs = await context.knowledge.query('supportFaq', payload.prompt, 3)
    const contextBlock = docs.map(doc => doc.body).join('\n')
    const result = await context.models['openai:gpt-5.2-mini'].generate({
      prompt: `${payload.prompt}\n\nContext:\n${contextBlock}`,
    })
    context.stream.sendFinal(result.output)
    return { message: result.output }
  })
  .build()
```

### 3.4 Expose HTTP + configure runtime pool mapping

```ts
const supportAgent = new AgentBuilder({ ... })
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent') // SSE default
  .setConcurrency({ poolId: 'support' })
  .setHandler(...)
  .build()
```

Set actual worker count in runtime bootstrap (`getInstance(..., { poolConfig: { maxWorkers } })`).

## 4) Quick method map

- schema methods (`.addPayloadSchema`, `.addParameterSchema`, `.addOutputSchema`) reuse normal Purista schema primitives.
- `.defineModel(alias)` declares allowed model aliases; provider instances are injected at runtime.
- `.setRetryPolicy(...)` mirrors command/queue retry behavior and emits handled/unhandled protocol errors automatically.

## Handler context breakdown

The handler receives a familiar context object with agent-specific helpers:

| Property | Description |
| --- | --- |
| `logger`, `message`, `serviceContext` | Same observability handles you use inside services. |
| `stream` | Action-oriented streaming helpers that map to the [agent protocol](./protocol-and-streaming.md): `sendChunk`, `sendFinal`, `sendArtifact`, `sendError`. |
| `session` | Wrapper around the chosen session store. Use `.load`, `.save`, `.delete` for conversation state. |
| `knowledge` | Fan-out to allowlisted knowledge adapters (vector stores, RAG indexes, etc.). |
| `tools` | Invoke allowlisted PURISTA commands. Events appear as tool frames for tracing/debugging. |
| `models` | Typed access to declared model aliases (`context.models[alias]`). |
| `resources` | Optional custom dependencies for non-model integrations (caches, SDK clients, domain utilities). |

Use these helpers instead of manually wiring protocol IDs, storing envelopes, or calling commands by hand. The builder/runtime ensure every handler runs with consistent tracing, retries, and validation.
