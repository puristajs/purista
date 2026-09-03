---
title: Configure delivery failures and idempotency
description: Request consumer behavior the selected EventBridge can honor, and make the business side effect safe when delivery repeats.
order: 341
---

This page configures consumer behavior. It does not create broker guarantees:
the selected EventBridge and its deployed broker determine what durable
delivery, retry, delay, dead-letter, fan-out, and pause behavior are real.
Choose the adapter before relying on a recovery path.

## Ask NATS JetStream for bounded delayed retry

This combination requires a NATS broker with JetStream enabled. `NatsBridge`
updates its durability and manual-ack capabilities after connecting, before the
service validates and registers the subscription:

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
recordInvoiceSubscriptionBuilder
  .adviceDurable(true)
  .adviceAutoacknowledgeMessage(false)
  .receiveMessageOnEveryInstance(false)
  .adviceConsumerFailureHandling({
    mode: 'strict',
    maxAttempts: 5,
    retryDelayMs: 1_000,
    deadLetterTarget: 'accounting.invoice-created.dead-letter',
  })
```

For AMQP, omit `retryDelayMs`: the adapter supports durable manual
acknowledgement, bounded retry, dead-letter, drop, and stop-consumer controls,
but does not advertise delayed retry.

```ts title="AMQP subscription delivery advice"
recordInvoiceSubscriptionBuilder
  .adviceDurable(true)
  .adviceAutoacknowledgeMessage(false)
  .adviceConsumerFailureHandling({
    mode: 'strict',
    maxAttempts: 5,
    deadLetterTarget: 'accounting.invoice-created.dead-letter',
  })
```

Do not combine requirements from different adapter rows and assume they form a
portable policy:

| EventBridge at registration time | Durable | Manual ack | Bounded retry | Delayed retry | Dead letter | Drop / stop consumer |
| --- | --- | --- | --- | --- | --- | --- |
| Default | No | No | No | No | No | No |
| AMQP | Yes | Yes | Yes | No | Yes | Yes |
| NATS with JetStream | Yes | Yes | Yes | Yes | Yes | Yes |
| Core NATS without JetStream | No | No | No usable strict consumer path | No usable strict consumer path | No usable strict consumer path | No |
| MQTT | No | No | No | No | No | No |
| HTTP / Dapr | No | No | No | No | No | No |

The NATS constructor starts with conservative durability/manual-ack flags and
updates them after it detects JetStream. Always call `eventBridge.start()`
before `service.start()`.

| Method | Default | Enforced runtime contract |
| --- | --- | --- |
| [`adviceDurable(durable)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#advicedurable) | `false` | `true` is a hard startup requirement for durable subscriptions. AMQP and NATS with JetStream satisfy it. |
| [`adviceAutoacknowledgeMessage(acknowledge = true)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#adviceautoacknowledgemessage) | `true` | `false` is a hard startup requirement for manual acknowledgement. AMQP and NATS with JetStream satisfy it. |
| [`receiveMessageOnEveryInstance(enforce = true)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#receivemessageoneveryinstance) | Definition starts with `shared: true` | `true` sets `shared: false` and requests delivery to every instance. This request has no Service-side capability gate; verify adapter fan-out. |
| [`adviceConsumerFailureHandling({ mode?, maxAttempts?, retryDelayMs?, deadLetterTarget? })`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#adviceconsumerfailurehandling) | `mode: 'strict'`, `maxAttempts: 1`, `retryDelayMs: 0` | Request bounded retry and/or dead-letter behavior. |

An unsupported durable requirement fails service startup with `subscription
"<name>" requires durable delivery, but <bridge> does not support durable
subscriptions`. An unsupported manual-ack requirement uses the corresponding
`requires manual acknowledgement` error. Both are `UnhandledError` values with
status `501 Not Implemented`.

`maxAttempts` must be at least `1`; `retryDelayMs` must be at least `0`; and
`mode` is `'strict'` or `'best-effort'`. These defaults are resolved only when
`adviceConsumerFailureHandling(...)` is called. In strict mode, service startup and
control-result execution reject unsupported requested capabilities. In
best-effort mode, accept only a documented adapter degradation.

Invalid values throw plain definition-time errors:

- `maxAttempts must be greater than 0`
- `retryDelayMs must be greater than or equal to 0`
- `mode must be either "strict" or "best-effort"`

The current strict startup gate also requires the selected EventBridge to
advertise a dead-letter target for **any** strict failure-handling
configuration, even when the configuration only requests bounded retry. With
the resolved defaults, `maxAttempts: 1` does not request bounded retry and
`retryDelayMs: 0` does not request delay, but the dead-letter capability check
still runs even when `deadLetterTarget` was omitted. Check that capability
before selecting strict mode; use `best-effort` only when an adapter-specific
degraded outcome is acceptable and documented.

## Make the business effect repeat-safe

Use an idempotent business key at the resource boundary. After a crash between
a write and completion, the redelivered message must discover the completed
effect instead of applying it again.

```ts title="src/service/accounting/v1/subscription/recordInvoice/ledgerResource.ts"
export async function recordInvoiceOnce(invoice: { invoiceId: string; amountCents: number }) {
  const existing = await ledgerRepository.findByInvoiceId(invoice.invoiceId)
  if (existing) return existing

  return await ledgerRepository.insert({
    invoiceId: invoice.invoiceId,
    amountCents: invoice.amountCents,
  })
}
```

The resource/database must make the lookup-and-write safe under concurrent
deliveries—for example with an appropriate unique constraint—not merely rely
on the application-level lookup.

## Operate a bounded repair path

Give each dead-letter target an owner, a business-key lookup, a maximum replay
scope, and evidence required before replay. A dead-letter target is not a
backup copy of customer data, and an unbounded replay is not recovery. Follow
the selected [EventBridge guide](/handbook/framework/connect-distributed-infrastructure/event-delivery/) and [recovery and replay](/handbook/framework/secure-and-operate/reliability/recovery-and-replay/) procedure for adapter-specific operation.

For NATS, `deadLetterTarget` is a subject. For AMQP, it is the dead-letter queue
or routing target; when the subscription omits it, the adapter can fall back to
its configured `deadLetterRoutingKey`.

## Verify the startup contract

Run one negative startup test with a bridge that lacks the required capability
and assert the exact `Not Implemented` message. Then run the positive integration
test against the selected broker: force one transient failure, assert the
bounded number and timing of attempts, and verify the named dead-letter target.
The first test proves PURISTA's gate; the second proves the broker configuration.

Next, [test subscriptions](/handbook/framework/build-services/subscriptions/test-subscriptions/) to separate deterministic flow evidence from deployed-broker evidence.

For the definition API, see [SubscriptionDefinitionBuilder](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/).
