---
title: Add human review
description: Pause a durable workflow while the application manages reviewers and the actual decision.
order: 530
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

The application owns review CRUD, authentication, authorization, comments,
notifications, revision compare-and-swap, action-digest binding, expiry, and
the final idempotent domain command. Do not store proposal text, tool values,
credentials, or reviewer IDs in the wait request or telemetry.

Pending work raises `ExternalWaitPendingError`; translate it to a safe queue or
HTTP status. Deliver `signalWait({ waitId, eventId, outcome })` once, then
resume with the same `runId`. Duplicate or late event IDs are typed no-ops.

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

For one immediate tool call, permission/policy `require_approval` instead calls
the shared `GovernanceApprovalProvider`, which returns `approved` or `rejected`
within a finite signal/deadline budget. It does not suspend a durable workflow.

Use `InMemoryHarnessStorage` for deterministic tests. `SqliteHarnessStorage`
is a local, single-host option—not a distributed production service. Test
approved, rejected, expired, cancelled, duplicate signal, changed action,
concurrent resumes, and crashes before/after the external effect and receipt.
