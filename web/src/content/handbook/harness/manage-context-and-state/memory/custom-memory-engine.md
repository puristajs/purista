---
title: Build a custom memory engine
description: Implement the MemoryEngine port only when the application needs a backend not supplied by a first-party adapter.
order: 626
---

A custom engine must enforce scoped reads and writes, cancellation, bounded
results, retention, cleanup, and the search capabilities it advertises. Run the
shared contract suite and backend failure tests.

```ts title="Custom Memory Engine example 1"
const definition = defineHarness({ name: 'support' }).addAgent(agent)
const harness = await definition.getInstance({ memory: customMemoryEngine, models })
```
Do not use a custom memory engine for Harness history or durable workflow
checkpoints. Keep backend credentials and tenant authorization outside the
agent definition.
