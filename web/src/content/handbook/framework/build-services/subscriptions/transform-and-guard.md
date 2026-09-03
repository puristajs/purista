---
title: Transform and guard a subscription
description: Convert a supported wire shape once, then use short guards to stop invalid or disallowed work before its side effect.
order: 333
---

Use a transform only when an incoming or outgoing representation must be
converted at the subscription boundary. Use a guard for a short invariant or
policy check. Neither is a second workflow, a place for long I/O, or a way to
hide a dependency.

## Convert input before domain validation

[`setTransformInput(rawPayloadSchema, rawParameterSchema, fn, contentType?, encoding?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#settransforminput) validates the raw parameter first, then the raw payload. Its non-arrow function returns `{ payload, parameter }`; those domain values are then validated by `addPayloadSchema` and `addParameterSchema`.

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
import { z } from 'zod'

const rawInvoiceSchema = z.object({ id: z.string(), customer_id: z.string(), amount_cents: z.string() })
const rawParameterSchema = z.undefined()

recordInvoiceSubscriptionBuilder.setTransformInput(
  rawInvoiceSchema,
  rawParameterSchema,
  async function (_context, rawPayload, parameter) {
    return {
      payload: {
        invoiceId: rawPayload.id,
        customerId: rawPayload.customer_id,
        amountCents: Number(rawPayload.amount_cents),
      },
      parameter,
    }
  },
)
```

The input-transform context intentionally has only message/base runtime
facilities, resources, stores, logging, metrics, and tracing. It cannot invoke
declared services, consume streams, or emit events. A queue namespace is also
present and is not restricted by a subscription declaration list in this
transform context. Do not enqueue from a transform; keep the conversion pure
and let the domain schema reject a `NaN`, negative amount, or other invalid
result.

## Stop unsafe work with guards

[`setBeforeGuardHooks({ name: async function (...) {} })`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setbeforeguardhooks) runs all named hooks in parallel after domain input validation and before the handler. A failed guard prevents the handler. [`setAfterGuardHooks(...)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setafterguardhooks) runs all named hooks in parallel after a normal, validated handler result; control results skip it.

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
import { HandledError, StatusCode } from '@purista/core'

recordInvoiceSubscriptionBuilder.setBeforeGuardHooks({
  requireCorrelation: async function (context, _payload) {
    if (!context.message.correlationId) {
      throw new HandledError(StatusCode.BadRequest, 'event requires a correlation ID')
    }
  },
})
```

All transforms and guard callbacks must be `async function`, not arrows, so they can be bound to the service instance. Parallel hooks must not depend on each other’s mutations or ordering. Put a required durable write in the handler, not an after guard.

Repeated guard-registration calls merge hooks by name. Reusing a name throws a
definition-time duplicate-hook error with the registering method name, so give
each independent policy check one stable name.

## Transform output only for a declared result event

[`setTransformOutput(schema, fn, contentType?, encoding?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#settransformoutput) owns a second result contract. `addOutputSchema(eventName,
schema, ...)` validates the handler's domain result, then after guards run; see
[`addOutputSchema(...)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addoutputschema).
The output transform runs after those guards. It receives the validated domain
result, and its own `schema`
validates the transformed event payload. Generated event metadata uses the
transform schema, not the domain-result schema.

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
import { z } from 'zod'

const ledgerEntrySchema = z.object({ ledgerEntryId: z.string().uuid() })
const ledgerEntryEventSchema = z.object({ id: z.string().uuid(), kind: z.literal('ledger-entry-created') })

recordInvoiceSubscriptionBuilder
  .addOutputSchema('accounting.ledgerEntryCreated', ledgerEntrySchema)
  .setTransformOutput(
    ledgerEntryEventSchema,
    async function (_context, result, _parameter) {
      return { id: result.ledgerEntryId, kind: 'ledger-entry-created' }
    },
  )
```

Use output transformation when the internal domain result and the public event
shape deliberately differ. Do not use it to conceal a changing result contract:
each schema is independently validated, and either failure takes the
subscription error path. It does nothing for a control result.

Next, decide whether to [publish a result or custom event](/handbook/framework/build-services/subscriptions/publish-result-and-custom-events/) or [control delivery](/handbook/framework/build-services/subscriptions/acknowledge-and-control-delivery/).

For signatures and hook types, see [SubscriptionDefinitionBuilder](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/).
