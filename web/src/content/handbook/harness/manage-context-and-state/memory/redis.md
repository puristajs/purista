---
title: Use Redis memory
description: Add Redis Search memory with a versioned namespace and optional fixed-dimension vectors.
order: 634
---

Use Redis when a shared claims-review deployment already operates Redis Search
and needs low-latency text recall. It is a separate first-party package; the
adapter includes the official `redis` client as its runtime dependency, so the
application only installs the PURISTA adapter.

## Install and configure

Provision Redis 8+ with Search. Vector commands are required only when you set
the `vector` option. Then install the adapter:

```sh title="Install Redis Search memory support"
npm install @purista/harness-memory-redis
```

```ts title="src/harness/claimsMemory.ts"
import { redisMemoryEngine } from '@purista/harness-memory-redis'

const url = process.env.REDIS_URL
if (!url) {
	throw new Error('REDIS_URL is required to configure Redis memory.')
}

export const claimsMemory = redisMemoryEngine({
	url,
	namespace: 'support:memory:v1',
	vector: { dimensions: 1536 },
})
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`redisMemoryEngine(options)`](/handbook/api/functions/_purista_harness-memory-redis.redisMemoryEngine/) | Creates a Redis Search-backed memory engine. The full [`RedisMemoryEngineOptions`](/handbook/api/interfaces/_purista_harness-memory-redis.RedisMemoryEngineOptions/) describe connection, namespace, and search options. | The engine initializes its versioned index on first use; Redis Search or ACL failure remains an explicit memory operation failure. It never substitutes a local engine. |
| [`url`](/handbook/api/interfaces/_purista_harness-memory-redis.RedisMemoryEngineOptions/#url) or [`client`](/handbook/api/interfaces/_purista_harness-memory-redis.RedisMemoryEngineOptions/#client) | Selects exactly one connection owner. `url` lets the engine connect and close its own node-redis client; `client` reuses an application-owned client. | Do not supply both. Use `client` when application lifecycle, TLS, or telemetry owns the connection; the engine then neither connects nor closes it. |
| [`namespace`](/handbook/api/interfaces/_purista_harness-memory-redis.RedisMemoryEngineOptions/#namespace) | Prefixes the engine's versioned records and search index. | Treat it as an immutable schema boundary. A new descriptor or embedding representation needs a new namespace plus reindex, not an in-place index mutation. |
| [`vector`](/handbook/api/interfaces/_purista_harness-memory-redis.RedisMemoryEngineOptions/#vector) | Enables the vector/hybrid index and fixes its dimensions. | Omit it for text-only recall. Enable it only after Redis Search vector support and an embedding contract are ready; dimensions cannot change in place. |

Pass `claimsMemory` to `.memory(claimsMemory)` in the complete Harness
definition shown in [SQLite memory](/handbook/harness/manage-context-and-state/memory/sqlite/).
[`redisMemoryEngine`](/handbook/api/functions/_purista_harness-memory-redis.redisMemoryEngine/)
accepts the factory options documented by
[`RedisMemoryEngineOptions`](/handbook/api/interfaces/_purista_harness-memory-redis.RedisMemoryEngineOptions/).
Text search and TTL are supported without `vector`; vectors are enabled only by
that option. If the application owns the node-redis lifecycle, pass `client`
instead of `url`; the adapter then neither connects nor closes it.

The adapter owns atomic record/index writes in its namespace, but does not drop
or migrate an existing index. Treat namespace and dimensions as immutable:
create `support:memory:v2` and reindex for a schema or embedding change. Test
Search availability, ACLs, TTL, index initialization, failed Redis calls, and
restore from the operational backup path.
