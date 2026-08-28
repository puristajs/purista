---
title: Retry, compensate, and test workflows
description: Make failure behavior explicit before a workflow touches an external system.
order: 550
---

Retry only a transient, safe operation before its checkpoint commits. Start
with [Build a workflow](/handbook/harness/orchestrate-work/workflows/); this is
the focused `workflow.handler` fragment for an enrichment step, not a complete
source file:

```ts title="Workflow handler: retry transient enrichment"
const enriched = await ctx.step('enrich-v1', () => ctx.agents.enricher(ctx.input), {
  retry: { maxAttempts: 3, minDelayMs: 250, maxDelayMs: 2_000 },
})
```

Harness can replay a committed step; it cannot make an email, payment, or API
write exactly once. Give every domain side effect an application-owned
idempotency key. For a multi-system change, model a compensating action and
its operator path rather than assuming rollback is automatic.

| Failure | Design response |
| --- | --- |
| Provider or transient service failure | Bounded retry with cancellation and timeout. |
| Committed step after restart | Reuse its checkpointed output. |
| External side effect uncertainty | Reconcile using a stable idempotency key. |
| Incompatible deployment | Start a new versioned run; do not reinterpret checkpoints. |

Use fake providers and deterministic adapters for unit tests. Cover successful
and partial fan-out, policy denial, cancellation, retry exhaustion, resume with
the same run ID, duplicate review signals, and redaction. Custom adapters should
run `harnessStorageContract` and `durableWorkspaceContract` from
`@purista/harness/testing` before production use. This proves workflow behavior
and recovery, not whether a real model's conclusion is good. Evaluate the
deployed workflow/agent on reviewed scenarios and regression thresholds through
[prompt and output evaluations](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/).
