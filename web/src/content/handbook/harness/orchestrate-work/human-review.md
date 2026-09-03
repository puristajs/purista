---
title: Add human review
description: Pause a durable workflow while the application manages reviewers and the actual decision.
order: 540
---

An external wait is a checkpoint-and-signal primitive, not a review system.
With configured durable storage, a workflow persists a safe wait descriptor,
releases its lease, and becomes `waiting`. The application later signals one
terminal outcome and invokes the same durable run id to resume.

Start with [Run durable workflows](/handbook/harness/orchestrate-work/durable-workflows/).
The following is the `workflow.handler` fragment that registers the wait after
the application has created its own versioned review task. The complete,
executable [durable human-review example](https://github.com/puristajs/harness/tree/main/examples/durable-human-review)
also verifies compare-and-swap decisions, immutable execution claims, and
receipt recovery. These are application APIs, not Harness review CRUD.

```ts title="reviewPayment workflow handler: register a wait"
const outcome = await ctx.externalWait.wait({
	waitId: task.waitId,
	kind: 'human_review',
	schemaVersion: 'payment-review-v1',
	definitionVersion: task.descriptor.definitionVersion,
	deadline: task.descriptor.expiresAt,
})
```

## Define only the durable wait descriptor

| Field | Required value | Purpose |
| --- | --- | --- |
| `waitId` | Stable application-owned identifier, 1–200 allowed characters | Idempotently registers and later signals this exact wait |
| `kind` | Stable routing category such as `human_review` | Lets the application choose the review workflow without storing review content |
| `schemaVersion` | Version of the signal/outcome contract | Prevents incompatible consumers from interpreting the wait differently |
| `definitionVersion` | Version of the application review definition | Binds the wait to the rules that created it |
| `deadline` | UTC ISO-8601 timestamp with millisecond precision | Resolves an overdue wait as `expired` |

Identifiers accept letters, numbers, `_`, `.`, `:`, `@`, `/`, and `-`. The
request is strict: extra fields and invalid timestamps are rejected. Store
review title, proposal, reviewer, comments, and permissions in the
application's review system, not in the Harness wait record.

`externalWait.wait(...)` is available on every workflow context but succeeds
only during a durable workflow invocation. On first registration it persists
the descriptor and throws `ExternalWaitPendingError` so the worker can release
the run. On resume, it returns a terminal snapshot with `status` equal to
`approved`, `rejected`, `expired`, or `cancelled`.

The application owns review CRUD, authentication, authorization, comments,
notifications, revision compare-and-swap, action-digest binding, expiry, and
the final idempotent domain command. Do not store proposal text, tool values,
credentials, or reviewer IDs in the wait request or telemetry.

Pending work raises `ExternalWaitPendingError`; translate it to a safe queue or
HTTP status. Deliver `signalWait({ waitId, eventId, outcome })` once, then
resume with the same `runId`. Duplicate or late event IDs are typed no-ops.

## Deliver the application decision

Signal the same `HarnessStorage` used by the durable Harness after the
application has authenticated the sender, authorized the reviewer, and won its
own compare-and-swap update:

```ts title="src/reviews/deliverPaymentReview.ts"
const delivery = await storage.signalWait({
	waitId: review.waitId,
	eventId: review.decisionEventId,
	outcome: review.decision,
	observedAt: new Date().toISOString(),
})

if (delivery.kind === 'applied' || delivery.kind === 'duplicate') {
	await enqueueWorkflowResume(review.runId)
}
```

`review.decision` must be `approved`, `rejected`, `expired`, or `cancelled`.
The same `eventId` is idempotent. The delivery result is explicit:

| Result | Meaning | Application action |
| --- | --- | --- |
| `applied` | This signal moved the wait to its terminal state | Enqueue one resume using the original durable run ID |
| `duplicate` | This exact event was already applied | Treat it as success; do not create another decision |
| `already_terminal` | A different event already resolved the wait | Do not overwrite it; reconcile the application review record |
| `not_found` | No wait with this ID exists | Reject or quarantine the delivery; verify routing and registration |

The snippet names application-owned `review` and `enqueueWorkflowResume`
values; the complete maintained example implements their database and queue
boundaries. PURISTA supplies the storage contract and idempotent reducer, not a
review API or job scheduler.

## Authenticate decisions across trust boundaries

Authenticate and authorize every decision before calling `signalWait(...)`.
When a decision crosses a queue, webhook, or separately operated review
service, carry a signed, versioned decision envelope containing only stable
binding data:

- a unique `eventId`, `waitId`, terminal outcome, and review revision;
- the canonical action digest and definition version being approved;
- `issuedAt`, `expiresAt`, issuer, audience, and signing-key ID.

Sign a canonical serialization with an application-approved signing service or
well-maintained JWS library. The receiver verifies the signature, issuer,
audience, expiry, review revision, and action digest before its compare-and-swap
update and before `signalWait(...)`. Use `eventId` as the delivery idempotency
key. Never include proposal text, tool arguments, credentials, reviewer
comments, or other sensitive content in the envelope.

A signature authenticates the decision message; it does not replace reviewer
authorization, action binding, compare-and-swap, or execution idempotency. A
direct authenticated internal call may use the platform's mTLS/service identity
and durable audit record instead of an additional message signature. Choose the
mechanism from the actual trust boundary and document it in the application
threat model.

API reference: [`ExternalWaitRequest`](/handbook/api/types/_purista_harness.ExternalWaitRequest/),
[`ExternalWaitResolved`](/handbook/api/types/_purista_harness.ExternalWaitResolved/),
[`ExternalWaitSignal`](/handbook/api/types/_purista_harness.ExternalWaitSignal/), and
[`ExternalWaitSignalResult`](/handbook/api/types/_purista_harness.ExternalWaitSignalResult/).

An `approved` wait outcome is not permission to execute an arbitrary current
payload. Before a new execution claim, reauthorize and verify the task's
approved revision, canonical action digest, target revision, definition
version, and expiry. The application atomically claims one immutable action
under a stable execution ID. Concurrent resumes converge on that same claim;
the executor uses its action and ID, then the application stores its receipt.
Do not use a separate “read approved, then execute” sequence or mark a task
consumed before the effect succeeds.

Recovery reads the existing claim and receipt. A recorded receipt returns the
same result; an uncertain effect is reconciled using the same idempotency key,
never a new execution. An admitted claim survives later expiry or revocation;
this is not post-admission cancellation. Check the invocation/action binding
outside replay-skipped steps so a changed payload cannot reuse an old receipt.

For a model-requested tool call, permission/policy `require_approval` returns a
durable `ToolApprovalInterrupt` before any gated tool in the batch runs. The
application authorizes the reviewer and resumes the same run with a
`ToolApprovalResume`.

Use `InMemoryHarnessStorage` for deterministic tests. `SqliteHarnessStorage`
is a local, single-host option—not a distributed production service. Test
approved, rejected, expired, cancelled, duplicate signal, changed action,
concurrent resumes, and crashes before/after the external effect and receipt.
