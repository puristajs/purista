---
title: Configuration and model settings
description: Declare model capabilities truthfully and use bounded defaults that match the execution path.
order: 210
---

Model aliases are capability contracts. An agent can only use operations its
alias declares, such as structured output, tools, streaming, embeddings, or
reranking. Declare what the configured adapter and chosen model actually offer;
the Harness validates required capabilities before a run.

```ts title="Bounded support-model defaults"
import { defineHarness } from '@purista/harness'
import { openai } from '@purista/harness-openai'

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is required to start the support Harness.')
}

export const harness = defineHarness({ name: 'support' })
  .models({
    assistant: {
      provider: openai({ apiKey }),
      model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
      capabilities: ['object', 'tool_use'],
      retry: {
        maxAttempts: 3,
        maxActiveElapsedMs: 60_000,
        maxActiveDelayMs: 20_000,
        respectRetryAfter: true,
        longRetry: 'error',
      },
    },
  })
  .defaults({
    runTimeoutMs: 600_000,
    modelTimeoutMs: 300_000,
    toolTimeoutMs: 120_000,
    agentMaxIterations: 16,
    maxParallelToolCalls: 8,
  })
  .build()
```

| Call or field | What it controls | Decision and failure boundary |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | A named Harness composition root. | The name identifies this local runtime in diagnostics; it does not select a provider. |
| [`.models(aliases)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | The named model aliases available to later agents and workflows. | Define aliases before agents so their model name and allowed operations are checked from the fluent builder state. |
| [`provider`](/handbook/api/interfaces/_purista_harness.ModelAlias/#provider) | The adapter that makes provider API calls. | Adapter installation and credentials are separate from the core Harness package. An unavailable credential should stop startup, as in the example. |
| [`model`](/handbook/api/interfaces/_purista_harness.ModelAlias/#model) | The concrete identifier the selected standalone Harness adapter sends to its provider. | This is required for a standalone Harness. Keep the business/agent definition portable by selecting it in composition, and validate provider compatibility in the adapter guide. |
| [`capabilities`](/handbook/api/interfaces/_purista_harness.ModelAlias/#capabilities) | The operations the alias permits the Harness to request. | Declare only what the chosen model and adapter support. Missing capability requirements fail before a compatible operation runs. |
| [`retry`](/handbook/api/interfaces/_purista_harness.ModelAlias/#retry) | Alias-level retry enablement or a provider-neutral retry policy. | It defaults to `true`; a policy’s documented defaults live on [`ModelRetryPolicy`](/handbook/api/interfaces/_purista_harness.ModelRetryPolicy/). Retries do not make tool side effects idempotent. |
| [`.defaults(settings)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#defaults) | Run-wide safety limits, including timeouts, iteration count, and concurrent tools. | These are limits, not provider credentials or model selection. Per-run overrides should be exceptional and tied to an SLA. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | The runnable Harness and its configuration validation. | Invalid aliases/defaults fail at build/startup rather than during an unrelated request. |

`HarnessBuilder` preserves the literal IDs registered by each call. Keep the
definition order meaningful: configure an adapter boundary such as
[`sandbox`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox),
then models, then the tools and skills an agent may name, then agents, then
workflows that may call those agents. Each later registry is checked against
the earlier registrations. See the
[full builder surface](/handbook/api/interfaces/_purista_harness.HarnessBuilder/)
for the less common composition calls.

## Set only the limits the workload needs

All values below are milliseconds unless noted. Omit a setting to use the
documented default; a value of `0` disables only `runTimeoutMs`.

| [`HarnessDefaults` setting](/handbook/api/interfaces/_purista_harness.HarnessDefaults/) | Default | Set it when | Important interaction |
| --- | --- | --- | --- |
| `runTimeoutMs` | `600_000` | The whole interactive or background run needs a firm deadline. | It bounds the run, not a provider's own request timeout. Do not set `0` for externally reachable work without another cancellation boundary. |
| `modelTimeoutMs` | `300_000` | A provider call must fail earlier than the run deadline. | Keep it below `runTimeoutMs` so the application can handle the failure. |
| `toolTimeoutMs` | `120_000` | A tool calls an application or remote dependency with a known budget. | Timing out a tool does not roll back an external side effect; design that side effect to be idempotent. |
| `agentMaxIterations` | `16` | A default-loop agent may need more or fewer model/tool rounds. | Must be a positive integer. Set a smaller limit for public, tool-enabled agents. An agent-level `maxSteps` overrides it. |
| `maxParallelToolCalls` | `8` | Independent, safe tool calls can use more or less concurrency. | Lower it when a downstream service has a tight quota or write contention. It does not authorize parallel mutations. |
| `decisionTimeoutMs` | `10_000` | A guardrail, policy, or approval callback has a shorter safety budget. | An expired decision fails the control path; it is not an approval. |
| `skillTimeoutMs` | `60_000` | Skill loading or reading needs a bounded budget. | Keep it finite; a skill is input, not a trusted execution authority. |
| `historyWindow` | all non-system messages | The model needs less transient conversation context. | This changes what reaches the model, not what durable history retains. Use `historyRetention` for storage bounds. |
| `historyRetention` | disabled | Persisted session history needs finite turn and byte bounds. | It requires storage with atomic message replacement; see [bound conversation history](/handbook/harness/manage-context-and-state/conversation-history/). |
| `delegation` | disabled | Workflows should have a default child-agent policy. | A workflow-level policy can narrow or override these budgets; see [build a workflow](/handbook/harness/orchestrate-work/workflows/). |

## Declare each capability only when the run needs it

| Capability | Declare it when | Do not declare it for |
| --- | --- | --- |
| `text` | One final plain-text result. | A structured object or live text response. |
| `text_stream` | Incremental plain-text output is delivered to the caller. | A caller that waits for one final text result. |
| `object` | The agent must return a schema-validated object. | A text-only result. |
| `object_stream` | The application consumes progressive structured output. | A single final object. |
| `tool_use` | The model may call declared Harness tools. | A tool-free classification or summary. |
| `vision_input` | The application deliberately supplies an image. | Text, audio, or a file without image content. |
| `audio_input` | The application deliberately supplies audio. | Text, images, or files without audio. |
| `file_input` | The application has authorized and prepared a file for the provider. | Unscanned or unauthorized attachments. |
| `embeddings` | Retrieval, similarity, or indexing generates vectors. | A normal agent loop with no vector operation. |
| `rerank` | The application orders an existing candidate set. | A request with no candidates to order. |

## Choose a retry policy for the caller

| Path | Recommended response to a long provider retry window |
| --- | --- |
| Interactive HTTP/API request | `longRetry: 'error'`; return a safe, retryable application response |
| Queue/worker with durable scheduling | `longRetry: 'defer'`; let application delivery schedule later work |

Harness retries short transient failures with bounded backoff. It does not make
external side effects idempotent. Do not wrap an agent that can perform a tool
mutation in an unbounded retry loop.

## Defaults are guardrails, not provider selection

Timeouts, iteration limits, and parallel-tool limits bound a run. Credentials,
provider SDK options, and a model identifier remain in the provider definition.
For user-facing calls, choose smaller budgets than background research or
review workflows. Override per call only when the caller has a clear SLA.

## Verify configuration

Run the smallest agent with a fake provider first, then one bounded live check.
That reliably verifies configuration and application control flow, not the
factual quality of a nondeterministic model answer. An invalid default, missing
model alias, or missing required capability fails with a `HarnessConfigError`
before a successful run. Measure production-agent quality separately with
[evaluations](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/).
Continue with [Build agents](/handbook/harness/build-agents/).
