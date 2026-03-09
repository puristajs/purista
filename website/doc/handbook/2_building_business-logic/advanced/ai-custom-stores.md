---
title: Custom AI Stores
description: Implementing custom Conversation Stores and Knowledge Adapters.
order: 299905
---

# Custom AI Stores & Adapters

PURISTA provides abstract interfaces for memory and knowledge, allowing you to plug in any storage engine (Redis, PostgreSQL, Pinecone, etc.).

## 1. Custom Conversation Store

A `ConversationStore` is responsible for persisting the chat transcript. To build your own, implement the `ConversationStore` interface.

```ts
import { ConversationStore, ConversationStoreRecord } from '@purista/ai'

export class MyCustomStore implements ConversationStore {
  async load(conversationId: string): Promise<ConversationStoreRecord | undefined> {
    // 1. Fetch from your database
  }

  async save(record: ConversationStoreRecord): Promise<void> {
    // 2. Persist to your database
  }

  async delete(conversationId: string): Promise<void> {
    // 3. Cleanup
  }
}
```

## 2. Custom Knowledge Adapter

A `KnowledgeAdapter` handles document retrieval (RAG). It must support multi-tenant scoping.

```ts
import { KnowledgeAdapter, KnowledgeQueryRequest, KnowledgeDocument } from '@purista/ai'

export class MyVectorStoreAdapter implements KnowledgeAdapter {
  async query(request: KnowledgeQueryRequest): Promise<KnowledgeDocument[]> {
    const { query, limit, scope } = request
    // 1. Filter by scope (tenantId, principalId, sessionId)
    // 2. Perform vector search
    // 3. Return top-N documents
  }

  async upsert(request: KnowledgeUpsertRequest): Promise<void> {
    // 4. Ingest new knowledge with correct scope
  }
}
```

## 3. Why the interface pattern?

By following the interface pattern:
- Your business logic (agent handler) remains independent of the storage engine.
- You can switch from an in-memory test store to a production-grade database with a single line of code in your bootstrap.
- PURISTA handles the complex metadata forwarding (tenancy, tracing) automatically before calling your adapter.
