# Page Patterns

## Contents

- [Choose a page pattern](#choose-a-page-pattern)
- [Capability hub](#capability-hub)
- [Adapter or provider guide](#adapter-or-provider-guide)
- [Tutorial or task guide](#tutorial-or-task-guide)
- [Concept or architecture page](#concept-or-architecture-page)
- [Configuration or API reference](#configuration-or-api-reference)
- [Operations or troubleshooting page](#operations-or-troubleshooting-page)
- [Migration page](#migration-page)
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
8. One or two decisions that affect this path.
9. Failure check and cleanup.
10. Next links: mental model, production guide, alternative adapter, and reference.

Prefer several focused tutorials over one example that introduces every PURISTA primitive at once. An end-to-end guide should connect already taught concepts.

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

- affected versions and audience;
- old behavior and new behavior;
- compatibility boundary and rollout prerequisites;
- stepwise code/config changes;
- data or message compatibility;
- verification after each meaningful step;
- rollback conditions and procedure;
- removed/deprecated route redirects and links to current guidance.

Do not mix historical exploration with the supported migration path.

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
