---
title: AI SDK Adapter
description: Use Vercel AI SDK through a normal PURISTA model alias so handlers stay simple and portable.
order: 203706
---

# AI SDK Adapter

Use this page when:

- you want to call a Vercel AI SDK model from a PURISTA agent
- you want tool loops through PURISTA commands or child agents
- you want to keep the handler free of Vercel-specific setup code

The normal PURISTA flow stays the same:

1. define a model alias in the builder
2. bind the real provider at `getInstance(...)`
3. call `context.models['alias']` in the handler

This page shows that full flow with one working example.

The important boundary is this:

- the builder stays provider-agnostic
- the handler stays provider-agnostic
- `getInstance(...)` decides which concrete provider adapter backs each model alias

## What You Usually Want

In most projects, you want this:

- the builder declares one alias such as `'openai:primary'`
- instance creation binds that alias to `AiSdkProvider`
- the handler calls `context.models['openai:primary'].generateText(...)`
- declared PURISTA skills are attached automatically
- allowlisted PURISTA commands and child agents are exposed automatically
- the provider translates both for the AI SDK internally

That keeps the handler short and easy to swap later.

## Automatic Defaults

When you call `context.models['alias'].generateText(...)` inside a handler:

- declared skills are loaded automatically if you omit `skills`
- allowlisted commands and child agents are exposed automatically if you omit `bindings`

That means the lowest-code default is usually:

```ts
const answer = await context.models['openai:primary'].generateText({
  developerInstruction: 'Use the available tools before answering.',
  prompt: payload.prompt,
  onTextDelta: delta => context.stream.sendChunk(delta),
})
```

Use explicit `skills` or `bindings` only when you want to narrow or override the defaults.

## Example: Support Agent With One Tool Loop

### 1. Define the agent contract

```ts
import { AgentBuilder } from '@purista/ai'

export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
})
  .defineModel('openai:primary', { capabilities: ['text', 'stream'] })
  .defineResource<'supportPolicy', { developerInstruction: string }>()
  .useSkills(['spec-elicitation', 'support-workflow'])
  .canInvoke('support', '1', 'lookupFaq')
  .canInvokeAgent('triageAgent', '1')
  .setHandler(async (context, payload) => {
    const answer = await context.models['openai:primary'].generateText({
      developerInstruction: [
        context.resources.supportPolicy.developerInstruction,
        'Use the available tools before answering.',
      ],
      prompt: payload.prompt,
      metadata: {
        aiSdk: {
          toolChoice: 'required',
          parallelToolCalls: false,
          maxSteps: 6,
        },
      },
      onTextDelta: delta => context.stream.sendChunk(delta),
    })

    context.stream.sendFinal(answer)
    return { message: answer }
  })
  .build()
```

### 2. Bind the real provider at instance creation

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
      defaults: { temperature: 0.2 },
    }),
  },
  resources: {
    supportPolicy: {
      developerInstruction: 'Keep answers concise and operational.',
    },
  },
  skills: supportSkills,
})
```

That is enough for the normal path.

## What The Handler Actually Sees

Inside the handler, you do not work with a Vercel-specific request object.

You work with normal PURISTA concepts:

- `developerInstruction`
- `prompt`
- `metadata`
- `context.resources`
- `context.skills`

The provider fills in default skills and bindings when you do not pass them, and translates the final request into AI SDK inputs.

From the handler’s point of view, the important API is simply:

```ts
await context.models['openai:primary'].generateText(...)
```

## How `AiSdkProvider` Maps PURISTA Concepts

When you call `generateText(...)` on an `AiSdkProvider`-backed alias:

- `developerInstruction` becomes high-priority model guidance
- `skills` are rendered into prompt context
- `references` are rendered into prompt context
- `bindings` become AI SDK tools
- `metadata.aiSdk` is passed through as AI SDK-specific overrides

This means you can keep one handler style and still get:

- tool calling
- streamed text deltas
- per-call AI SDK overrides
- skill-aware prompt composition

## The Shortest Useful Version

If you want the smallest possible default code, this is usually enough:

```ts
const answer = await context.models['openai:primary'].generateText({
  developerInstruction: 'Use the available tools before answering.',
  prompt: payload.prompt,
  onTextDelta: delta => context.stream.sendChunk(delta),
})
```

Use this as the default. Add explicit `skills`, `references`, `bindings`, or `metadata.aiSdk` only when you actually need them.

## When To Use `bindings`

Use explicit `bindings` when the model should decide whether and when to call only a subset of the allowlisted tools.

Typical cases:

- FAQ lookup
- child-agent escalation
- structured retrieval command
- calculation command

Do not use `bindings` when the handler already knows it must call the command directly. In that case, call the command through:

- `context.tools`
- or `context.agents`

and pass the result to the model as normal text context.

## When To Use `metadata.aiSdk`

`metadata.aiSdk` is optional.

Reach for it only when the default provider setup is not enough for one specific call.

Typical uses:

- force tool use with `toolChoice: 'required'`
- disable parallel tool calls
- set `maxSteps`
- tune temperature or output length

Keep the common path simple and move provider-specific tuning to the rare calls that need it.

## Skills And Tools Are Still Different

Keep this distinction clear:

- skills shape how the model reasons
- tools execute real PURISTA work

Examples:

- skill: `support-workflow`
- tool: `support.1.lookupFaq`

The AI SDK adapter supports both, but it does not collapse them into one concept.

## How To Switch Adapters Later

If you later want a different adapter, the change should happen at instance creation:

```ts
const instance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': anotherProvider,
  },
})
```

The goal is that the handler can stay the same as long as the new provider implements the same `ModelProvider` contract.

That is the PURISTA intention:

- define aliases in the builder
- implement against `context.models[...]`
- choose the concrete adapter only at `getInstance(...)`

## Common Mistakes

- Building AI SDK request objects inside the handler.
- Treating the adapter as a second runtime API next to `context.models`.
- Putting provider construction into the builder instead of `getInstance(...)`.
- Passing large numbers of provider-specific overrides on every call.
- Using tool loops when a direct `context.tools` call would be simpler.

## Decision Guide

Use `AiSdkProvider` when:

- you want Vercel AI SDK as the concrete model runtime
- you want PURISTA commands or child agents exposed as tools
- you want streaming through `onTextDelta`

Stay on the plain provider path when:

- you do not need AI SDK-specific tool calling
- a simple text or JSON model call is enough

Use low-level helpers only when:

- you are building your own provider
- you are integrating another external runtime
- you intentionally need manual control over the final AI SDK request shape

## Related Guides

- [Quick Start](./getting-started.md)
- [Builder](./agent-builder.md)
- [Context](./handler-context.md)
- [Runtime](./runtime.md)
- [Skills](./skills.md)
- [External Runtime Bindings](./external-runtime-bridge.md)
