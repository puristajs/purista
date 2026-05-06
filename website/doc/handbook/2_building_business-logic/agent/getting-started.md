---
title: Quick Start
description: "Build one service-attached PURISTA agent with the current @purista/ai builder boundary."
order: 203701
---

# Quick Start

This guide shows the current PURISTA AI pattern:

- import `ServiceBuilder` from `@purista/ai`
- define commands, streams, and attached agents beside each other
- keep builders declarative
- inject model providers only at `getInstance(..., { ai })`

## Target Structure

```text
src/
  index.ts
  service/support/v1/
    supportV1ServiceBuilder.ts
    supportV1Service.ts
    command/lookupFaq/lookupFaqCommandBuilder.ts
    agent/supportPlannerAgent/supportPlannerAgentBuilder.ts
```

## 1. Create The AI-Enabled Service Builder

```ts title="src/service/support/v1/supportV1ServiceBuilder.ts"
import type { ServiceInfoType } from '@purista/core'
import { ServiceBuilder } from '@purista/ai'

export const supportServiceInfo = {
  serviceName: 'support',
  serviceVersion: '1',
  serviceDescription: 'Support workflows',
} as const satisfies ServiceInfoType

export const supportV1ServiceBuilder = new ServiceBuilder(supportServiceInfo)
```

This is the important boundary:

- `@purista/core` owns the generic service framework
- `@purista/ai` owns attached-agent builders and runtime wiring

## 2. Define The Attached Planner Agent

```ts title="src/service/support/v1/agent/supportPlannerAgent/supportPlannerAgentBuilder.ts"
import { z } from 'zod'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

const supportAgentResponseSchema = z.object({
  urgency: z.enum(['low', 'medium', 'high']),
  explanation: z.string().min(1),
  nextSteps: z.string().min(1),
})

export const supportPlannerAgentBuilder = supportV1ServiceBuilder
  .getAgentQueueBuilder(
    'supportPlannerAgent',
    'Planner-focused support assistant attached to the support service',
    'support.planner.completed',
  )
  .canInvoke('support', '1', 'lookupFaq', lookupFaqOutputSchema, lookupFaqInputSchema)
  .addPayloadSchema(
    z.object({
      prompt: z.string().min(1),
    }),
  )
  .addOutputSchema(supportAgentResponseSchema)
  .addModel('openai:gpt-4o-mini')
  .exposeAsHttpEndpoint('POST', 'agents/supportPlannerAgent')
  .setStreamProtocolAdapter('ai-sdk.ui-message')
  .setAgentFunction(async function (context, payload) {
    const plan = await context.plan.generate({
      model: 'openai:gpt-4o-mini',
      instructions: 'Break the request into executable tasks.',
      worker: context.ai.createModelExecutor({
        model: 'openai:gpt-4o-mini',
        systemPrompt: 'You are the support worker for a developer platform.',
      }),
      delegates: [
        context.ai.createToolExecutorFromInvoke(
          context.invoke.tools.invoke.support['1'].lookupFaq,
          {
            id: 'lookup-faq',
            description: 'Fetch factual support guidance',
            buildPayload: ({ task }) => ({ question: task.instruction }),
          },
        ),
        context.ai.createModelExecutor({
          id: 'triage',
          description: 'Produces structured urgency triage for incident-style requests.',
          model: 'openai:gpt-4o-mini',
          systemPrompt: 'Classify urgency and return urgency, explanation, and next steps.',
          schema: supportAgentResponseSchema,
        }),
      ],
    })

    const { results, plan: executedPlan } = await context.plan.execute(plan)
    const lastTask = executedPlan.tasks.at(-1)
    const finalResult = supportAgentResponseSchema.parse(results[lastTask?.id ?? ''])

    return {
      message: [
        `Urgency: ${finalResult.urgency}`,
        `Explanation: ${finalResult.explanation}`,
        `Next steps: ${finalResult.nextSteps}`,
      ].join('\n'),
      output: finalResult,
    }
  })
```

Builder responsibilities:

- payload and parameter schemas
- output schema validation for the final structured result
- model aliases
- allowed tools and child agents
- queue/worker definition generation
- optional HTTP exposure metadata with stream-first defaults and an explicit aggregate override via `setStreamingMode('aggregate')`
- optional success event emission, with the third `getAgentQueueBuilder(...)` argument as the primary shorthand

For autonomous sequential planning, prefer the explicit two-step flow shown above:

1. `const plan = await context.plan.generate(...)`
2. `await context.plan.execute(plan)`

The planner model is:

- one required `worker`
- optional named `delegates`
- generated tasks with `id`, `title`, `instruction`, and optional `delegate`

The task `instruction` is passed to the resolved executor as the user-facing task message.

If you need a lower-level direct streaming workflow without planner generation, see the `supportAgent` example in `examples/ai-basic`. That example uses `run.plan(...)` and `run.task(...)` deliberately as the lower-level durable run-state API rather than the canonical planner API.

When you use `run.plan(...)`, `run.task(...)`, or the higher-level `context.plan.*` helpers, PURISTA emits reserved live progress artifacts alongside durable `run-state`:

- `purista-ai:plan`
- `purista-ai:task:<taskId>`
- `purista-ai:task-chunk:<taskId>`
- `purista-ai:plan-status`

Use `publishToCurrentStream.taskId` on `context.ai.streamText(...)` or `context.ai.streamObject(...)` when model output should automatically feed the current task lane.

Handler responsibilities:

- implement the workflow
- use `context.ai`, `context.invoke`, `context.memory`, and `context.io`

## 3. Attach The Agent To The Service

```ts title="src/service/support/v1/supportV1Service.ts"
import { supportPlannerAgentBuilder } from './agent/supportPlannerAgent/supportPlannerAgentBuilder.js'
import { lookupFaqCommandBuilder } from './command/lookupFaq/lookupFaqCommandBuilder.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

const supportPlannerAgentDefinition = supportPlannerAgentBuilder.getDefinition()

export const supportV1Service = supportV1ServiceBuilder
  .addCommandDefinition(lookupFaqCommandBuilder.getDefinition())
  .addAgentDefinition(supportPlannerAgentDefinition)
```

This matches the normal PURISTA pattern:

- the builder file owns the definition
- the service file only aggregates definitions

## 4. Instantiate With Runtime AI Config

```ts title="src/index.ts"
import { createOpenAI } from '@ai-sdk/openai'
import { AiSdkProvider } from '@purista/ai'
import { DefaultEventBridge, DefaultQueueBridge } from '@purista/core'
import { supportV1Service } from './service/support/v1/index.js'

const eventBridge = new DefaultEventBridge()
await eventBridge.start()

const queueBridge = new DefaultQueueBridge()
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

const provider = new AiSdkProvider({
  model: openai('gpt-4o-mini'),
})

const service = await supportV1Service.getInstance(eventBridge, {
  queueBridge,
  ai: {
    model: {
      'openai:gpt-4o-mini': provider,
    },
  },
})

await service.start()
```

That is where runtime concerns belong:

- concrete model providers
- conversation store
- pool manager
- sandbox registry/driver
- resources

## 5. Invoke The Attached Agent

From a command or subscription:

```ts
.canInvokeAgent('supportAgent', '1', {
  payloadSchema: z.object({ prompt: z.string() }),
})
```

```ts
const result = await context.invokeAgent.supportAgent['1']
  .call({ prompt: payload.prompt })
  .final()
```

From another agent:

```ts
const envelopes = await context.invoke.agents
  .stream({
    agentName: 'supportAgent',
    serviceVersion: '1',
    payload: { prompt: payload.prompt },
  })
  .forwardToCurrentStream()
  .collect()
```

## Decision Rules

- Use `ServiceBuilder` from `@purista/ai` when the service attaches agents.
- Keep agent definition files under the same versioned service namespace.
- Use `addAgentDefinition(...)`, not custom registration glue.
- Pass real providers only through `getInstance(..., { ai })`.
- Use `exposeAsHttpEndpoint(...)` as the single attached-agent HTTP entrypoint.
- Attached-agent HTTP exposure defaults to streaming; use `setStreamingMode('aggregate')` only when you need aggregate delivery.

## Related Guides

- [Agent Builder](./agent-builder.md)
- [Invocation](./invocation.md)
- [Context](./handler-context.md)
