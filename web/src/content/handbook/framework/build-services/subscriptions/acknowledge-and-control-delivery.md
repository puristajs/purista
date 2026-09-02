---
title: Acknowledge and control delivery
description: Complete normally or request retry, dead-letter, drop, or pause behavior without confusing framework controls with broker guarantees.
order: 334
---

Most handlers should return `undefined`. It means the business effect completed
or was safely deduplicated. Return a control result only when the handler knows
what the EventBridge should do next. The selected bridge still decides whether
it can honor that request.

## Choose the outcome that matches the condition

| Handler result | Framework behavior | Use it when |
| --- | --- | --- |
| `undefined` | Normal successful completion | The effect is complete or safely deduplicated. |
| `{ status: 'ack' }` | Explicit normal completion | The same condition as `undefined`, when naming the outcome improves clarity. |
| `{ status: 'retry', reason?, delayMs? }` | Asks the EventBridge to redeliver | A transient dependency failed and the effect is repeat-safe. |
| `{ status: 'deadLetter', reason? }` | Asks the EventBridge for its dead-letter path | Repair or operator review is required. |
| `{ status: 'drop', reason? }` | Asks the EventBridge to discard the delivery | Loss is an approved, non-actionable business decision. |
| `{ status: 'stop-consumer', reason? }` | Asks the EventBridge to pause the consumer | A runbook and supported resume path exist. |

Any control result bypasses output validation, after guards, output transforms,
and configured result-event creation. A `HandledError` completes the delivery
without redelivery; an unexpected thrown error is rethrown to the EventBridge’s
failure path.

## Return a deliberate control result

```ts title="src/service/accounting/v1/subscription/recordInvoice/recordInvoiceSubscriptionBuilder.ts"
import { HandledError, StatusCode } from '@purista/core'

recordInvoiceSubscriptionBuilder
  .adviceConsumerFailureHandling({
    mode: 'strict',
    maxAttempts: 5,
    retryDelayMs: 1_000,
    deadLetterTarget: 'accounting.invoice-created.dead-letter',
  })
  .setSubscriptionFunction(async function (context, payload) {
  const existing = await context.resources.ledger.findByInvoiceId(payload.invoiceId)
  if (existing) return undefined // Safe idempotent completion.

  try {
    await context.resources.ledger.recordInvoice(payload)
    return undefined
  } catch (error) {
    if (error instanceof HandledError && error.errorCode === StatusCode.ServiceUnavailable) {
      return { status: 'retry', reason: 'ledger temporarily unavailable', delayMs: 1_000 }
    }

    return { status: 'deadLetter', reason: 'ledger record cannot be created' }
  }
})
```

[`setSubscriptionFunction(fn)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction)
installs the service-bound handler whose normal value or explicit control
result the runtime interprets. It does not configure retries by itself; pair a
control result with the selected bridge's capabilities and the subscription's
delivery advice before relying on recovery.

Do not retry an invalid schema, authorization failure, or an unknown
external-side-effect state blindly. Make the resource operation idempotent by a
business key; after a crash between the write and completion, a redelivery can
then detect the existing effect.

## Know the bridge boundary

Only AMQP and NATS currently act on subscription control errors. The default,
MQTT, and HTTP/Dapr EventBridges log the control error; they do not retry,
dead-letter, drop, or pause the delivery.

| EventBridge | `retry` / delayed retry | `deadLetter` | `drop` | `stop-consumer` |
| --- | --- | --- | --- | --- |
| Default | Logged only | Logged only | Logged only | Logged only |
| AMQP | Adapter-controlled | Adapter-controlled | Adapter-controlled | Adapter-controlled |
| NATS | Adapter-controlled | Adapter-controlled | Adapter-controlled | Adapter-controlled |
| MQTT | Logged only | Logged only | Logged only | Logged only |
| HTTP / Dapr | Logged only | Logged only | Logged only | Logged only |

Capability checks run only after the definition calls
[`adviceConsumerFailureHandling(...)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#adviceconsumerfailurehandling).
That call defaults to `mode: 'strict'`; without the call, no control-capability
check runs. Strict execution checks delayed retry only when `delayMs` is greater
than zero. A plain retry still relies on the adapter's behavior.

`best-effort` permits only the degradation documented by the selected adapter.
The broker owns retention, redelivery timing, dead-letter storage, and resume
operations. Verify each requested outcome with the deployed EventBridge before
depending on it for recovery.

Next, [configure delivery failures and idempotency](/handbook/framework/build-services/subscriptions/delivery-failures-and-idempotency/) before depending on a recovery path.

For the control-result type, see [SubscriptionHandlerResult](/handbook/api/types/_purista_core.SubscriptionHandlerResult/).
