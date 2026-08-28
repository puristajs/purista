---
title: Match and filter events
description: Receive only the event/message shape a subscription owns, while keeping routing metadata separate from authorization.
order: 332
---

Start with a named business event. Add another filter only when it prevents a
real collision or expresses a deliberate addressed-message contract. Filters
decide which message is delivered; they do not authorize the business record
inside that message.

## Build an additive match

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
export const recordInvoiceSubscriptionBuilder = accountingV1ServiceBuilder
  .getSubscriptionBuilder('recordInvoice', 'Record an issued invoice in the ledger')
  .subscribeToEvent('billing.invoiceCreated', '1')
  .filterSentFrom('Billing', '1', 'createInvoice', undefined)
  .addPayloadSchema(invoiceCreatedSchema)
  .setSubscriptionFunction(async function (context, payload) {
    await context.resources.ledger.recordInvoice(payload)
  })
```

[`getSubscriptionBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getsubscriptionbuilder)
creates the service-owned reaction. [`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addpayloadschema)
declares the domain payload validated before its normal handler execution, and
[`setSubscriptionFunction(...)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction)
installs that service-bound handler. The filter calls only decide routing; they
never validate record ownership or authorise a side effect.

`subscribeToEvent(...)` initially records the optional service version as a
sender criterion. `filterSentFrom(...)` replaces the complete sender metadata,
so call it after `subscribeToEvent(...)` when you need sender name, target, or
instance filtering. Keep every `undefined` criterion intentional: it means
“do not filter on this value.”

## Choose the narrowest useful filter

| Method | Parameters | What it matches | Use it when |
| --- | --- | --- | --- |
| [`subscribeToEvent(eventName, serviceVersion?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#subscribetoevent) | A non-empty custom event; optional publisher version | Custom event name and optional sender version | The normal starting point for a business event. |
| [`filterSentFrom(serviceName, serviceVersion, serviceTarget, instanceId)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#filtersentfrom) | Four exact values or `undefined` | Message origin metadata | The event name is shared across publishers or targets. |
| [`filterReceivedBy(serviceName, serviceVersion, serviceTarget, instanceId)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#filterreceivedby) | Four exact values or `undefined` | Addressed receiver metadata | You intentionally consume an addressed protocol message. |
| [`filterForMessageType(messageType)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#filterformessagetype) | One `EBMessageType` value | A protocol message kind | You are reacting to a command response or another non-custom-message kind. |
| [`filterPrincipalId(principalId)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#filterprincipalid) | One trusted, non-empty principal ID | The message principal | A trusted identity narrows the allowed message stream. |
| [`filterTenantId(tenantId)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#filtertenantid) | One trusted, non-empty tenant ID | The message tenant | A trusted tenant narrows the allowed message stream. |

Do not use `filterPrincipalId` or `filterTenantId` as record-level access
control. Check tenant ownership and the actual business permission at the
resource or service boundary as well.

## Prove both sides of the boundary

For every non-default filter, test one matching message and one near miss: a
different event name, sender, receiver, message type, principal, or tenant.
This catches accidental broadening when a publisher changes its metadata.

Next, [transform and guard a subscription](/handbook/framework/build-services/subscriptions/transform-and-guard/) when message data needs a deliberate boundary conversion.

For the full filter surface, see [SubscriptionDefinitionBuilder](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/).
