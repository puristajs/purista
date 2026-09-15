---
title: Persist Harness state in PostgreSQL
description: Use the PostgreSQL storage adapter for replicated session, run, step, and wait state.
order: 645
---

Install the separate storage package and run its migrations with the
application-owned database authority.

```sh title="Postgresql Harness Storage example 1"
npm install @purista/harness-storage-postgres pg
```
Bind the adapter at instance creation:

```ts title="Postgresql Harness Storage example 3"
import { defineHarness } from '@purista/harness'
import { createPostgresHarnessStorage } from '@purista/harness-storage-postgres'

const storage = createPostgresHarnessStorage({ connectionString: process.env.DATABASE_URL })
const definition = defineHarness({ name: 'support' }).addWorkflow(workflow)
const harness = await definition.getInstance({ storage, models })
```
PostgreSQL storage owns Harness control state only. It does not replace a
business database, memory engine, or durable workspace. Pair it with a
compatible workspace for file-bearing workflows and configure a sandbox with
only the capabilities the workflow needs.

Verify migrations, concurrent leases, idempotent step commits, restart,
transaction failures, cancellation, cleanup, and least-privilege credentials.
Run the shared storage contract suite before claiming adapter conformance.
