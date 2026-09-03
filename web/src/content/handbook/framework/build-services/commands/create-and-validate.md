---
title: Create and validate a command
description: Define an updateInvoice contract, implement its business result and safe errors, register it, and run it deterministically.
order: 321
---

By the end of this page, `updateInvoice` accepts a validated invoice ID and
change set, returns one verified result, reports a missing invoice safely, and
hides unexpected repository failures.

You need a versioned [service builder](/handbook/framework/build-services/services/create-and-version-a-service/). The example adds one narrow repository resource; PURISTA injects its implementation when the service instance is created.

## 1. Declare the resource the handler needs

A service is the logical container for one versioned business capability. It
owns the commands, subscriptions, streams, workers, resources, configuration,
and shared runtime requirements needed to implement that capability. A command
therefore declares and uses dependencies through its service boundary instead
of constructing a database client, provider SDK, logger, or store itself.

PURISTA keeps the declaration separate from the implementation:

| Boundary | Responsibility |
| --- | --- |
| Service builder | Declares resource interfaces, validated configuration, metrics, and child definitions. |
| Application composition root | Chooses and constructs concrete resources, store adapters, bridges, logger, telemetry, and instance configuration for `getInstance(...)`. |
| Command, subscription, stream, or worker | Receives only the service facilities and explicitly declared capabilities available to that callback. |

At execution time, PURISTA creates the typed handler context from the service
instance. Resources arrive through `context.resources`; stores, logging,
metrics, and tracing arrive through their context APIs. Validated
`serviceConfig` remains owned by the bound service instance and is available as
`this.config` inside a non-arrow handler—it is not copied into `context`.

Keep database clients and SDKs out of the command. Define the smallest
application interface that implements the business operation.

```ts title="src/service/invoice/v1/invoiceV1ServiceBuilder.ts"
import { ServiceBuilder } from '@purista/core'
import { invoiceV1ServiceInfo } from './invoiceV1ServiceInfo.js'

export type InvoiceUpdate = { dueDate: string; note?: string }
export type UpdatedInvoice = InvoiceUpdate & { invoiceId: string; updatedAt: string }

export interface InvoiceRepository {
  update(invoiceId: string, changes: InvoiceUpdate): Promise<UpdatedInvoice | undefined>
}

export const invoiceV1ServiceBuilder = new ServiceBuilder(invoiceV1ServiceInfo)
  .defineResource<'invoices', InvoiceRepository>()
```

[`defineResource<ResourceName, ResourceType>()`](/handbook/api/classes/_purista_core.ServiceBuilder/#defineresource) is a typed declaration shared by every definition created from this service builder. It does not construct, start, or stop the repository. The composition root supplies `resources.invoices` through `getInstance(...)`; tests can supply a deterministic fake that implements the same interface.

[Provide service resources](/handbook/framework/build-services/services/provide-resources-and-metrics/)
owns the complete pattern: choosing a narrow interface, constructing and
injecting the implementation at runtime, managing its lifecycle, and replacing
it at the test boundary. See [configure a service](/handbook/framework/build-services/services/configure-a-service/),
[use stores from handlers](/handbook/framework/configure-applications/use-stores-from-handlers/),
and the [handler context reference](/handbook/framework/build-services/handler-context/)
for the other service-provided boundaries.

## 2. Define the public contract

`payload` contains the requested changes. `parameter` contains selectors—in
this case the invoice ID that can later come from an HTTP path. The output is
the public result, not an unrestricted database record.

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceSchemas.ts"
import { z } from 'zod'

export const updateInvoicePayloadSchema = z.object({
  dueDate: z.iso.date().describe('New invoice due date'),
  note: z.string().trim().min(1).max(500).optional().describe('Optional customer-visible note'),
}).strict()
  .describe('Fields the caller may change on an invoice')
  .meta({ examples: [{ dueDate: '2026-09-30', note: 'Customer requested an extension' }] })

export const updateInvoiceParameterSchema = z.object({
  invoiceId: z.string().min(1).describe('Stable public invoice identifier'),
  notify: z.union([z.boolean(), z.stringbool()]).optional().default(false)
    .describe('Whether the caller requests a notification'),
}).strict()
  .describe('Selectors and request options for the invoice update')
  .meta({ examples: [{ invoiceId: 'invoice-42', notify: false }] })

export const updateInvoiceOutputSchema = z.object({
  invoiceId: z.string().min(1).describe('Updated invoice identifier'),
  dueDate: z.iso.date().describe('Current invoice due date'),
  note: z.string().optional().describe('Current customer-visible note'),
  updatedAt: z.iso.datetime().describe('Time the update was persisted'),
}).strict()
  .describe('Public result returned after an invoice update')
  .meta({ examples: [{
    invoiceId: 'invoice-42',
    dueDate: '2026-09-30',
    note: 'Customer requested an extension',
    updatedAt: '2026-08-28T10:00:00.000Z',
  }] })
```

Descriptions explain the business meaning of each field; they should not
repeat constraints already visible in the schema. PURISTA preserves Zod
descriptions and examples in exported JSON Schema. Hono uses that schema for
OpenAPI request bodies, responses, and path/query parameter descriptions.
Examples are optional: add only small, schema-valid synthetic values that are
safe to publish. Operation summaries and HTTP-specific descriptions remain
part of the command's HTTP exposure metadata.

The `notify` union accepts a boolean from an EventBridge caller and a supported
boolean string from an HTTP query. Avoid `z.coerce.boolean()` for query values:
JavaScript truthiness converts the non-empty string `"false"` to `true`.

Strict output validation is useful at a public boundary: an accidental extra
database field becomes an internal implementation failure instead of leaving
the service. Use a non-strict Zod object deliberately when filtering unknown
fields is the intended contract.

## 3. Implement the handler and expected business error

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.ts"
import { HandledError, StatusCode } from '@purista/core'
import { invoiceV1ServiceBuilder } from '../../invoiceV1ServiceBuilder.js'
import {
  updateInvoiceOutputSchema,
  updateInvoiceParameterSchema,
  updateInvoicePayloadSchema,
} from './updateInvoiceSchemas.js'

export const updateInvoiceCommandBuilder = invoiceV1ServiceBuilder
  .getCommandBuilder('updateInvoice', 'Update an invoice')
  .addPayloadSchema(updateInvoicePayloadSchema)
  .addParameterSchema(updateInvoiceParameterSchema)
  .addOutputSchema(updateInvoiceOutputSchema)
  .setCommandFunction(async function (context, payload, parameter) {
    const invoice = await context.resources.invoices.update(parameter.invoiceId, payload)

    if (!invoice) {
      throw new HandledError(StatusCode.NotFound, 'Invoice does not exist', {
        invoiceId: parameter.invoiceId,
      })
    }

    return invoice
  })
```

Use `async function`, not an arrow function. PURISTA binds the callback to the
service instance and rejects an arrow function. The handler receives readonly,
validated `payload` and `parameter` values and the resource type declared by
the service builder.

## Understand the builder methods

The method order establishes the type flow:

| Method | Parameters and defaults | Runtime effect |
| --- | --- | --- |
| [`getCommandBuilder(name, description, eventName?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder) | Non-empty service-local name, description, and optional success-event name. | Creates the typed definition builder; it does not register or execute the command. |
| [`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addpayloadschema) | Standard Schema plus optional media metadata; definition defaults are JSON and UTF-8. | Validates and types the business payload. |
| [`addParameterSchema(schema)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addparameterschema) | Standard Schema; no parameter object is created automatically. | Validates and types path, query, or caller-supplied selectors. |
| [`addOutputSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#addoutputschema) | Standard Schema plus optional response media metadata. | Validates the handler result before after guards, output transformation, and success response creation. |
| [`setCommandFunction(handler)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#setcommandfunction) | Non-arrow async function receiving `(context, payload, parameter)`. | Installs the required service-bound business implementation. |

## 4. Register the definition

```ts title="src/service/invoice/v1/invoiceV1Service.ts"
import { updateInvoiceCommandBuilder } from './command/updateInvoice/updateInvoiceCommandBuilder.js'
import { invoiceV1ServiceBuilder } from './invoiceV1ServiceBuilder.js'

export const invoiceV1Service = invoiceV1ServiceBuilder
  .addCommandDefinition(updateInvoiceCommandBuilder.getDefinition())
```

[`addCommandDefinition(definition)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addcommanddefinition)
adds the resolved command definition to this service builder and returns the
same builder for further assembly.

`getDefinition()` fails when no handler was installed. Add definitions before
the service builder resolves them; do not register application commands ad hoc
after normal startup.

## 5. Run the first result

This focused test boots the actual service command runtime with a deterministic
EventBridge mock and repository. It proves the contract without requiring a
database or HTTP server.

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.runtime.test.ts"
import { createCommandTestHarness } from '@purista/core'
import { expect, test } from 'vitest'
import { invoiceV1ServiceBuilder } from '../../invoiceV1ServiceBuilder.js'
import { updateInvoiceCommandBuilder } from './updateInvoiceCommandBuilder.js'

test('updates an invoice through the command runtime', async () => {
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
    const { result } = await harness.run({
      payload: { dueDate: '2026-09-30', note: 'Customer requested an extension' },
      parameter: { invoiceId: 'invoice-42' },
    })

    expect(result).toEqual({
      invoiceId: 'invoice-42',
      dueDate: '2026-09-30',
      note: 'Customer requested an extension',
      updatedAt: '2026-08-28T10:00:00.000Z',
    })
  } finally {
    await harness.destroy()
  }
})
```

The expected object is the command result. It does not imply that a subscriber,
queue worker, HTTP server, or production EventBridge has completed work.

After [`defineResource(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#defineresource),
`resources` becomes a required `getInstance(...)` option. Omitting it rejects
service creation with `UnhandledError(500, 'This services requires resources
to be set in getInstance options')`; the service never reaches `start()`.

## Know the default error behavior

| Situation | PURISTA behavior | Application action |
| --- | --- | --- |
| Payload or parameter does not match its schema | Handled `400 Bad Request` with validation issues; the handler does not run. | Correct the request or contract. |
| Repository returns `undefined` | The shown `HandledError` returns `404`, its safe message, and the optional invoice ID. | Treat it as an expected business outcome. |
| Repository throws a database/provider error | PURISTA returns a generic internal `500` with a trace ID and records the actual failure internally. | Do not expose the database message, query, credential, or stack. |
| Handler returns an invalid or extra value against the strict output schema | PURISTA returns a generic internal `500`; later success stages do not run. | Fix the handler/resource mapping or the intended output contract. |

`HandledError(status, message?, data?, traceId?)` is deliberately public. Put
only stable, caller-safe information in its message and data. Every other
thrown value remains unexpected and is serialized as a safe internal error.

Next, [invoke another command](/handbook/framework/build-services/commands/call-other-capabilities/invoke-command/) when `updateInvoice` needs a downstream decision before it can continue.

For exact signatures, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/) and [HandledError](/handbook/api/classes/_purista_core.HandledError/).
