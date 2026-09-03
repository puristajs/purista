---
title: End-to-end testing
description: Verify the authenticated public path, real infrastructure wiring, and operational evidence before release.
order: 940
---

An end-to-end test should exercise a small production-shaped flow: invoke an
authenticated command, observe its result or accepted job, and verify the
expected event/state/trace without asserting raw sensitive telemetry.

## Keep release flows few and decisive

Use one path per important deployment promise, not every business permutation.
For example, an invoice API test can create an invoice through the protected
HTTP endpoint, wait for the durable email-delivery record, and verify a trace
with a synthetic correlation id.

| Step | Assert | Avoid |
| --- | --- | --- |
| Authenticate and invoke | Success response has the published schema | A live user credential or full response body in logs |
| Negative authorization | Missing/other-tenant principal gets controlled `401`/`403` | Making the endpoint public to simplify the test |
| Async completion | A business-visible record/event appears before a bounded deadline | Fixed sleeps or inspecting an implementation-only queue payload |
| Operational evidence | Health, trace/correlation, and expected queue state | Sensitive trace attributes or raw payload assertions |
| Failure/recovery | A scoped failed job reaches its defined repair signal | Replaying a shared test queue without an idempotency boundary |

For a queue-backed flow, wait for a business-visible completion signal with a
bounded timeout. For an HTTP route, assert authorization and problem response
shape as well as success. For a distributed flow, use the real bridge/store
deployment configuration and a unique correlation identifier that is safe for
test telemetry.

Use end-to-end tests as release evidence, not as the only place business behavior is tested.

Next: [chapter overview](/handbook/framework/test-applications/).
