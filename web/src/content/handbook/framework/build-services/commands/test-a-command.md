---
title: Test a command
description: Test command logic with typed context stubs, then prove deterministic validation and lifecycle behavior through the real PURISTA service runtime.
order: 331
---

Use two test levels. A direct handler test makes business decisions fast and deterministic. The command runtime harness proves the framework boundary—schemas, guards, transforms, response mapping, and declared capability wiring—without a real broker or database.

## Test handler logic directly

`createCommandContextMock(builder, input)` creates a typed context from the command builder declarations. Its input requires `payload` and `parameter`; `resources`, a Sinon `sandbox`, and a `message` override for those two values are optional. It does **not** override message ID, trace, principal, tenant, or other trusted envelope metadata. It returns `context`/`mock` plus stubs for resources, emitted events, downstream services, queues, stores, logger, spans, and metrics.

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.test.ts"
import {
  DefaultEventBridge,
  StatusCode,
  createCommandContextMock,
  getCommandMessageMock,
  safeBind,
} from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { invoiceV1Service } from '../../invoiceV1Service.js'
import { updateInvoiceCommandBuilder } from './updateInvoiceCommandBuilder.js'

test('updates an invoice through the handler', async () => {
  const sandbox = createSandbox()
  const eventBridge = new DefaultEventBridge()
  const resources = {
    invoices: {
      update: async (invoiceId, changes) => ({
        invoiceId,
        ...changes,
        updatedAt: '2026-08-28T10:00:00.000Z',
      }),
    },
  }
  const service = await invoiceV1Service.getInstance(eventBridge, { resources })

  try {
    const handler = safeBind(updateInvoiceCommandBuilder.getCommandFunction(), service)
    const { context } = createCommandContextMock(updateInvoiceCommandBuilder, {
      payload: '<invoice-update><due-date>2026-09-30</due-date></invoice-update>',
      parameter: { invoiceId: 'invoice-42', notify: false },
      sandbox,
      resources,
    })

    await expect(handler(
      context,
      { dueDate: '2026-09-30' },
      { invoiceId: 'invoice-42', notify: false },
    )).resolves.toEqual({
      invoiceId: 'invoice-42',
      dueDate: '2026-09-30',
      updatedAt: '2026-08-28T10:00:00.000Z',
    })
  } finally {
    await service.destroy()
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

## Test transforms and guards directly

Test a hook directly when one branch deserves a small, fast assertion. Use the
context helper that matches the callback: transforms receive the restricted
transform context, while guards receive the full command context.

| Hook under test | Retrieve it with | Build its context with | Call arguments after context |
| --- | --- | --- | --- |
| Input transform | [`getTransformInputFunction()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#gettransforminputfunction) | [`getCommandTransformContextMock(...)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#getcommandtransformcontextmock) | Raw payload and raw parameter. |
| Output transform | [`getTransformOutputFunction()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#gettransformoutputfunction) | `getCommandTransformContextMock(...)` | Validated domain result and validated parameter. |
| Before guard | [`getBeforeGuardHook(name)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#getbeforeguardhook) | [`createCommandContextMock(...)`](/handbook/api/functions/_purista_core.createCommandContextMock/) | Validated domain payload and parameter. |
| After guard | [`getAfterGuardHook(name)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#getafterguardhook) | `createCommandContextMock(...)` | Validated domain result, payload, and parameter. |

The next focused test uses the input transform introduced on
[Transform and guard command execution](/handbook/framework/build-services/commands/transform-and-guard/).
The excerpt assumes `service`, `resources`, and a fresh Sinon `sandbox` are
created by a shared test fixture using the same setup as the direct handler
test above.

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.test.ts"
test('converts the supported legacy representation to domain input', async () => {
  const transform = updateInvoiceCommandBuilder.getTransformInputFunction()
  if (!transform) throw new Error('updateInvoice input transform is not configured')

  const rawPayload = '<invoice-update><due-date>2026-09-30</due-date></invoice-update>'
  const rawParameter = { invoiceId: 'invoice-42', notify: false }
  const { mock } = updateInvoiceCommandBuilder.getCommandTransformContextMock({
    payload: rawPayload,
    parameter: rawParameter,
    sandbox,
  })

  const transformed = await safeBind(transform, service)(mock, rawPayload, rawParameter)

  expect(updateInvoicePayloadSchema.parse(transformed.payload)).toEqual({
    dueDate: '2026-09-30',
  })
  expect(updateInvoiceParameterSchema.parse(transformed.parameter)).toEqual(rawParameter)
})
```

`getCommandTransformContextMock(...)` returns `mock` and typed stubs for the
logger, spans, stores, queues, metrics, and resources available at a transform
boundary. It does not run the raw schemas, the transform-output schema, or any
later lifecycle stage. Parse the returned value with the expected domain schema
as shown; use the command runtime harness when the test must prove both schema
boundaries and their order.

Test named guards through their builder accessors. The context mock supplies
the declared resource/client/store surfaces, while the arguments passed to the
guard represent values already validated by the command runtime.

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.test.ts"
test('rejects a missing tenant before the handler', async () => {
  const guard = updateInvoiceCommandBuilder.getBeforeGuardHook('requireTenant')
  const rawPayload = '<invoice-update><due-date>2026-09-30</due-date></invoice-update>'
  const payload = { dueDate: '2026-09-30' }
  const parameter = { invoiceId: 'invoice-42', notify: false }
  const { context } = createCommandContextMock(updateInvoiceCommandBuilder, {
    payload: rawPayload,
    parameter,
    sandbox,
    resources,
  })
  const message = getCommandMessageMock({
    tenantId: undefined,
    payload: { payload: rawPayload, parameter },
  })

  await expect(safeBind(guard, service)(
    { ...context, message },
    payload,
    parameter,
  )).rejects.toMatchObject({
    errorCode: StatusCode.Forbidden,
  })
})

test('rejects a changed invoice identity after the handler', async () => {
  const guard = updateInvoiceCommandBuilder.getAfterGuardHook('preserveInvoiceIdentity')
  const rawPayload = '<invoice-update><due-date>2026-09-30</due-date></invoice-update>'
  const payload = { dueDate: '2026-09-30' }
  const parameter = { invoiceId: 'invoice-42', notify: false }
  const { context } = createCommandContextMock(updateInvoiceCommandBuilder, {
    payload: rawPayload,
    parameter,
    sandbox,
    resources,
  })

  await expect(safeBind(guard, service)(
    context,
    { invoiceId: 'invoice-99', dueDate: '2026-09-30', updatedAt: '2026-08-28T10:00:00.000Z' },
    payload,
    parameter,
  )).rejects.toThrow('invoice identity changed')
})
```

These direct calls do not validate the arguments for you and do not run sibling
guards. Named guards normally run in parallel, so test them as independent
checks. When an input transform is configured, `context.message` retains the
received representation while the guard's positional arguments are the
validated domain values. [`safeBind(...)`](/handbook/api/functions/_purista_core.safeBind/) keeps
the service receiver and callback types intact.

## Run through the deterministic Framework runtime

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.runtime.test.ts"
import { createCommandTestHarness } from '@purista/core'
import { expect, test } from 'vitest'

test('validates and executes updateInvoice through the command runtime', async () => {
  const harness = await createCommandTestHarness(invoiceV1ServiceBuilder, updateInvoiceCommandBuilder, {
    resources: {
      invoices: {
        update: async (invoiceId, changes) => ({
          invoiceId,
          ...changes,
          updatedAt: '2026-08-28T10:00:00.000Z',
        }),
      },
    },
  })
  try {
    const { message, result } = await harness.run({
      payload: '<invoice-update><due-date>2026-09-30</due-date></invoice-update>',
      parameter: { invoiceId: 'invoice-42', notify: false },
    })
    expect(result).toEqual({
      invoiceId: 'invoice-42',
      dueDate: '2026-09-30',
      updatedAt: '2026-08-28T10:00:00.000Z',
    })
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
