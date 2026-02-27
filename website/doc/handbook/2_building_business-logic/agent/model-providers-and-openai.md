---
title: Model Providers & OpenAI
description: Register AI SDK providers, share them through the resource registry, and call real OpenAI models.
order: 203703
---

# Model Providers & OpenAI

Agents call models through the lightweight `ModelProvider` interface. Providers hide vendor-specific SDKs, emit token usage, and can be swapped per environment without changing handler code.

```ts
export interface ModelProvider {
  readonly name: string
  generate(request: { prompt: string; context?: string; metadata?: Record<string, unknown> }): Promise<{
    output: string
    tokens?: { prompt: number; completion: number }
    costUsd?: number
    metadata?: Record<string, unknown>
  }>
}
```

`@purista/ai` includes two ready-to-use implementations:

- `EchoProvider` — deterministic echo, perfect for tests and documentation
- `AiSdkProvider` — wraps any [Vercel AI SDK](https://ai-sdk.dev/docs/introduction) `LanguageModel`, unlocking OpenAI, Anthropic, Google, Ollama, Azure OpenAI, etc.

## Register OpenAI via the Vercel AI SDK

```ts title="src/providers/openai.ts"
import { createOpenAI } from '@ai-sdk/openai'
import { AiSdkProvider, defaultModelResourceRegistry } from '@purista/ai'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const gpt4oMini = new AiSdkProvider({
  model: openai('gpt-4o-mini'),
  systemPrompt: 'You are a concise support engineer.',
  defaults: {
    temperature: 0.2,
    maxOutputTokens: 512,
  },
})

defaultModelResourceRegistry.register('openai:gpt-4o-mini', gpt4oMini)
```

1. Install the SDK packages once (usually at the workspace root):
   ```bash
   pnpm add @ai-sdk/openai ai
   ```
2. Export a helper that registers each model with `defaultModelResourceRegistry`. The string key (`openai:gpt-4o-mini`) is what agents reference in their manifests via `.useResource('model', { resourceName: 'openai:gpt-4o-mini' })` or `.setModelResource({ resourceName: 'openai:gpt-4o-mini' })`.
3. Load this module during bootstrap (before starting any agents or workers) so the registry knows how to resolve the resource name.

The registry is optional but handy when multiple agents share the same provider. For one-off setups you can also pass the provider instance directly through `getInstance({ resources: { model: provider } })`.

## Per-run overrides with metadata

`AiSdkProvider` understands the `metadata.aiSdk` object to override call options without recreating the provider:

```ts
await context.resources.model.generate({
  prompt: payload.prompt,
  metadata: {
    aiSdk: {
      temperature: 0.4,
      maxOutputTokens: 256,
    },
  },
})
```

Background queues (or orchestration services) can set the same metadata field to experiment with temperature, max tokens, tool choices, JSON mode, and more.

## Telemetry & tracing

Every provider exposes its `name`, which flows into the agent telemetry frame and OpenTelemetry attributes. Use it to build dashboards per model, compare latency, or alert when a fallback kicks in. The AI SDK already reports token usage; `AiSdkProvider` forwards `inputTokens`/`outputTokens` so you can aggregate prompt/completion costs across agents.
