# Evaluation Scenarios

Use these scenarios to test whether the `purista` skill gives an otherwise untrained agent enough context to design and implement PURISTA work without inventing stale APIs or unsafe architecture.

The machine-readable sibling catalog at `../evaluations/scenarios.json` contains
the release rubric for selected high-risk scenarios. Record an agent answer as
`{ "scenarioId": "...", "response": "..." }` and run
`npm run evaluate:skill-response -- --response <response.json>`. The scorer is
deliberately model-agnostic: it verifies required architectural evidence and
does not pretend to judge general code quality.

## Contents
- [Scenario 1: Greenfield Project Setup](#scenario-1-greenfield-project-setup)
- [Scenario 2: Durable Background Work](#scenario-2-durable-background-work)
- [Scenario 3: Streaming Or Aggregate HTTP Response](#scenario-3-streaming-or-aggregate-http-response)
- [Scenario 4: Service-Owned Agent](#scenario-4-service-owned-agent)
- [Scenario 5: Enterprise Runtime Review](#scenario-5-enterprise-runtime-review)
- [Scenario 6: Existing Application Change](#scenario-6-existing-application-change)
- [Scenario 7: Durable Agent Workspace Replay](#scenario-7-durable-agent-workspace-replay)
- [Scenario 8: Replicated Scheduler Host](#scenario-8-replicated-scheduler-host)
- [Scenario 9: Multi-Package Selection](#scenario-9-multi-package-selection)

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
- uses `setSessionPolicy({ mode: 'conversation', payloadPath: ['conversationId'] })` only when the product needs a
  continuing conversation; trusted `message.tenantId` and `message.principalId`
  automatically add optional namespace dimensions
- keeps prompt/completion content out of logs, metrics, traces, events, queues, and examples

Validation:
- generated agent test uses `createAgentTestHarness(...)`, `FakeModelProvider`, and documents `createAgentSkillTestRuntime(...)` for skill-backed agents
- model capabilities are declared and validated at startup
- model output is schema-validated before deterministic state changes
- the same logical conversation is reused only when its conversation id and all
  present trusted tenant/principal dimensions match; absent dimensions use
  stable framework defaults

## Scenario 5: Enterprise Runtime Review
Prompt:

```text
Review a PURISTA architecture for enterprise production readiness, including tenant isolation, observability, schedule exports, and gateway contracts.
```

Expected behavior:
- names each service owner and source of truth
- carries tenant, principal, trace, and correlation metadata across every sensitive boundary
- keeps Scheduler Runtime deployment separate from business services, emits event triggers only, and does not schedule subscriptions directly
- keeps contract export helpers in `@purista/core`
- configures OTel metrics through application-owned provider/exporter setup

Validation:
- no secrets, PII, prompts, completions, headers, raw payloads, or tenant-sensitive content appear in telemetry attributes or generated examples
- queue retries, DLQ handling, idempotency, health, and replay expectations are explicit
- runtime wiring lists EventBridge, QueueBridge, stores, resources, HTTP, metrics, and model providers

## Scenario 6: Existing Application Change
Prompt:

```text
Add a new billing command to an existing PURISTA application. The app has local
CLI scripts, but no source checkout of the PURISTA framework is available.
```

Expected behavior:
- reads the application's package scripts and `purista.json` when present
- uses the local `add:command` script to generate the command skeleton, then
  refines schemas, authorization, handler capabilities, and tests
- re-exports definitions and runs static validation when the application
  provides those scripts

Validation:
- no framework source path or internal package file is required
- the command is registered once in the generated service definition
- the application test and build scripts pass

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

## Scenario 8: Replicated Scheduler Host
Prompt:

```text
Run monthly billing in a horizontally scaled PURISTA deployment. The trigger
must be reliable, but the billing work itself may take hours and must retry.
```

Expected behavior:
- keeps `getScheduleBuilder(...).emitEvent(...)` as a service-owned declaration
  and runs `SchedulerBuilder` in a separate minimal host, never inside each
  billing service instance
- uses an event trigger followed by an event-to-queue binding and queue worker;
  it does not place billing business logic in the scheduler
- selects `@purista/redis-scheduler-provider`, a shared production
  EventBridge, `.setStrict()`, and `.setRequireDistributedClaims()` for a
  replicated scheduler group
- uses an application/environment-specific Redis `keyPrefix` and explains that
  claims protect scheduler emission, not downstream exactly-once business work
- treats `message.schedule.occurrenceId` as the downstream idempotency key

Validation:
- the agent rejects `DefaultSchedulerProvider` for multiple scheduler replicas
  and explains the stable startup capability failure
- the scheduler process imports manifest/infrastructure only and does not boot
  business services, handlers, stores, workers, agents, or HTTP routes
- provider-package changes run `assertSchedulerProviderContract(...)` with an
  independent replica sharing the same test backend
- the answer never claims exactly-once delivery: a crash after EventBridge
  publication and before durable completion remains at-least-once

## Scenario 9: Multi-Package Selection

Prompt:

```text
Expose selected commands through HTTP, publish domain events through AMQP, run
strict-idempotent invoice work on Redis, and load deployment secrets from AWS
Secrets Manager.
```

Expected behavior:
- selects `@purista/hono-http-server` for HTTP projection,
  `@purista/amqpbridge` for the event transport,
  `@purista/redis-queue-bridge` for durable strict-idempotent work, and
  `@purista/aws-secret-store` for secrets
- keeps the EventBridge and QueueBridge roles separate; an event causes normal
  queue enqueueing and the queue worker owns invoice work
- uses a strict queue idempotency key and does not put credentials in handlers,
  logs, events, or generated code

Validation:
- package choices are exact published package names rather than assumed aliases
- the answer names Hono as a projection of builder-declared APIs, not a
  route-first replacement for service definitions
- Redis is selected for the strict queue guarantee, not as a substitute for an
  EventBridge
