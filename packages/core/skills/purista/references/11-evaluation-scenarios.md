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
- [Scenario 8: Command-Capable Agent Boundary](#scenario-8-command-capable-agent-boundary)
- [Scenario 9: Guarded Claims Agent](#scenario-9-guarded-claims-agent)
- [Scenario 10: Clean Harness Composition](#scenario-10-clean-harness-composition)
- [Scenario 11: State Ownership in a Small App](#scenario-11-state-ownership-in-a-small-app)
- [Scenario 12: Command and Resource Testing](#scenario-12-command-and-resource-testing)
- [Scenario 13: Command Success Event or Manual Event](#scenario-13-command-success-event-or-manual-event)

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
- uses a native Harness definition, `mountHarness(...)`, and address-first PURISTA consumers
- installs provider packages only in the app wiring layer
- allowlists tools and child agents
- keeps prompt/completion content out of logs, metrics, traces, events, queues, and examples

Validation:
- generated definition test uses `FakeModelProvider`; the PURISTA wrapper test stubs the declared target address
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
Old planning notes mention @purista/ai, AgentProtocolEnvelope, and a Core
AgentBuilder, but the implementation mounts native Harness definitions. Update
the skills.
```

Expected behavior:
- checks current implementation before copying stale planning assumptions
- documents native Harness definitions, the Core mount boundary, and
  address-first invocation instead of reviving removed APIs
- updates repo-local `purista/skills` before installed mirror copies

Validation:
- `rg -n "@purista/ai|AgentProtocolEnvelope|AgentBuilder|AiSdkProvider" skills/purista` only finds explicit historical warnings if any
- `npm run audit:skills` passes
- `npm run lint` passes when skill changes affect tracked repo files

## Scenario 7: Durable Agent Workspace Replay
Prompt:

```text
Add a long-running research agent that may retry after worker restart and must resume from workspace checkpoints.
```

Expected behavior:
- declares durable workflow and workspace requirements in the native Harness definition
- mounts the workflow on the owning service and invokes it address-first
- keeps concrete Harness storage and workspace adapters in `getInstance(..., { ai })` runtime wiring
- requires harness capabilities such as `storage.workspace_checkpoint`, `workspace.durable`, `workspace.checkpoint`, `workspace.resume`, and `workspace.cleanup`
- treats retention durations, encryption key policy, tenant/project quotas, and cleanup scheduling as product-owned policy
- keeps workspace refs, file content, prompts, completions, tool inputs, tool outputs, credentials, tokens, and raw headers out of logs, metrics, traces, queues, events, and examples

Validation:
- startup fails when required storage/workspace capabilities are missing
- retry resumes from the latest committed harness checkpoint and workspace checkpoint
- terminal success and terminal failure cleanup paths are tested
- omitting durability is deliberate and tested only when the product accepts restart semantics

## Scenario 8: Command-Capable Agent Boundary

Prompt:

```text
Attach a document-extraction agent to a PURISTA service. It receives customer
uploads and must run a local stdio MCP extractor in a regulated multi-tenant
deployment.
```

Expected behavior:
- keeps caller and tenant authorization in PURISTA guards/resources and stages
  only the authorized upload into the agent workspace
- does not recommend `bashSandbox()` or local host-directory execution as the
  production isolation boundary
- wires a custom Harness sandbox adapter through the `ai.sandbox` runtime
  binding and uses `setSandboxPolicy(...)` only to select its sharing partition
- requires a spawn-capable isolating runtime with default-deny egress,
  unprivileged identity, workload limits, per-run/tenant mounts, cancellation,
  and cleanup
- requires immutable reviewed package mounts in addition to spawn capability
  when the extractor is a trusted Agent Plugin

Validation:
- the design names the adapter/platform owner for mounts, egress, process
  identity, CPU/memory/PID/time limits, secrets, and retention cleanup
- negative tests cover missing executor, cross-tenant file access, blocked
  egress, forbidden command, cancellation/process cleanup, and stale workspace
  cleanup
- it explicitly rejects the near miss “a tenant-prefixed session ID and Zod
  schema make host execution tenant-safe”

## Scenario 9: Guarded Claims Agent

Prompt:

```text
Attach an agent to the claims service. It must mask customer email addresses,
reject a prompt-injection instruction from retrieved policy text, and require a
human before a settlement tool may execute.
```

Expected behavior:
- uses `@purista/harness-guardrails` in the application composition root rather
  than adding it as a Core dependency or claiming a PURISTA review subsystem
- attaches rails only to a default-loop Harness agent and explicitly filters
  application-owned retrieval before its contents are supplied to the agent
- uses one typed inline guardrail configuration and opaque action tokens;
  TypeScript owns action behavior, model aliases, and one injected detector
  implementation
- preserves PURISTA guard/resource authorization and uses governance only for
  the sensitive tool decision
- separates content `allow`/`block`/phase transform, permission/policy
  `require_approval`, `ToolApprovalInterrupt`/`ToolApprovalResume`, and workflow
  `ExternalWaitOutcome` plus application execution claim/receipt
- combines static permission and policy demands in one durable approval
  interruption; narrows multi-tool input by `toolId`
- uses immutable execution claims, stable idempotency keys and receipts for a
  long human review; rejects a read-approved-then-execute or consumed flag recipe

Validation:
- output/tool checks do not replace tenant authorization or final domain
  validation
- detector/model content, findings, offsets, prompts, and tool arguments are
  absent from logs, metrics, traces, and fixtures
- guardrail decisions use Harness observability; Core does not duplicate model
  token or cost metrics
- tests use deterministic Harness/detector fakes and include allow, transform,
  block, and detector-failure paths
- tests show raw tool JSON transformed before one schema parse and the same
  frozen parsed input reaching governance, approval, and handler
- tests cover final-only output rails, malformed callback results, finite
  timeout/cancellation, no late approval side effect, and safe error evidence
- `model.completed` accounts for a blocked candidate without releasing
  `model.object`; direct-call/opaque-reasoning and post-admission revocation
  limits are explicit
- durable-review tests cover changed action/revision, concurrent resume and
  crashes before/after the effect and receipt, reusing the same execution claim

## Scenario 10: Clean Harness Composition

Prompt:

```text
Add an inline transfer tool and a workflow-backed mounted agent. Keep the
Harness composition type-safe and show the request lifecycle.
```

Expected behavior:
- registers the inline native definition with `.tool('transfer_funds', {...})`
  so schema-derived handler input remains exact
- uses `.tools(record)` only when a reusable native/MCP record is already typed
- invokes agents and workflows with `.run(...)` or `.stream(...)`, never
  `.prompt(...)`
- calls `session.release()` for normal idle cleanup and reserves
  `session.destroy()` for deliberate data deletion
- uses `ctx.logger` and `ctx.telemetry` in Harness agent/workflow handlers

Validation:
- no tool callback helper, registration brand, legacy invoker, Harness
  `session.close()`, or workflow `ctx.log` appears
- duplicate and invalid definition ids fail during configuration
- the example keeps authorization in the application/tool boundary rather than
  treating schemas or model instructions as authority

## Scenario 11: State Ownership in a Small App

Prompt:

```text
Our tutorial uses StateStore for sessions and transaction records, and declares
login/session/logout directly on the Hono app. Refactor it to idiomatic PURISTA.
```

Expected behavior:
- names the session capability owner and uses StateStore only for operational
  session state
- exposes login/session/logout as Identity service commands; login is explicitly
  public while session/logout remain protected generated endpoints
- uses `setProtectMiddleware` to resolve the opaque token and set trusted identity
- puts transactions behind a declared repository resource backed by a database,
  even when the first repository API only saves and reads by id
- validates keyed session reads and stored expiry, and guards business access
- separates immutable fixtures and test captures from mutable application state
- does not replace a unique insert or multi-record transaction with get-then-set
- keeps the first repository API small instead of misclassifying the record as
  application state

Validation:
- no second general session/state engine remains in the application
- no handwritten Hono business or session lifecycle routes remain
- the command metadata, generated routes, and protection middleware are tested
- state/resource mocks cover missing values, dependency failure and denied effects
- local store lifetime and cleanup are explicit; restart durability is not
  inferred from sharing one in-process store between service instances

## Scenario 12: Command and Resource Testing

Prompt:

```text
Teach me to test a command with a mocked external client, a state write, a
business guard, and an input transform. I do not want every test to start HTTP.
```

Expected behavior:
- starts from the generated test and explains arrange, act, assert and cleanup
- uses createCommandContextMock, declared resource fakes and configured state stubs
- binds the command to a service instance with safeBind
- explains getCommandFunction's included validation/before guards and excluded
  transforms/after guards; uses a runtime test to cover the complete lifecycle
- sets trusted identity with an explicit message fixture, not invented context
  helper or harness run options

Validation:
- success, resource rejection and no dependency call on business denial are checked
- direct transform tests and real lifecycle checks prove different boundaries
- test assertions match the mock library and do not replace the guard under test
- infrastructure behavior and live model quality are not inferred from unit tests

## Scenario 13: Command Success Event or Manual Event

Prompt:

```text
After saveTransaction returns the stored transaction, publish
transaction.recorded.v1 so a subscription can assess it.
```

Expected behavior:
- uses `setSuccessEventName('transaction.recorded.v1')` because the event
  is the successful command result
- subscribes to the named `CommandSuccessResponse` and validates the command's
  output shape as the event payload
- reserves `canEmit` plus `context.emit` for a separate fact produced during
  execution, such as an intermediate import warning or progress notification

Validation:
- a failed repository write produces no named success response
- the handler does not manually emit a duplicate result event
- runtime coverage observes the message type, event name, sender, trusted
  identity metadata, and payload

## Scenario 14: Capability Service Names

Prompt:

```text
Build an Example Bank tutorial with login, transactions, monitoring, reports,
and support AI. Put the commands in BankingService so the example stays simple.
```

Expected behavior:
- rejects `BankingService` as an application-wide container
- starts with only `BankProfile` for the first public fixture, then introduces
  `Identity`, `Transaction`, `Monitoring`, `Reporting`, `Support`, and
  `Knowledge` when their capabilities are taught
- keeps credential/session ownership in `Identity` and business authorization
  guards on the service that owns the protected action
- keeps each independently runnable tutorial baseline minimal

Validation:
- no active plan, learner page, CLI command, or retained source generates a
  `Banking` or `ExampleBank` service
- every service has one stated capability, state/resource owner, and focused
  test boundary
- the application and UI may still use the product name “Example Bank”
