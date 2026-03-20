---
title: Retrieval & RAG
description: How to model retrieval, vector stores, and skill bundles without a framework-owned knowledge API.
order: 299907
---

# AI Retrieval & RAG (Advanced View)

Retrieval-Augmented Generation (RAG) is a technique for grounding an LLM's answers in your specific data. In PURISTA, retrieval is modeled as normal application infrastructure, not as a special framework-owned knowledge adapter.

## 1. The Retrieval Architecture

Use resources for your retrieval systems:

```ts
const docs = await context.resources.supportFaq.search({
  query: payload.prompt,
  limit: 3,
  tenantId: context.service.tenantId,
  principalId: context.service.principalId,
})
```

That resource can wrap a vector database, document index, search engine, or skill bundle registry. If retrieval must be model-invocable, expose it through an allowlisted PURISTA command and then hand that command to an external tool loop.

## 2. Multi-tenant Scoping

Scoping is still important, but it is now owned by your resource or command contract instead of hidden in framework magic.

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

## 3. Retrieval Lifecycle

Retrieval is typically managed in three stages:
1. **Ingestion**: Add documents to the backing store through a resource, command, or ingestion workflow.
2. **Retrieval**: Query documents in the handler through `context.resources` or an allowlisted command/tool.
3. **Context Injection**: Combining the retrieved documents with the user prompt before calling the model.

## 4. Advanced Resource Patterns

For complex data sources, you can implement resources that:
- Pre-process documents (e.g., chunking, metadata extraction).
- Use specific embedding models.
- Handle fallback or hybrid search (vector + keyword).
 - Resolve skill bundles or framework guidance documents for planning agents.

See the **[Custom AI Stores](./ai-custom-stores.md)** section for conversation persistence patterns and custom retrieval resource examples.
