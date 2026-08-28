---
title: Errors and failure behavior
description: Handle validation, capability, cancellation, provider, and tool failures at the application boundary.
order: 360
---

An agent call can fail before a model request, during provider execution, while
running a tool, or when validating final output. Map these failures to an
application-safe response or retry decision; do not leak prompts, credentials,
tool inputs, or raw provider payloads.

| Failure | What it means | Safe response |
| --- | --- | --- |
| `HarnessConfigError` | Invalid definition/default or missing required capability | Fix composition and fail startup or controlled invocation. |
| `DecisionBlockedError` | A content or authority decision blocked a protected boundary | Use the content-free evidence and stable reason code; do not automatically retry or turn a rail block into an approval request. |
| `DecisionEvaluationError` | Policy, approval, audit, rail, or its dependency could not complete safely | Keep the failure closed; inspect stable `failureKind`, never a raw callback error. |
| Provider/model error | Authentication, quota, timeout, unavailable model, or malformed provider response | Surface a safe transient/permanent application error and follow bounded retry policy. |
| Schema validation error | Request or final result breaks the declared contract | Correct caller data, instructions, schema, or test fixture. |
| Cancellation/timeout | Caller or Harness budget ended the run | Stop work, then reconcile any external side effect using application idempotency. |
| Tool error | Handler rejected input or its dependency failed | Preserve authorization boundary; do not assume a model retry is safe. |

Provider retry belongs to the model alias configuration. A workflow or queue can
schedule durable retries only after the application has established the
idempotency and recovery boundary for its side effects.

Both decision errors are exported by `@purista/harness`. Their shared
`DecisionEvidence` contains `decisionId`, `source`, `phase`, and optional
`reasonCode`; error `failureKind` is separate. Events and audit records own
effect, enforcement, and correlation fields. None carries prompts, tool
values, or reviewer comments. Propagate callback `signal`/`deadline`; a timeout or cancellation
must not allow a late approval to execute the tool. This is not rollback or
revocation of a previously admitted external effect.
