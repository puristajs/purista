---
name: purista-docs-maintainer
description: Maintains PURISTA website, handbook, API docs, navigation, and coverage. Use when changing documentation structure, learning paths, examples, feature coverage, or drift; not for runtime implementation.
---

# PURISTA Docs Maintainer

## Purpose

Create a public website that helps technical decision-makers evaluate PURISTA
and a handbook that helps developers reach a working result, choose the right
option, configure it exactly, and operate it safely.

Use a coherent reading flow without announcing the narrative technique. Keep
every page useful on its own and give it an obvious entry and next step.

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
   evidence, and next decision.
3. Inventory current routes/content and build the relevant coverage ledgers
   before changing API-shaped or structural material.
4. For a restructure, record each useful legacy content unit and target before
   merging, reducing, or redirecting its route.
5. For executable topics, verify the runtime lifecycle and failure branches,
   then map child pages to reader outcomes in implementation order.
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
result, and failure branches. Child order follows first result → normal
output/event → advanced composition → resources/stores/context → exposure →
failure/recovery → testing, omitting unsupported stages. Use reader-facing
titles; do not hide enqueue, event emission, stream consumption, success
events, or exposure under an unrelated method family.

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

### Topology and adapters

For multi-runtime features, explain process ownership, registration/discovery,
startup/readiness order, late/missing participant behavior, and direct/monolith
versus distributed/event-driven modes before method details.

For every adapter/provider, trace its constructor, shared base classes,
defaults, capability matrix, operation guards, lifecycle, and tests. Do not
copy one adapter's guarantees to another. Separate transport/enqueue guarantees
from exactly-once business execution.

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

For every executable primitive, state the exact test boundary of each helper.
A direct builder wrapper may validate input and run only selected hooks; it does
not automatically prove transforms, later hooks, result/event construction,
delivery control conversion, registration, or adapter behavior. Require a
three-column boundary table—direct logic, deterministic service runtime, and
selected real adapter—unless source evidence proves a smaller set is complete.
Name which lifecycle stages each level does and does not exercise.

## Hard Rules

- One canonical explanation per reader job; link instead of copying.
- One page must stand alone with minimal context, prerequisites, action,
  evidence, important risk, and next step.
- Nest when it improves findability; never add empty wrapper levels.
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
- For autonomous work, require exact write/evidence scopes, dependencies,
  retention/public-surface IDs, exclusions, halt conditions, acceptance, and
  verification. One integrator owns manifest/routes/shared navigation.
- Use real-world examples with safe synthetic data and explicit outcomes.
- Write handbook prose as product and framework documentation. Do not expose
  authoring reasoning, review/debug notes, prompt feedback, or editorial
  directions such as “keep this inline.” State the runtime behavior,
  ownership, contract, constraint, and resulting implementation step instead.
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
- Every documented fluent builder/configuration call must have a nearby
  source-verified explanation of its intent, reader-relevant parameters,
  defaults/options, runtime effect, and important invalid/failure interaction;
  use a compact table when several calls are introduced together. Link its
  practical owner to a stable, exact generated API member anchor. A later page
  may own exhaustive detail, but the first snippet must say what it declares
  and link there explicitly.
- Keep automated snippet checks narrow and evidence-backed. The handbook audit
  verifies the high-risk attached-agent chain (`getAgentQueueBuilder`, schemas,
  model/execution selection, response mode, and HTTP projection) has the exact
  generated API member link in the same Markdown section as its TypeScript
  example. Extend that list only for a similarly unambiguous public builder
  family; do not turn generic dot calls into a noisy heuristic.
- For a handbook coverage pass, run
  `node scripts/handbook-snippet-coverage.mjs` before and after the work. It
  inventories source-verified Framework primitive builders and complete
  `defineHarness(...)` chains, reporting the exact API lookup nearest each
  snippet. Treat a missing row as a review task—not proof that prose is absent
  and not an excuse to add a vague package link. Record the before/after count,
  fix high-impact clusters first, and promote only a fully clean, unambiguous
  method family into the blocking handbook audit.
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
- Treat authorization, tenant isolation, data minimization, reliability,
  observability, and operations as normal production guidance.
- Do not hand-edit generated API/site output or leak internal specs/plans/agent
  workflows into public pages.

## Repository Routing

- `web/src/pages/` — website/routes
- `web/src/content/handbook/` — canonical and legacy detailed content
- `web/src/content/handbook-cards/` — legacy/current cards; evidence, not IA
- `web/src/data/handbook*` — canonical runtime structure/manifest
- `web/src/content.config.ts` — public content schemas
- `web/src/lib/api-docs.ts`, `web/src/generated/purista-api.json` — generated API presentation/evidence
- `packages/*/src`, package tests/READMEs — public implementation evidence
- `examples/`, `packages/cli`, `starter`, `create-purista` — executable/generated paths

## Stop Conditions

Stop and record a concrete blocker when specs, implementation, tests, API data,
or examples disagree; a public surface/default cannot be verified; a page
fails usefulness; route retention is incomplete; a snippet cannot be proven;
or another ticket owns the required file/canonical answer. Do not invent,
broaden scope, publish a placeholder, or edit another owner's shared files.

## Completion

A change is complete only when the audience can find and complete its outcome;
the first result and feature enablement are explicit; methods/context/adapters
have exact canonical ownership; both reader journeys pass; snippets and claims
match implementation/API evidence; links and rendered pages pass; old routes
have retained content and valid redirects; no duplicate/empty canonical page
remains; and structural plus skill/knowledge audits pass.
