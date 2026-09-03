---
title: Consume a stream from a subscription
description: Declare a typed stream dependency, process its frames deliberately, and cancel it when the event reaction no longer needs it.
order: 338
---

Use a stream only when incremental frames are the actual contract. A stream is
not a durable work queue and it extends the subscription’s active processing
time, so prefer a command or queue when a final value or later work is enough.

The selected EventBridge must advertise stream support. Among the shipped
bridges, only `DefaultEventBridge` currently does; AMQP, NATS, MQTT, and the
HTTP/Dapr bridge reject stream registration. Decide this topology before
building a distributed dependency; see the [EventBridge capability
matrix](/handbook/framework/connect-distributed-infrastructure/event-delivery/#decide-stream-support-before-designing-a-distributed-stream).

```ts title="src/service/accounting/v1/subscription/reconcileInvoice/reconcileInvoiceSubscriptionBuilder.ts"
import { HandledError, UnhandledError, type StreamFramePayload } from '@purista/core'
import { z } from 'zod'
import { accountingV1ServiceBuilder } from '../../accountingV1ServiceBuilder.js'

const invoiceCreatedSchema = z.object({ invoiceId: z.string().min(1) })
const streamInputSchema = z.object({ invoiceId: z.string().min(1) })
const streamParameterSchema = z.object({})
const chunkSchema = z.object({ percent: z.number().min(0).max(100) })
const finalSchema = z.object({ reconciled: z.boolean() })

export const reconcileInvoiceSubscriptionBuilder = accountingV1ServiceBuilder
  .getSubscriptionBuilder('reconcileInvoice', 'Follow invoice reconciliation')
  .subscribeToEvent('billing.invoiceCreated', '1')
  .addPayloadSchema(invoiceCreatedSchema)
  .canConsumeStream(
    'Reconciliation',
    '1',
    'reconcileInvoice',
    chunkSchema,
    streamInputSchema,
    streamParameterSchema,
    finalSchema,
  )
  .setSubscriptionFunction(async function (context, payload) {
    const session = await context.stream.Reconciliation['1'].reconcileInvoice(payload, {})
    let completed = false

    try {
      for await (const frame of session) {
        const stream = frame.payload as StreamFramePayload<z.output<typeof chunkSchema>, z.output<typeof finalSchema>>
        if (stream.frameType === 'chunk' && stream.chunk) {
          context.logger.debug(
            { invoiceId: payload.invoiceId, percent: stream.chunk.percent },
            'reconciliation progress received',
          )
        }
        if (stream.frameType === 'complete' && stream.final) {
          completed = true
          context.logger.info(
            { invoiceId: payload.invoiceId, reconciled: stream.final.reconciled },
            'reconciliation completed',
          )
        }
        if (stream.frameType === 'error' && stream.error) {
          const ErrorType = stream.error.isHandledError ? HandledError : UnhandledError
          throw new ErrorType(stream.error.status, stream.error.message, stream.error.data, stream.error.traceId)
        }
      }
    } finally {
      if (!completed) await session.cancel('subscription stopped before the final frame')
    }
  })
```

[`getSubscriptionBuilder(name, description)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getsubscriptionbuilder)
creates the service-owned definition.
[`subscribeToEvent(eventName, serviceVersion?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#subscribetoevent)
selects the source fact and optional producer service version, while
[`addPayloadSchema(schema, contentType?, contentEncoding?)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#addpayloadschema)
validates the event payload before the stream is opened.
[`canConsumeStream(serviceName, serviceVersion, streamName, chunkSchema?,
payloadSchema?, parameterSchema?, finalSchema?, validateChunk = true,
validateFinal = true)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#canconsumestream)
adds a typed `context.stream` function. Unlike `canInvoke(...)`, the current
subscription builder does not reject blank service, version, or target strings
when the definition is created. Supply stable non-empty address parts; a blank
address otherwise produces a request that cannot resolve.
[`setSubscriptionFunction(fn)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction)
installs the service-bound reaction that owns the session. It returns a session
with `sessionId`, an async iterator, and `cancel(reason?)`. Consume
chunk, final, error, and cancellation paths intentionally; call `cancel` when
the remaining frames cannot change the event reaction’s outcome.

Do not hold a stream open while waiting for unrelated work. If the reaction can
finish after accepting background work, [bind the event to a queue](/handbook/framework/build-services/subscriptions/call-other-capabilities/queue-work-from-an-event/) instead.

Verify the handler with `createSubscriptionContextMock(...)`: make the declared
stream stub resolve a deterministic async session containing a `chunk` and a
`complete` frame, then assert the handler consumes both. Add a second case that
ends early and assert `session.cancel.calledOnce`. Finally run one
`DefaultEventBridge` integration test; a direct mock cannot prove stream
registration, frame routing, or cancellation transport.

For the full declaration surface, see
[`SubscriptionDefinitionBuilder`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/).
