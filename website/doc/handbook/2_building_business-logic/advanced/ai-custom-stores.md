---
title: Custom AI Stores
description: Implementing custom conversation stores and resource-backed retrieval systems.
order: 299905
---

# Custom AI Stores & Retrieval Resources

PURISTA provides a conversation-store interface for memory, and uses normal resources for retrieval infrastructure such as vector stores, search indexes, and skill registries.

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

## 2. Custom Retrieval Resource

Retrieval stays application-owned. Build a normal resource for it and inject it at runtime.

```ts
export class SupportFaqResource {
  constructor(private readonly vectorDb: VectorDbClient) {}

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

  async upsert(input: {
    id: string
    content: string
    tenantId?: string
    principalId?: string
  }) {
    await this.vectorDb.upsert(input)
  }
}
```

## 3. Why the interface pattern?

By following the resource pattern:
- Your business logic (agent handler) remains independent of the storage engine.
- You can switch from an in-memory test store to a production-grade database with a single line of code in your bootstrap.
- Authorization, tenant scoping, and retrieval behavior stay explicit in your own contract.
