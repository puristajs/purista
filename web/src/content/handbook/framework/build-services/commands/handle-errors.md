---
title: Handle command errors
description: Keep invalid input, expected business rejection, and unexpected failure distinct so callers and operators receive the right signal.
order: 330
---

Command error handling starts with the contract. Let schema validation reject malformed input before the handler runs. Throw `HandledError` only for an expected business result that is safe to share. Let bugs and unavailable dependencies remain unexpected so the runtime, logs, and traces can show the real failure.

[Handle errors across service primitives](/handbook/framework/build-services/handle-service-errors/)
owns the shared error classification and `HandledError` contract. This page
owns the command-specific lifecycle exits, caller response, acknowledgement
advice, and recovery choice.

## Classify the outcome

| Situation | What to do | What must not happen |
| --- | --- | --- |
| Payload or parameter has the wrong shape | Let the declared schemas reject it. | Duplicate validation manually in the handler. |
| A known business rule prevents the action | Throw a `HandledError`. | Return a fake success or leak internal details. |
| A dependency is unavailable or an invariant is broken | Let the error propagate. | Convert it into a caller-facing domain message. |
| The handler returns an invalid result | Fix the implementation/output contract. | Continue to after guards or publish success. |

## Keep business errors deliberate

The first command task shows the reviewed `404` branch beside the handler in
[Create and validate a command](/handbook/framework/build-services/commands/create-and-validate/#3-implement-the-handler-and-expected-business-error).
Keep that mapping close to the domain decision. Do not catch a database or
provider exception only to expose its message through `HandledError`.

```ts title="src/service/invoice/v1/command/updateInvoice/assertInvoiceEditable.ts"
import { HandledError, StatusCode } from '@purista/core'

export const assertInvoiceEditable = (status: string) => {
  if (status === 'paid') {
    throw new HandledError(StatusCode.Conflict, 'A paid invoice cannot be changed', {
      rule: 'invoice-is-paid',
    })
  }
}
```

A handled command response carries `{ status, message, data?, traceId }` and is
marked as handled on the EventBridge envelope. Keep `data` stable and safe for
the caller; do not include provider errors, database records, credentials, or
stacks.

## Know what the caller receives

| Failure stage | Command error payload | Later stages skipped |
| --- | --- | --- |
| No registered `serviceTarget` | `501 Not Implemented` and a trace ID. | Every command lifecycle stage; no handler was resolved. |
| Raw parameter or payload schema | Handled `400`, validation issues in `data`, and the trace ID. | Input transform, domain validation, guards, handler, and every output stage. |
| Input transform | A deliberate `HandledError` is public; every other failure becomes generic `500`. | Domain validation, guards, handler, and every output stage. |
| Domain payload or parameter schema | Handled `400`, validation issues in `data`, and the trace ID. | Guards, handler, and every output stage. |
| Before guard | A deliberate `HandledError` is public; every other failure becomes generic `500`. | Handler and every output stage. |
| Handler or resource | A deliberate `HandledError` is public; every other failure becomes generic `500`. | Domain output validation and every later success stage. |
| Domain output schema | Generic `500`; schema issues remain internal. | After guards, output transform, response creation, and named success-event matching. |
| After guard | A deliberate `HandledError` is public; every other failure becomes generic `500`. | Output transform, response creation, and named success-event matching. Handler side effects may already exist. |
| Output transform | A deliberate `HandledError` is public; every other failure becomes generic `500`. | Transformed-output validation, response creation, and named success-event matching. Handler side effects may already exist. |
| Transformed-output schema | Generic `500`; schema issues remain internal. | Response creation and named success-event matching. Handler side effects may already exist. |

The transport may project this payload into another representation, such as
Hono problem details. The visibility rule remains the same: handled details
are public by application choice; unhandled details stay internal.

The [complete command lifecycle](/handbook/framework/build-services/commands/#follow-the-complete-command-lifecycle)
shows these stages in execution order. The builder chain records the
configuration; it does not change that order.

### Failures from declared outbound capabilities

| Outbound failure | Internal classification | Caller-visible result when uncaught |
| --- | --- | --- |
| Custom event payload fails its declared schema, or no event schema exists | `UnhandledError(500)` | Generic `500`; event-schema details remain internal. |
| Invoked payload/parameter fails the caller-owned downstream schema | `UnhandledError` with internal `400` classification | Generic `500`, because this handler constructed invalid downstream input. |
| Invoked response fails the caller-owned output schema | `UnhandledError(500)` | Generic `500`. |
| Downstream command returns `HandledError` | Reconstructed `HandledError` | The downstream status/message/data pass through unless this handler catches and maps them. |
| Queue is not declared by the handler / not registered by the service | `UnhandledError` with internal `403` / `404` | Generic `500`; fix service composition. |
| Consumed stream chunk/final fails its configured schema | `UnhandledError(500)` during iteration | Generic `500` if the command does not catch and safely map it. |

## Keep recovery at the owning boundary

Commands are request-response operations. [`adviceAutoacknowledgeMessages(acknowledge = true)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#adviceautoacknowledgemessages)
supplies delivery advice to the EventBridge; its default is `true`. Setting it
to `false` does not create command-local retry or exactly-once delivery—provider
support and response delivery decide whether redelivery is possible.

`adviceAutoacknowledgeMessages(false)` requires an EventBridge whose
`manualAckSupported` capability is true. `DefaultEventBridge`, MQTT, Dapr, and
NATS without JetStream cannot honor it; strict command registration throws
`501` with `command "<name>" requires manual acknowledgement, but <bridge> does
not support it`. AMQP supports manual acknowledgement, and NATS enables it after
JetStream starts successfully.

## Verify the error envelope

```ts title="src/service/invoice/v1/command/updateInvoice/updateInvoiceCommandBuilder.runtime.test.ts"
import { createCommandTestHarness, isCommandErrorResponse, StatusCode } from '@purista/core'

const harness = await createCommandTestHarness(invoiceV1ServiceBuilder, updateInvoiceCommandBuilder, { resources })

try {
  const { message, result } = await harness.run({ payload: paidInvoiceUpdate, parameter })
  expect(result).toBeUndefined()
  if (!isCommandErrorResponse(message)) throw new Error('expected command error response')
  expect(message.isHandledError).toBe(true)
  expect(message.payload).toMatchObject({
    status: StatusCode.Conflict,
    message: 'A paid invoice cannot be changed',
  })
} finally {
  await harness.destroy()
}
```

This deterministic test proves command classification and serialization. Test
the Hono problem-details projection and the selected EventBridge separately at
their actual transport boundaries.

For a business conflict, return the known result now. For durable retry, dead-lettering, or backoff, move the work to a [queue and worker](/handbook/framework/build-services/queues-and-workers/) or use a [subscription delivery policy](/handbook/framework/build-services/subscriptions/). Make an external side effect idempotent before allowing any retry path.

[`markSchedulable(options)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#markschedulable)
attaches command schedule metadata; it does not run a scheduler. Its defaults
are `concurrencyPolicy: 'allow'`, `missedRunPolicy: 'skip'`, and
`enabledByDefault: true`. The options also own the expression/time zone,
catch-up count, jitter, idempotency key, target schemas, and provider hints;
choose and deploy them in [Schedule work](/handbook/framework/build-services/schedule-work/).
[`markAsDeprecated()`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#markasdeprecated)
is metadata only; retain the working implementation until callers have a
documented replacement.

Next, [publish the success event](/handbook/framework/build-services/commands/publish-success-event/) or [test a command](/handbook/framework/build-services/commands/test-a-command/).

For the API signatures, see [CommandDefinitionBuilder](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/).
