---
title: Model Providers & OpenAI
description: Use AI SDK providers with runtime model injection, JSON generation, embeddings, and middleware.
order: 203703
---

# Model Providers & OpenAI

Agents call models through the lightweight `ModelProvider` interface. Providers hide vendor-specific SDKs, emit token usage, and can be swapped per environment without changing handler code.

```ts
export interface ModelProvider {
  readonly name: string
  readonly capabilities: {
    text?: boolean
    stream?: boolean
    embedding?: boolean
    rerank?: boolean
    json?: boolean
  }
  generate?(request: { prompt: string; context?: string; metadata?: Record<string, unknown> }): Promise<{
    output: string
    reasoningText?: string
    tokens?: { prompt: number; completion: number }
    costUsd?: number
    metadata?: Record<string, unknown>
  }>
  generateJson?<T>(request: {
    prompt: string
    context?: string
    schema?: unknown
    metadata?: Record<string, unknown>
  }): Promise<{
    data: T
    text: string
    reasoningText?: string
    tokens?: { prompt: number; completion: number }
    metadata?: Record<string, unknown>
  }>
  stream?(request: { prompt: string; context?: string; metadata?: Record<string, unknown> }): ProviderStream
  embed?(request: { value: string; metadata?: Record<string, unknown> }): Promise<{ embedding: number[] }>
  embedMany?(request: { values: string[]; metadata?: Record<string, unknown> }): Promise<{ embeddings: number[][] }>
  rerank?(request: { query: string; documents: unknown[]; topN?: number; metadata?: Record<string, unknown> }): Promise<{
    ranking: Array<{ originalIndex: number; score: number; document: unknown }>
    rerankedDocuments: unknown[]
  }>
}
```

`@purista/ai` includes `AiSdkProvider`, which wraps [Vercel AI SDK](https://ai-sdk.dev/docs/introduction) models for text/stream and optional embedding/rerank capabilities.

## Provider choice guide

| Provider | Best for | Pros | Cons |
| --- | --- | --- | --- |
| `AiSdkProvider` | production workloads + realistic tests | broad provider ecosystem, telemetry support, text/stream/embed/rerank support | needs configured AI SDK models |

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
import { extractReasoningMiddleware } from 'ai'
import { AiSdkProvider } from '@purista/ai'
import { supportAgent } from './agents/supportAgent/v1/supportAgent.js'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const gpt4oMiniProvider = new AiSdkProvider({
  model: openai('gpt-4o-mini'),
  // optional capabilities:
  // embeddingModel: openai.textEmbeddingModel('text-embedding-3-small'),
  // rerankingModel: someProvider.rerankingModel('rerank-model'),
  systemPrompt: 'You are a concise support engineer.',
  defaults: { temperature: 0.2, maxOutputTokens: 512 },
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
})

const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
  models: {
    'openai:gpt-4o-mini': gpt4oMiniProvider,
  },
})
```

This keeps dependencies explicit at bootstrap and matches the standard service `getInstance(...)` pattern.

You do not need to call `defaultModelResourceRegistry.register(...)` for standard agent usage.  
Runtime injection through `getInstance(..., { models })` is the default pattern and should be your first choice.

## Capability-aware declarations

Declare required capabilities in the builder so Purista can fail fast at `getInstance(...)`:

```ts
new AgentBuilder({ agentName: 'searchAgent', agentVersion: '1' })
  .defineModel('openai:gpt-4o-mini') // defaults: ['text', 'stream']
  .defineModel('openai:gpt-4o-mini-json', { capabilities: ['text', 'stream', 'json'] })
  .defineModel('openai:embeddings', { capabilities: ['embedding'] })
  .defineModel('openai:reranker', { capabilities: ['rerank'] })
```

In handlers:

- `context.models.<alias>` is for text/stream
- `context.models.<alias>.generateJson(...)` is for structured JSON output
- `context.embeddings.<alias>` is for embeddings
- `context.rerankers.<alias>` is for reranking

## Embeddings in practice

Use embedding aliases to build retrieval and semantic similarity pipelines:

```ts
const vector = await context.embeddings['openai:embeddings'].embed({
  value: payload.prompt,
})

const candidates = await context.knowledge.supportFaq.query(payload.prompt, { limit: 8 })
const reranked = await context.rerankers['openai:reranker'].rerank({
  query: payload.prompt,
  documents: candidates.map(candidate => candidate.content),
  topN: 3,
})
```

Recommended split:

- embedding model alias for vector generation
- reranker model alias for precise top-N selection
- text/stream alias for final answer synthesis

## Structured JSON output

Use `generateJson` when your agent needs validated structured data (routing, classification, extraction).

```ts
import { z } from 'zod/v4'

const triageSchema = z.object({
  urgency: z.enum(['low', 'medium', 'high']),
  explanation: z.string().min(1),
})

const result = await context.models['openai:gpt-4o-mini'].generateJson<z.infer<typeof triageSchema>>({
  prompt: `Classify this ticket: ${payload.prompt}`,
  schema: triageSchema,
})
```

If the provider cannot satisfy JSON generation, `getInstance(...)` fails fast when capability declarations require it.

## Thinking / reasoning output

`AiSdkProvider` forwards reasoning text where available:

- `generate(...)` may return `reasoningText`
- `stream(...)` may emit `reasoning-delta`

Forward reasoning to the protocol/UI with:

```ts
context.stream.sendReasoning('model chain-of-thought summary')
```

Reasoning is emitted as protocol artifact frames, so UI consumers can render it separately from assistant text.

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

For structured JSON calls:

```ts
await context.models['openai:gpt-4o-mini'].generateJson({
  prompt: 'Extract SLA fields',
  schema: extractionSchema,
  metadata: {
    aiSdk: {
      generateJson: {
        temperature: 0,
      },
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

## Logging and failures

`@purista/ai` keeps AI logging aligned with standard PURISTA behavior:

- request payloads are **not** logged by default
- provider warnings are logged automatically as structured warn entries (`AI provider returned warnings`)
- provider failures are logged automatically as structured error entries (`AI provider invocation failed`)
- OpenTelemetry correlation stays active through the same trace/span chain used by the rest of the app

This gives you operational visibility without leaking prompt content or tool input bodies by default.
