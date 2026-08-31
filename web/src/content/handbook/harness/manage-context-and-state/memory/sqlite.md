---
title: Use SQLite memory
description: Persist one application's scoped memory on a single host, with FTS5 text search and an explicit vector-search opt-in.
order: 632
---

Use SQLite when a claims-review service runs as one durable local process and
must remember a claim between restarts. It keeps the memory file beside the
application; it is not a shared database for multiple application instances.

## Enable durable local memory

SQLite memory is a separate first-party runtime package. Core otherwise uses
ephemeral in-memory memory. Install it in the application, before importing it:

```bash title="Install SQLite memory for the application"
npm install @purista/harness-memory-sqlite
```

Create the Harness at the composition root. This complete example uses a model
that is deliberately never called, so you can verify persistence without model
credentials. Replace `noop` with the model configuration from [configure the
runtime](/handbook/harness/configure-the-runtime/) when an agent also needs to
run.

```ts title="src/harness/claimsReview.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { sqliteMemoryEngine } from '@purista/harness-memory-sqlite'

export const claimsReviewHarness = defineHarness({ name: 'claims-review' })
	.sandbox(inMemorySandbox())
	.memory(sqliteMemoryEngine({ file: '.purista/claims-memory.sqlite' }))
	.models({
		noop: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: [] },
	})
	.build()
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts the named application composition that owns its sessions and memory facade. | The name defaults to `agent-harness`; it is diagnostic identity, not a memory namespace or tenant boundary. |
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Explicitly selects the files-and-bounded-search adapter returned by [`inMemorySandbox()`](/handbook/api/functions/_purista_harness.inMemorySandbox/). | The factory has no options and provides `sandbox.fs` plus `sandbox.text_search`; it is not where this SQLite file is persisted. The memory engine owns the SQLite path, while this sandbox remains ephemeral and cannot execute commands or provide tenant isolation. |
| [`sqliteMemoryEngine(options)`](/handbook/api/functions/_purista_harness-memory-sqlite.sqliteMemoryEngine/) | Opens one SQLite-backed memory engine. [`file`](/handbook/api/interfaces/_purista_harness-memory-sqlite.SqliteMemoryEngineOptions/#file) is required; its parent directory is created when the engine opens. | Use one durable, deployment-controlled file for a single-host process. An empty path, unavailable built-in SQLite driver, missing FTS5, or incompatible existing schema fails construction; the engine never falls back to in-memory memory. |
| [`.memory(engine)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#memory) | Registers the one engine used by every session memory facade. | The direct engine form has no model dependency. A second `.memory(...)` call is invalid. Choose it before `.build()`; changing it while sessions are running is not a migration mechanism. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Supplies the non-empty registry that every built Harness requires. | `noop` has no capabilities and no agent consumes it, so this persistence check makes no provider call. Add a real alias only when an agent or embedding configuration needs it. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the full composition and returns the session API. | It fails for a missing model registry or invalid shared definitions; it does not open a model connection merely because `noop` is registered. |
| `vector: true` | Opts into the overload that advertises vector and hybrid search capabilities. | Only enable it after installing the pinned `sqlite-vec` peer and verifying the Node/Bun extension policy. Without it, vector writes/searches fail explicitly rather than degrading to text search. |

[`memory(engine)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#memory)
registers one memory engine for the Harness; a second call fails configuration.
The `file` option selects the application-owned SQLite path. It is relative to
the process working directory in this example, so use an absolute,
deployment-controlled path when the working directory is not stable. The
persistence verification has no tool or agent consumer. It includes the inert
`noop` model alias only because `.build()` requires a non-empty model registry.

The adapter uses the SQLite implementation built into supported Node.js and
Bun runtimes. Key/value records, lists, TTL, and FTS5 text search need no
third-party runtime package. Ensure the process can create `.purista/`, back up
the file, and keep it on durable storage; a container's writable layer is not
a backup strategy.

## Verify a scoped record survives application code

Use the identity that the application has already authenticated. The
[`SessionOptions`](/handbook/api/types/_purista_harness.SessionOptions/) object
places tenant and principal dimensions under `identity`; they bind the session,
so later [`getSession`](/handbook/api/interfaces/_purista_harness.Harness/#getsession)
calls cannot accidentally reopen it with a different identity.

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

console.log(await session.memory.read('claim-status'))
await claimsReviewHarness.shutdown()
```

```text title="Expected local verification output"
{ status: 'documents-requested' }
```

Restart the process and run the same read before writing to prove the file is
durable. Do not treat session identity as authorization: enforce tenant and
principal access before calling `getSession`.

## Add exact vector search only when needed

FTS5 text search is available after the base SQLite setup. Exact vector and
hybrid search are an explicit, native peer dependency. Enable them only when
you have an embedding configuration and need semantic recall; this changes the
runtime and container boundary.

```bash title="Install the SQLite vector-search peer"
npm install sqlite-vec@0.1.9
```

```ts title="src/harness/claimsReview.ts"
const memory = sqliteMemoryEngine({
	file: '.purista/claims-memory.sqlite',
	vector: true,
})
```

[`vector`](/handbook/api/interfaces/_purista_harness-memory-sqlite.SqliteMemoryEngineOptions/#vector)
defaults to `false`. It changes the engine capability contract at construction;
it is not a per-query switch. The first written vector fixes its descriptor and
dimension for that file, so rebuild and reindex a new file for a changed
embedding representation.

Pass `memory` to `.memory(memory)` in the complete definition above. The first
stored vector fixes the descriptor and dimensions for that database. For an
embedding-model or dimension change, create a new database file, reindex the
records, verify the new search path, then retire the old file. Missing
`sqlite-vec` or blocked native-extension loading raises `HarnessConfigError`;
Harness never silently falls back to text search. Bun on macOS may require an
extension-capable custom SQLite build.

Choose [PostgreSQL memory](/handbook/harness/manage-context-and-state/memory/postgres/)
instead when several instances need the same records. See [select a memory
backend](/handbook/harness/manage-context-and-state/memory/) for the remaining
trade-offs.
