---
title: Quick Start
description: "Build one complete PURISTA agent through the real lifecycle: define, implement, create an instance, and adapt."
order: 203701
---

# Quick Start

This guide builds one small but realistic PURISTA setup:

- an inline `triageAgent`
- a queued durable `supportAgent`
- one support command used as a tool
- two skills provided at instance creation
- one optional Vercel AI SDK adapter call

The goal is not to show every feature. The goal is that you finish the page with one mental model that actually works.

## What You Will Build

```text
src/
  agents/
    triageAgent/v1/triageAgent.ts
    supportAgent/v1/supportAgent.ts
  service/support/v1/command/lookupFaq/lookupFaqCommandBuilder.ts
  skills.ts
  index.ts
```

## Step 1: Define The Fast Inline Agent

The triage agent is a small classifier. It is fast, so inline execution is enough.

```ts title="src/agents/triageAgent/v1/triageAgent.ts"
import { AgentBuilder } from '@purista/ai'
import { z } from 'zod'

export const triageAgent = new AgentBuilder({
  agentName: 'triageAgent',
  agentVersion: '1',
  description: 'Classifies support urgency',
})
  .setExecutionMode('inline')
  .addPayloadSchema(z.object({ prompt: z.string().min(1) }))
  .defineModel('openai:fast', { capabilities: ['json'] })
  .setHandler(async context => {
    const payload = context.input.payload
    const result = await context.ai.models['openai:fast'].generateJson({
      prompt: `Classify the urgency of this support request: ${payload.prompt}`,
      schema: z.object({
        urgency: z.enum(['low', 'medium', 'high']),
      }),
    })

    return { message: JSON.stringify(result.data) }
  })
  .build()
```

What to notice:

- the builder declares the execution mode
- the builder declares the model alias
- the handler only implements logic

## Step 2: Define The Queued Durable Agent

Before looking at the code, start with the intent.

We want a `supportAgent` that:

1. survives restarts
2. streams visible progress to the user
3. can resume after interruptions
4. can call one support command and one child agent
5. uses declared skills to shape the answer

That combination is exactly why queued durable execution exists in PURISTA.

The code below is the same agent, but this time with inline comments showing why each declaration exists.

```ts title="src/agents/supportAgent/v1/supportAgent.ts"
import { AgentBuilder, renderSkillDocuments } from '@purista/ai'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'

export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
  description: 'Queued durable support assistant',
})
  // This work should survive restarts and stream progress.
  .setExecutionMode('queued')
  // Declare small validated runtime config values separately from resources.
  .setConfigSchema(
    z.object({
      locale: z.string().min(2).default('en'),
    }),
  )
  .setDefaultConfig({ locale: 'en' })
  .setExecutionPolicy({
    // The caller attaches to the active durable run and receives updates.
    httpBehavior: 'attach-and-stream',
    // PURISTA should resume from checkpoints after interruption.
    recovery: 'resume-from-checkpoints',
    // Runs for the same sessionId reuse the same durable scope.
    scopeFromPayload: ['sessionId'],
  })
  .addPayloadSchema(
    z.object({
      prompt: z.string().min(1),
      sessionId: z.string().optional(),
    }),
  )
  // Declare one runtime resource that the host must provide.
  .defineResource<'supportPolicy', { developerInstruction: string }>()
  // The builder only declares model aliases and capabilities.
  .defineModel('openai:primary', { capabilities: ['text', 'stream'] })
  // Only these skills are visible through context.ai.skills.
  .useSkills(['spec-elicitation', 'support-workflow'])
  // Allow one command-backed tool.
  .canInvoke('support', '1', 'lookupFaq')
  // Allow one child agent.
  .canInvokeAgent('triageAgent', '1')
  // Guard hooks are for short request policy checks, not business logic.
  .setBeforeGuardHooks({
    requirePrompt: async function requirePrompt(_context, requestPayload) {
      if (!requestPayload.prompt.trim()) {
        throw HandledError.fromMessage(StatusCode.BadRequest, 'prompt is required')
      }
    },
  })
  // Expose the agent through the normal PURISTA HTTP/SSE path.
  .exposeAsHttpEndpoint('POST', 'agents/supportAgent')
  .setSseProtocol('ai-sdk-ui-message')
  .setHandler(async (context, payload) => {
    // 1. Start durable workflow state for progress, checkpoints, and recovery.
    const run = await context.memory.run.start({
      title: 'Support response',
      extraScope: { sessionId: payload.sessionId ?? context.input.message.id },
    })

    // Keep user-visible conversation history separate from workflow state.
    await context.memory.conversation.addUser(payload.prompt)
    await run.plan([
      { id: 'triage', title: 'Classify urgency' },
      { id: 'faq', title: 'Load FAQ guidance' },
      { id: 'answer', title: 'Write final answer' },
    ])
    await run.update({ phase: 'running', status: 'running' })

    // 2. Gather the factual inputs needed for the final answer.
    // Call the allowlisted child agent.
    const triage = await context.invoke.agents.runText({
      agentName: 'triageAgent',
      agentVersion: '1',
      payload: { prompt: payload.prompt },
    })

    // Call the allowlisted PURISTA command as a tool.
    const faq = await context.invoke.tools.invoke.support['1'].lookupFaq({
      question: payload.prompt,
    })

    // 3. Load the declared skills exactly where they are needed:
    // right before prompt construction for the final answer.
    const skills = await context.ai.skills.loadAvailable()
    const skillBlock = renderSkillDocuments('Relevant skills', skills)

    // 4. Generate the final answer while streaming deltas to the client.
    const answer = await run.step(
      'answer',
      async () =>
        await context.ai.reply.generate({
          model: 'openai:primary',
          developerInstruction: context.app.resources.supportPolicy.developerInstruction,
          prompt: [
            skillBlock,
            `Customer request: ${payload.prompt}`,
            `Triage result: ${triage}`,
            `FAQ answer: ${String(faq.answer ?? '')}`,
          ]
            .filter(Boolean)
            .join('\n\n'),
        }),
      { checkpoint: 'final-answer' },
    )

    // 5. Persist the assistant message and finish the durable run.
    await context.memory.conversation.addAssistant(answer)
    await run.finishSuccess(answer)
    return { message: answer }
  })
  .build()
```

If you want to publish a custom event from an agent, declare it explicitly with
`.canEmit(...)` and call `context.output.emit(...)` yourself. If you want a
single event with the agent's final aggregated result, use
`.setSuccessEventName(...)`. That success event emits one normalized terminal
result payload, not the raw protocol envelope list. Otherwise, the default is
no custom event.

Read that code in two passes:

### Builder declarations

These define the contract:

- queued execution mode
- execution policy
- payload schema
- declared resources
- model aliases
- declared skill names
- allowlisted commands
- allowlisted child agents
- custom PURISTA events
- guard hooks
- transport exposure

More detail:

- [Builder](./agent-builder.md)
- [Runtime](./runtime.md)
- [Durable Run State](./run-state.md)

### Handler implementation

These use that contract:

- `context.memory.run`
- `context.memory.conversation`
- `context.app.resources`
- `context.ai.skills`
- `context.invoke.agents`
- `context.invoke.tools`
- `context.ai.models`
- `context.io.stream`

More detail:

- [Context](./handler-context.md)
- [Invocation](./invocation.md)

Inside the handler, try to keep the code grouped by execution phase:

1. start and describe the durable run
2. gather facts and child results
3. load skills where prompt construction actually happens
4. generate and stream the answer
5. persist and finish

That is easier to understand than collecting all variables at the top and using them much later.

One more rule:

- use guards for short request policy checks
- use the handler for the real workflow

## Step 3: Provide The Skills

In real applications, the usual path is not inline string content. The common path is:

1. create a `skills/` directory in your application
2. put one `SKILL.md` per skill there
3. load that directory as a skill catalog at instance creation

Inline skill content is useful for tests and tiny examples, but it is not the main real-world path.

### A normal application skill layout

```text
src/
  skills/
    spec-elicitation/
      SKILL.md
    support-workflow/
      SKILL.md
      references/
        fallbacks.md
```

Example `SKILL.md`:

```md title="src/skills/spec-elicitation/SKILL.md"
# Spec Elicitation

Before answering, identify any missing business context, constraints, or user role assumptions.
```

```md title="src/skills/support-workflow/SKILL.md"
# Support Workflow

Use triage first, then gather factual guidance, then answer clearly and briefly.
```

### Load the skill directory

```ts title="src/skills.ts"
import { createLayeredFileSkillResource } from '@purista/ai'

export const supportSkills = createLayeredFileSkillResource({
  overlayRoots: [new URL('./skills', import.meta.url).pathname],
})
```

If you want to merge your local skills with a shared catalog, add `canonicalRoots` too.

More detail:

- [Skills](./skills.md)

## Step 4: Create Real Instances

Now the inert definitions become running workloads.

This is also where the real model adapter/provider enters the picture. The builder only declared aliases like `openai:fast` and `openai:primary`. `getInstance(...)` binds those aliases to real providers.

```ts title="src/index.ts"
import { AiSdkProvider } from '@purista/ai'
import { DefaultEventBridge, DefaultQueueBridge } from '@purista/core'
import { openai } from '@ai-sdk/openai'

const eventBridge = new DefaultEventBridge()
const queueBridge = new DefaultQueueBridge()

await eventBridge.start()

const triageAgentInstance = await triageAgent.getInstance(eventBridge, {
  models: {
    // Bind the builder alias to a real provider adapter.
    'openai:fast': new AiSdkProvider({
      model: openai('gpt-4o-mini'),
    }),
  },
})

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  // Queued durable agents need a queue bridge.
  queueBridge,
  models: {
    // This is the real provider used by context.ai.models['openai:primary'].
    'openai:primary': new AiSdkProvider({
      model: openai('gpt-4o'),
    }),
  },
  // Provide the resource declared with defineResource(...).
  resources: {
    supportPolicy: {
      developerInstruction: 'Answer concisely and include next steps.',
    },
  },
  // Provide the declared skills here.
  skills: supportSkills,
  // Runtime config is the right place for environment-controlled values.
  config: {
    locale: 'en',
  },
})

await triageAgentInstance.start()
await supportAgentInstance.start()
```

This is the key PURISTA pattern:

- builder declares intent
- `getInstance(...)` provides the real dependencies and runtime values

More detail:

- [Runtime](./runtime.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)

## Step 5: Invoke The Agent From PURISTA

The normal path is still a normal PURISTA call.

```ts
const result = await context.invokeAgent.supportAgent['1']
  .call({
    prompt: 'A customer was charged twice and needs help.',
    sessionId: 'support-thread-1',
  })
  .final()
```

That works whether the agent is inline or queued. The difference is internal execution and streaming behavior, not the conceptual call shape.

## Step 6: Adapt At The AI SDK Boundary

If you want to use Vercel AI SDK, bind it as the concrete provider for the model alias you already declared.

First bind the concrete provider for the declared alias at instance creation:

```ts
import { createOpenAI } from '@ai-sdk/openai'
import { AiSdkProvider } from '@purista/ai'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  queueBridge,
  models: {
    'openai:primary': new AiSdkProvider({
      model: openai('gpt-4o-mini'),
      systemPrompt: 'You are a concise support engineer.',
    }),
  },
  skills: supportSkills,
})
```

Then keep the handler in the same PURISTA style and talk only to the alias.

For the common case where this is the public assistant reply the user should see, prefer the handler-level reply helper:

```ts
const answer = await context.ai.reply.generate({
  model: 'openai:primary',
  developerInstruction: 'Use tools before answering.',
  prompt: payload.prompt,
  metadata: {
    aiSdk: {
      toolChoice: 'required',
      parallelToolCalls: false,
    },
  },
})
```

That helper streams deltas to the current turn, emits the final assistant end marker, and returns the final reply text so you can persist it.

Use `context.ai.reply.compose(...)` when the text is internal synthesis input for a larger workflow, not the final public reply.

What matters here:

- the builder still only declares the alias
- the instance binds the real provider
- the handler still uses `context.ai.models['openai:primary']`
- the provider handles the Vercel-specific mapping internally, including default skills and allowlisted bindings
- the provider path does not change how resources, skills, or guards work

If you later replace `AiSdkProvider` with another `ModelProvider`, the handler should not need to change.

## When To Add Sandbox

Add the sandbox runtime only when the agent needs a real workspace:

- shell execution
- repository operations
- skill scripts
- generated files that should not touch the host directly

If the agent only needs models, commands, child agents, and skills as text, do not add sandbox complexity yet.

## What You Should Remember

- Define with `AgentBuilder`.
- Implement with `context`.
- Provide dependencies at `getInstance(...)`.
- Declare resources with `defineResource(...)` and provide them at instance creation.
- Use guards for short policy checks, not for workflow logic.
- Adapt at the SDK boundary, not earlier.
- Skills are declared in the builder and provided at instance creation.
- Queued durable agents need `queueBridge` and should use `context.memory.run`.

## Where To Go Next

- [Builder](./agent-builder.md) for a cleaner breakdown of what belongs in the definition.
- [Context](./handler-context.md) for a structured tour of the handler API.
- [Runtime](./runtime.md) for instance creation, pools, and sandbox runtime wiring.
- [Skills](./skills.md) for inline vs filesystem skills and skill references.
- [AI SDK Adapter](./ai-sdk-adapter.md) for the Vercel AI SDK boundary in more detail.
