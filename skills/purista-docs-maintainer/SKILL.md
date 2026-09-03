---
name: purista-docs-maintainer
description: Maintains PURISTA website, handbook, API docs, navigation, and coverage. Use for documentation structure, feature coverage, and drift; use purista-tutorial-maintainer for worked tutorial series and purista for runtime implementation.
---

# PURISTA Docs Maintainer

## Purpose

Create a public website that helps technical decision-makers evaluate PURISTA
and a handbook that helps developers reach a working result, choose the right
option, configure it exactly, and operate it safely.

Use a coherent reading flow without announcing the narrative technique. Keep
every page useful on its own and give it an obvious entry and next step. For the Tutorials section and runnable learning examples, use the adjacent `purista-tutorial-maintainer` workflow, which reuses these presentation conventions.

## Audience

- Main website pages serve CTOs, development leads, architects, and technical
  evaluators. Lead with enterprise problems, architecture, trade-offs,
  operational effects, and evidence.
- The handbook serves developers who may know neither PURISTA nor the
  underlying pattern. Lead from outcome and mental model to a small verified
  result, then choices, configuration, testing, operations, and reference.
- Generated API documentation serves exact lookup. It complements practical
  explanations; it does not replace them.

## Required References

Load only the references required by the task, but read each selected file
completely.

| Task | Required reference |
| --- | --- |
| Navigation, chapter boundaries, routes, or learning paths | `references/information-architecture.md` and `references/structure-governance.md` |
| Completeness, packages, builders, context, projections, topology, config, or adapters | `references/coverage-and-traceability.md` |
| Primitive/capability restructure, concept rehoming, or autonomous plan | `references/topic-lifecycle-and-task-flow.md` |
| New or substantially changed page | `references/page-patterns.md` |
| Prose, snippets, tables, diagrams, examples, or editing | `references/writing-and-presentation.md` |
| Anything not installed, wired, enabled, or production-ready by default | `references/optional-dependencies-and-feature-enablement.md` |
| Primary website/landing-page work | `references/website-pages.md` |
| Handoff of an audit or change | `references/verification.md` |
| Material change to this skill/workflow | `references/evaluation-scenarios.md` |

Before website work, also read `web/AGENTS.md` and `web/DESIGN.md`. For
handbook structure, locate the latest approved, non-superseded handbook specs
and plans; do not infer the desired tree from current folders or rendered
navigation.

## Evidence Order

Verify claims in this order:

1. active specs and decisions, including the handbook IA for structural work;
2. current implementation, exported types, defaults, validation, tests, and
   error behavior;
3. manifests, loaders, capability checks, CLI/starter output, maintained
   examples, and runtime composition;
4. current handbook, navigation, and freshly generated TypeDoc evidence; and
5. official external provider documentation for compatibility and migration.

If intended behavior and implementation disagree, stop or record the drift.
Do not hide it with user-facing prose. Public pages remain self-contained and
never require internal specs, plans, or skills.

## Workflow

1. Classify the request: audit, website page, concept, tutorial, task guide,
   capability hub, adapter, operations, migration, or reference.
2. State the audience, exact question, outcome, prerequisites, observable
   evidence, and next decision. For an executable primitive, also state its
   semantic contract: who initiates it, who is selected, who waits, what normal
   result exists, and what it does or does not know about callers/consumers.
3. Inventory current routes/content and build the relevant coverage ledgers
   before changing API-shaped or structural material.
4. For a restructure, record each useful legacy content unit and target before
   merging, reducing, or redirecting its route.
   For tutorial drift, also apply the tutorial maintainer's architecture-and-learning review.
5. For executable topics, verify the runtime lifecycle and every stage's
   failure classification/serialization, then map child pages to reader
   outcomes in implementation order.
6. Give each page one useful job. Use a provider-neutral hub plus focused
   adapter pages when implementations differ materially.
7. Write the smallest safe path and expected result first. Add choices,
   detailed options, customization, testing, security, operations,
   troubleshooting, compatibility, and references where the task needs them.
8. Role-play both a newcomer reaching the first result and an existing user
   locating an exact method/default/context/failure from the hub within two
   navigation decisions.
9. Verify source claims, snippets, generated API, navigation, links, Mermaid,
   responsive rendering, and drift in proportion to the change.

## Gates

### Usefulness

Create a public page or chapter only when it owns a distinct reader question or
outcome, has enough verified material for orientation/action/choice/next step,
and is more than a link list, duplicate, placeholder, or taxonomy shell. Merge
a thin task into its nearest owner. Preserve unique content and public routes.

### Retention

Before replacing a route, inventory its setup, configuration, lifecycle,
failure/recovery, security, tests, compatibility, examples, and decisions.
Give each unit one evidence-backed disposition: re-homed target, retained hub,
reference-only, obsolete with reason, or blocked. A passing route/link audit
does not prove content retention.

### Lifecycle and findability

Every substantial executable hub shows the source-verified lifecycle, normal
result, and failure branches. Before the diagram, define the primitive through
its initiator, selected recipient, waiting/completion behavior, returned or
published result, and coupling. Child order follows first result → required
synchronous dependencies → normal output/event → additional event/durable/
stream composition → transforms/guards → resources/stores/context → exposure →
advanced failure/recovery → testing, omitting unsupported stages. Put default
error behavior beside the first implementation even when a later page owns
advanced recovery. Use reader-facing titles; do not hide invocation, enqueue,
event emission, stream consumption, success events, or exposure under an
unrelated method family or duplicate wrapper hub.

For every lifecycle stage, record the values it receives, purpose, ordering,
side-effect boundary, failure class, caller-visible serialization, later stages
that are skipped, and internal observability. Input/output validation are not
assumed symmetric: verify whether caller-owned invalid input exposes actionable
issues and whether invalid application output becomes a safe internal error.
Do not infer execution order from a fluent builder chain. Trace the assembled
definition and runtime dispatcher. When transforms exist, distinguish received-
representation schemas from domain schemas: raw validation → input transform →
domain input validation → before guards → handler → domain output validation →
after guards → output transform → transformed-output validation. Omit only the
optional stages the implementation actually skips.

Keep one dominant question per lifecycle diagram. When a complete lifecycle
becomes dense at the handbook's default or mobile width, split it into two or
three parts at real semantic boundaries—typically input preparation, business
execution, and output/result—and keep one
numbered order table as the exact source of sequence truth. Branches in the
diagrams and rows in the table must use the same stage names. Do not compress
several ordered callbacks into one opaque “boundary” node merely to retain a
single picture.

### Public surface coverage

For each reader-relevant method or cohesive overload family, record exact
signature/options/defaults, lifecycle stage, runtime/context effect,
interactions, failures, source/tests, and one canonical guide heading,
reference-only reason, or not-user-facing reason. “Mentioned” is not covered.
Link practical builder/configuration guidance to the exact generated API symbol.

Treat callback inputs and handler context as public APIs. Explain primitive-
specific positional arguments, immutable message/trusted identity, resources,
stores, typed clients, emitters, telemetry, cancellation/job controls, and the
builder declarations that make them available. Verify callback receiver
binding for lifecycle helpers.

Present the service as the logical dependency and runtime boundary for its
commands, subscriptions, streams, workers, and mounted Harness targets. Distinguish
service-builder declarations from composition-root implementations and from
the context projection used during execution. State exactly where each value
appears: resources and runtime facilities on typed context members, validated
service configuration on the bound service instance, and declared outbound
clients only after the owning primitive's `can*` call. Do not describe the
context as a global service locator or imply that a declaration constructs an
adapter.

For HTTP projections, trace every path and query value from route/query
metadata into the command or stream parameter schema and handler argument.
Document the route syntax, exact matching schema key, raw HTTP representation,
required/optional agreement between OpenAPI metadata and the runtime schema,
and collision/merge behavior when it affects correctness. Never imply that
query metadata validates a value or that an undeclared path key is created in
the typed parameter contract.

Assign shared and primitive-local ownership before writing context, resource,
store, or error guidance. The service-resource task owns declaration,
composition-root injection, lifecycle ownership, and fakes. The store task
owns store selection, wiring, shared operations, and adapter links. The shared
handler-context page owns common positional/context concepts. The shared error
page owns classification and disclosure rules. A primitive page keeps only its
exact callback shape, additional controls/clients, lifecycle mapping, recovery,
and a link to those shared owners. Remove repeated builder tours and examples
that teach no primitive-specific delta.

Treat public contract metadata as part of documentation coverage. Verify the
actual Standard Schema → JSON Schema → OpenAPI/definition pipeline before
recommending a library-specific API. For the supported Zod path, require useful
business descriptions on public object and field schemas when they feed
generated contracts; add examples only when the converter preserves them and
the values are small, schema-valid, synthetic, and safe to publish. Do not
repeat validation syntax in descriptions or put secrets, PII, tenant IDs, or
production identifiers in examples.

When one handler consumes another contract, prefer a consumer-local schema that
contains only the fields needed for the decision. Verify whether the chosen
schema implementation strips or rejects unknown fields before claiming data
minimization; do not generalize one library's behavior to every Standard Schema
implementation.

### Topology and adapters

For multi-runtime features, explain process ownership, registration/discovery,
startup/readiness order, late/missing participant behavior, and direct/monolith
versus distributed/event-driven modes before method details.

For every adapter/provider, trace its constructor, shared base classes,
defaults, capability matrix, operation guards, lifecycle, and tests. Do not
copy one adapter's guarantees to another. Separate transport/enqueue guarantees
from exactly-once business execution.

An EventBridge chapter must define the transport boundary before listing
providers: construction and ownership, bridge-before-service startup,
registration, readiness, health, invocation/event/stream flow, capability
rejection, drain, and shutdown. Its selection table must compare included or
optional availability, process topology, durability/acknowledgement/recovery,
stream support, and operational dependency. Each adapter page then owns exact
installation, provisioning, constructor/defaults, supported and unsupported
capabilities, startup, failure/reconnect behavior, production security,
verification, and migration impact. A custom-adapter page must map every public
interface family and every capability set to `true` to a real implementation
and provider test.

### Security, governance, Guardrails, and sandboxing

Do not collapse these controls into one “security” checklist. Keep their
owners and runtime order explicit:

1. the application authenticates the caller and authorizes the business
   action;
2. agent tool selection and built-in permissions constrain available actions;
3. governance exposure and execution policies decide typed allow, deny, audit,
   or durable tool-approval interruption outcomes;
4. content Guardrails inspect or transform exact input, output, tool, or
   retrieval phases; and
5. the selected sandbox/MCP/platform adapter enforces files, processes,
   credentials, network, and isolation guarantees it actually implements.

Reflect these owners in the hierarchy and follow `references/page-patterns.md`.
A governance task is incomplete without policy registration order, typed
context/input, rule selectors and effects, defaults and precedence, shadow
versus enforce behavior, approval interrupt/resume and audit callbacks,
timeout/cancellation, fail-closed behavior, content-safe evidence, and
deterministic tests proving the handler did not run. Distinguish a durable tool
approval interruption from a workflow external wait. Teach governance
progressively from one complete native deny-rule
tutorial through effects, rollout, approval, audit, external evaluators, and
tests. Verify shipped adapters and use the custom-evaluator requirements in
`references/page-patterns.md`; never call a typed registration helper a vendor adapter.

A Guardrails task is incomplete without optional-package enablement, phase and
flow order, exact protected value/selector, transform limits, binding point,
failure behavior, telemetry/evidence, and deterministic enforcement tests.
For a model-backed rail, register its model alias before the protected agent,
declare the exact capability, keep deterministic checks first, inject the
provider/model at composition, and send live false-accept/false-reject quality
measurement to evaluations. Never present a guardrail model as deterministic
or as business authorization.

Framework AI pages explain where these Harness controls attach to a versioned
service: provider-neutral model requirements on the builder, content rails on
the inline agent definition, governance/approval/audit and concrete providers
on `getInstance(..., { ai })`, service/command authorization around the
business effect, and sandbox adapter/owner authorization at composition. Link
to the Harness owner for full control semantics instead of copying it.

Verify capability defaults from the runtime resolver. Omit redundant opt-out
fields when omission is the secure default; show only the minimal explicit
allowlist that changes behavior. Skills never grant tools: document required
activation tools, earliest failure, and whether author metadata is enforced.
Treat every skill file as reviewed supply-chain input. Distinguish inert
mounting from separately enabled execution, and cover source trust, business
authorization, credentials/egress, sandbox isolation, and change re-review.

### Deployment, migrations, recipes, and test ownership

Deployment is a first-class task graph, not a security/operations footnote.
Separate compile/bundle output, runtime entry points and assets, process
startup/shutdown, health/readiness, configuration/secrets, and observability.
Document monolith direct definition registration separately from independent
gateway/services that discover definitions over EventBridge. For distributed
topologies, show startup-order consequences, late/missing registration,
workers/schedulers, and graceful drain. Do not call `tsc` a bundler or imply a
container image creates brokers, sidecars, stores, or credentials.

For a major-version migration, compare the latest actually published source
version with the intended release target. Build a source-backed change ledger;
exclude intermediate APIs that were never published. Every developer-relevant
change owns: affected usage, old and new contract, why it changed, exact code/
config/data steps, failure/compatibility boundary, verification after the
step, and rollback. Separate reusable migration process, contract evolution,
adapter/topology migration, and one exact version-to-version guide. Do not
publish an incomplete target as historical fact; mark unresolved release
contracts as blocked.

Keep a patterns/recipes chapter only for genuine cross-capability outcomes
whose complete implementation spans several canonical chapters. A recipe must
add a concrete end-to-end decision and implementation path; deployment shapes,
primitive tutorials, and pointer-only pages belong to their focused owners.

Primitive pages own their implementation tests. A cross-cutting test chapter
owns only service composition, cross-message flows, selected real adapters,
deployment topology, and release evidence. Its hub must route back to the
primitive owner instead of repeating helper signatures, full builder examples,
or error branches.

### Availability

At first use, distinguish included/enabled, included/opt-in, separate
first-party package, peer or package-manager optional dependency,
development-only tool, external runtime/service, and custom implementation.
Document install, provision, wire, configure, enable, verify,
missing/incompatible behavior, and production boundary. Installation alone is
not enablement.

### Stores and AI testing

Keep state, configuration, and secret stores visible as essential Framework
building blocks. Compare data ownership before providers; show composition-root
wiring and primitive-local context use.

Deterministic Framework/Harness adapters test implementation and flow. They do
not prove nondeterministic model correctness. Put live-model behavior, prompt
quality, and agent correctness measurements in evaluations and link the two
boundaries explicitly.

For Harness test documentation, keep four reader jobs distinct:

1. the implementation page shows the smallest successful deterministic test
   for that agent, tool, workflow, or state capability;
2. the cross-cutting deterministic-test chapter owns scripted model rounds,
   capability failures, cancellation, replay, and test-fixture hygiene;
3. adapter pages link to the matching shared contract and name the
   provider-specific isolation, recovery, topology, and cleanup tests the
   generic contract cannot prove; and
4. evaluation pages own reviewed datasets, candidate execution, scorer
   calibration, release policy, repeated trials, accounting, and CI.

When the testing API supports strict fixtures, use the mode that rejects
unqueued or mismatched interactions and show how to detect unused fixtures.
If it does not, record and fix that product gap rather than describing a silent
fallback as reliable test behavior. Never use a fake model response to claim
agent correctness, and never use a passing generic adapter contract to claim
container, VM, network, tenant, or durability guarantees.

An evaluation path is incomplete unless the reader can define or load a
versioned dataset, run a named candidate/task, select and calibrate scorers,
inspect per-case status and coverage before aggregates, encode a release
decision, and execute the same bounded gate in CI. Include real code for the
dataset, runner or maintained-example handoff, policy assertion, command, and
CI job when that is the page's reader job. State credential, budget, timeout,
concurrency, sensitive-observation, artifact, retry-versus-trial, and holdout
ownership explicitly.

For every executable primitive, state the exact test boundary of each helper.
A direct builder wrapper may validate input and run only selected hooks; it does
not automatically prove transforms, later hooks, result/event construction,
delivery control conversion, registration, or adapter behavior. Require a
three-column boundary table—direct logic, deterministic service runtime, and
selected real adapter—unless source evidence proves a smaller set is complete.
Name which lifecycle stages each level does and does not exercise.

When a builder exposes direct transform or guard accessors, document how to
test them with the matching typed context mock, service receiver binding,
positional values for that lifecycle stage, and explicit validation of returned
values. State which surrounding schemas, sibling hooks, response construction,
and delivery stages the direct call skips; use the deterministic service
runtime test for the complete order.

## Hard Rules

- One canonical explanation per reader job; link instead of copying.
- Shared pages own common setup and semantics; primitive pages own only the
  executable delta. Keep a concise local consequence and direct link rather
  than copying the canonical example or options table.
- Keep the chapter's executable learning path ahead of cross-cutting lookup
  pages. A shared context, error, or reference page must not interrupt the
  service-to-first-result sequence merely because several later pages link to
  it. Place it after the executable sibling hubs or in the chapter that owns
  the task, then link to it at the point of use.
- One page must stand alone with context, prerequisites, action, evidence, risk, and next step.
- Keep linear task paths as siblings even when routes are deeper; nest only a distinct browsable capability family, and never add empty wrappers.
- Keep Framework and Harness as independent navigation/previous-next graphs.
- Derive landing, sidebar, breadcrumbs, search, canonical routes, redirects,
  and previous/next from one manifest.
- Treat a topic as a top-level sidebar chapter only when its declared parent is
  the product root. Keep product-root chapter names visible, then expand only
  the active chapter and its active descendants. This preserves a clear path
  without rendering every child topic as a long, unfocused list. A nested
  chapter may retain its chapter-level content and audit role, but must render
  beneath its declared parent—not as a duplicate root entry. On narrow screens,
  provide an explicit handbook disclosure/menu with the same progressive
  active-branch behavior; do not leave only a generic link back to the landing
  page. Verify the desktop and narrow/mobile tree after every structural
  change.
- Keep concept chapters on durable mental models. Land task destinations before
  rehoming exact procedures or reducing concept pages.
- Put primitive tests beside implementation; cross-cutting test chapters own
  strategy, integration, and end-to-end boundaries.
- Keep sandbox capability selection, built-in adapter configuration, shared
  lifecycle, and production enforcement requirements in the sandbox chapter.
  Keep HTTP/stdio transport fields, authentication, protocol behavior, and MCP
  failures in the MCP chapter. Adapter-specific install, provisioning,
  compatibility, cleanup, and verification remain on the adapter page. Link
  these owners; do not teach the same MCP setup in the sandbox chapter.
- For autonomous work, require exact write/evidence scopes, dependencies,
  retention/public-surface IDs, exclusions, halt conditions, acceptance, and
  verification. One integrator owns manifest/routes/shared navigation.
- Use real-world examples with safe synthetic data and explicit outcomes.
- Carry one small real-world scenario through a capability page graph where it
  remains natural. Each child shows only its new delta and keeps names, schemas,
  identifiers, expected results, and failure semantics consistent. Change the
  scenario when another problem genuinely fits better; do not contort one
  example for superficial uniformity.
- Document the released final state. Keep development chronology, rejected
  designs, authoring/review notes, correction narratives, prompt feedback, and
  editorial directions out of public pages. State the runtime contract and
  usage. Migration pages compare released APIs without design chronology.
- Keep snippets focused and source-verified. Use the correct fenced language
  and a real path or precise action/result title—never `snippet.ts`,
  `example.sh`, or invented filenames.
- Keep configuration inline when the fluent builder owns its dynamic schema and
  type propagation. For a genuinely reusable named definition/configuration
  object, prefer `as const satisfies PublicType` over a broad assertion so
  unsupported options fail at author time. A direct import must be a declared
  application dependency; never recommend a transitive import. If a standard
  generated path truly needs a dependent type, expose a deliberately named
  alias from the owning public package instead of reaching into an
  implementation package.
- For standalone Harness definitions, use repeatable
  `.agent(id, definition)` and `.workflow(id, definition)` as the normal inline
  path. Use `.agents(record)` and `.workflows(record)` only for cohesive
  pre-typed batches, and explain that singular/plural calls accumulate while
  duplicate ids fail. Never reintroduce callback identity wrappers or
  standalone definition helpers. Register models before agents and agents
  before workflows so schema-derived callback and `ctx.agents` types cascade.
- Bind optional Harness Guardrails through the default-loop agent definition's
  direct `guardrails` field. Do not document decorator or attach helpers.
  State that custom-handler agents reject Guardrails, interceptors, and other
  default-loop controls, and verify that a PURISTA service mount preserves the
  same provider-neutral definition without a Core dependency on the addon.
- Every documented fluent builder/configuration call must have a nearby
  source-verified explanation of its intent, reader-relevant parameters,
  defaults/options, runtime effect, and important invalid/failure interaction;
  use a compact table when several calls are introduced together. Link its
  practical owner to a stable, exact generated API member anchor. A later page
  may own exhaustive detail, but the first snippet must say what it declares
  and link there explicitly.
- Keep automated snippet checks narrow and evidence-backed. The handbook audit
  verifies high-risk Framework builder chains against generated API members.
  For AI integration, separately verify native Harness definition, synchronous
  `mountHarness(...)`, address-first invocation, and explicit HTTP projection;
  do not turn generic dot calls into a noisy heuristic.
- For a coverage pass, run `node scripts/handbook-snippet-coverage.mjs` before
  and after changes, then `npm run audit:handbook` against rebuilt TypeDoc.
  The first inventories local snippet lookups; the second blocks missing
  curated public-surface lookups. Neither proves prose quality. Follow
  `references/coverage-and-traceability.md` for interpretation and repair.
- Before adding an exact API link for a first-party package, confirm that the
  generated API pipeline actually includes that package and exposes the target
  symbol. Extend the pipeline and regenerate its evidence when it does not;
  never publish an exact-looking path that the site cannot generate. A package
  root link is not a substitute for a missing member lookup.
- A method is discoverable only when its likely reader task is visible in the
  owning hub or a clearly named child page. Do not count a method as covered
  because it is buried under an unrelated broad title. For every substantial
  primitive, test a newcomer path to the first result and an experienced-user
  lookup path from the hub to each material method family in two navigation
  decisions or fewer.
- Never expose secrets, credentials, PII, prompts/completions, raw payloads,
  headers, attachments, or tenant/user identifiers in examples or telemetry.
- Treat caller-visible application errors as an explicit disclosure boundary.
  Document exactly which status/message/data becomes public and keep provider,
  database, stack, credential, PII, and invalid-output details internal. Never
  recommend catching an unexpected dependency failure merely to expose its
  message as a handled business error. Apply the error, streaming, cancellation,
  and cleanup boundaries in `references/topic-lifecycle-and-task-flow.md`.
- Treat authorization, tenant isolation, data minimization, reliability,
  observability, and operations as normal production guidance.
- Do not hand-edit generated API/site output or leak internal specs/plans/agent
  workflows into public pages.

## Stop Conditions

Stop and record a concrete blocker when specs, implementation, tests, API data, or examples disagree; a public surface/default cannot be verified; a page
fails usefulness; route retention is incomplete; a snippet cannot be proven;
or another ticket owns the required file/canonical answer. Do not invent,
broaden scope, publish a placeholder, or edit another owner's shared files.

## Completion

A change is complete only when the audience can find and complete its outcome;
the first result and feature enablement are explicit; methods/context/adapters have exact canonical ownership; both reader journeys pass; snippets and claims match implementation/API evidence; links and rendered pages pass; old routes
have retained content and valid redirects; no duplicate/empty canonical page
remains; and structural plus skill/knowledge audits pass.
