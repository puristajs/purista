---
title: Reliability and delivery guarantees
description: Design handlers for timeouts, duplicate delivery, retries, and recovery instead of assuming exactly-once execution.
order: 270
---

Reliability is a property of the whole path: handler, bridge, store, external service, and deployment. A successful local test does not prove durable distributed delivery.

## The minimum rules

- Make externally visible side effects idempotent before enabling retry.
- Use a stable business key, not a random retry attempt, to detect repeated work.
- Set a timeout that fits the caller's contract; move slow work to a queue.
- Return an explicit subscription outcome: acknowledge, retry, dead-letter, drop, or stop the consumer according to the failure.
- Record enough non-sensitive operational context to diagnose a failure without logging payloads or credentials.

| Situation | Safe design |
| --- | --- |
| A notification request times out after the provider may have accepted it | Persist a delivery key and reconcile before retrying. |
| A queue worker crashes after a side effect | Make the provider call idempotent, then allow lease recovery/retry. |
| A subscriber cannot parse a message | Dead-letter or stop according to policy; do not endlessly retry an invalid contract. |

## Return a typed subscription outcome

A subscription can finish normally or return a
[`SubscriptionHandlerResult`](/handbook/api/types/_purista_core.SubscriptionHandlerResult/).
Use a control result only after deciding whether repeating the handler is safe:

```ts title="src/service/notification/deliveryOutcome.ts"
import type { SubscriptionHandlerResult } from '@purista/core'

type DeliveryPayload = { customerId?: string }
type DeliverIdempotently = (payload: DeliveryPayload) => Promise<void>

export const decideDelivery = async (
  payload: DeliveryPayload,
  deliverIdempotently: DeliverIdempotently,
): Promise<SubscriptionHandlerResult> => {
  if (!payload.customerId) {
    return { status: 'deadLetter', reason: 'customerId is required' }
  }

  try {
    await deliverIdempotently(payload)
    return { status: 'ack' }
  } catch {
    return { status: 'retry', reason: 'provider unavailable', delayMs: 5_000 }
  }
}
```

Call this policy helper from the function passed to
[`setSubscriptionFunction(handler)`](/handbook/api/classes/_purista_core.SubscriptionDefinitionBuilder/#setsubscriptionfunction)
and return its result unchanged.

`drop` acknowledges the current message without processing it again;
`stop-consumer` asks the bridge to stop this consumer. A deeply nested helper
that cannot return the result can throw
[`SubscriptionConsumerControlError`](/handbook/api/classes/_purista_core.SubscriptionConsumerControlError/)
with the same outcome, reason, and optional retry delay. Bridge capabilities
decide whether requested retry, delay, dead-lettering, or consumer stop can be
honored. Verify the handler deterministically by asserting its returned status,
then test the selected adapter's real retry and dead-letter path before release.

Continue with [acknowledge and control delivery](/handbook/framework/build-services/subscriptions/acknowledge-and-control-delivery/)
for capability checks and tests. Choose the bridge and queue adapter based on
required durability and recovery behavior in
[Connect distributed infrastructure](/handbook/framework/connect-distributed-infrastructure/).

Next: [build services](/handbook/framework/build-services/).
