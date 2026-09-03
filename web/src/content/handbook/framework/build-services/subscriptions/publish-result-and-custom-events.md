---
title: Publish result and custom events
description: Return one validated result event from the subscription or declare and emit a separate business fact for an independent reaction.
order: 335
---

There are two event boundaries. Use a result event when the normal output of
this subscription is itself the fact another subscriber needs. Use a custom
event when the handler produces a separate business fact during its work.

## Return a validated result event

[`addOutputSchema(eventName, schema, contentType?, encoding?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addoutputschema) validates a
normal handler result. After after-guards and an optional output transform, the
runtime returns a custom EventBridge message with that event name.

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
import { z } from 'zod'

const ledgerEntryCreatedSchema = z.object({ ledgerEntryId: z.string() })

recordInvoiceSubscriptionBuilder
  .addOutputSchema('accounting.ledgerEntryCreated', ledgerEntryCreatedSchema)
  .setSubscriptionFunction(async function (context, payload) {
    const entry = await context.resources.ledger.recordInvoice(payload)
    return { ledgerEntryId: entry.id }
  })
```

[`setSubscriptionFunction(fn)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction)
installs the service-bound handler that returns this normal result. The result
event is produced only after that handler completes its normal validation and
post-handler stages.

`Service.executeSubscription(...)` returns the message to the EventBridge
callback; the adapter publishes it. The shipped Default, AMQP, NATS, MQTT, and
HTTP adapters implement that callback boundary. Verify the result-event route
with the selected adapter because its publish confirmation and delivery
guarantees differ.

The returned message has `messageType: CustomMessage`, the configured
`eventName`, no receiver, and this sender address:

```ts title="Generated result-event sender address"
{
  serviceName: accountingV1ServiceInfo.serviceName,
  serviceVersion: accountingV1ServiceInfo.serviceVersion,
  serviceTarget: 'recordInvoice',
  instanceId: eventBridge.instanceId,
}
```

Its content type and encoding come from the third and fourth
`addOutputSchema(...)` arguments and default to `application/json` and `utf-8`.
Use those sender fields when a downstream subscription calls
`filterSentFrom(...)`.

This is not `context.emit(...)`. It does not run for a control result, handler
failure, failed after guard, or failed output transform, and it is not
transactional with a resource write. The publishing adapter may deliver it to
matching subscriptions; this handler does not wait for those subscribers.

## Emit a separate fact deliberately

Declare every custom event before the handler uses it. The declaration types
`context.emit` and makes the dependency visible in the service definition.

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
import { z } from 'zod'

const ledgerPostingPreparedSchema = z.object({ invoiceId: z.string(), ledgerEntryId: z.string() })

recordInvoiceSubscriptionBuilder
  .canEmit('accounting.ledgerPostingPrepared', ledgerPostingPreparedSchema)
  .setSubscriptionFunction(async function (context, payload) {
    const entry = await context.resources.ledger.recordInvoice(payload)
    await context.emit('accounting.ledgerPostingPrepared', {
      invoiceId: payload.invoiceId,
      ledgerEntryId: entry.id,
    })
  })
```

[`canEmit(eventName, schema)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#canemit)
creates the typed event allow-list, while
[`setSubscriptionFunction(fn)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction)
installs the handler that may use it. A declaration does not publish anything;
the explicit `context.emit(eventName, payload, contentType?, contentEncoding?)`
call validates its payload against the registered schema before publishing.
Repeated declarations merge distinct event names. Reusing an event name replaces
its registered schema, so keep one declaration per name.

In a direct handler test, assert
`stubs.emit['accounting.ledgerPostingPrepared'].calledOnce`. For a result event,
run the service with the selected EventBridge and subscribe a capture handler to
`accounting.ledgerEntryCreated`; assert its event name, payload, and sender
address. A direct `getSubscriptionFunction()` call cannot prove result-event
construction or adapter publication.

| Need | Choose | Why |
| --- | --- | --- |
| One validated normal output from this reaction | [`addOutputSchema(...)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addoutputschema) | The runtime returns a result event after normal completion. |
| An additional, independently meaningful business fact | [`canEmit(...)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#canemit) and `context.emit(...)` | The handler publishes an explicit, declared event. |
| A bounded reply to the original caller | A command | A subscription has no original request/response caller. |

Keep both payloads small and version them deliberately. If event delivery must
be coupled atomically to a database write, model and operate an explicit
outbox/recovery pattern; neither mechanism provides that transaction.

Next, [call other capabilities](/handbook/framework/build-services/subscriptions/call-other-capabilities/) when the reaction needs another service or durable background work.

For the builder surface, see [SubscriptionDefinitionBuilder](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/).
