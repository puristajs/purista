---
title: AI SDK Adapter
description: Convert provider-neutral PURISTA external bindings into Vercel AI SDK tools at the external runtime boundary.
order: 203704
---

# AI SDK Adapter

Use the AI SDK adapter only at the point where you actually call Vercel AI SDK.

The sequence is:

1. `AgentBuilder` declares the allowlist with `canInvoke(...)` and `canInvokeAgent(...)`
2. `context.expose.*` binds those declarations to the live PURISTA runtime
3. `toAiSdkTools(...)` converts the neutral bindings into AI SDK `tools`

```ts
import { generateText, toAiSdkTools } from '@purista/ai'

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
        toolChoice: 'required',
        parallelToolCalls: false,
      },
    },
  },
})
```

## Why this split exists

- PURISTA owns the allowlist, execution path, telemetry, and durability rules
- the AI SDK adapter only converts neutral bindings into Vercel AI SDK tool objects
- the same neutral binding contract can later be adapted to other runtimes

## Durable boundary

Queued durable runs only support bindings that resolve to:

- PURISTA commands
- PURISTA child agents

Pure in-memory closures are still inline-only. Keep local sandbox or filesystem helpers outside the durable path unless you expose them as PURISTA commands or resources first.
