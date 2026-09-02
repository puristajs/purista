---
title: Invoke a command from a subscription
description: Declare and await one typed command dependency only when the event reaction needs its bounded result now.
order: 337
---

Use synchronous invocation sparingly: it makes the subscriber depend on the
target’s availability and latency. Declare the exact target before calling it;
that both types `context.service` and keeps the dependency visible.

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
const profileInputSchema = z.object({ customerId: z.string() })
const profileOutputSchema = z.object({ ledgerAccountId: z.string() })
const emptyParameterSchema = z.undefined()

recordInvoiceSubscriptionBuilder
  .canInvoke('Customer', '1', 'getBillingProfile', profileOutputSchema, profileInputSchema, emptyParameterSchema)
  .setSubscriptionFunction(async function (context, payload) {
    const profile = await context.service.Customer['1'].getBillingProfile(
      { customerId: payload.customerId },
      {},
    )
    await context.resources.ledger.recordInvoice({ ...payload, ledgerAccountId: profile.ledgerAccountId })
  })
```

[`canInvoke(serviceName, serviceVersion, commandName, outputSchema?,
payloadSchema?, parameterSchema?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#caninvoke)
requires the three non-empty target strings.
[`setSubscriptionFunction(fn)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction)
installs the service-bound reaction that awaits this dependency. The optional
schemas constrain the downstream reply and request. Treat a
downstream error as a delivery decision: return retry only when the effect is
safe to repeat, otherwise use the appropriate control or error boundary.

Next, [consume a stream](/handbook/framework/build-services/subscriptions/call-other-capabilities/consume-a-stream/) for incremental output, or use a [queue handoff](/handbook/framework/build-services/subscriptions/call-other-capabilities/queue-work-from-an-event/) when the work need not finish here.
