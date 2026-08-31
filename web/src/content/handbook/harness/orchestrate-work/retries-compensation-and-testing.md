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
	retry: {
		maxAttempts: 3,
		minDelayMs: 250,
		maxDelayMs: 2_000,
		backoff: 'exponential',
	},
})
```

## Understand the step boundary

`ctx.step(stepId, fn, options?)` behaves differently depending on the
invocation:

| Invocation | Behavior |
| --- | --- |
| Ordinary workflow call | Runs `fn` with the selected retry policy; no checkpoint is written |
| First durable attempt | Runs `fn`, requires a JSON-serializable result, then commits one checkpoint |
| Durable resume with a committed `stepId` | Returns the stored output without calling `fn` again |

Use a stable ID matching `^[A-Za-z0-9_.:-]{1,128}$`. An invalid or duplicate ID
fails with `DurableStepError`. A failed attempt writes no checkpoint. Once the
output is committed, retry and resume reuse that output rather than repeating
the function.

## Configure retries

| `retry` value or field | Default | Meaning |
| --- | --- | --- |
| omitted or `false` | one attempt | Do not retry |
| `true` | 3 attempts, 100–1,000 ms exponential delay | Use the built-in bounded policy |
| `maxAttempts` | `3` in a policy object | Total attempts including the first call; a non-positive or non-finite value normalizes to one |
| `minDelayMs` | `100` | Delay before the first retry; negative values normalize to zero |
| `maxDelayMs` | `1_000` | Upper delay bound; negative values normalize to zero |
| `backoff` | `exponential` | Choose `fixed` or `exponential` |
| `shouldRetry(error, attempt)` | retry every failure until the attempt limit | Return `false` for a business rejection or permanent error. `attempt` is the number that just failed. |

Workflow cancellation stops a retry before the next attempt and interrupts a
pending backoff. The step function must still forward `ctx.signal` to its own
HTTP, SDK, model, or agent calls so in-flight work can stop promptly.

API reference: [`WorkflowContext.step(...)`](/handbook/api/interfaces/_purista_harness.WorkflowContext/#step),
[`DurableStepOptions`](/handbook/api/interfaces/_purista_harness.DurableStepOptions/), and
[`DurableStepRetryPolicy`](/handbook/api/interfaces/_purista_harness.DurableStepRetryPolicy/).

## Keep side effects idempotent

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

For example, derive a payment idempotency key from the durable `runId` and
stable step name, pass it to the payment provider, and store the provider
receipt as the step output. If the outcome is uncertain, query by that same key
before retrying. Never generate a new key for a replay.

## Test execution and recovery separately

Use fake providers and deterministic adapters for unit tests. Cover successful
and partial fan-out, policy denial, cancellation, retry exhaustion, resume with
the same run ID, duplicate review signals, and redaction. Custom adapters should
run `harnessStorageContract` and `durableWorkspaceContract` from
`@purista/harness/testing` before production use. This proves workflow behavior
and recovery, not whether a real model's conclusion is good. Evaluate the
deployed workflow/agent on reviewed scenarios and regression thresholds through
[prompt and output evaluations](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/).
