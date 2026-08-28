---
title: Use in-memory memory
description: Use the default ephemeral memory engine for tests and single-process runs.
order: 631
---

No install or configuration is required: Harness uses `inMemoryMemoryEngine()`
when `.memory(...)` is absent. It supports scoped key/value, list, delete, and
TTL operations only. This is the right default for a deterministic unit test or
a local experiment where a restarted process must forget the data.

If a test needs to document that choice explicitly, create the engine as a
normal value and pass it to the complete Harness definition:

```ts title="test/support/createTestHarness.ts"
import { defineHarness, inMemoryMemoryEngine, inMemorySandbox } from '@purista/harness'

export const testHarness = defineHarness({ name: 'claims-review-test' })
  .sandbox(inMemorySandbox())
  .memory(inMemoryMemoryEngine())
  .models({
    noop: { provider: { id: 'test', genAiSystem: 'test' }, model: 'not-called', capabilities: [] },
  })
  .build()
```

| Call or field | What it configures | Choice and failure boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Starts the named composition that owns sessions and their memory facades. | The name defaults to `agent-harness`; it labels diagnostics but does not create a memory namespace or isolation boundary. |
| [`inMemoryMemoryEngine()`](/handbook/api/functions/_purista_harness.inMemoryMemoryEngine/) | Creates the explicit core in-process key/value/list/delete/TTL engine. | Omit `.memory(...)` to receive the same default, or call it explicitly when a test should make the ephemeral dependency visible. It has no search or persistence capability. |
| [`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox) | Adds an ephemeral files-only sandbox to this otherwise minimal composition. | It is optional for memory itself. Do not infer a persistent filesystem or tenant isolation from this test/runtime adapter. |
| [`.memory(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#memory) | Registers a direct engine instance; the other accepted forms are a configuration object or an alias-aware callback. | Use the direct instance when no embedding alias is needed. Register models before the callback form so the builder can type-check the declared alias. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Registers the required non-empty model registry without making a provider call. | The `noop` alias deliberately has no capabilities and no consumer. `.build()` always requires a model alias, but this memory fixture must not prompt it. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates the composition and returns the Harness. | With the inert required model but no tool, agent, or workflow registry, it makes a valid storage/memory test fixture—not an agent runtime. |

[`memory(engine)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#memory)
accepts either a memory engine, a configuration object, or a callback that uses
already-registered model aliases. This direct engine form has no *memory-model*
requirement. The Harness builder still requires the inert `noop` model alias
shown above, while this verification has no agent, tool, or workflow consumer.
Empty registry calls do not enable anything.

It is lost on restart, is not shared across instances, and has no text, vector,
or hybrid search. Use it for unit tests, examples, or explicitly ephemeral
flows—not durable user memory. Test expiry with a controlled clock where your
application depends on it, then move to a persistent backend before deploying
multi-instance workloads. Do not rely on it as a development stand-in for a
production database: it cannot reveal migration, connection, locking, or
tenant-isolation mistakes.
