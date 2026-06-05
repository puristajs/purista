# Evaluation Scenarios

Use these scenarios to test whether the `purista` skill gives an otherwise untrained agent enough context to design and implement PURISTA work without inventing stale APIs or unsafe architecture.

## Contents
- [Scenario 1: Greenfield Project Setup](#scenario-1-greenfield-project-setup)
- [Scenario 2: Durable Background Work](#scenario-2-durable-background-work)
- [Scenario 3: Streaming Or Aggregate HTTP Response](#scenario-3-streaming-or-aggregate-http-response)
- [Scenario 4: Service-Owned Agent](#scenario-4-service-owned-agent)
- [Scenario 5: Enterprise Runtime Review](#scenario-5-enterprise-runtime-review)
- [Scenario 6: Skill Drift Repair](#scenario-6-skill-drift-repair)
- [Scenario 7: Durable Agent Workspace Replay](#scenario-7-durable-agent-workspace-replay)

## Scenario 1: Greenfield Project Setup
Prompt:

```text
Create a new PURISTA app for customer onboarding. It needs HTTP support, a service, a validateCustomer command, and no external broker yet.
```

Expected behavior:
- starts from `npm create purista@latest` or `purista init <target>` with explicit `--non-interactive --defaults` choices when automated
- keeps generated files under `src/service`
- uses local package scripts such as `npm run add:service -- ...` and `npm run add:command -- ...`
- keeps runtime wiring in bootstrap files, not in handlers
- does not add AI, queue, provider, or broker dependencies without a stated need

Validation:
- generated command has payload, parameter, and output schemas
- service definition imports and registers the command once
- Hono HTTP exposure is configured from the command definition

## Scenario 2: Durable Background Work
Prompt:

```text
Add invoice generation that may run for minutes, must retry safely, and must support operator replay.
```

Expected behavior:
- chooses queue plus queue worker instead of subscription or long-running command
- declares idempotency keys, retry policy, timeout budget, and DLQ handling
- uses local package scripts such as `npm run add:queue -- ...` and `npm run add:queue-worker -- ...`
- selects Redis or NATS QueueBridge when strict idempotency is required
- treats DefaultQueueBridge as local/test only

Validation:
- worker handler is idempotent
- queue payload contains identifiers and small immutable facts, not full confidential records
- startup fails fast when requested queue capabilities are unavailable

## Scenario 3: Streaming Or Aggregate HTTP Response
Prompt:

```text
Expose a document analysis capability over HTTP. Some clients need live progress, others need a final JSON result.
```

Expected behavior:
- chooses stream for live progress and aggregate response behavior where configured
- distinguishes command endpoints from stream endpoints
- exposes HTTP through Hono metadata on the builder, not by hand-written route-first design
- documents cancellation, timeout, chunk schema, and final schema behavior

Validation:
- stream builder has chunk and final schemas
- OpenAPI metadata reflects stream or aggregate behavior accurately
- no claim is made that streaming and aggregate endpoints are the same REST path unless the implementation actually exposes both

## Scenario 4: Service-Owned Agent
Prompt:

```text
Add a support triage agent that can classify tickets, call an allowed command tool, and stream progress to the frontend.
```

Expected behavior:
- attaches the agent to the support service with a local package script such as `npm run add:agent -- ...`
- uses core agent builder/runtime APIs and `@purista/harness` model bindings
- installs provider packages only in the app wiring layer
- allowlists tools and child agents
- keeps prompt/completion content out of logs, metrics, traces, events, queues, and examples

Validation:
- generated agent test uses `createAgentTestHarness(...)` and `createScriptedHarnessModel()`
- model capabilities are declared and validated at startup
- model output is schema-validated before deterministic state changes

## Scenario 5: Enterprise Runtime Review
Prompt:

```text
Review a PURISTA architecture for enterprise production readiness, including tenant isolation, observability, schedule exports, and gateway contracts.
```

Expected behavior:
- names each service owner and source of truth
- carries tenant, principal, trace, and correlation metadata across every sensitive boundary
- treats schedules as external contracts and does not schedule subscriptions directly
- keeps contract export helpers in `@purista/core`
- configures OTel metrics through application-owned provider/exporter setup

Validation:
- no secrets, PII, prompts, completions, headers, raw payloads, or tenant-sensitive content appear in telemetry attributes or generated examples
- queue retries, DLQ handling, idempotency, health, and replay expectations are explicit
- runtime wiring lists EventBridge, QueueBridge, stores, resources, HTTP, metrics, and model providers

## Scenario 6: Skill Drift Repair
Prompt:

```text
Old planning notes mention @purista/ai and AgentProtocolEnvelope, but the implementation exposes core-native agents. Update the skills.
```

Expected behavior:
- checks current implementation before copying stale planning assumptions
- documents the implemented API and records planning drift instead of reviving removed APIs
- updates repo-local `purista/skills` before installed mirror copies

Validation:
- `rg -n "@purista/ai|AgentProtocolEnvelope|AiSdkProvider|Vercel AI SDK" skills/purista` only finds explicit historical warnings if any
- `npm run audit:skills` passes
- `npm run lint` passes when skill changes affect tracked repo files

## Scenario 7: Durable Agent Workspace Replay
Prompt:

```text
Add a long-running research agent that may retry after worker restart and must resume from workspace checkpoints.
```

Expected behavior:
- attaches the agent to the owning service through `getAgentQueueBuilder`
- declares durable replay with `setWorkspacePolicy({ mode: 'durable', required: true, cleanup: 'on_terminal' })`
- keeps concrete durable runtime and workspace stores in `getInstance(..., { ai })` runtime wiring
- requires harness capabilities such as `runtime.workspace_checkpoint`, `workspace_store.durable`, `workspace_store.checkpoint`, `workspace_store.resume`, and `workspace_store.cleanup`
- treats retention durations, encryption key policy, tenant/project quotas, and cleanup scheduling as product-owned policy
- keeps workspace refs, file content, prompts, completions, tool inputs, tool outputs, credentials, tokens, and raw headers out of logs, metrics, traces, queues, events, and examples

Validation:
- startup fails when required runtime/workspace capabilities are missing
- retry resumes from the latest committed harness checkpoint and workspace checkpoint
- terminal success and terminal failure cleanup paths are tested
- explicit `required: false` non-durable restart is tested only when the product accepts restart semantics
