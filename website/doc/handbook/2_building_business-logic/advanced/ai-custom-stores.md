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
import {
  ConversationStore,
  ConversationStoreRecord,
  type ConversationStoreScope,
} from '@purista/ai'

export class MyCustomStore implements ConversationStore {
  async load(
    conversationId: string,
    scope?: ConversationStoreScope,
  ): Promise<ConversationStoreRecord | undefined> {
    // 1. conversationId is the logical session id, for example "chat-42"
    // 2. scope carries tenant/principal/agent isolation metadata
  }

  async save(record: ConversationStoreRecord, scope?: ConversationStoreScope): Promise<void> {
    // 3. Persist using record.conversationId + scope as your compound key
  }

  async delete(conversationId: string, scope?: ConversationStoreScope): Promise<void> {
    // 4. Cleanup using the same logical id + scope
  }
}
```

Important:
- `conversationId` is no longer pre-scoped by the runtime. It is the raw logical conversation/session id.
- The runtime passes isolation metadata in `scope`, currently `tenantId`, `principalId`, `agentName`, and `agentVersion`.
- Custom stores should either use that full scope as part of their compound key or ignore only the fields they intentionally do not support.

## 2. Custom Knowledge Adapter

A `KnowledgeAdapter` handles document retrieval (RAG). It must support multi-tenant scoping.

```ts
import { KnowledgeAdapter, KnowledgeQueryRequest, KnowledgeDocument } from '@purista/ai'

export class MyVectorStoreAdapter implements KnowledgeAdapter {
  async query(request: KnowledgeQueryRequest): Promise<KnowledgeDocument[]> {
    const { query, limit, scope } = request
    // 1. Filter by scope (tenantId, principalId, agentName, agentVersion, sessionId)
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
- PURISTA handles the scope metadata forwarding automatically before calling your store or adapter.
