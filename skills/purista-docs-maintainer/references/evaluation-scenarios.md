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
- [Scenario 21: Primitive semantics, failure asymmetry, and continuing example](#scenario-21-primitive-semantics-failure-asymmetry-and-continuing-example)
- [Scenario 22: Dense lifecycle, schema metadata, and shared-page overlap](#scenario-22-dense-lifecycle-schema-metadata-and-shared-page-overlap)
- [Scenario 23: Service boundary, hook tests, and HTTP parameters](#scenario-23-service-boundary-hook-tests-and-http-parameters)
- [Scenario 24: Cross-cutting pages interrupt the learning path](#scenario-24-cross-cutting-pages-interrupt-the-learning-path)
- [Scenario 25: Harness sandbox, deterministic tests, and evaluation CI](#scenario-25-harness-sandbox-deterministic-tests-and-evaluation-ci)
- [Scenario 26: Agent governance, model Guardrails, and Framework ownership](#scenario-26-agent-governance-model-guardrails-and-framework-ownership)
- [Scenario 27: Published-version migration without implementation-history leakage](#scenario-27-published-version-migration-without-implementation-history-leakage)
- [Scenario 28: EventBridge and deployment topology coverage](#scenario-28-eventbridge-and-deployment-topology-coverage)
- [Scenario 29: Recipes and cross-cutting tests duplicate focused owners](#scenario-29-recipes-and-cross-cutting-tests-duplicate-focused-owners)
- [Scenario 30: Secure built-in defaults and skill execution boundaries](#scenario-30-secure-built-in-defaults-and-skill-execution-boundaries)
- [Scenario 31: Beginner governance and external policy engines](#scenario-31-beginner-governance-and-external-policy-engines)
- [Scenario 32: Consumer-style runnable example](#scenario-32-consumer-style-runnable-example)
- [Scenario 33: Flatten a linear task graph](#scenario-33-flatten-a-linear-task-graph)
- [Scenario 34: Declarative agent and workflow registration](#scenario-34-declarative-agent-and-workflow-registration)

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

- inventories the current public stream, Harness mount, and address-first invocation methods and
  their tests before editing prose;
- distinguishes a normal command endpoint, HTTP stream, mounted target,
  explicit AI SDK UI stream adapter, and queued accepted-work response;
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
- claiming that mounting a target implicitly creates a queue or HTTP endpoint;
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
- uses one readable lifecycle diagram or two/three focused diagrams when the
  complete flow would be too dense, while retaining one exact order table;
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
The mounted-agent example hides important native Harness and mount policy
options in detached constants. Keep the recommended path idiomatic and ensure
readers can find every option without reverse-engineering source.
```

Expected behavior:

- keeps a focused native Harness agent definition beside its owned input and
  output schemas, using the singular or plural definition registry that best
  preserves local type inference;
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

## Scenario 21: Primitive semantics, failure asymmetry, and continuing example

Prompt:

```text
Rewrite Commands so a newcomer understands request-response, can run one
update command, then add invocation, events, transforms, HTTP exposure, errors,
and tests without losing the original example.
```

Expected behavior:

- defines who selects the command, who waits, what response exists, which
  caller identity metadata remains available, and how the command stays
  contractually independent of named callers/subscribers;
- verifies the complete lifecycle and records every stage's input, output,
  ordering, side-effect boundary, failure classification, public response, and
  skipped later stages;
- distinguishes raw representation schemas from domain schemas around input
  and output transforms, and derives guard placement from runtime execution
  rather than the visual order of fluent builder calls;
- explains beside the first working handler that invalid caller input returns
  actionable handled validation details, an intentional business rejection
  exposes only safe `HandledError` data, and unexpected or invalid-output
  failures become an opaque internal response;
- carries one small real-world operation through sibling pages, showing only
  each new declaration/handler delta and keeping names, schemas, results, and
  errors consistent;
- uses a consumer-local dependency response schema and states stripping versus
  rejection only for the verified schema library; and
- makes invocation, success events, custom events, queues, streams, exposure,
  and tests directly discoverable without a duplicate composition wrapper.

Near miss to reject:

- saying a command “does not know the caller” while omitting principal, tenant,
  sender, trace, and correlation metadata available in context;
- describing input and output validation as the same public `400` response;
- catching a database/provider exception and returning its message in a handled
  error;
- changing domains and identifiers on every child page so readers must rebuild
  the mental model; or
- claiming every Standard Schema implementation strips unknown response fields
  because the shown Zod object does.

## Scenario 22: Dense lifecycle, schema metadata, and shared-page overlap

Prompt:

```text
The Commands lifecycle diagram is hard to read, the first command schemas do
not help generated OpenAPI clients, and resources/stores/context/errors are
explained repeatedly across shared and command pages. Improve the flow without
losing lookup coverage.
```

Expected behavior:

- re-verifies raw input, domain validation, guards, handler, domain output,
  output transform, response, and event order from implementation and tests;
- splits the visual at semantic handoffs when that produces clearer input,
  execution, and output diagrams, while preserving one numbered order table;
- verifies the current schema-to-JSON-Schema/OpenAPI converter before adding
  business descriptions and optional safe, schema-valid examples;
- makes the service resource page own declaration, composition-root injection,
  lifecycle, and test replacement; the store page own selection/wiring/shared
  operations; the shared context/error pages own fundamentals; and the command
  pages own only exact callback capabilities and command failure mapping; and
- preserves useful routes and direct lookup links while removing repeated
  examples, builder tours, and option tables that add no local delta.

Near miss to reject:

- changing only the Mermaid layout while retaining an incorrect stage order;
- claiming every Standard Schema library preserves Zod metadata;
- adding real tenant, user, invoice, or credential data as an OpenAPI example;
- deleting a shared or primitive page solely because both mention `context` or
  `HandledError`; or
- keeping the same full resource/store/error tutorial on every primitive page.

## Scenario 23: Service boundary, hook tests, and HTTP parameters

Prompt:

```text
The first command constructs dependencies in the handler, hook tests call raw
callbacks without the right context, and its HTTP route does not explain how
path and query values become typed command parameters. Correct the guide.
```

Expected behavior:

- presents the service as the logical container that declares shared resource,
  configuration, metric, and runtime requirements for its definitions;
- distinguishes application interfaces from concrete resources, stores,
  bridges, logging, and telemetry supplied through `getInstance(...)`, and
  states the exact service-instance or context member where each appears;
- uses string service-version keys inferred from literal `canInvoke(...)` or
  `canConsumeStream(...)` declarations;
- documents direct transform and guard accessors with the correct context mock,
  service binding, lifecycle-stage arguments, result validation, and excluded
  stages, then uses the service runtime harness for complete-order evidence;
- maps every `:path` and documented query name to the parameter schema and
  handler, including raw string parsing and matching required/optional states
  in OpenAPI metadata and runtime validation.

Near miss to reject:

- describing `context` as a global dependency container or saying validated
  service configuration is copied onto it when implementation keeps it on the
  bound service instance;
- using numeric service-version property access in recommended TypeScript;
- treating a directly invoked transform as proof that its surrounding schemas
  ran; or
- marking a query optional only in OpenAPI while leaving its runtime schema
  required, or vice versa.

## Scenario 24: Cross-cutting pages interrupt the learning path

Prompt:

```text
Build services starts with handler context, stores, and shared error handling
before Services and Commands. Reorder it without losing useful information.
```

Expected behavior:

- identifies the executable newcomer path independently from cross-cutting
  lookup material;
- retains handler-context and shared-error pages when they own unique
  cross-primitive contracts, but places them after the primitive sequence and
  links them locally from implementation pages;
- migrates store selection, wiring, and shared operations to the stores and
  configuration chapter, preserving a focused handler-use task;
- records a per-page retain, migrate, merge, or retire disposition before
  editing and preserves a redirect when canonical ownership changes; and
- verifies direct-child order, previous/next behavior, old routes, inbound
  links, and both newcomer and exact-lookup journeys.

Near miss to reject:

- deleting shared pages because primitive pages mention the same nouns;
- requiring a newcomer to read a context reference before creating a service;
- leaving a full store tutorial under Build services and another under store
  configuration; or
- moving a source file without redirecting the old public route.

## Scenario 25: Harness sandbox, deterministic tests, and evaluation CI

Prompt:

```text
The Harness sandbox page duplicates MCP setup, model fakes silently return
fallback responses, and the evaluation chapter describes datasets and CI
without a runnable gate. Refactor and correct the product at the root.
```

Expected behavior:

- verifies sandbox capabilities, optional dependencies, lifecycle, adapter
  contracts, MCP transports, fake-provider behavior, and evaluation APIs from
  source and tests before editing;
- keeps built-in sandbox selection/configuration and production enforcement in
  the sandbox chapter, MCP HTTP/stdio setup in the MCP chapter, and
  adapter-specific provisioning on focused adapter pages;
- uses strict scripted interactions and unused-fixture detection when the
  public test helper supports them, or fixes the helper additively with tests,
  TSDoc, public exports/specs, and compatibility preserved;
- separates primitive-local first tests from cross-cutting tool, workflow,
  replay, state, and adapter testing, and states exactly what each proves;
- provides a versioned reviewed dataset, candidate/task/scorer wiring,
  per-case/coverage-first interpretation, application release assertion,
  package command, and bounded protected CI job; and
- distinguishes fake-driven implementation evidence, real-adapter conformance,
  and nondeterministic live-agent quality without using one as proof of another.

Near miss to reject:

- teaching the same complete MCP example under both sandboxing and MCP;
- calling a fallback-returning fake reliable without detecting unexpected or
  unused interactions;
- claiming a generic sandbox contract proves tenant or process isolation;
- presenting an evaluation loop with no executable release decision or CI
  command; or
- retrying a low score until the candidate passes.

## Scenario 26: Agent governance, model Guardrails, and Framework ownership

Prompt:

```text
Secure and govern agents lists guardrails and policies but does not show how to
define a policy, require approval, use a separate guardrail model, or attach the
controls to a PURISTA service. Make it implementable.
```

Expected behavior:

- separates application authorization, tool selection/permissions, governance,
  Guardrails, approval, sandbox, and MCP/platform isolation;
- documents typed policy selectors/effects, defaults/precedence, shadow and
  enforce modes, bounded approval, content-safe audit, failure behavior, and
  deterministic handler-suppression tests;
- defines Guardrail phases and ordered actions, registers a separate
  object-capable model alias before the protected agent, keeps deterministic
  rails first, and injects concrete provider/model bindings at composition;
- keeps full standalone semantics in Harness while Framework pages show the
  agent-definition, `getInstance(..., { ai })`, authorization, and sandbox-owner
  integration points; and
- sends real guardrail-model accuracy and agent correctness to versioned
  evaluations rather than deterministic flow tests.

Near miss to reject:

- calling prompt instructions a policy or guardrail;
- using model output as caller authorization;
- putting the concrete provider/model in the Framework builder requirement;
- treating a tool-approval interruption as a general workflow business wait; or
- claiming one fake model response proves guardrail quality.

## Scenario 27: Published-version migration without implementation-history leakage

Prompt:

```text
Write the current PURISTA major migration guide. Several APIs changed names
more than once while the new major was developed.
```

Expected behavior:

- identifies the latest published source tag and intended final release target,
  then diffs exported APIs, runtime behavior, dependencies, generated output,
  tests, and maintained examples;
- excludes names that existed only between unpublished target commits;
- begins with an affected-usage matrix and gives old/new code, reason, ordered
  edits, missing-step failure, data compatibility, verification, and rollback
  for every developer-relevant change;
- distinguishes package alignment, application source migration, durable-data
  migration, adapter/topology migration, and contract coexistence; and
- blocks or labels unresolved target behavior instead of presenting it as a
  released historical fact.

Near miss to reject:

- turning the git commit history into a user migration sequence;
- listing only package-manager commands;
- saying “run the tests” without per-boundary evidence;
- copying legacy durable tables into an incompatible store; or
- documenting an internal package that was never published.

## Scenario 28: EventBridge and deployment topology coverage

Prompt:

```text
Document EventBridge choices and show how to compile, run, and deploy the same
application as a monolith or independent services with an HTTP gateway.
```

Expected behavior:

- defines EventBridge ownership, registration, invocation/event/stream flow,
  capabilities, bridge-before-service startup, readiness, health, drain, and
  shutdown before comparing adapters;
- gives each supported adapter exact optional installation, provisioning,
  configuration/defaults, supported/unsupported capabilities, security,
  failure/reconnect, verification, and migration guidance;
- distinguishes TypeScript compilation from bundling and identifies concrete
  entry points, assets, config/secrets, probes, signals, and external runtime
  dependencies;
- distinguishes direct monolith definition registration from the independent
  HTTP process that learns endpoints over EventBridge, including startup-order
  and missing/late-registration consequences; and
- requires every custom adapter capability claim to have implementation and
  real-provider evidence.

Near miss to reject:

- saying all bridges have the same guarantees because they implement one
  interface;
- starting services before the bridge without verified adapter-specific reason;
- describing `tsc` output as a bundled executable;
- implying a container image provisions brokers, sidecars, stores, or IAM; or
- hiding deployment below a generic security/operations page.

## Scenario 29: Recipes and cross-cutting tests duplicate focused owners

Prompt:

```text
Apply patterns and recipes contains monolith and microservices pages, while Test
applications repeats the complete command and queue test tutorials. Make both
topics useful and concise.
```

Expected behavior:

- moves topology setup to the dedicated deployment graph and preserves public
  redirects;
- retains a recipe only when it owns a real cross-capability outcome, decision,
  end-to-end implementation delta, and verification;
- leaves primitive handler/helper/lifecycle tests beside commands,
  subscriptions, streams, queues, and mounted Harness targets;
- makes the cross-cutting test chapter own service composition, cross-message
  flows, real adapters, topology, and focused release evidence; and
- links to focused owners instead of copying full builder chains, method tables,
  or error cases.

Near miss to reject:

- retaining empty pages for navigation symmetry;
- renaming a deployment page “recipe” without changing its reader job;
- duplicating a primitive test and calling the copy “integration”; or
- deleting old routes without redirects and content-retention evidence.

## Scenario 30: Secure built-in defaults and skill execution boundaries

Prompt:

```text
Built-in Harness tools should be opt-in, but every example sets
builtinTools: false. Check whether skills collide with that default and explain
the security limits of skill scripts and instructions.
```

Expected behavior:

- traces the canonical built-in resolver, agent registration, skill mounting,
  model tool exposure, sandbox capabilities, and tests before changing claims;
- makes omission enable no built-ins, removes redundant opt-out fields from the
  normal path, and keeps explicit named allowlists where capabilities are used;
- requires a default-loop skill agent to name `read` and fails during
  configuration before model or sandbox I/O when it is missing;
- states that skills never grant tools, `allowed-tools` is unenforced metadata
  unless source proves otherwise, and registration/mounting never executes a
  bundled script;
- explains that harmful instructions can still steer separately allowed tools,
  and covers source pinning/review, discovery trust, domain authorization,
  credentials/egress, execution isolation, deterministic tests, and change
  re-review; and
- updates Framework attachment behavior and guidance when a Framework
  allowlist is not consistently projected into Harness.

Near miss to reject:

- auto-enabling every built-in because a skill is present;
- claiming `allowed-tools` enforces permissions because the frontmatter field
  exists;
- saying skill scripts are safe merely because mounting does not execute them;
- retaining `builtinTools: false` in every recommended snippet after omission
  becomes the verified secure default; or
- discovering the missing `read` only after a provider request starts.

## Scenario 31: Beginner governance and external policy engines

Prompt:

```text
Explain Harness governance to a new developer and show how to use OPA or Cedar
through adapter(...).
```

Expected behavior:

- starts with the prepared-tool decision path and separates tool selection,
  permissions, governance, approval, content Guardrails, handler authorization,
  and sandbox enforcement;
- builds one working native deny rule first, then explains selector typing,
  unmatched default, precedence, approval, audit, exposure, shadow rollout,
  failures, and deterministic verification in dependency order;
- verifies the package/export inventory before claiming an OPA, Cedar, or
  generic external-policy adapter exists;
- when the first-party OPA package ships, teaches its exact install, fixed
  client, typed `opaPolicy(helpers, ...)` mapping, Standard Schema result,
  undefined decision, bounds/errors, strict fake, and real-OPA verification;
- for engines without a package, states that fact and gives a focused
  application-owned `GovernancePolicyEvaluator` guide while explaining that
  `adapter(...)` only preserves evaluator types;
- distinguishes OPA's reusable Data API transport from embedded Cedar and AWS
  Verified Permissions, which are different execution topologies, and rejects
  a generic arbitrary-endpoint adapter that widens credential or SSRF risk; and
- requires both fake-evaluator control-flow tests and selected-engine
  integration tests before enforcement.

Near miss to reject:

- opening with one large composition containing unexplained approval, audit,
  native rules, and a placeholder external client;
- saying “use the OPA/Cedar adapter” instead of verifying and naming the
  focused OPA package while keeping Cedar topologies separate;
- implying `adapter(...)` performs network I/O, provisions a client, loads a
  bundle, or understands vendor policy syntax;
- documenting a generic “Cedar URL” or treating an embedded runtime and AWS
  Verified Permissions as configurations of the same adapter;
- returning unchecked vendor JSON or allowing on evaluator failure; or
- treating model/tool input as authenticated principal or tenant identity.

## Scenario 32: Consumer-style runnable example

Prompt:

```text
The Guardrails quickstart tells readers to build Harness workspaces before they
can run it. Make it look and behave like a normal Node/TypeScript application.
```

Expected behavior:

- removes dependency-workspace build commands from the public run path;
- gives the example its own runtime dependencies and package-local install,
  typecheck, test, build, and start commands;
- uses the supported Node runtime's native environment-file flag and provides
  a safe `.env.example` when provider credentials are needed;
- uses a real provider in the executable application while injecting a fake
  provider into deterministic tests; and
- verifies the application package without requiring a live provider call in
  automated tests.

Near miss to reject:

- exposing monorepo bootstrap commands as application prerequisites;
- using a fake provider in the only runnable application path;
- adding `dotenv` or a custom parser when the declared Node engine already
  provides the required loader;
- making tests require an API key or network access; or
- committing a populated `.env` file.

## Scenario 33: Flatten a linear task graph

Prompt:

```text
Govern agent actions contains a governance-policy overview whose implementation
steps appear as sub-sub-pages. Keep the routes, but make the topic easier to scan.
```

Expected behavior:

- confirms that the pages form one ordered governance implementation path, not
  separate capability families;
- keeps Govern agent actions as the owning topic and makes the overview, native
  policy, choices, rollout, approval, audit, external adapter, and tests direct
  siblings in that order;
- preserves every canonical route and source file because the reader jobs did
  not change;
- updates the approved information architecture and canonical manifest
  together; and
- verifies desktop/mobile indentation, breadcrumbs, previous/next order, and
  internal links from the manifest-derived navigation.

Near miss to reject:

- moving files or changing URLs only to make folder depth match navigation;
- retaining a nested wrapper because the source directory is nested;
- flattening a real adapter or provider family whose overview owns a distinct
  selection decision; or
- maintaining a second hard-coded sidebar tree.

## Scenario 34: Declarative agent and workflow registration

Prompt:

```text
Update Harness and Framework documentation after adding singular and plural
agent/workflow registration plus a direct Guardrails field.
```

Expected behavior:

- traces the exported builder types, runtime merge path, duplicate validation,
  Guardrails binding, PURISTA forwarding, type tests, and generated API before
  changing examples;
- teaches `.agent(id, definition)` and `.workflow(id, definition)` as the normal
  repeatable inline path with model-before-agent and agent-before-workflow order;
- explains `.agents(record)` and `.workflows(record)` as cohesive pre-typed
  batch registration, and states that all four methods accumulate while
  duplicate ids fail;
- shows schema-derived instruction/handler context and workflow `ctx.agents`
  inference without broad casts or extracted definition constants;
- binds configured Guardrails with `guardrails: rails` on a default-loop agent,
  removes redundant `builtinTools: false`, and states the custom-handler
  incompatibility; and
- proves the same provider-neutral definition is mounted without mutation while
  Core remains independent of the optional addon.

Near miss to reject:

- reintroducing `.agents(({ agent }) => ...)`, `.workflows(({ workflow }) => ...)`,
  `defineAgent(...)`, or a Guardrails decorator/attach helper;
- presenting plural registration as a replacement registry instead of an
  additive batch;
- defining a workflow before the agents it calls or using casts to hide lost
  inference;
- documenting Guardrails on a custom-handler agent; or
- linking to removed helper interfaces or generated API anchors.
