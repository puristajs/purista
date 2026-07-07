---
title: Model Capabilities
description: Use model aliases, structured output, embeddings, rerank, multimodal input, and provider capabilities in AI agents.
order: 207030
---

# Model capabilities

Model aliases describe what an agent is allowed to do. They are declared on the agent builder and bound to concrete providers when the service starts.

## Capability table

| Capability | Handler method or behavior |
| --- | --- |
| `text` | `context.harness.models.alias.text(...)` |
| `text_stream` | `context.harness.models.alias.textStream(...)` |
| `object` | `context.harness.models.alias.object(...)` and structured harness agent output |
| `object_stream` | `context.harness.models.alias.objectStream(...)` |
| `tool_use` | tool declarations and tool-call messages |
| `vision_input` | image input content parts |
| `audio_input` | audio input content parts |
| `file_input` | file input content parts |
| `embeddings` | `context.harness.models.alias.embed(...)` |
| `rerank` | `context.harness.models.alias.rerank(...)` |

Declare the smallest capability set the handler needs.

```ts
.addModel('primary', {
  model: 'support-fast',
  capabilities: ['object', 'tool_use'],
})
```

Do not declare a capability because a provider brand generally supports it. Declare it only when the concrete adapter, model, and endpoint support it. Startup fails if the runtime provider does not implement the declared capability.

## Runtime binding

```ts
const supportService = await supportV1ServiceBuilder.getInstance(eventBridge, {
  queueBridge,
  ai: {
    models: {
      primary: {
        provider: openAiProvider,
        model: 'gpt-4.1-mini',
        capabilities: ['object', 'tool_use'],
      },
      retrieval: {
        provider: embeddingProvider,
        model: 'text-embedding-3-small',
        capabilities: ['embeddings'],
      },
      ranker: {
        provider: rerankProvider,
        model: 'rerank-v1',
        capabilities: ['rerank'],
      },
    },
  },
})
```

The service definition owns aliases and requirements. The application runtime owns provider instances, credentials, endpoint URLs, and provider options.

## Structured output

Use `object` for structured model output:

```ts
const result = await context.harness.models.primary.object(
  {
    messages: [{
      role: 'user',
      content: context.payload.text,
    }],
    schema: {
      type: 'object',
      properties: {
        priority: { enum: ['low', 'normal', 'high'] },
        reason: { type: 'string' },
      },
      required: ['priority', 'reason'],
    },
    schemaName: 'TicketTriage',
  },
  context.signal,
)

return result.object
```

The agent output schema still validates the final returned value. Provider structured-output schema and PURISTA output schema should describe the same contract from different layers.

## Text

Use `text` for non-structured generation that a deterministic handler will post-process or wrap in a typed output.

```ts
const summary = await context.harness.models.primary.text(
  {
    messages: [{
      role: 'user',
      content: `Summarize this incident:\n${context.payload.incidentText}`,
    }],
  },
  context.signal,
)

return {
  summary: summary.text,
}
```

Avoid parsing free-form text when a structured object would be more reliable.

## Streaming text and objects

`textStream(...)` and `objectStream(...)` return provider chunks to the handler.
Those chunks stay internal by default. When an agent stream endpoint should
forward model chunks to the client, pass `{ emitRunEvents: true }` to that
specific model stream call and still consume the provider chunks in the handler:

```ts
let answer = ''

for await (const chunk of context.harness.models.primary.textStream(
  {
    messages: [{
      role: 'user',
      content: context.payload.question,
    }],
  },
  context.signal,
  { emitRunEvents: true },
)) {
  if (chunk.kind === 'delta') answer += chunk.text
}

return { answer }
```

PURISTA emits provider-style SSE chunks for opted-in model deltas. Use the
generated `stream_id` to aggregate chunks from one model stream invocation and
`agent_id`, `workflow_id`, or `model_alias` for source attribution. Display
labels and client event names belong in your HTTP/SSE adapter.

## Embeddings

Use `embeddings` for retrieval, similarity search, clustering, and deduplication. The vector index is application infrastructure; the model provider only creates vectors.

```ts
const embedding = await context.harness.models.retrieval.embed(
  {
    input: context.payload.question,
    dimensions: 1536,
  },
  context.signal,
)

const hits = await context.resources.vectorIndex.search(
  embedding.embeddings[0].vector,
  { topK: 20 },
)
```

The harness enforces non-empty input and provider method availability. Your application still owns tenant scoping, vector persistence, metadata filtering, and retention.

## Rerank

Use `rerank` to order candidate documents after coarse retrieval.

```ts
const ranked = await context.harness.models.ranker.rerank(
  {
    query: context.payload.question,
    documents: hits.map(hit => ({
      id: hit.id,
      text: hit.text,
      metadata: { source: hit.source },
    })),
    topN: 5,
  },
  context.signal,
)

const evidence = ranked.results.map(result => hits[result.index])
```

The harness validates unique document ids and valid `topN`. Keep retrieval policy and prompt assembly in application code.

## Real-world RAG agent

```ts
const answerAgent = await docsService
  .getAgentQueueBuilder('answerQuestion', 'Answers questions with citations')
  .addPayloadSchema(z.object({
    question: z.string(),
    tenantId: z.string(),
  }))
  .addOutputSchema(z.object({
    answer: z.string(),
    citations: z.array(z.object({
      documentId: z.string(),
      title: z.string(),
      quoteOrSummary: z.string(),
    })),
    confidence: z.enum(['low', 'medium', 'high']),
  }))
  .addModel('retrieval', {
    model: 'text-embedding-3-small',
    capabilities: ['embeddings'],
  })
  .addModel('ranker', {
    model: 'rerank-v1',
    capabilities: ['rerank'],
  })
  .addModel('writer', {
    model: 'gpt-4.1-mini',
    capabilities: ['object'],
  })
  .setRunFunction(async context => {
    const embedding = await context.harness.models.retrieval.embed(
      { input: context.payload.question },
      context.signal,
    )

    const candidates = await context.resources.vectorIndex.search(
      embedding.embeddings[0].vector,
      {
        tenantId: context.payload.tenantId,
        topK: 25,
      },
    )

    const ranked = await context.harness.models.ranker.rerank(
      {
        query: context.payload.question,
        documents: candidates.map(doc => ({
          id: doc.id,
          text: doc.text,
          metadata: { title: doc.title },
        })),
        topN: 5,
      },
      context.signal,
    )

    const evidence = ranked.results.map(hit => candidates[hit.index])

    const answer = await context.harness.models.writer.object(
      {
        messages: [{
          role: 'user',
          content: [
            `Question: ${context.payload.question}`,
            'Evidence:',
            ...evidence.map(doc => `- ${doc.title}: ${doc.text}`),
          ].join('\n'),
        }],
        schema: {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            citations: { type: 'array' },
            confidence: { enum: ['low', 'medium', 'high'] },
          },
          required: ['answer', 'citations', 'confidence'],
        },
      },
      context.signal,
    )

    return answer.object
  })
  .getDefinition()
```

## Multimodal input

Declare `vision_input`, `audio_input`, or `file_input` when model messages include those content parts.

```ts
const extraction = await context.harness.models.vision.object(
  {
    messages: [{
      role: 'user',
      content: [
        { kind: 'text', text: 'Extract the invoice total.' },
        { kind: 'image_url', url: context.payload.invoiceUrl, mimeType: 'image/png' },
      ],
    }],
    schema: invoiceSchemaJson,
    schemaName: 'InvoiceExtraction',
  },
  context.signal,
)
```

The harness does not implicitly upload local files. Application code or provider adapters must convert files into supported content parts.

## Provider options and defaults

Defaults belong in the alias when they are part of the service contract:

```ts
.addModel('writer', {
  model: 'gpt-4.1-mini',
  capabilities: ['object'],
  defaults: {
    temperature: 0.1,
    maxTokens: 2000,
    providerOptions: {
      reasoning_effort: 'low',
    },
  },
})
```

Provider credentials and endpoint-specific options belong in runtime wiring:

```ts
ai: {
  models: {
    writer: {
      provider,
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      providerOptions: {
        serviceTier: 'default',
      },
    },
  },
}
```

## Checklist

- use `object` for validated structured output
- use `embeddings` and `rerank` as explicit retrieval operations
- keep vector storage outside the model provider
- declare multimodal input capabilities before sending content parts
- pass `context.signal` into model calls
- bind provider capabilities truthfully at startup
