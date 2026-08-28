---
title: Test a command
description: Test command logic with typed context stubs, then prove deterministic validation and lifecycle behavior through the real PURISTA service runtime.
order: 332
---

Use two test levels. A direct handler test makes business decisions fast and deterministic. The command runtime harness proves the framework boundary—schemas, guards, transforms, response mapping, and declared capability wiring—without a real broker or database.

## Test handler logic directly

`createCommandContextMock(builder, input)` creates a typed context from the command builder declarations. Its input requires `payload` and `parameter`; `resources`, a Sinon `sandbox`, and a `message` override for those two values are optional. It does **not** override message ID, trace, principal, tenant, or other trusted envelope metadata. It returns `context`/`mock` plus stubs for resources, emitted events, downstream services, queues, stores, logger, spans, and metrics.

```ts title="src/service/invoice/v1/command/createInvoice/createInvoiceCommandBuilder.test.ts"
import { DefaultEventBridge, createCommandContextMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { invoiceV1Service } from '../../invoiceV1Service.js'
import { createInvoiceCommandBuilder } from './createInvoiceCommandBuilder.js'

test('creates an invoice through the handler', async () => {
  const sandbox = createSandbox()
  try {
    const resources = {
      invoices: { create: async () => ({ id: 'invoice-1' }) },
    }
    const service = await invoiceV1Service.getInstance(new DefaultEventBridge(), { resources })
    const handler = safeBind(createInvoiceCommandBuilder.getCommandFunction(), service)
    const { context } = createCommandContextMock(createInvoiceCommandBuilder, {
      payload: { customerId: 'customer-1', amountCents: 1200 },
      parameter: {},
      sandbox,
      resources,
    })

    await expect(handler(context, { customerId: 'customer-1', amountCents: 1200 }, {}))
      .resolves.toEqual({ invoiceId: 'invoice-1' })
  } finally {
    sandbox.restore()
  }
})
```

The builder declarations determine the available typed stubs. Unconfigured config, secret, and state stubs reject by default, which prevents an accidental test from silently treating a store read as successful. Test a trusted-identity branch through an explicitly constructed service/message fixture; this helper is intentionally not an authority-message factory.

The service instance is not started here: it supplies the command handler's
service receiver for this direct test only. The test does not register a
command receiver or connect the EventBridge; the runtime harness below owns
that broader boundary.

## Choose the narrowest direct helper

| Helper | Optional input / what it runs | What it deliberately excludes |
| --- | --- | --- |
| [`getCommandFunction({ beforeGuards? })`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#getcommandfunction) | Merges named `beforeGuards` overrides over the builder’s registered before guards, validates payload/parameter, runs before guards and the handler, then validates output. | Input transform, after guards, output transform, definition registration, and transport delivery. |
| [`getCommandFunctionPlain()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#getcommandfunctionplain) | The raw declared handler only. | All schemas and all hooks. Use only when that boundary is intentional. |
| [`getTransformInputFunction()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#gettransforminputfunction) / [`getTransformOutputFunction()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#gettransformoutputfunction) | One configured transform callback, or `undefined` when none is configured. | The surrounding validation and later lifecycle stages. Validate its returned shape explicitly in the test. |
| [`getBeforeGuardHook(name)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#getbeforeguardhook) / [`getAfterGuardHook(name)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#getafterguardhook) | One named configured guard, or `undefined`. | Other guards, handler execution, output transformation, and response mapping. |

Bind every retrieved callback to the service with `safeBind(...)` and provide the
context shape for that callback. A direct helper is useful for a narrow branch;
the deterministic harness below proves the complete Framework path.

## Run through the deterministic Framework runtime

```ts title="src/service/invoice/v1/command/createInvoice/createInvoiceCommandBuilder.runtime.test.ts"
import { createCommandTestHarness } from '@purista/core'
import { expect, test } from 'vitest'

test('validates and executes createInvoice through the command runtime', async () => {
  const harness = await createCommandTestHarness(invoiceV1ServiceBuilder, createInvoiceCommandBuilder, {
    resources: { invoices: { create: async () => ({ id: 'invoice-1' }) } },
  })
  try {
    const { message, result } = await harness.run({
      payload: { customerId: 'customer-1', amountCents: 1200 },
      parameter: {},
    })
    expect(result).toEqual({ invoiceId: 'invoice-1' })
    expect(message).toBeDefined()
  } finally {
    await harness.destroy()
  }
})
```

`createCommandTestHarness(serviceBuilder, commandBuilder, options = {})` boots a real service instance, materializes and registers the command definition, and uses a supplied EventBridge/QueueBridge or a deterministic EventBridge mock. It returns `service`, `eventBridge`, mock `stubs.eventBridge` when it owns the mock, `run(...)`, and `destroy()`.

| Test | What it proves | What it does not prove |
| --- | --- | --- |
| Direct handler/context mock | Business decisions and declared interactions. | Schema runtime, service registration, transport behavior. |
| Command test harness | Deterministic schemas, transforms, guards, response mapping, and runtime wiring. | A production EventBridge, database, Hono route, or an LLM/provider result. |
| Adapter integration test | Chosen transport/server/provider configuration. | Broad business correctness by itself. |

Cover a valid result, invalid input, expected `HandledError`, unexpected dependency failure, and every guard/transform branch that changes the outcome. Test real EventBridge and HTTP behavior in their owning integration suite.

For helper signatures, see [createCommandContextMock](/handbook/api/functions/_purista_core.createCommandContextMock/) and [createCommandTestHarness](/handbook/api/functions/_purista_core.createCommandTestHarness/).
