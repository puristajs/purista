---
title: Design service and contract coverage
description: Turn primitive tests into a small, non-duplicating contract matrix for the assembled service.
order: 910
---

After each command, subscription, stream, queue worker, or attached agent has focused tests, verify the service as the logical container that combines them. Do not copy handler cases into this layer. Test only composition facts that a primitive cannot prove alone.

## 1. Validate the definition aggregate

```ts title="src/service/invoice/v1/invoiceV1Service.test.ts"
import { describe, expect, test } from 'vitest'
import { invoiceV1Service } from './invoiceV1Service.js'

describe('Invoice v1 service', () => {
  test('has a valid definition aggregate', async () => {
    await expect(invoiceV1Service.testServiceSetup()).resolves.toBe(true)
  })
})
```

[`testServiceSetup()`](/handbook/api/classes/_purista_core.ServiceBuilder/#testservicesetup) resolves and caches the definitions, then rejects duplicate command, subscription, stream, or queue names; duplicate command response-event names; and invalid queue-worker references. Use a fresh builder if another test must add different definitions after this check.

It does not create resources, start the service, verify schedules or event-to-queue bindings, connect adapters, or exercise deployment startup.

## 2. Build a contract matrix

For an invoice service that accepts a command, publishes `InvoiceCreated`, and queues delivery work, keep one owner for each behavior:

| Contract | Focused owner | Composition assertion |
| --- | --- | --- |
| `createInvoice` validation and business result | Command test | Definition is registered exactly once. |
| `InvoiceCreated` response event | Command success-event test | Event name/schema matches the consuming subscription contract. |
| `sendInvoice` subscription mapping | Subscription test | Subscription target and queue name exist in the assembled service. |
| `deliverInvoice` retry/idempotency | Queue-worker test | Worker references the registered queue and result-event names are unique. |
| Store/resource behavior | Handler test with a narrow fake | Service configuration supplies the real provider at startup/integration boundary. |

The composition test should fail when a definition is missing, duplicated, or wired to the wrong name. It should not retest whether a missing invoice returns `404`; that belongs to the command handler test.

## 3. Add startup evidence only for runtime construction

Create an actual service instance when the claim concerns resource construction, configuration validation, a custom service lifecycle, or attached runtime startup. Supply deterministic adapters and destroy everything the test owns in `finally`.

| Startup claim | Required evidence | Separate boundary still needed |
| --- | --- | --- |
| Required service config is rejected | Invalid config cannot construct the instance; valid config can. | Real secret/config-store authorization. |
| Resource factory receives validated config | Narrow fake resource is created and destroyed once. | Database protocol and credentials. |
| Attached agent aliases are complete | Missing/capability-incompatible binding fails startup. | Live model quality evaluation. |
| Custom service hooks run | Start/destroy order and failure cleanup are observable. | Container/process signal handling. |

Do not call `service.start()` merely to prove a handler branch. Starting crosses into registration and adapter ownership; use it only when that lifecycle is the subject of the test.

Next: [test cross-message flows, queues, and retries](/handbook/framework/test-applications/message-flows-queues-and-retries/).
