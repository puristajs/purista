---
title: Quick Start
description: Build one inline agent and one queued durable agent.
order: 203701
---

# Quick Start

This guide shows the decision boundary:

- use an **inline** agent for a short classification or answer step
- use a **queued durable** agent when the work should survive restarts, expose progress, and support checkpoints
- use **external runtime bindings** when you want a Vercel AI SDK loop but the tools must still execute as PURISTA commands or child agents

## 1. Scaffold

```bash
purista add agent SupportAgent
```

## 2. Define An Inline Agent

This agent classifies a request and returns a small JSON result. It is fast enough to run inline.

```ts title="src/agents/triageAgent/v1/triageAgent.ts"
import { AgentBuilder } from '@purista/ai'
import { z } from 'zod'

export const triageAgent = new AgentBuilder({
  agentName: 'triageAgent',
  agentVersion: '1',
  description: 'Classifies requests quickly',
})
  .setExecutionMode('inline')
  .addPayloadSchema(z.object({ prompt: z.string() }))
  .defineModel('openai:gpt-4o-mini', { capabilities: ['json'] })
  .setHandler(async (context, payload) => {
    const result = await context.models['openai:gpt-4o-mini'].generateJson({
      prompt: `Classify this request: ${payload.prompt}`,
      schema: z.object({
        urgency: z.enum(['low', 'medium', 'high']),
      }),
    })

    return { message: JSON.stringify(result.data) }
  })
  .build()
```

## 3. Define A Queued Durable Agent

This agent performs longer work, keeps a task list in `context.runState`, and uses checkpoints so it can resume after interruption.

```ts title="src/agents/supportAgent/v1/supportAgent.ts"
import { AgentBuilder, generateText } from '@purista/ai'
import { z } from 'zod'

export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Support assistant with durable progress tracking',
})
  .setExecutionMode('queued')
  .setExecutionPolicy({
    httpBehavior: 'attach-and-stream',
    recovery: 'resume-from-checkpoints',
    scopeFromPayload: ['sessionId'],
  })
  .addPayloadSchema(z.object({ prompt: z.string(), sessionId: z.string().optional() }))
  .defineModel('openai:gpt-4o-mini')
  .canInvoke('support', '1', 'lookupFaq')
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setSseProtocol('ai-sdk-ui-message')
  .setHandler(async (context, payload) => {
    if (!(await context.runState.get())) {
      throw new Error('Queued support run state is not initialized')
    }

    await context.runState.replaceTasks([
      { id: 'faq', title: 'Check knowledge base' },
      { id: 'answer', title: 'Write final answer' },
    ])
    await context.runState.checkpoint('request', { prompt: payload.prompt }, { completed: true })
    await context.runState.update({ phase: 'running', status: 'running' })

    const faqAnswer = await context.runState.step(
      'faq',
      async () => {
        const lookup = await context.tools.invoke.support['1'].lookupFaq({ question: payload.prompt })
        return typeof lookup === 'object' && lookup && 'answer' in lookup ? String(lookup.answer) : ''
      },
      { detail: 'Searching the knowledge base', checkpoint: 'faq-answer' },
    )

    await context.runState.update({ phase: 'summarizing', status: 'summarizing' })
    const answer = await context.runState.step(
      'answer',
      async () =>
        await generateText({
          model: context.models['openai:gpt-4o-mini'],
          request: {
            prompt: `Question: ${payload.prompt}\nKnowledge base: ${faqAnswer}`,
          },
      }),
      { checkpoint: 'final-answer' },
    )

    await context.runState.finish({
      status: 'completed',
      summary: answer,
      finalMessage: answer,
    })
    context.stream.sendFinal(answer)
    return { message: answer }
  })
  .build()
```

## 4. Bootstrap

Queued durable agents need a `queueBridge` at runtime.

```ts title="src/index.ts"
import { DefaultEventBridge, DefaultQueueBridge } from '@purista/core'

const eventBridge = new DefaultEventBridge()
const queueBridge = new DefaultQueueBridge()

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  queueBridge,
  models: { 'openai:gpt-4o-mini': provider },
})
```

For queued agents, PURISTA creates the durable run record before the handler starts. The handler should update the existing run with `context.runState.get()`, `update()`, `replaceTasks()`, `step()`, and `finish(...)` instead of starting a second run manually.

## 5. Invoke Via Command

Use the normal PURISTA dependency pattern for both inline and queued agents.

```ts title="src/services/support/v1/command/ask.ts"
export const askCommand = supportServiceBuilder
  .getCommandBuilder('ask', 'Asks the agent')
  .canInvokeAgent('supportAgent', '1')
  .setCommandFunction(async (context, payload) => {
    const result = await context.invokeAgent.supportAgent['1']
      .call({ prompt: payload.prompt, sessionId: payload.sessionId })
      .final()

    return result.message
  })
```

When `supportAgent` is queued, the HTTP/SSE endpoint attaches to the active run, streams `data-run-state`, and keeps the composer locked until the run finishes.

## 6. Add An External Runtime Loop

If you want the reasoning loop in Vercel AI SDK while keeping execution inside PURISTA, create provider-neutral bindings first and adapt them at the AI SDK boundary:

```ts
const bindings = context.expose.tools({
  commands: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
  agents: [{ agentName: 'triageAgent', agentVersion: '1', name: 'triageEscalation', resultMode: 'text' }],
})

await generateText({
  model: context.models['openai:gpt-4o-mini'],
  request: {
    prompt: payload.prompt,
    metadata: {
      aiSdk: {
        tools: toAiSdkTools(bindings),
      },
    },
  },
})
```

This keeps PURISTA framework-agnostic: the external SDK handles reasoning, PURISTA handles commands, agent invocation, tracing, and queue-backed execution through one neutral binding contract.
