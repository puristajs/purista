---
title: AI SDK Adapter
description: Use Vercel AI SDK through a normal PURISTA model alias so handlers stay simple and portable.
order: 203706
---

# AI SDK Adapter

Use this page when:
- You want to call a Vercel AI SDK model from a PURISTA agent.
- You want the model to use PURISTA commands or child agents as tools.
- You want to keep your handler logic clean and portable.

The core PURISTA flow stays the same:
1.  Define a model alias in the `AgentBuilder`.
2.  Bind that alias to a real `AiSdkProvider` instance at `getInstance(...)`.
3.  Call the model via `context.ai.models['your-alias']` in the handler.

This keeps your agent's business logic separate from the specific model implementation, allowing you to swap providers later without rewriting your handler.

## The `AiSdkProvider`

The `AiSdkProvider` is a bridge between PURISTA and any model compatible with the Vercel AI SDK. It implements the standard `ModelProvider` interface, so your handler code doesn't need to know about the AI SDK at all.

### Key Features
- **Automatic Tool Exposure**: Automatically exposes allowlisted PURISTA commands and child agents as tools to the model.
- **Skill Integration**: Renders declared skills into the prompt context for the model.
- **Streaming Support**: Natively handles streaming responses via `onTextDelta`.
- **Invocation Policies**: Supports bounded timeout and retry policies for model calls, crucial for production reliability.

## Example: Support Agent with a Tool Loop

### 1. Define the Agent Contract

The builder defines the agent's capabilities but remains provider-agnostic.

```ts
import { AgentBuilder } from '@purista/ai';

export const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
})
  .defineModel('openai:primary', { capabilities: ['text', 'stream'] })
  .useSkills(['support-workflow'])
  .canInvoke('support', '1', 'lookupFaq') // Allowlist the tool
  .setHandler(async (context, payload) => {
    const answer = await context.ai.reply.generate({
      model: 'openai:primary',
      developerInstruction: 'Use the available tools before answering.',
      prompt: payload.prompt,
      metadata: {
        aiSdk: {
          toolChoice: 'required', // Force the model to use a tool
        },
      },
    });

    return { message: answer };
  })
  .build();
```

### 2. Bind the Provider at Instance Creation

At `getInstance(...)`, you bind the `openai:primary` alias to a concrete `AiSdkProvider` instance.

```ts
import { createOpenAI } from '@ai-sdk/openai';
import { AiSdkProvider } from '@purista/ai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': new AiSdkProvider({
      model: openai('gpt-4o-mini'),
      systemPrompt: 'You are a concise support engineer.',
      defaults: {
        temperature: 0.2,
        // Set a default invocation policy for reliability
        invocation: {
          timeoutMs: 15000,
          retry: { maxRetries: 2 },
        },
      },
    }),
  },
  // ... other dependencies
});
```

## How It Works

### Automatic Defaults

When you call `generateText(...)`, the `AiSdkProvider` automatically:
- Loads skills declared with `useSkills` if you don't provide them in the request.
- Exposes tools and child agents from `canInvoke` and `canInvokeAgent` as `bindings` if you don't provide them.

For public assistant replies, the shortest useful call is often just:
```ts
const answer = await context.ai.reply.generate({
  model: 'your-alias',
  prompt: payload.prompt,
});
```

Use `context.ai.models['your-alias'].generateText(...)` directly when the generated text is an internal synthesis step rather than the final user-facing reply.

### Prompt and System Message Composition

The provider intelligently combines several sources to construct the final prompt for the model:
- `systemPrompt` (from the provider constructor)
- `context` (from the `generateText` request)
- `developerInstruction` (from the `generateText` request)
- Rendered `skills` and `references`
- The main `prompt`

This ensures the model gets a rich, well-structured context for its reasoning process.

### Overriding Behavior with `metadata.aiSdk`

For per-call control, you can pass AI SDK-specific options via `metadata.aiSdk`.

```ts
await context.ai.models['your-alias'].generateText({
  prompt: '...',
  metadata: {
    aiSdk: {
      // Vercel AI SDK options
      temperature: 0.8,
      maxTokens: 1024,
      toolChoice: 'required',

      // Invocation policy override for this specific call
      invocation: {
        timeoutMs: 30000,
      },
    },
  },
});
```
This is the recommended way to tune provider-specific parameters without cluttering your handler logic.

## When to Use `bindings`

Use an explicit `bindings` property in your `generateText` call only when you want the model to choose from a *subset* of the allowlisted tools.

If your handler already knows it needs to call a specific command, it's simpler and more efficient to call it directly with `context.invoke.tools` and pass the result to the model as part of the prompt.

## Switching Adapters

Because the handler only interacts with the standard `ModelProvider` interface via `context.ai.models`, switching to a different provider in the future is as simple as changing the binding at `getInstance(...)`. Your handler logic remains untouched.

```ts
// Switching to a different provider
const instance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:primary': new MyOtherProvider({ ... }),
  },
});
```

This is the core PURISTA pattern: define intent in the builder, implement against standard interfaces in the handler, and provide concrete dependencies at instance creation.

## Related Guides
- [Quick Start](./getting-started.md)
- [Agent Builder](./agent-builder.md)
- [Handler Context](./handler-context.md)
- [Runtime](./runtime.md)
- [Skills](./skills.md)
- [External Runtime Bindings](./external-runtime-bridge.md)
