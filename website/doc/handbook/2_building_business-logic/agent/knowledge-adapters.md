---
title: Knowledge Adapters
description: Connect RAG/document sources to agents and choose adapter options with clear trade-offs.
order: 203705
---

# Knowledge Adapters

Knowledge adapters connect agents to external context sources (FAQ, docs, catalogs, vector indexes).

## Why use knowledge adapters

- keep prompts grounded in current domain data
- share context across multiple agents
- separate retrieval concerns from model-generation logic

## Minimal pattern

```ts
new AgentBuilder({ ... })
  .defineModel('openai:gpt-4o-mini')
  .useKnowledgeAdapter({ adapterName: 'supportFaq', options: { locale: 'en-US' } })
  .setHandler(async context => {
    const docs = await context.knowledge.query('supportFaq', context.payload.prompt, 5)
    const contextBlock = docs.map(doc => `• ${doc.title}: ${doc.body}`).join('\n')

    const { output } = await context.models['openai:gpt-4o-mini'].generate({
      prompt: `${context.payload.prompt}\n\nContext:\n${contextBlock}`,
    })

    return { message: output }
  })
```

## Options reference

| Option | Purpose | Typical example |
| --- | --- | --- |
| `adapterName` | lookup alias used in handler | `supportFaq`, `productCatalog`, `roadmap` |
| `options` | adapter-specific configuration | `{ locale: 'en-US', topK: 5 }` |

## Runtime wiring

Provide adapters in `getInstance(..., { knowledgeAdapters })`.

- default adapter is in-memory (good for local/dev)
- production usually uses Redis/PGVector/DB-backed adapters
- alias names should match what builder/handler use

## Design guidance

| Choice | Pros | Cons | Use when |
| --- | --- | --- | --- |
| single shared adapter | simple ops and reuse | weaker domain isolation | small/medium app with common corpus |
| domain-specific adapters | tighter relevance and ownership | more config/ops overhead | larger app with distinct domains |
| high `topK` | more context recall | more token usage/noise risk | broad discovery questions |
| low `topK` | concise prompt | may miss edge facts | latency/cost-sensitive routes |

## Shared knowledge between agents

Multiple agents can point to the same adapter instance.  
For agent-specific behavior, pass options in builder config and branch in adapter logic.

## Current and future DX

Current handler API:

```ts
await context.knowledge.query('supportFaq', query, 5)
```

Planned DX improvement (tracked in spec backlog):

```ts
await context.knowledge.supportFaq.query(query, 5)
```
