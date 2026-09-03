---
title: Queue work from an event
description: Bind an event to durable queue work at the service boundary, with explicit payload mapping, idempotency, and enqueue-failure behavior.
order: 339
---

Use an event-to-queue binding when every matching event must become durable,
independently operated work. This is not a handler feature: a regular
subscription has no `canEnqueue(...)`, and its queue context rejects enqueueing
at runtime. The service builder creates a bounded subscription for the binding.

## Bind the event to the queue

```ts title="src/service/accounting/v1/accountingV1ServiceBuilder.ts"
export const accountingV1ServiceBuilder = new ServiceBuilder(serviceInfo)
  .addQueueDefinition(monthlyClosingQueue)
  .bindEventToQueue('billing.monthlyCycleDue', 'accounting.monthlyClosing', {
    idempotencyMode: 'strict',
    idempotencyKey: message => {
      const payload = message.payload as { cycleId: string }
      return `monthly-close:${payload.cycleId}`
    },
    mapPayload: payload => ({ cycleId: payload.cycleId }),
    mapParameter: () => ({ source: 'monthly-cycle' }),
    onEnqueueFailure: { reason: 'queue temporarily unavailable', delayMs: 1_000 },
  })
```

[`addQueueDefinition(...queues)`](/handbook/api/classes/_purista_core.ServiceBuilder/#addqueuedefinition)
accepts one or more resolved or pending queue definitions and records the job
contract on this service. It does not start a worker or provision a QueueBridge.
Register the matching queue before the service resolves definitions; adding it
after `getInstance(...)` or `resolveDefinitions()` throws.

[`bindEventToQueue(eventName, queueName, options?)`](/handbook/api/classes/_purista_core.ServiceBuilder/#bindeventtoqueue)
records a generated subscription that consumes `eventName` and enqueues
`queueName` when that event arrives. Both names are required; omitting
`options` uses advisory idempotency. The generated binding is registered only
when the service starts. An unknown queue fails when that binding tries to
enqueue the event. With a QueueBridge that performs strict startup validation,
an unsupported `strict` idempotency request fails service startup with
`UnhandledError(StatusCode.NotImplemented)` and identifies the binding and
bridge. Otherwise the bridge is responsible for its own capability behavior.

The generated subscription is named
`eventToQueue:<eventName>:<queueName>` in logs, traces, and metrics. Each queue
job receives `purista.sourceEventName`, `purista.sourceMessageId`, and the
source principal/tenant identity headers.

The custom `idempotencyKey` function receives the complete EventBridge message,
so read the event data from `message.payload`. `mapPayload` and `mapParameter`
receive the event payload directly. These callback inputs are intentionally
different because an idempotency strategy may need stable message metadata.

`bindEventToQueue(eventName, queueName, options = {})` accepts:

| Option | Default | What it does |
| --- | --- | --- |
| `idempotencyMode` | `'advisory'` | Requests advisory or strictly enforced idempotency. `strict` fails service startup when the QueueBridge cannot enforce keys. |
| `idempotencyKey` | no key | Uses `'messageId'`, `'correlationId'`, `'none'`, `'eventField'` (the payload's `id` property only), or a function that receives the complete message and returns a stable non-sensitive key. |
| `mapPayload` | source event payload | Converts the event data to the queue payload. |
| `mapParameter` | `undefined` | Creates queue parameters from the event data. |
| `onEnqueueFailure` | rethrow | Use `{ reason, delayMs? }` to request retry. Use `{ status: 'fail', reason }` to request dead-letter handling. No other `status` value is valid. |

Do not put raw payloads, credentials, tokens, or personal data into an
idempotency key. A business key such as a cycle ID is often clearer than a
broker message ID when duplicate business events must coalesce.

## Keep the two delivery guarantees separate

The EventBridge delivers the source event to the generated binding; the
QueueBridge accepts and later delivers the queue job. Neither guarantee implies
the other. Test mapping and idempotency policy deterministically, then prove
the selected EventBridge and QueueBridge behaviour in the deployed topology.

The generated subscription becomes durable and disables automatic
acknowledgement only when the EventBridge reports both durable-subscription and
manual-acknowledgement support. Among the shipped bridges, AMQP and a started
NATS bridge connected to a JetStream-enabled broker provide both. Core NATS
without JetStream, Default, MQTT, and HTTP/Dapr produce a non-durable,
automatically acknowledged handoff, so `onEnqueueFailure` cannot turn the
source delivery into a durable broker retry. Select the EventBridge and
QueueBridge from the end-to-end delivery guarantee you need.

Next, implement the consumer in [queues and workers](/handbook/framework/build-services/queues-and-workers/).

For the service API, see [ServiceBuilder](/handbook/api/classes/_purista_core.ServiceBuilder/).
