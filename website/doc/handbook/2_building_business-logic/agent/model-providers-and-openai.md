---
title: Model Providers & OpenAI
description: Use AI SDK providers with runtime model injection and optional shared registries.
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

## Provider choice guide

| Provider | Best for | Pros | Cons |
| --- | --- | --- | --- |
| `EchoProvider` | tests/docs/local scaffolds | deterministic, zero external dependency | no real model behavior |
| `AiSdkProvider` | production AI workloads | broad provider ecosystem, telemetry support, feature-rich options | needs external API/model runtime |

## Install provider packages

::: code-group

```bash [npm]
npm install @ai-sdk/openai ai
```

```bash [pnpm]
pnpm add @ai-sdk/openai ai
```

```bash [bun]
bun add @ai-sdk/openai ai
```

```bash [yarn]
yarn add @ai-sdk/openai ai
```

:::

## Recommended: inject provider via `getInstance(...)`

```ts title="src/index.ts"
import { createOpenAI } from '@ai-sdk/openai'
import { AiSdkProvider } from '@purista/ai'
import { supportAgent } from './agents/supportAgent/v1/supportAgent.js'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const gpt4oMiniProvider = new AiSdkProvider({
  model: openai(''),
  systemPrompt: 'You are a concise support engineer.',
  defaults: { temperature: 0.2, maxOutputTokens: 512 },
})

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:': gpt4oMiniProvider,
  },
})
```

This keeps dependencies explicit at bootstrap and matches the standard service `getInstance(...)` pattern.

You do not need to call `defaultModelResourceRegistry.register(...)` for standard agent usage.  
Runtime injection through `getInstance(..., { models })` is the default pattern and should be your first choice.

## Optional: shared model registry

Use the shared registry only when you intentionally want process-wide provider defaults reused across multiple runtimes.

## AiSdkProvider options reference

| Option | Purpose | Typical usage |
| --- | --- | --- |
| `model` | underlying AI SDK language model | `openai('')`, anthropic, ollama, etc. |
| `systemPrompt` | static system instruction baseline | role/persona and guardrails |
| `defaults.temperature` | response variability | lower for deterministic support flows |
| `defaults.maxOutputTokens` | output length cap | control latency and token spend |
| `defaults.topP`, `defaults.topK`, ... | provider-specific tuning | optional experimentation |

## Per-run overrides with metadata

`AiSdkProvider` understands the `metadata.aiSdk` object to override call options without recreating the provider:

```ts
await context.models['openai:'].generate({
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

When deciding between static defaults and per-run overrides:

- use defaults for stable baseline behavior
- use per-run overrides for feature flags, A/B tests, or special routes
- keep overrides explicit so evaluation/test comparisons stay reproducible

## Telemetry & tracing

Every provider exposes its `name`, which flows into the agent telemetry frame and OpenTelemetry attributes. Use it to build dashboards per model, compare latency, or alert when a fallback kicks in. The AI SDK already reports token usage; `AiSdkProvider` forwards `inputTokens`/`outputTokens` so you can aggregate prompt/completion costs across agents.
