---
title: Manage sessions and durable work
description: Keep conversation identity separate from transport identity, bind Harness persistence explicitly, and model waits as resumable outcomes.
order: 396
---

`traceId`, `correlationId`, `sessionId`, and `runId` serve different
purposes.

| Value | Meaning |
| --- | --- |
| `traceId` | One distributed observability trace |
| `correlationId` | One PURISTA message conversation |
| Harness `sessionId` | Product conversation or durable AI context |
| Harness `runId` | One execution attempt or resumable workflow run |

Choose a stable product-owned session id and pass it in the invocation options.
Do not reuse an HTTP connection id or arbitrary trace id as conversation
identity.

```ts title="Run a durable workflow session"
await context.workflow.Support['1'].review_rollback.run(input, {
  sessionId: `incident:${input.incidentId}`,
  runId: input.reviewRunId,
})
```

Bind `HarnessStorage`, memory, workspace, and sandbox adapters through the
service's `ai` runtime config. PURISTA StateStore is not a replacement for
Harness checkpoints, and neither store is a transactional domain database.

Durable workflows may return `status: 'interrupted'` with an approval or
external-wait payload. Persist the application-facing task in a database,
authorize the reviewer through normal commands, and resume the same run after
the decision. Rejection and expiry are business outcomes. Infrastructure or
programming failures remain errors.
