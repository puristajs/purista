---
title: Use in-memory memory
description: Use process-local memory for tests and disposable development sessions.
order: 621
---

`inMemoryMemoryEngine()` needs no external service and loses data on process
restart. Bind it at instance creation:

```ts title="In Memory example 1"
import { inMemoryMemoryEngine, defineHarness } from '@purista/harness'
const definition = defineHarness({ name: 'support' }).addAgent(agent)
const harness = await definition.getInstance({ memory: inMemoryMemoryEngine(), models })
```
It is useful for deterministic tests, but it does not provide cross-worker
sharing, durable recovery, or tenant isolation by itself.
