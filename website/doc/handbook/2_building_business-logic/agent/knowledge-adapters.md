---
title: Knowledge Adapters
description: Use retrieval backends for RAG with tenant-aware isolation and custom adapter implementations.
order: 203705
---

# Knowledge Adapters

Knowledge adapters connect an agent to searchable domain knowledge (FAQ, policy docs, product catalog, runbooks, vector stores).

Use them when prompts alone are not enough and answers must be grounded in data you control.

## Quick start

```ts
const supportAgent = new AgentBuilder({
  agentName: 'supportAgent',
  agentVersion: '1',
})
  .defineModel('openai:')
  .useKnowledgeAdapter('supportFaq', { locale: 'en-US' })
  .setHandler(async (context, payload) => {
    const docs = await context.knowledge.supportFaq.query(payload.prompt, { limit: 3 })
    const contextBlock = docs.map(doc => `- ${doc.content}`).join('\n')

    const result = await context.models['openai:'].generate({
      prompt: `${payload.prompt}\n\nContext:\n${contextBlock}`,
    })

    context.stream.sendFinal(result.output)
    return { message: result.output }
  })
  .build()
```

At runtime, provide the actual adapter instance:

```ts
await supportAgent.getInstance(eventBridge, {
  models: { 'openai:': provider },
  knowledgeAdapters: {
    supportFaq: new InMemoryKnowledgeAdapter(),
  },
})
```

## Handler API

You can call adapters in two styles:

```ts
await context.knowledge.query('supportFaq', 'reset password', 5)
await context.knowledge.supportFaq.query('reset password', { limit: 5 })
```

You can also write/delete documents from handler logic:

```ts
await context.knowledge.supportFaq.upsert({
  id: 'faq-123',
  content: 'To reset a password, open Settings > Security.',
  metadata: { source: 'kb', locale: 'en-US' },
})

await context.knowledge.supportFaq.delete('faq-123')
```

## Tenant and principal isolation

Every query/upsert/delete automatically gets a scope from the current PURISTA message:

- `tenantId`
- `principalId`
- `agentName`
- `agentVersion`
- `sessionId`

This means your custom adapter can isolate knowledge by tenant/user without extra handler code.

Also, `useKnowledgeAdapter('alias', options)` is passed as `options` on adapter operations, so adapter-specific settings stay in definition code while storage topology stays runtime-configurable.

## Practical patterns

### 1) Shared global knowledge + tenant overrides

- Store global docs without scope.
- Store tenant docs with `tenantId`.
- Query returns both global and matching tenant docs.

Use this for SaaS support bots with common docs and customer-specific policy pages.

### 2) Domain-separated adapters

```ts
.useKnowledgeAdapter('supportFaq')
.useKnowledgeAdapter('billingPolicy')
```

Use dedicated adapters per domain when data ownership and refresh cycles differ.

### 3) Background enrichment

When events arrive (e.g. “new article published”), a subscription can invoke an agent that calls `context.knowledge.<alias>.upsert(...)` to keep retrieval fresh.

## Implement a custom knowledge adapter

Create your own adapter by implementing `KnowledgeAdapter`.

```ts
import type {
  KnowledgeAdapter,
  KnowledgeDeleteRequest,
  KnowledgeDocument,
  KnowledgeQueryRequest,
  KnowledgeUpsertRequest,
} from '@purista/ai'

type VectorRecord = {
  id: string
  content: string
  metadata?: Record<string, unknown>
}

export class PgVectorKnowledgeAdapter implements KnowledgeAdapter {
  readonly id = 'pgvector'

  constructor(private readonly client: { /* your db client */ }) {}

  async upsert(request: KnowledgeUpsertRequest) {
    const row: VectorRecord = request.document
    // Store scope columns (tenantId/principalId/agentName/agentVersion) for isolation.
    // Store request.options (for example index/namespace overrides) if needed.
    void row
  }

  async query(request: KnowledgeQueryRequest): Promise<KnowledgeDocument[]> {
    // Run semantic/fulltext query with request.query + request.limit.
    // Apply request.scope tenant/principal filters.
    // Optionally use request.filters + request.options for adapter-specific behavior.
    return []
  }

  async delete(request: KnowledgeDeleteRequest) {
    // Delete by id; optionally enforce same scope.
    void request
  }
}
```

Recommended minimum behavior:

- enforce tenant isolation when `scope.tenantId` is present
- cap `limit` to a safe upper bound
- log/debug query latency and hit count
- return stable `id` values so downstream artifact linking stays deterministic

## Troubleshooting

- `Knowledge adapter <name> not registered`: alias exists in builder but missing in runtime `knowledgeAdapters`.
- empty retrieval results: validate tenant/principal scope filters in your adapter first.
- noisy prompts: reduce `limit`, add adapter-side filtering, or split one adapter into domain adapters.
