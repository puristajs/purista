---
title: AI SDK Adapter
description: Bind a Vercel AI SDK model to a declared model alias at service startup.
order: 203706
---

# AI SDK Adapter

`AiSdkProvider` is the standard bridge from PURISTA model aliases to Vercel AI SDK models.

The pattern stays the same:

1. declare the model alias in the attached-agent builder
2. bind that alias to a real `AiSdkProvider` in `getInstance(..., { ai })`
3. use `context.ai.models[alias]` in the handler

## Builder Side

```ts
export const supportAgentBuilder = supportV1ServiceBuilder
  .getAgentQueueBuilder('supportAgent', 'Support assistant', 'support.agent.completed')
  .addPayloadSchema(z.object({ prompt: z.string().min(1) }))
  .addModel('openai:primary')
  .setAgentFunction(async (context, payload) => {
    const answer = await context.ai.models['openai:primary'].generateText({
      prompt: payload.prompt,
    })

    return { message: answer }
  })
```

## Runtime Binding

```ts
import { createOpenAI } from '@ai-sdk/openai'
import { AiSdkProvider } from '@purista/ai'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

const service = await supportV1Service.getInstance(eventBridge, {
  queueBridge,
  ai: {
    model: {
      'openai:primary': new AiSdkProvider({
        model: openai('gpt-4o-mini'),
        systemPrompt: 'You are a concise support engineer.',
      }),
    },
  },
})
```

## Why This Boundary Matters

- handlers stay provider-agnostic
- examples stay testable with deterministic providers
- swapping model adapters does not require rewriting business logic

## Related Guides

- [Quick Start](./getting-started.md)
- [Builder](./agent-builder.md)
- [External Runtime Bindings](./external-runtime-bridge.md)
