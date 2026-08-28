---
title: Configure delivery failures and idempotency
description: Request consumer behavior the selected EventBridge can honor, and make the business side effect safe when delivery repeats.
order: 341
---

This page configures consumer behavior. It does not create broker guarantees:
the selected EventBridge and its deployed broker determine what durable
delivery, retry, delay, dead-letter, fan-out, and pause behavior are real.
Choose the adapter before relying on a recovery path.

## Ask for the consumer behavior you need

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

| Method | Default | Request to the selected EventBridge |
| --- | --- | --- |
| [`adviceDurable(durable)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#advicedurable) | `false` | Keep matching deliveries while the consumer is absent. |
| [`adviceAutoacknowledgeMessage(acknowledge = true)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#adviceautoacknowledgemessage) | `true` | Acknowledge delivery immediately; set `false` only when redelivery after unexpected execution/response failure is required and supported. |
| [`receiveMessageOnEveryInstance(enforce = true)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#receivemessageoneveryinstance) | Builder starts shared (`false` enforcement) | With `true`, request delivery to every running instance; with `false`, request a shared consumer. |
| [`adviceConsumerFailureHandling({ mode?, maxAttempts?, retryDelayMs?, deadLetterTarget? })`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#adviceconsumerfailurehandling) | `mode: 'strict'`, `maxAttempts: 1`, `retryDelayMs: 0` | Request bounded retry and/or dead-letter behavior. |

`maxAttempts` must be at least `1`; `retryDelayMs` must be at least `0`; and
`mode` is `'strict'` or `'best-effort'`. These defaults are resolved only when
`adviceConsumerFailureHandling(...)` is called. In strict mode, service startup and
control-result execution reject unsupported requested capabilities. In
best-effort mode, accept only a documented adapter degradation.

The current strict startup gate also requires the selected EventBridge to
advertise a dead-letter target for **any** strict failure-handling
configuration, even when the configuration only requests bounded retry. Check
that capability before selecting strict mode; use `best-effort` only when an
adapter-specific degraded outcome is acceptable and documented.

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

Next, [test subscriptions](/handbook/framework/build-services/subscriptions/test-subscriptions/) to separate deterministic flow evidence from deployed-broker evidence.

For the definition API, see [SubscriptionDefinitionBuilder](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/).
