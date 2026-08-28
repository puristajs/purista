---
title: Consume a stream from a subscription
description: Declare a typed stream dependency, process its frames deliberately, and cancel it when the event reaction no longer needs it.
order: 338
---

Use a stream only when incremental frames are the actual contract. A stream is
not a durable work queue and it extends the subscription’s active processing
time, so prefer a command or queue when a final value or later work is enough.

```ts title="src/service/accounting/v1/subscription/reconcileInvoice/reconcileInvoiceSubscriptionBuilder.ts"
reconcileInvoiceSubscriptionBuilder
  .canConsumeStream('Reconciliation', '1', 'reconcileInvoice', chunkSchema, inputSchema, z.object({}), finalSchema)
  .setSubscriptionFunction(async function (context, payload) {
    const session = await context.stream.Reconciliation['1'].reconcileInvoice(payload, {})

    for await (const frame of session) {
      if (frame.payload.chunk) {
        context.logger.debug({ invoiceId: payload.invoiceId }, 'reconciliation progress received')
      }
    }
  })
```

[`canConsumeStream(serviceName, serviceVersion, streamName, chunkSchema?,
payloadSchema?, parameterSchema?, finalSchema?, validateChunk = true,
validateFinal = true)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#canconsumestream)
adds a typed `context.stream` function.
[`setSubscriptionFunction(fn)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction)
installs the service-bound reaction that owns the session. It returns a session
with `sessionId`, an async iterator, and `cancel(reason?)`. Consume
chunk, final, error, and cancellation paths intentionally; call `cancel` when
the remaining frames cannot change the event reaction’s outcome.

Do not hold a stream open while waiting for unrelated work. If the reaction can
finish after accepting background work, [bind the event to a queue](/handbook/framework/build-services/subscriptions/call-other-capabilities/queue-work-from-an-event/) instead.
