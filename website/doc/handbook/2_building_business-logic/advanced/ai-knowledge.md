---
title: Knowledge & RAG
description: Deep dive into the vector stores, document adapters and multi-tenant scoping.
order: 299907
---

# AI Knowledge & RAG (Advanced View)

Retrieval-Augmented Generation (RAG) is a technique for grounding an LLM's answers in your specific data. PURISTA's `KnowledgeAdapter` system is designed to handle this while respecting multi-tenancy and security.

## 1. The Knowledge Architecture

In PURISTA, knowledge is not just a vector database. It is a system that automatically handles **scoping**.

When you query knowledge in a handler:
```ts
const docs = await context.knowledge.supportFaq.query(payload.prompt, 3)
```
The query is automatically scoped by:
- `tenantId` (Multi-tenancy separation)
- `principalId` (User separation)
- `agentName` and `agentVersion` (Agent-level separation)
- `sessionId` (Conversation separation)

This ensures that one user's private data is never "leaked" to another user's LLM prompt.

## 2. Multi-tenant Scoping

The scope is automatically resolved by the agent runtime before calling the adapter. This means your adapter implementation can focus on the storage-specific filtering logic:

```ts
async query(request: KnowledgeQueryRequest): Promise<KnowledgeDocument[]> {
  const { query, limit, scope } = request
  // scope contains tenantId, principalId, agentName, agentVersion, sessionId
  return this.vectorDb.search(query, {
    limit,
    filter: {
      tenantId: scope.tenantId,
      principalId: scope.principalId,
      agentName: scope.agentName,
      agentVersion: scope.agentVersion,
      sessionId: scope.sessionId,
    }
  })
}
```

## 3. Knowledge Lifecycle

Knowledge is typically managed in three stages:
1. **Ingestion**: Adding new documents to the store via `context.knowledge.<alias>.upsert()`.
2. **Retrieval**: Querying documents in the agent handler via `context.knowledge.<alias>.query()`.
3. **Context Injection**: Combining the retrieved documents with the user prompt before calling the model.

## 4. Advanced Adapter Patterns

For complex data sources, you can implement custom adapters that:
- Pre-process documents (e.g., chunking, metadata extraction).
- Use specific embedding models.
- Handle fallback or hybrid search (vector + keyword).

See the **[Custom AI Stores](./ai-custom-stores.md)** section for implementation details.
