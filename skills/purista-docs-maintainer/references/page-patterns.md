# Page Patterns

## Contents

- [Choose a page pattern](#choose-a-page-pattern)
- [Capability hub](#capability-hub)
- [Adapter or provider guide](#adapter-or-provider-guide)
- [Tutorial or task guide](#tutorial-or-task-guide)
- [Governance task](#governance-task)
- [Agent-control task graphs](#agent-control-task-graphs)
- [Workflow task graph](#workflow-task-graph)
- [Concept or architecture page](#concept-or-architecture-page)
- [Configuration or API reference](#configuration-or-api-reference)
- [Operations or troubleshooting page](#operations-or-troubleshooting-page)
- [Migration page](#migration-page)
- [Deterministic test and evaluation pages](#deterministic-test-and-evaluation-pages)
- [Split test](#split-test)

## Choose a page pattern

| Reader intent | Primary pattern | Do not substitute |
|---|---|---|
| Understand a capability and choose an implementation | Capability hub | a flat package list |
| Install and configure one backend/provider | Adapter guide | a paragraph on the hub |
| Reach a working result | Tutorial/task guide | an API inventory |
| Understand why the system works this way | Concept/architecture | a long setup sequence |
| Look up exact options, defaults, or signatures | Reference | a prose tutorial |
| Diagnose or operate behavior | Operations/troubleshooting | scattered warning callouts |
| Upgrade safely | Migration | a changelog entry alone |

A page may borrow a small section from another pattern, but its primary job stays clear.

## Capability hub

Use for a primitive or extension family such as stores, queues, agents, event bridges, or HTTP exposure.

Recommended flow:

1. What problem the capability solves.
2. Where it sits in the runtime, with a small architecture or data-flow diagram.
3. Common contract and lifecycle.
4. Minimal provider-neutral example.
5. Decision matrix for implementations or modes.
6. Availability matrix: default path, optional packages, external prerequisites, and enablement links.
7. Common configuration and safe defaults.
8. Testing, operations, security, and reliability expectations shared by every option.
9. Links to focused adapter guides, custom implementation, and API reference.

The hub must help a reader choose. A catalog without selection criteria is incomplete.

## Adapter or provider guide

Use one focused real-world scenario. A good guide normally contains:

1. Best-fit and avoid-if summary.
2. Supported product/runtime versions and authoritative compatibility link.
3. Default availability and installation command with the exact package name and dependency class.
4. Required external setup, credentials, and network assumptions.
5. Smallest working runtime wiring/configuration that explicitly enables the feature.
6. Expected connection, capability, generated artifact, or behavior evidence.
7. Options table: key, type, default, required state, effect, and security note.
8. Guarantees and limitations: delivery, ordering, idempotency, consistency, timeout, retry, or durability as applicable.
9. Local development and test strategy.
10. Production hardening and observability.
11. Common errors with cause, evidence, and corrective action.
12. Upgrade/migration notes and links to the capability hub, API page, example, and vendor.

Do not copy an option table from memory or another provider. Derive it from the adapter's current public types, defaults, validation, and tests.

When the page describes optional behavior, load the optional-dependencies and
feature-enablement reference directly from `SKILL.md`. Do not imply that
installing a package also provisions, configures, wires, or
production-hardens the feature.

## Tutorial or task guide

Start with a concrete finish line:

```text
By the end, a POST request enqueues an invoice job and returns a job ID; a worker processes it and emits a completion event.
```

Recommended flow:

1. Outcome, expected duration if useful, and what will be built.
2. Small diagram of the finished flow.
3. Prerequisites.
4. Scaffold or install.
5. Focused implementation steps.
6. Run command or invocation.
7. Exact expected response, log shape, trace, file, or state change.
8. Default validation, expected business rejection, and unexpected/internal
   failure behavior for this path.
9. One or two decisions that affect this path.
10. Failure check and cleanup.
11. Next links: mental model, production guide, alternative adapter, and reference.

Prefer several focused tutorials over one example that introduces every PURISTA primitive at once. An end-to-end guide should connect already taught concepts.

## Governance task

Teach governance to an inexperienced reader as a progressive task: establish
the tool and authorization boundary, add one native rule, explain unmatched
defaults and precedence, add approval/audit only when required, then cover
exposure and rollout. Do not begin with a combined native-policy, external
engine, approval, and audit example. Every step must state its prerequisite,
working outcome, relevant options, failure behavior, and verification.

Before naming an external policy engine or provider, verify whether a
first-party package actually ships. Distinguish a typed registration helper or
public port from an implementation adapter. When the focused OPA package is
present, teach its exact install, `createOpaClient(...)`,
`opaPolicy(helpers, ...)`, cascading types, explicit least-data input mapping,
Standard Schema result validation, undefined-document behavior, fixed
URL/path/header constraints, limits/defaults, strict fake, and live OPA test.
If another engine has no adapter, say so at first mention and document the
application-owned contract. Never imply that `adapter(...)` provisions a
client, connects to an engine, loads policy bundles, or translates vendor
syntax.

Also distinguish the engine topology. OPA exposes a reusable named-decision
Data API boundary. Cedar defines an authorization model, not one generic
endpoint: embedded Cedar and AWS Verified Permissions require separate runtime
guidance and potentially separate packages. Do not recommend a generic
arbitrary-endpoint policy adapter merely to hide `fetch`; it removes little
application mapping while expanding credential and SSRF risk. Keep
authenticated identity/resource resolution and vendor-to-Harness decision
mapping application-owned even when a transport package exists.

## Agent-control task graphs

Match navigation ownership to the runtime control. Built-in tool selection and
permissions live under Tools. MCP authentication, transport, selection, data
isolation, and stdio process security live under MCP. Governance, content
Guardrails, and sandbox isolation become separate task graphs when each passes
the usefulness gate. A shared security-model page may compare them but never
owns their implementation.

Begin each graph with one independently runnable, focused scenario. The first
guide includes dependency installation, complete composition, invocation,
expected result, one denied/failed result, cleanup, and a verification command,
either directly or through an exact maintained-example handoff. A fragment that
only defines a rule, action, callback, or adapter is not an end-to-end guide.

For Guardrails, teach one deterministic input rail first. Then add phase flows,
tool rails, privacy detectors, and model-backed checks one decision at a time.
At first use, explain `phase`, `valueSchema`, tool selectors, timeouts,
transformation permission, model dependencies, evaluator context, every flow
field, failure behavior, and the exact protected value. Keep the complete agent
composition and invocation visible before combining Guardrails with governance
or sandbox controls.

## Workflow task graph

Teach workflows in dependency order: typed workflow and handler context,
synchronous child-agent calls and fan-out, asynchronous child tasks, durable
execution and steps, durable external waits/human review, then retry,
compensation, and deterministic recovery tests. Human review must not precede
the durable execution it requires.

Keep child-task conversation context separate from sandbox partition policy.
Document only source-supported context modes; list `inherit`, `private`, and
group sharing only as sandbox choices. Give exact tables for workflow fields,
delegation defaults/overrides, every handler-context member, child-task start
options and handles, durable invocation fields, step retry/backoff/cancellation,
and external-wait requests/signals/results. Retry guidance must name the
idempotency boundary and prove cancellation stops pending attempts; external
wait guidance must keep review data and authorization in the application.

## Concept or architecture page

Recommended flow:

1. Plain-language definition and why the reader should care.
2. One mental model, using familiar terms before PURISTA names.
3. Diagram of components, ownership, and message/data flow.
4. Concrete real-world example.
5. Boundaries and invariants.
6. Comparison with the nearest alternatives.
7. Consequences for implementation, testing, deployment, and operations.
8. Links to the first practical task and deeper reference.

Avoid turning a concept page into marketing copy. State limitations and conditions that change the recommendation.

## Configuration or API reference

Reference pages optimize for scanning and exact lookup.

For configuration, cover:

- where the value is declared;
- type, default, required/optional state, allowed range, and validation failure;
- precedence and resolution order;
- whether the application, framework, adapter, or external platform owns it;
- whether changes require restart;
- security and observability consequences;
- a minimal example and links to practical guides.

For callable APIs, cover the execution model: in-process, local process, remote service, external provider, declarative data, or human-mediated. Link to current generated API pages instead of duplicating signatures.

## Operations or troubleshooting page

Organize around observable symptoms and operator actions.

| Symptom | Likely cause | Evidence to inspect | Corrective action | Prevention |
|---|---|---|---|---|

Cover normal health, startup failures, degraded mode, retries, timeout behavior, queue/DLQ or replay behavior, shutdown/drain, capacity limits, telemetry, backup/restore where relevant, and escalation boundaries.

Do not tell readers to retry blindly. Name the idempotency and side-effect conditions first.

## Migration page

State:

- exact published source version/tag and intended target version;
- affected packages, usages, deployment/data boundaries, and audience;
- a source-backed ledger that excludes intermediate, unreleased target APIs;
- old behavior/API and final new behavior/API;
- why the change matters and compatibility/rollout prerequisites;
- ordered code, configuration, generated-artifact, adapter, and data steps;
- expected compile/startup/runtime failure when a step is missing;
- verification after each meaningful step;
- data/message/durable-state compatibility and coexistence constraints;
- rollback trigger, executable rollback boundary, and data ownership; and
- removed/deprecated route redirects and links to current guidance.

For several independent changes, begin with an “are you affected?” table and
give each change its own old → new example. A generic inventory checklist is
not a replacement for a version-specific migration guide.

Do not mix historical exploration with the supported migration path.

## Deterministic test and evaluation pages

A deterministic test page should contain:

1. the implementation behavior being proved;
2. the real runtime composition kept in the test;
3. each replaced boundary and its deterministic fake/adapter;
4. strict fixture setup, expected interactions, and unused-fixture detection
   when supported;
5. the successful assertion and the material unhappy paths;
6. cleanup and isolation between cases; and
7. an explicit statement of what still needs a real-adapter test or evaluation.

An evaluation task page should contain:

1. the business decision and failure cost being measured;
2. a reviewed, versioned dataset with separate candidate input and scorer-only
   assessment;
3. named/versioned candidates, task, trials, and scorers;
4. scorer outcomes, calibration, and accounting boundaries;
5. per-case status, coverage, segment, and aggregate interpretation in that
   order;
6. an application-owned release-policy assertion;
7. the exact local command and CI job with bounded cost/time/concurrency; and
8. observation retention, holdout, artifact, and sensitive-data policy.

Do not merge deterministic implementation tests and nondeterministic quality
measurement into one undifferentiated tutorial. Link them as consecutive
confidence layers.

## Split test

Split a page when any two of these are true:

- it serves different audiences with different success criteria;
- it contains both a full tutorial and exhaustive reference;
- provider-specific setup dominates a provider-neutral topic;
- readers must scroll past unrelated material to reach a common task;
- two distinct diagrams are needed to explain unrelated flows;
- the title can no longer describe the whole page precisely;
- changes to one half should not require reviewing the other half.

Keep a longer page when all sections contribute to one result and splitting would force readers to bounce between pages during one short task.
