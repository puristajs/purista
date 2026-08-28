# Evaluation Scenarios

Use these scenarios to forward-test whether the skill produces focused, accurate, and maintainable documentation decisions.

## Contents

- [Scenario 1: New store adapter](#scenario-1-new-store-adapter)
- [Scenario 2: Restructure a duplicated chapter](#scenario-2-restructure-a-duplicated-chapter)
- [Scenario 3: Completeness audit after a package release](#scenario-3-completeness-audit-after-a-package-release)
- [Scenario 4: Enterprise landing page](#scenario-4-enterprise-landing-page)
- [Scenario 5: Repair a stale snippet](#scenario-5-repair-a-stale-snippet)
- [Scenario 6: Small documentation correction](#scenario-6-small-documentation-correction)
- [Scenario 7: Optional client-generation dependency](#scenario-7-optional-client-generation-dependency)
- [Scenario 8: Handbook structure drift](#scenario-8-handbook-structure-drift)
- [Scenario 9: Builder method coverage](#scenario-9-builder-method-coverage)
- [Scenario 10: Inherited adapter defaults](#scenario-10-inherited-adapter-defaults)
- [Scenario 11: Distributed HTTP projection and handler context](#scenario-11-distributed-http-projection-and-handler-context)
- [Scenario 12: Command lifecycle and task graph](#scenario-12-command-lifecycle-and-task-graph)
- [Scenario 13: Rehome an overloaded concept chapter](#scenario-13-rehome-an-overloaded-concept-chapter)
- [Scenario 14: Collision-safe autonomous refactor plan](#scenario-14-collision-safe-autonomous-refactor-plan)
- [Scenario 15: Primitive test-boundary drift](#scenario-15-primitive-test-boundary-drift)
- [Scenario 16: Nested chapter navigation](#scenario-16-nested-chapter-navigation)
- [Scenario 17: Fluent typed examples and exact option lookup](#scenario-17-fluent-typed-examples-and-exact-option-lookup)
- [Scenario 18: Semantic method lookup](#scenario-18-semantic-method-lookup)
- [Scenario 19: Partial custom-adapter example](#scenario-19-partial-custom-adapter-example)
- [Scenario 20: API-generation coverage for a first-party package](#scenario-20-api-generation-coverage-for-a-first-party-package)

## Scenario 1: New store adapter

Prompt:

```text
Document a new PostgreSQL state-store adapter, including installation, configuration, selection guidance, and production use.
```

Expected behavior:

- verifies the public package, constructor/config type, defaults, capability flags, tests, and maintained example;
- updates the state-store hub decision matrix and creates one focused adapter page;
- covers install, minimal wiring, expected result, option/default reference, security, consistency, failure behavior, tests, observability, migration, and exact API/vendor links;
- keeps common state-store usage on the hub and PostgreSQL-specific behavior on the adapter page.

Near miss to reject:

- adding an unverified configuration object copied from the Redis adapter;
- placing the full provider guide inside the state-store overview;
- listing PostgreSQL without explaining when it is a better fit.

## Scenario 2: Restructure a duplicated chapter

Prompt:

```text
The command builder is explained in two long handbook routes. Make the chapter concise and easier to navigate without losing useful content.
```

Expected behavior:

- inventories inbound links, navigation entries, unique content, examples, and current API accuracy first;
- chooses one canonical explanation and separates concept, task, testing, HTTP exposure, and API reference only where each has a distinct job;
- preserves or adds redirects for the retired canonical route;
- gives every resulting page enough independent context and deliberate next links;
- verifies all affected routes and anchors after build.

Near miss to reject:

- deleting one route because titles look similar without checking unique content or inbound links;
- keeping both full explanations and adding cross-links between them;
- splitting into many one-paragraph pages with empty wrappers.

## Scenario 3: Completeness audit after a package release

Prompt:

```text
Audit whether the handbook completely covers the latest PURISTA release, including packages, configuration, examples, and operations.
```

Expected behavior:

- rebuilds/uses fresh API evidence and inventories public packages, exports, configs, CLI paths, adapters, tests, examples, and navigation;
- creates a coverage matrix with documented, partial, missing, not-public, deprecated, or superseded status;
- distinguishes missing explanation from generated API lookup coverage;
- prioritizes first-success blockers, unsafe production gaps, and missing decision/configuration guidance;
- proposes focused page work with source evidence and does not invent missing behavior.

Near miss to reject:

- judging completeness by page count or search hits alone;
- treating every TypeDoc export as requiring its own tutorial;
- claiming compatibility based on a package name without checking current provider documentation.

## Scenario 4: Enterprise landing page

Prompt:

```text
Create a primary-navigation page explaining PURISTA's queue architecture to CTOs and architects.
```

Expected behavior:

- leads with enterprise workload and ownership problems, then architecture, guarantees, operational consequences, limits, and evidence;
- uses one semantic system visual rather than a developer setup sequence or generic card grid;
- separates EventBridge and QueueBridge and avoids promising exactly-once processing;
- links claims to the focused queue, bridge, reliability, and operations handbook pages;
- ends with one evaluator-appropriate next step.

Near miss to reject:

- pasting the queue-worker tutorial onto the landing page;
- making unsupported reliability or performance claims;
- linking every section only to the handbook homepage.

## Scenario 5: Repair a stale snippet

Prompt:

```text
A quickstart snippet uses an old HTTP server and a method that no longer exists. Fix the page.
```

Expected behavior:

- checks active framework decisions, implementation, CLI/starter output, tests, and fresh API data;
- updates the supported Hono-based path and uses current generated project structure;
- keeps the snippet focused, runnable, and followed by expected output;
- finds dependent copies and either updates them or replaces duplication with canonical links;
- runs focused build/link/code verification.

Near miss to reject:

- changing method names based only on another handbook page;
- preserving an old alternative as if it were supported;
- expanding the quickstart into exhaustive HTTP configuration.

## Scenario 6: Small documentation correction

Prompt:

```text
Correct one misleading sentence about a queue timeout and add the exact reference link.
```

Expected behavior:

- verifies the timeout semantics and updates the narrow canonical location;
- checks whether the misleading sentence is duplicated;
- adds the precise API or focused guide link;
- runs proportional content/link verification.

Near miss to reject:

- redesigning the chapter or creating a new page without evidence that structure is the problem;
- changing runtime code or defaults under the authority of a documentation correction.

## Scenario 7: Optional client-generation dependency

Prompt:

```text
Document ClientBuilder for applications that only consume clients at runtime and for developers who generate TypeScript clients. TypeScript is loaded only for generation.
```

Expected behavior:

- verifies the package manifest, dynamic import, runtime error, generated project defaults, and focused tests;
- states that ordinary runtime consumption does not require enabling client generation;
- places the TypeScript development dependency install before the first generation command and keeps it out of runtime dependency guidance;
- shows the generation configuration/wiring, command, expected artifact, and missing/incompatible dependency behavior;
- distinguishes package installation from invoking and verifying generation.

Near miss to reject:

- telling every PURISTA application to install TypeScript as a runtime dependency;
- assuming TypeScript is included because PURISTA itself is written in TypeScript;
- mentioning only the missing-module error instead of documenting enablement at the point of use;
- saying the feature is enabled after installation without showing the generation step and output.

## Scenario 8: Handbook structure drift

Prompt:

```text
Reorganize the Framework and AI Harness handbook. Use the current folders and
navigation as the starting structure, add the new AI pages, and update next
links.
```

Expected behavior:

- locates and reads the latest approved, non-superseded handbook information
  architecture before treating the current folders as a target;
- inventories the approved target, shipped manifest/routes, legacy content,
  and missing/conflicting topics separately;
- keeps AI-powered PURISTA services in the Framework service-building path and
  standalone models, tools, skills, MCP, plugins, memory, guardrails, and
  evaluations in the Harness product graph;
- derives landing, sidebar, breadcrumbs, previous/next, search facets,
  canonical routes, and redirects from one structural manifest;
- creates a route/content migration map and preserves redirects before removing
  duplicate or legacy pages; and
- requires structural audits for duplicate IDs/routes, invalid parents,
  cross-product sequence edges, missing sources, stale redirects, and uncovered
  packages/adapters.

Near miss to reject:

- assuming the current card order is approved because it renders;
- maintaining separate ordered arrays for the homepage and sidebar;
- allowing Framework previous/next navigation to enter the Harness chapter;
- copying standalone Harness explanations into Framework AI service pages; or
- deleting old routes before merging unique value and establishing redirects.

## Scenario 9: Builder method coverage

Prompt:

```text
The handbook says agents and streams can be exposed over HTTP. Review the
builders and make sure the handbook covers every supported exposure shape.
```

Expected behavior:

- inventories the current public stream and attached-agent builder methods and
  their tests before editing prose;
- distinguishes a normal command endpoint, HTTP stream, generated aggregate
  agent command, generated streaming agent endpoint, and queued accepted-work
  response;
- documents default security, enablement/wiring, lifecycle/disconnect or queue
  behavior, and a focused usage example for each supported shape;
- records every remaining public method as a canonical-guide, reference-only,
  not-user-facing, or remediation row; and
- does not invent a server, provider, or transport behavior not implemented by
  current public packages.

Near miss to reject:

- saying “agents can be exposed over HTTP” without showing aggregate versus
  stream selection;
- documenting a stream as durable after client disconnect;
- treating generated agent queue behavior as identical to a synchronous command;
- assuming an HTTP server is included merely because `@purista/core` stores
  HTTP metadata.

## Scenario 10: Inherited adapter defaults

Prompt:

```text
The state-store pages say writes are opt-in, but a report says an inherited
store base changed the default. Correct the handbook without copying behavior
from another store family.
```

Expected behavior:

- traces every relevant constructor through its shared base class and tests;
- distinguishes inherited defaults from provider overrides and unsupported
  provider operations;
- updates each affected hub, adapter guide, local/test guide, and comparison
  table together; and
- distinguishes duplicate-enqueue enforcement from exactly-once business work.

Near miss to reject:

- correcting only the page named in the report;
- assuming config, secret, and state stores share guard defaults; or
- calling a duplicate-enqueue guarantee exactly-once processing.

## Scenario 11: Distributed HTTP projection and handler context

Prompt:

```text
Document the Hono HTTP server and the command/stream builder API so a team can
deploy an HTTP process separately from its PURISTA services and understand the
handler context they implement.
```

Expected behavior:

- traces registration events and Hono's subscription from implementation and
  tests, then diagrams the independent HTTP process, EventBridge, and business
  service boundaries;
- documents the required distributed startup order, readiness consequences, and
  the separate monolith/direct-registration route without treating them as the
  same setup;
- gives parameter/default tables for HTTP exposure, security, streaming, and
  relevant Hono configuration instead of only pasting a builder chain;
- explains command, stream, subscription, and queue-worker handler positional
  inputs and context capabilities, including the builder declarations that
  unlock typed clients; and
- keeps the topology guide concise by linking specialized HTTP stream and
  queued-work pages rather than duplicating them.

Near miss to reject:

- implying Hono is merely middleware inside every service process;
- showing a distributed Hono instance starting after non-replayed endpoint
  announcements without explaining the missing-route consequence;
- listing `context.resources` or `context.service` without explaining their
  declaration, type source, or security boundary; or
- documenting only a method name while omitting its options and defaults.

## Scenario 12: Command lifecycle and task graph

Prompt:

```text
Commands mentions every builder method, but users cannot follow the complete
execution lifecycle or find success events, queueing, and custom events. Split
and reorder the topic without losing detail.
```

Expected behavior:

- traces and tests the real input-transform, domain-validation, guard, handler,
  output-validation/transform, response, event, and error order;
- puts one readable lifecycle diagram on the Commands hub;
- orders focused pages from first command through success event, invocation,
  enqueue, stream/event composition, resources/stores/context, exposure,
  failure, and tests;
- uses reader-facing titles and records every current content unit and public
  method in a canonical owner; and
- validates a newcomer first result and exact lookup for
  `setSuccessEventName`, `canEnqueue`, and handler context.

Near miss to reject:

- adding a diagram without verifying callback order;
- leaving all outbound capabilities under “Call another service”;
- moving success-event or error detail without a per-content-unit retention
  record; or
- creating empty pages so every primitive has the same tree.

## Scenario 13: Rehome an overloaded concept chapter

Prompt:

```text
Understand the Framework duplicates builder lifecycles, deployment setup,
retries, and handler context. Make it useful as an independent mental-model
chapter and move detail to focused guides.
```

Expected behavior:

- retains architecture, ownership, boundaries, invariants, and primitive
  decision guidance;
- identifies the exact task owner for builder order, context, deployment,
  reliability, exposure, and tests;
- lands and verifies destination content before reducing or redirecting a
  concept route;
- preserves minimal consequence/context plus a deliberate canonical link; and
- checks direct-search readers still understand the concept page independently.

Near miss to reject:

- deleting detail because it exists somewhere in generated API docs;
- keeping competing full procedures in concept and task pages; or
- moving content before its destination page and route exist.

## Scenario 14: Collision-safe autonomous refactor plan

Prompt:

```text
Create a plan that cheaper autonomous agents can use to refactor the entire
Framework handbook in parallel without losing content or drifting navigation.
```

Expected behavior:

- starts with route, content-unit, public-surface, topology, and page-job
  evidence ledgers;
- pilots one representative primitive before parallel sibling work;
- gives every ticket exact write/read scopes, dependencies, retained IDs,
  acceptance journeys, verification, exclusions, and halt conditions;
- reserves manifest, redirects, shared navigation/layout, search, breadcrumbs,
  and previous/next for one integration owner; and
- finishes with independent newcomer and experienced-user reviews rather than
  accepting route/page-count coverage alone.

Near miss to reject:

- assigning all Start, concepts, and service primitives to one agent;
- allowing every content writer to edit the shared manifest;
- redirecting routes before content-unit retention closes; or
- marking the plan ready from an unrelated readiness report.

## Scenario 15: Primitive test-boundary drift

Prompt:

```text
The subscription guide says direct builder tests cover the full runtime
lifecycle. Keep the tests concise, but correct the guide and prevent this
mistake in future primitive documentation.
```

Expected behavior:

- traces the direct helper/wrapper and the service execution path through
  implementation and tests rather than trusting its name or TSDoc alone;
- identifies exactly which validation, transforms, hooks, result-event, control,
  registration, and adapter stages each boundary executes;
- places a focused three-boundary table beside the subscription implementation
  guide and links real-adapter behaviour to the adapter guide; and
- updates the docs-maintainer guard so future primitive pages cannot describe a
  direct helper as proof of a lifecycle stage it does not run.

Near miss to reject:

- replacing the claim with “unit tests are enough”;
- requiring every developer to run a live broker for pure handler logic; or
- using an LLM/provider quality test as evidence of a deterministic framework
  flow.

## Scenario 16: Discoverable nested chapter navigation

Prompt:

```text
Move State stores under Use stores and configuration, but keep its existing
canonical route and its independently useful state-store pages.
```

Expected behavior:

- preserves the state-store content, route, redirects, and chapter-level audit
  evidence while declaring its parent as the stores/configuration chapter;
- derives the sidebar from parent relationships so only direct children of the
  Framework product are top-level entries, while only the active chapter and
  its active descendants expand; and
- provides a narrow-screen handbook disclosure/menu with the same progressive
  active-branch behavior, rather than only a generic Handbook landing-page
  link;
- renders State stores under Use stores and configuration, with its adapter
  pages still reachable and in their intended order; and
- verifies both the expanded desktop tree and the narrow/mobile navigation in
  addition to route and link audits.

Near miss to reject:

- filtering every nested chapter out of navigation and making its pages
  unreachable;
- keeping the nested chapter as a second top-level sidebar item merely because
  it still has an `index.md`; or
- changing a public state-store URL solely to make the sidebar implementation
  simpler.

## Scenario 17: Fluent typed examples and exact option lookup

Prompt:

```text
The generated attached-agent example creates a detached configuration constant,
and a queued-agent guide calls setResponseMode with an unexplained resultPolicy
and status URL. Keep the recommended path idiomatic and ensure readers can
find every option without reverse-engineering source.
```

Expected behavior:

- keeps the Harness agent definition inline with its fluent agent builder when
  the builder already owns the payload/output schemas and type propagation;
- uses `as const satisfies` only for a genuinely reusable standalone object,
  after checking that its type is a direct public dependency;
- explains every builder call introduced by the focused snippet, including
  purpose, parameters, defaults/modes, runtime result, and the relevant
  failure or trade-off;
- links to a stable generated API member anchor, not a reflection ID or an
  unfiltered methods section; and
- verifies the generated example compiles/tests and the handbook link renders.

Near miss to reject:

- importing an implementation or transitive package directly only to obtain a
  type;
- extracting a single-use object merely to add an explicit type;
- replacing option guidance with a raw TypeDoc link; or
- documenting a URL template as if the Framework expands or serves it when it
  merely returns the string.

## Scenario 18: Semantic method lookup

Prompt:

```text
The Commands chapter mentions canEnqueue, canEmit, and canConsumeStream, but
all three are hidden below one broad “Call other capabilities” heading. Make
the guidance findable without duplicating implementation details.
```

Expected behavior:

- verifies the builder signatures, context surfaces, and runtime boundaries;
- keeps a concise composition hub when it adds a useful decision, then gives
  each independently searched operation a reader-facing child title or an
  equally explicit hub task link;
- preserves one canonical option table and exact API-member link for every
  method family; and
- verifies that a reader can navigate from the primitive hub to each operation
  without relying on full-text search or knowledge of internal method names.

Near miss to reject:

- treating a paragraph mention as method coverage;
- creating empty wrapper pages solely to produce a symmetrical sidebar; or
- duplicating the full configuration table on the hub and every child page.

## Scenario 19: Partial custom-adapter example

Prompt:

```text
Document how to build a custom QueueBridge. The page has a short class that
claims to implement QueueBridge but omits most methods.
```

Expected behavior:

- verifies every public interface member and the shown composition boundary;
- replaces the non-compiling concrete class with either a complete tested
  implementation, an explicit abstract base, or a standalone capability/config
  declaration whose type is checked with `satisfies`;
- keeps the complete lifecycle/method matrix beside the focused example; and
- does not show a partial object being passed to `getInstance(...)`.

Near miss to reject:

- retaining `implements QueueBridge` with a comment saying to implement the
  remaining methods later;
- using `as QueueBridge` to hide missing members; or
- claiming the provider capabilities are available before the concrete
  implementation and integration tests prove them.

## Scenario 20: API-generation coverage for a first-party package

Prompt:

```text
The handbook now explains a public Harness adapter method, but its exact API
link resolves to no generated page. Repair the documentation workflow without
replacing the member link with a vague package homepage.
```

Expected behavior:

- verifies the exported package and symbol in source, then checks the current
  generated API inventory and route output;
- extends the documented API-generation pipeline so the package and its public
  module structure are present in the shared API evidence;
- regenerates and verifies the exact member route before adding or retaining
  the handbook link; and
- preserves a focused task guide while using generated API only for signature
  lookup.

Near miss to reject:

- hand-writing a URL based on a TypeScript source path;
- replacing the missing member link with a package root link; or
- declaring the guide complete because the source export exists while the
  generated website cannot present it.
