---
title: Test a service
description: Validate the assembled service contract, then prove handler logic, deterministic runtime behavior, and real adapter behavior at separate boundaries.
order: 317
---

Test the aggregate before testing a handler. [`testServiceSetup()`](/handbook/api/classes/_purista_core.ServiceBuilder/#testservicesetup) resolves the
service definitions once and validates structural errors that would otherwise
look like runtime failures.

```ts title="src/service/invoice/v1/invoiceV1Service.test.ts"
import { describe, expect, test } from 'vitest'
import { invoiceV1Service } from './invoiceV1Service.js'

describe('Invoice v1 service', () => {
  test('has a valid definition aggregate', async () => {
    await expect(invoiceV1Service.testServiceSetup()).resolves.toBe(true)
  })
})
```

| Boundary | Proves | Does not prove |
| --- | --- | --- |
| `testServiceSetup()` | Duplicate command/subscription/stream/queue names, duplicate command response-event names, and queue-worker references | Resource or service-config construction/validation, event-to-queue bindings, schedules, EventBridge/QueueBridge health/capabilities, service startup, adapter behavior, or deployment topology |
| Primitive handler/helper test | Domain outcome, authentication branch, narrow resource call, emitted contract | Service registration, real bridge/store behavior, or a live provider |
| Deterministic primitive runtime harness | The selected command/stream/subscription/worker Framework lifecycle | A production transport, store, broker, HTTP server, or nondeterministic model result |
| Real adapter integration | Configured provider startup, credentials, network, persistence, or delivery behavior | Guarantees from another provider or business exactly-once behavior |

[`testServiceSetup()`](/handbook/api/classes/_purista_core.ServiceBuilder/#testservicesetup) is not a non-mutating inspection: it resolves and caches
definitions. Build a fresh builder for a test shape that needs to add different
definitions after an aggregate test.

Use a narrow fake resource for handler tests. Test a custom service class's
start/destroy behavior separately, and add adapter integration tests for the
real dependency. Select the primitive guide for its exact helper boundary:
[commands](/handbook/framework/build-services/commands/),
[subscriptions](/handbook/framework/build-services/subscriptions/),
[streams](/handbook/framework/build-services/streams/), or
[queues and workers](/handbook/framework/build-services/queues-and-workers/).

For the aggregate API, see [ServiceBuilder](/handbook/api/classes/_purista_core.ServiceBuilder/).
