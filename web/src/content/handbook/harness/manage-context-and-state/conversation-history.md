---
title: Manage conversation history
description: Keep session history, memory, and business records separate and apply an explicit retention policy.
order: 610
---

A `HarnessSession` owns conversation history and run records for one stable
application session ID. It is separate from `MemoryEngine`, which stores
scoped application memory, and from your business database.

```ts title="Conversation History example 1"
const session = await harness.getSession('tenant:example:chat:42', {
  identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
})
await session.clearHistory()
await session.replaceHistory([{ role: 'user', content: 'Start over.' }])
const summary = await session.getRunSummary('run-1')
await session.release()
```
Use [`HarnessSession.clearHistory`](/handbook/api/interfaces/_purista_harness.HarnessSession/#clearhistory),
[`HarnessSession.replaceHistory`](/handbook/api/interfaces/_purista_harness.HarnessSession/#replacehistory),
and [`HarnessSession.getRunSummary`](/handbook/api/interfaces/_purista_harness.HarnessSession/#getrunsummary)
for authorized operations. `release()` detaches live resources while retaining
persisted data; `destroy()` removes the persisted session. Authenticate and
authorize history operations in the application before calling them.

History retention is a policy choice. Use in-memory storage for tests and a
durable `HarnessStorage` when sessions must survive restart or move between
workers. Never use session history as a queue, secret store, or business ledger.
