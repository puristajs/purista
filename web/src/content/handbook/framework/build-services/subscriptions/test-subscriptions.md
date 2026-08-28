---
title: Test subscriptions
description: Prove direct handler logic, deterministic framework behavior, and the selected EventBridge boundary separately.
order: 342
---

Subscriptions have three useful test boundaries. Each proves a different
thing; none substitutes for the others.

| Boundary | Proves | Does not prove |
| --- | --- | --- |
| Direct builder/handler test | Schema validation, before guards, handler logic, declared context, and normal/control result choices | Input/output transforms, after guards, result-event construction, or bridge delivery. |
| Service runtime test | Framework lifecycle: transforms, after guards, result-event construction, handled errors, and control conversion | The deployed broker’s registration, retention, retry timing, or dead-letter implementation. |
| Selected EventBridge integration | Real registration, routing, and the documented adapter behavior | Agent/provider/database correctness outside the configured scope. |

## Test direct logic with a typed context mock

Use a real builder so the helper can derive the context type. Bind
`getSubscriptionFunction()` to a service instance; it runs input/output
validation and before guards before calling the handler.

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.test.ts"
import { createSubscriptionContextMock, getCustomMessageMessageMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { describe, expect, test } from 'vitest'
import { accountingV1Service } from '../../accountingV1Service.js'
import { recordInvoiceSubscriptionBuilder } from './recordInvoiceSubscriptionBuilder.js'

describe('recordInvoice subscription', () => {
  test('records one valid invoice', async () => {
    const sandbox = createSandbox()
    try {
      const ledger = { recordInvoice: sandbox.stub().resolves({ id: 'ledger-42' }) }
      const message = getCustomMessageMessageMock('billing.invoiceCreated', {
        invoiceId: 'invoice-42', customerId: 'customer-42', amountCents: 4_200,
      })
      const { context } = createSubscriptionContextMock(recordInvoiceSubscriptionBuilder, {
        message,
        sandbox,
        resources: { ledger },
      })
      const handler = safeBind(recordInvoiceSubscriptionBuilder.getSubscriptionFunction(), accountingV1Service)

      await expect(handler(context, { invoiceId: 'invoice-42', customerId: 'customer-42', amountCents: 4_200 }, {})).resolves.toEqual({
        ledgerEntryId: 'ledger-42',
      })
      expect(ledger.recordInvoice).toHaveBeenCalledOnce()
    } finally {
      sandbox.restore()
    }
  })
})
```

`createSubscriptionContextMock(builder, { message, sandbox?, resources? })`
rejects unconfigured store, service, and queue calls. That is intentional: the
test must declare the dependency it exercises rather than accidentally relying
on an invented context.

## Cover the decision paths

| Case | Deterministic assertion |
| --- | --- |
| Invalid payload/parameter | The handler and resource fake are not called. |
| Before guard rejects | The handler is not called. |
| Duplicate business key | The handler returns `undefined` or `ack` without repeating the effect. |
| Temporary dependency failure | The handler returns the documented retry control result. |
| Permanent, repairable failure | The handler returns the documented dead-letter control result. |
| Custom emit | Assert the typed `stubs.emit` call and its payload. |

Use `getSubscriptionFunctionPlain()` only when the test deliberately owns all
validation and guard setup. It does not run validation or hooks.

| Builder helper | Direct-test boundary |
| --- | --- |
| [`getSubscriptionFunction()`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#getsubscriptionfunction) | Input/output validation and before guards plus the handler; no transforms, after guards, result event, registration, or bridge delivery. |
| [`getSubscriptionFunctionPlain()`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#getsubscriptionfunctionplain) | Raw handler only. |
| [`getTransformInputFunction()`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#gettransforminputfunction) and [`getTransformOutputFunction()`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#gettransformoutputfunction) | One configured transform function only; validate its input and output schemas in the test. Each returns `undefined` when that transform is not configured. |
| [`getSubscriptionTransformContextMock({ message, resources?, sandbox? })`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#getsubscriptiontransformcontextmock) | A base transform context with message, stores, logger, metrics, traces, resources, and queue stubs. It has no declared `service`, `stream`, or `emit` capabilities; unconfigured store/queue calls reject. |

## Prove the runtime and adapter separately

A service/runtime test should feed a synthetic message through the service and
assert input/output transforms, after guards, `HandledError` completion,
control-result conversion, and configured result-event construction. Add a
real-adapter integration test only for adapter claims: matching/non-matching
routing, consumer registration, supported retry/delay/dead-letter behavior,
and a bounded recovery procedure.

Use disposable broker namespaces and synthetic data. Do not test an LLM or a
remote provider’s nondeterministic result here; the test proves your
subscription’s implementation and flow. Measure AI result quality in the
[AI Harness evaluation guidance](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/).

Next, choose [an EventBridge](/handbook/framework/connect-distributed-infrastructure/event-delivery/) for adapter-specific production evidence.

For the helper API, see [createSubscriptionContextMock](/handbook/api/functions/_purista_core.createSubscriptionContextMock/).
