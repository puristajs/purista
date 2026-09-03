---
title: Handle errors across service primitives
description: Look up the shared classification of safe business rejections, unexpected failures, and primitive-specific recovery without leaking internal details.
order: 371
---

An error is part of the contract only when a caller or consumer can act on it
safely. Start by classifying the outcome, then apply the recovery mechanism
owned by the primitive. A `HandledError` is not a general retry tool, and a
retry request is not a way to make an unsafe side effect safe.

```mermaid title="Error classification begins before primitive-specific recovery"
flowchart TD
  A[Handler cannot complete] --> B{Known business outcome\nand safe to share?}
  B -->|Yes| C[Throw HandledError]
  B -->|No| D{Transient work delivery\nand effect is idempotent?}
  D -->|Yes| E[Use the primitive's retry control]
  D -->|No| F[Let unexpected failure propagate\nor use a deliberate terminal control]
  C --> G[Primitive maps the outcome]
  E --> G
  F --> G
  G --> H[Command response, subscription delivery, stream frame, or queue-job state]
```

## Classify the outcome

| Situation | Correct action | Why |
| --- | --- | --- |
| Input does not match its declared schema | Let schema validation reject it. | Validation already produces a handled bad-request outcome before the handler runs. |
| A known business rule prevents the requested action | Throw `HandledError` with a stable, caller-safe message and data. | It intentionally crosses a command or handler boundary. |
| A bug, corrupt state, programming invariant, or unknown dependency failure occurs | Let it propagate after recording safe diagnostic context. | PURISTA records an internal failure; exposing implementation details would be unsafe. |
| A subscription or worker can safely repeat an idempotent effect after a transient failure | Return that primitive's retry control. | The bridge or queue adapter, not `HandledError`, owns redelivery and timing. |
| An item needs repair or approved loss | Return the supported dead-letter or drop control. | The selected adapter and runbook own the final destination and recovery procedure. |

Command input-validation issues are placed in the caller-visible `data` field
of the handled error response. Validator issues can include field paths and
rejected values. If that detail is unsuitable for the caller, validate or
redact the external shape at the transform/guard boundary and return a stable,
reviewed business error.

## Choose the exported error type

| Type | Constructor and helpers | Use |
| --- | --- | --- |
| [`HandledError`](/handbook/api/classes/_purista_core.HandledError/) | `new HandledError(status, message?, data?, traceId?)`; `fromMessage(...)`, `fromError(...)`, `getErrorResponse(...)`, `toJSON()` | A reviewed business outcome whose message and data may cross the service boundary. `fromError(...)` does not make an arbitrary error safe. |
| [`UnhandledError`](/handbook/api/classes/_purista_core.UnhandledError/) | `new UnhandledError(status = 500, message?, data?, traceId?)`; `fromMessage(...)`, `fromError(...)`, `intoHandledError()`, `getErrorResponse()`, `toJSON()` | Framework/runtime failures and failed downstream calls. The command response path replaces its details with a generic error unless you deliberately convert it after reviewing the data. |
| [`SubscriptionConsumerControlError`](/handbook/api/classes/_purista_core.SubscriptionConsumerControlError/) | `new SubscriptionConsumerControlError(result)` or `(outcome, reason?, delayMs?)`; `isSubscriptionConsumerControlError(value)` | Adapter-facing representation of a subscription control result. Application handlers normally return the result object described below. |

`StatusCode` is PURISTA's exported enum of HTTP-shaped numeric codes. An
exposed HTTP command uses the handled error's numeric value as its HTTP status.
Common Framework-produced outcomes are:

| Status | Typical Framework source |
| --- | --- |
| `400 BadRequest` | Input or parameter schema validation, or an invalid queued/stream invocation payload. |
| `403 Forbidden` | A handler enqueues a queue it did not declare. |
| `404 NotFound` | A queue or HTTP route does not exist. |
| `501 NotImplemented` | A command target or required queue/stream adapter capability is unavailable. |
| `500 InternalServerError` | Output validation, undeclared custom-event schema, or an unexpected failure. |
| `503 ServiceUnavailable` | EventBridge or QueueBridge health fails during startup. |

## Return a deliberate business rejection

`HandledError` has the positional form
`new HandledError(statusCode, message?, data?, traceId?)`. Its message and data
are public contract data for a command caller, and may be observed by other
transports. Keep both small, stable, and safe. Use the existing trace ID to
correlate operator-visible diagnostics; do not put a stack trace, credential,
raw upstream response, or request body in the error.

```ts title="src/service/invoice/v1/shared/cancelInvoiceError.ts"
import { HandledError, StatusCode } from '@purista/core'

export const paidInvoiceCannotBeCancelled = (invoiceId: string, traceId?: string) =>
  new HandledError(
    StatusCode.Conflict,
    'A paid invoice cannot be cancelled',
    { invoiceId },
    traceId,
  )
```

Use the helper only where `invoiceId` itself is safe for the intended caller.
For tenant-scoped data, derive authorization and tenancy from the trusted
message envelope before deciding which identifiers may be returned. See
[authentication and authorization](/handbook/framework/secure-and-operate/security/authentication-and-authorization/).

## Know what the runtime does with an unexpected failure

For a command, PURISTA returns a generic internal-error response for an
unexpected exception, while logging and tracing the original error locally.
It does not copy an `UnhandledError` message or data into the public command
response. An invalid handler output is also an internal failure: later guards,
transforms, success-event creation, and response delivery do not run.

Do not catch every exception merely to call `HandledError.fromError(...)`.
That helper preserves an error object but cannot decide whether its message or
data is suitable for a client. Map only a known, reviewed domain condition to
a handled error; leave operational failures observable to logs, traces, and
the owning retry boundary.

## Follow the error across the boundary

A command error response is an `EBMessageType.CommandErrorResponse`. It keeps
the request identity/correlation fields, swaps sender and receiver, and adds
`isHandledError` so an EventBridge client can distinguish a contract outcome
from an internal failure.

```ts title="Caller-visible handled command error payload"
{
  isHandledError: true,
  payload: {
    status: 409,
    message: 'A paid invoice cannot be cancelled',
    data: { invoiceId: 'inv_123' },
    traceId: '...',
  },
}
```

For an unexpected command error, the response has `isHandledError: false` and
the payload contains only the generic status, generic message, and trace ID.
The original error remains in local logs/spans. Hono projects a handled result
to the same HTTP status and either the configured JSON error shape or RFC 9457
problem details. An unhandled Hono failure becomes a generic 500 response.

A stream uses a terminal `error` frame instead of a command response:

```ts title="Stream error frame"
{
  frameType: 'error',
  sequence: 3,
  error: {
    status: 409,
    message: 'The document is locked',
    isHandledError: true,
    data: { documentId: 'doc_123' },
    traceId: '...',
  },
}
```

## Apply the owning primitive's recovery semantics

| Primitive | `HandledError` means | Unexpected failure / recovery owner | Canonical guide |
| --- | --- | --- | --- |
| Command | A safe error response to the request caller. | PURISTA returns an internal-error response; command acknowledgement is EventBridge/provider dependent. | [Handle command errors](/handbook/framework/build-services/commands/handle-errors/) |
| Subscription | Delivery completes without redelivery. | A thrown unexpected error reaches the EventBridge failure path. Return `{ status: 'ack' }`, `{ status: 'retry', reason?, delayMs? }`, `{ status: 'deadLetter', reason? }`, `{ status: 'drop', reason? }`, or `{ status: 'stop-consumer', reason? }` only when deliberately controlling delivery; the bridge must support the selected control. | [Acknowledge and control delivery](/handbook/framework/build-services/subscriptions/acknowledge-and-control-delivery/) |
| Stream | A terminal error frame marked handled, not a successful final value. | Throw for ordinary terminal failure; durable retry and recovery belong in a queue. Do not pass raw upstream errors to the writer when an HTTP/SSE client can observe their message or data. | [Handle stream termination and failures](/handbook/framework/build-services/streams/termination-and-failures/) |
| Queue worker | Do not use an error class as a job-state protocol. | Return normal completion or use `context.job` / the queue result for retry, failure, dead-lettering, or lease control. | [Configure leases, retries, idempotency, and dead letters](/handbook/framework/build-services/queues-and-workers/configure-leases-retries-idempotency-and-dead-letters/) |
| Attached agent | A Framework-facing safe error only after the agent projection has classified it. | Use deterministic runtime tests for flow and Harness evaluations for model quality; retries and durable work follow the generated queue/worker boundary. | [Secure the service boundary](/handbook/framework/build-ai-powered-services/secure-the-service-boundary/) |

The table describes Framework behavior, not every broker or queue guarantee.
Before depending on a delayed retry, dead-letter path, or consumer pause,
verify the selected EventBridge or QueueBridge adapter’s capability and its
operational recovery path.

## Make the error observable without leaking it

Log an error with trusted correlation fields, record the exception on the
active span, and keep metric labels low-cardinality. The Framework already
records command outcomes; add business metrics only when they answer a real
operational question. Configure the process-level logger and telemetry in
[structured logging](/handbook/framework/secure-and-operate/observability/logging/)
and [OpenTelemetry](/handbook/framework/secure-and-operate/observability/opentelemetry/).

Next, choose the primitive that owns the result: [commands](/handbook/framework/build-services/commands/),
[subscriptions](/handbook/framework/build-services/subscriptions/),
[streams](/handbook/framework/build-services/streams/), or
[queues and workers](/handbook/framework/build-services/queues-and-workers/).
