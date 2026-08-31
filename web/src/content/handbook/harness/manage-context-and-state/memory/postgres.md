---
title: Use PostgreSQL memory
description: Add multi-instance memory with PostgreSQL full-text, vector, and hybrid search.
order: 633
---

Use PostgreSQL when several claims-review workers need the same memory and your
team already operates PostgreSQL. The adapter owns its versioned schema and
uses PostgreSQL full-text plus `pgvector`; it is not a shortcut around database
access control or backups.

## Install and provision

Provision PostgreSQL 16+ with the `vector` extension, give the application a
least-privilege database role, then install the runtime adapter:

```sh title="Install the PostgreSQL memory adapter"
npm install @purista/harness-memory-postgres
```

```ts title="src/harness/claimsMemory.ts"
import { postgresMemoryEngine } from '@purista/harness-memory-postgres'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is required to configure PostgreSQL memory.')
}

export const claimsMemory = postgresMemoryEngine({
	connectionString,
})
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`postgresMemoryEngine(options)`](/handbook/api/functions/_purista_harness-memory-postgres.postgresMemoryEngine/) | Creates a PostgreSQL 16+ memory engine with key/value, TTL, text, vector, and hybrid capabilities. | It lazily applies the package migration before the first memory operation. Provision `pgvector`, connectivity, and the database role before readiness; an unavailable extension or migration failure is not a local-memory fallback. |
| [`connectionString`](/handbook/api/interfaces/_purista_harness-memory-postgres.PostgresMemoryEngineOptions/#connectionstring) | Lets the engine create and own a `pg` pool. | Supply this for normal application-owned connection configuration. The engine closes only this pool on Harness shutdown. |
| [`pool`](/handbook/api/interfaces/_purista_harness-memory-postgres.PostgresMemoryEngineOptions/#pool) | Reuses one application-owned `pg` pool. | Choose it when the application shares connection lifecycle or instrumentation. Provide exactly one of `pool` or `connectionString`; both or neither produce `HarnessConfigError`. |

Import `claimsMemory` into `src/harness/claimsReview.ts` and pass it to
`.memory(claimsMemory)` in the complete Harness definition shown in [SQLite
memory](/handbook/harness/manage-context-and-state/memory/sqlite/). Alternatively
pass one application-owned `pg` pool; choose exactly one connection mode. An
injected pool stays application-owned and is never closed by the engine. On
first use the adapter applies its versioned schema and verifies `pgvector`, so
make database connectivity and extension provisioning part of deployment
readiness.

It supports durable multi-instance scoped key/value, TTL, full-text, vector,
and hybrid retrieval. The first vector fixes dimensions and its descriptor.
For a changed embedding model or schema, create a new schema/database and
reindex rather than mutating old records in place. Verify the role can create
the initial schema in a clean environment, then test failed initialization,
concurrent instances, backup restore, and tenant scoping before production.
