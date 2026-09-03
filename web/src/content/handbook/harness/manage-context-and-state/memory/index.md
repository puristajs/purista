---
title: Select a memory backend
description: Enable only the scoped memory capabilities and operational service your application needs.
order: 630
---

Memory is scoped application state for information an agent or workflow must
recall later; it is not the execution store, authorization system, or audit
archive. In a claims-review service, use it for the current claim status and
approved facts—not the source-of-record policy decision.

Core defaults to an in-memory key/value engine. It supports key/value, list,
delete, and TTL for one process; it is neither persistent nor searchable.
Choose a backend based on query needs and operating model.

| Backend | Install | Best fit | Search |
| --- | --- | --- | --- |
| [In-memory](/handbook/harness/manage-context-and-state/memory/in-memory/) | Core only | Tests and ephemeral local runs | No |
| [SQLite](/handbook/harness/manage-context-and-state/memory/sqlite/) | `@purista/harness-memory-sqlite` | Local/single-host state | Text; vector opt-in |
| [PostgreSQL](/handbook/harness/manage-context-and-state/memory/postgres/) | `@purista/harness-memory-postgres` | Shared relational operations | Text, vector, hybrid |
| [Redis](/handbook/harness/manage-context-and-state/memory/redis/) | `@purista/harness-memory-redis` | Redis Search operations | Text; vector opt-in |
| [NATS](/handbook/harness/manage-context-and-state/memory/nats/) | `@purista/harness-memory-nats` | JetStream KV coordination | No |
| [Custom engine](/handbook/harness/manage-context-and-state/memory/custom-memory-engine/) | Application-owned package | Existing database or platform contract | Capabilities implemented and verified by the application |

The selected adapter creates an engine value, then the complete Harness
definition passes it to `.memory(memory)`. For a runnable local path, start
with [SQLite memory](/handbook/harness/manage-context-and-state/memory/sqlite/).
Once the Harness is configured, application code reads and writes through a
session rather than calling a database client directly:

```ts title="src/claims/rememberClaimStatus.ts"
import { claimsReviewHarness } from '../harness/claimsReview.js'

const session = await claimsReviewHarness.getSession('claim:example', {
	identity: {
		tenantId: 'demo',
		principalId: 'claims-handler',
	},
})

await session.memory.write(
	'claim-status',
	{ status: 'documents-requested' },
	{
		tags: ['claim'],
		ttlMs: 3_600_000,
	},
)

const claimStatus = await session.memory.read('claim-status')
```

| Call or field | What it does | Boundary |
| --- | --- | --- |
| [`harness.getSession(id, options)`](/handbook/api/interfaces/_purista_harness.Harness/#getsession) | Opens/binds a Harness session. `identity` is part of the existing session binding, not arbitrary request metadata. | Authenticate and authorize the tenant/principal before this call. A mismatched or omitted bound identity fails before memory I/O; it does not prove the caller may access that tenant. |
| [`session.memory.write(key, value, options)`](/handbook/api/interfaces/_purista_harness.SessionMemory/#write) | Writes one JSON-compatible record in the session scope. Optional `tags`, `metadata`, `index: { text }`, and `ttlMs` select indexed/searchable data where the installed engine supports them. A configured embedding model derives vectors from the indexed text. | Keep values small and application-approved. `ttlMs` controls expiry visibility, not immediate physical deletion; persistent adapters must still have a deletion/backup policy. |
| [`session.memory.read(key)`](/handbook/api/interfaces/_purista_harness.SessionMemory/#read) | Reads a record from the same derived scope, returning `undefined` when it is absent or expired. | Use explicit application fallback behaviour for a missing record. Do not infer a record's authorization from its existence. |
| [`session.memory.delete(key)`](/handbook/api/interfaces/_purista_harness.SessionMemory/#delete) | Deletes one key from the selected scope. | Treat a successful call as removal from the live engine. Backups, replicas, and audit retention remain adapter/platform concerns. |
| [`session.memory.list(options)`](/handbook/api/interfaces/_purista_harness.SessionMemory/#list) | Lists entry metadata with optional `prefix`, `limit`, and opaque `cursor`; values are deliberately omitted. | Follow the returned cursor and keep limits bounded. Listing is not text or semantic search. |
| [`session.memory.search(query)`](/handbook/api/interfaces/_purista_harness.SessionMemory/#search) | Runs `text`, `semantic`, or `hybrid` recall with a bounded limit, cursor, tags, metadata, and timestamp filters. | The selected engine must advertise the requested search capability. Semantic/hybrid search also requires an embedding model and compatible index descriptor. Unsupported modes fail explicitly. |

Select namespace, tenant scope, TTL, and access policy before storing data.
Changing a vector descriptor or data interpretation is a migration: version the
namespace/schema and reindex; do not silently reuse incompatible records.

## Register the engine and optional model orchestration

[`HarnessBuilder.memory(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#memory)
accepts one of three shapes. Call it once; a second registration fails with a
duplicate-adapter configuration error.

| Shape | Use it when | Validation and runtime effect |
| --- | --- | --- |
| `memory(engine)` | The application needs the engine's native key/value, TTL, list, delete, or text-search behavior only. | Harness validates the engine descriptor and advertised capabilities, then binds scoped `SessionMemory` facades. |
| `memory({ engine, embedding })` | Semantic or hybrid recall needs vectors from a registered model alias. | `embedding` must reference an alias declaring `embeddings`, and the engine must advertise `memory.vector_search`. The index descriptor pins alias, provider, model, dimensions, distance, and extractor revision. |
| `memory(model => ({ engine, embedding: model.embedding, summary: ... }))` | The configuration should retain literal model-alias inference for embeddings or conversation summaries. | The callback receives frozen configuration references, not live provider handles. A summary model needs `object`; invalid references fail during composition. |

Omitting `.memory(...)` selects `inMemoryMemoryEngine()` for process-local
key/value use. That default is convenient for tests, but it does not silently
provide persistence, multi-instance coordination, or search. Use
[`MemoryEngine`](/handbook/api/interfaces/_purista_harness.MemoryEngine/),
[`MemoryConfiguration`](/handbook/api/interfaces/_purista_harness.MemoryConfiguration/),
and [`MemoryCapability`](/handbook/api/types/_purista_harness.MemoryCapability/)
as the exact adapter contract.

## Bind memory scope to session identity

Open a session with the tenant and principal dimensions that your application
has already authenticated. [`Harness.getSession`](/handbook/api/interfaces/_purista_harness.Harness/#getsession)
accepts a [`SessionOptions`](/handbook/api/types/_purista_harness.SessionOptions/)
object; put those dimensions inside its
[`identity`](/handbook/api/interfaces/_purista_harness.HarnessIdentity/) field.
Their presence and values remain part of that session's identity; changing or
omitting a previously bound dimension fails before memory or other run
resources are opened.

```ts title="src/claims/openClaimSession.ts"
const session = await harness.getSession('claim:example', {
	identity: {
		tenantId: 'demo',
		principalId: 'claims-handler',
	},
})
```

Within a run, `ctx.memory.application`, `.session`, `.run`, `.agent`,
`.tenant()`, and `.principal()` select a lifetime/scope. Missing tenant or
principal identity fails before engine I/O. This prevents accidental namespace
mixing; application authorization remains a separate responsibility.

If an existing data platform must provide these operations, follow
[build a custom memory engine](./custom-memory-engine/).
