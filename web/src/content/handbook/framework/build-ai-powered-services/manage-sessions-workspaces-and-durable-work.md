---
title: Manage sessions and durable work
description: Keep conversation identity separate from transport identity, bind persistence explicitly, and model waits as resumable outcomes.
order: 396
---

`traceId`, `correlationId`, `sessionId`, and `runId` have different jobs.

| Value | Meaning |
| --- | --- |
| `traceId` | One distributed observability trace |
| `correlationId` | One PURISTA message conversation |
| Harness `sessionId` | Product conversation or durable AI context |
| Harness `runId` | One execution attempt or resumable workflow run |

Choose a stable application-owned session id on the trusted server boundary.
Derive it after authentication from tenant, principal, and an authorized
conversation key. Never accept the Harness session id itself from a browser.

```ts title="Run a durable workflow session"
const review = context.workflow.Support['1'][reviewRollbackWorkflow.contract.id]
const result = await review.run(input, {
  sessionId: `incident:${input.incidentId}`,
})

if (result.outcome.status === 'interrupted' && result.outcome.interrupt.type === 'tool-approval') {
  await reviewRepository.save(result.sessionId, result.outcome.interrupt)
  const decision = await reviewRepository.waitForAuthorizedDecision(result.sessionId)

  const request = result.outcome.interrupt.requests[0]
  if (!request) throw new Error('Expected an approval request')

  const descriptor = {
    type: 'tool-approval' as const,
    runId: result.outcome.runId,
    interruptId: result.outcome.interrupt.id,
    revision: result.outcome.interrupt.revision,
    eventId: decision.id,
    decisions: [{ approvalId: request.approvalId, approved: decision.approved }],
  }

  const resumed = await review.resume(descriptor).run({ sessionId: result.sessionId })
}
```

Fresh execution and continuation are separate typed operations. Use
`review.run(input, options)` only for new work. Use
`review.resume(descriptor).run(options)` or `.stream(options)` to continue the
interrupted run; a continuation does not accept the original input again.

Bind Harness storage, memory, workspace, and sandbox adapters through the
service's `ai` runtime config. PURISTA StateStore is for application key-value
state. Neither store replaces a transactional domain database.

An interrupted outcome can carry an approval or external-wait request. Persist
the application task, authorize the reviewer through a normal command, and
resume the same run after the decision. Rejection and expiry are business
outcomes. Infrastructure and programming failures remain errors.
