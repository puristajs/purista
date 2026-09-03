---
title: Configuration and environment variables
description: Look up Harness defaults, invocation overrides, and the small set of environment variables read by the core runtime.
order: 1412
---

Configure Harness in application code. The builder owns stable composition;
session and invocation options own request-specific values. Environment
variables are limited to process-wide operational defaults. Provider secrets
remain application configuration that you pass to the selected adapter.

## Configuration precedence

For a run, the most specific valid value wins:

1. invocation options such as `timeoutMs` and `historyWindow`;
2. model-alias defaults and retry/context settings for a model call;
3. Harness-wide `.defaults(...)` values;
4. the core defaults below.

Adapter factory options still govern their own SDK client, endpoint, and
credentials. They do not override a shorter remaining Harness run budget.

## Composition defaults

| `HarnessDefaults` field | Core default | Meaning |
| --- | --- | --- |
| `agentMaxIterations` | `16` | Maximum model iterations in the built-in agent loop. |
| `runTimeoutMs` | `600_000` | Whole agent or workflow run. `0` disables this timeout. |
| `modelTimeoutMs` | `300_000` | One provider model operation. |
| `toolTimeoutMs` | `120_000` | One tool call. |
| `skillTimeoutMs` | `60_000` | One skill load or operation. |
| `decisionTimeoutMs` | `10_000` | Permission, governance, or approval decision callback. |
| `maxParallelToolCalls` | `8` | Tool calls from one model response that may run concurrently. |
| `historyWindow` | all retained non-system messages | Transient model context; `0` sends only system messages. |
| `contextProjection` | disabled | Retry-only projection after a context-length failure. |
| `historyRetention` | disabled | Durable complete-turn limits by count and serialized bytes. |
| `delegation.enabled` | `false` | Workflow child-agent delegation unless a workflow opts in locally. |
| `delegation.maxChildAgentCalls` | `32` | Total child-agent calls in one workflow run. |
| `delegation.maxParallelChildAgentCalls` | `8` | Active child-agent calls in one workflow run. |
| `delegation.maxDepth` | `1` | Local workflow-to-agent delegation depth. |

Use [`.defaults(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#defaults)
once at composition time. A non-positive iteration or concurrency limit and a
negative timeout fail validation; `0` has the documented special meaning only
where the corresponding type permits it.

## Model alias settings

Each [`ModelAlias`](/handbook/api/interfaces/_purista_harness.ModelAlias/)
binds a provider, provider model identifier, and explicit capability list. It
may also set a stable `credentialScope`, generation `defaults`, retry policy,
retry-only `contextProjection`, and opaque `providerOptions`.

The capability list is an application assertion checked before the operation;
it does not make a provider model support that operation. Verify the selected
model and deployment against the [provider compatibility matrix](../provider-and-adapter-compatibility/).

## Core environment variables

| Variable | Accepted values | Default and behavior |
| --- | --- | --- |
| `PURISTA_HARNESS_LOG_LEVEL` | `trace`, `debug`, `info`, `warn`, `error`, `fatal` | `info`. An invalid value emits a warning and falls back to `info`. |
| `PURISTA_TELEMETRY_FLAVOR` | `dual`, `gen_ai_only`, `openinference_only` | `dual`. Prefer the typed telemetry option in application code so an invalid deployment value cannot silently select an unintended filter. |
| `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT` | `true`, `false`, `NO_CONTENT`, `SPAN_ONLY`, `EVENT_ONLY`, `SPAN_AND_EVENT` | `NO_CONTENT`. `true` maps to `SPAN_AND_EVENT`; `false` maps to `NO_CONTENT`; unknown values also fail closed to `NO_CONTENT`. |

`PWD` is only a fallback when skill discovery is not given an explicit project
root. Local sandbox processes inherit a controlled `PATH` and receive their
workspace as `HOME`; these are process inputs, not Harness feature switches.

Provider variables such as `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or a database
URL are conventions owned by your application and deployment. Read them,
validate that required values exist, and pass them to the adapter factory. Do
not put credentials in model aliases, `providerOptions`, invocation metadata,
session IDs, logs, or prompts.

## Invocation options

[`InvokeOptions`](/handbook/api/interfaces/_purista_harness.InvokeOptions/)
contains `signal`, `timeoutMs`, `historyWindow`, `idempotencyKey`,
`contextProjection`, W3C `traceparent`/`tracestate`, scalar `metadata`, approval
`resume`, and workflow-only `durable`. A host integration may also pass opaque
`hostContext`; Harness never persists, logs, or sends it to a model.

Use the [sessions and execution guide](/handbook/harness/build-agents/sessions-and-execution/)
for validation rules and lifecycle behavior. Use [model settings](/handbook/harness/configure-the-runtime/configuration-and-model-settings/)
for generation defaults, retries, and per-call overrides.
