---
title: Retrieval & RAG
description: Model retrieval as normal PURISTA resources and commands instead of a framework-owned knowledge subsystem.
order: 299907
---

# AI Retrieval & RAG (Advanced View)

This page is the advanced follow-up to [Memory & Retrieval](../agent/memory-and-retrieval.md).

The key advanced idea is simple:

> Retrieval is application infrastructure, not a hidden AI framework feature.

That is why PURISTA models retrieval through:

- resources
- commands
- normal runtime injection

## A Good Retrieval Architecture

### 1. Put the retrieval backend behind a resource

```ts
const docs = await context.resources.supportFaq.search({
  query: payload.prompt,
  limit: 3,
  tenantId: context.service.tenantId,
  principalId: context.service.principalId,
})
```

That resource might wrap:

- a vector database
- a keyword search engine
- a hybrid search layer
- a domain-specific document service

### 2. Build prompt context explicitly

```ts
const prompt = [
  payload.prompt,
  '',
  'Relevant documents:',
  ...docs.map(doc => `- ${doc.title}: ${doc.content}`),
].join('\n')
```

### 3. If the model must call retrieval dynamically, expose it as a command

That keeps retrieval inside the same execution, tracing, and allowlist model as other tools.

## Multi-Tenant Scoping

Scoping belongs in the resource or command contract, not in hidden framework behavior.

```ts
async search(input: {
  query: string
  limit: number
  tenantId?: string
  principalId?: string
}) {
  return await this.vectorDb.search(input.query, {
    limit: input.limit,
    filter: {
      tenantId: input.tenantId,
      principalId: input.principalId,
    },
  })
}
```

That keeps ownership, authorization, and filtering explicit.

## A Useful Retrieval Lifecycle

Think in these stages:

1. ingestion
2. retrieval
3. prompt construction or tool exposure

That lifecycle is clearer than thinking in terms of a vague “knowledge layer”.

## Where Skills Fit

Skills are not the same thing as retrieval.

- retrieval gives you external facts or documents
- skills give you reusable instructions and workflow guidance

They can both be loaded through resources, but they solve different problems.

## Advanced Patterns

Use more complex resource implementations when needed:

- chunking and metadata extraction
- hybrid search
- embedding selection
- reranking
- catalog overlays for document sources

But keep the integration shape the same:

- runtime resource
- explicit query
- explicit prompt construction or command exposure

## Anti-Patterns

- Reintroducing a hidden framework-owned knowledge subsystem.
- Auto-injecting retrieved text without the handler owning the prompt composition.
- Mixing retrieval, chat history, and durable run state into one abstraction.

## Related Guides

- [Memory & Retrieval](../agent/memory-and-retrieval.md)
- [Runtime](../agent/runtime.md)
- [Skills](../agent/skills.md)
