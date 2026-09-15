# Coverage and Traceability

## Contents

- [Purpose](#purpose)
- [Evidence sources](#evidence-sources)
- [Coverage matrix](#coverage-matrix)
- [Builder method coverage](#builder-method-coverage)
- [Runtime topology, builder API, and handler context coverage](#runtime-topology-builder-api-and-handler-context-coverage)
- [Definition of complete](#definition-of-complete)
- [API and configuration coverage](#api-and-configuration-coverage)
- [Drift handling](#drift-handling)
- [Audit procedure](#audit-procedure)

## Purpose

Completeness is a traceable relationship between implemented public behavior and user-facing guidance. Page count and prose volume are not useful proxies.

Maintain a coverage matrix for broad audits, releases, new packages, new adapters, or substantial capability changes. It may be a temporary review artifact unless the repository already has a canonical maintained inventory.

## Evidence sources

Use current, inspectable evidence:

- active framework specs and decisions for intended behavior;
- exported implementation and public package entry points;
- constructor/config types, schemas, defaults, validators, capability declarations, and errors;
- dependency classifications, dynamic loaders, feature flags, runtime bindings, and missing/incompatible dependency behavior;
- tests for edge cases and failure behavior;
- CLI generators and starter templates for the supported first path;
- maintained examples for runnable composition;
- freshly generated TypeDoc JSON for API inventory;
- current handbook sources and navigation data;
- external official provider documentation for compatibility and migration facts.

Treat old generated output, release articles, stale examples, and historical plans as leads, not authority.

## Coverage matrix

Use one row per public capability, primitive, package, adapter, configuration family, CLI command family, or operational behavior.

| Field | Meaning |
|---|---|
| Public surface | Exact feature, package, command, type, or behavior |
| Audience/job | Who needs it and what they must accomplish |
| Source evidence | Implementation, test, config schema, generated API item, or active decision |
| Canonical page | One explanatory or task-oriented public route |
| First success | Setup path and observable working result |
| Availability/enablement | Default state, additional package or service, wiring, and verification |
| Choices | Modes, adapters, guarantees, or decision guidance |
| Configuration | Defaults, validation, precedence, customization, and exact reference |
| Example/test | Focused maintained example or verified snippet source |
| Production | Security, reliability, observability, operations, and troubleshooting |
| Compatibility | Versions, migrations, deprecations, and external links |
| Status | documented, partial, missing, not public, deprecated, or superseded |
| Gap/owner | Concrete next action and owning area |

Do not mark a row documented merely because an API symbol appears in generated TypeDoc.

## Builder method coverage

For every public builder used to define a Framework primitive, make a second,
method-level ledger before restructuring its documentation. This is mandatory
when a builder generates multiple runtime surfaces, such as a command, stream,
queue, worker, or HTTP projection.

Include every reader-relevant configuration method or cohesive method family:

- schema/contract and definition registration;
- declared outbound capabilities and event/result behavior;
- transforms, guards, filtering, and authorization controls;
- runtime execution, concurrency, lease, retry, session, workspace, or
  durability policy;
- every HTTP, streaming, public/security, OpenAPI, or generated projection;
- schedules, delayed work, provider hints, and result/recovery behavior;
- deterministic mock/harness and real-adapter verification;
- deprecation or compatibility metadata.

For each row, record implementation and test evidence, canonical guide/section,
and status: `canonical guide`, `reference-only`, `not user-facing`, or a
concrete remediation item. Do not classify a method as covered merely because a
nearby hub names the primitive. A reader should be able to discover each
material choice from the guide that owns the outcome.

When a builder exposes several HTTP shapes, document them separately. Explain
which generated contract is exposed, default security, content/stream mode,
and disconnect, timeout, result, or queue behavior for each shape.

### Snippet and configuration contract

For every handbook snippet that calls a public builder/configuration method,
add a trace row or a scoped audit note with:

| Field | Required evidence |
| --- | --- |
| Snippet call | Exact public member and source-verified chain position |
| Type safety | Inline builder inference, a public semantic type with `satisfies` for a reusable object, or a justified boundary assertion |
| Reader explanation | Nearby purpose, parameters/options/defaults, runtime effect, and important failure/choice |
| Lookup link | Stable exact generated API member anchor |
| Canonical detail | Page/heading that owns exhaustive configuration when the snippet remains intentionally small |

Do not accept a code block because it compiles alone. It must teach the reader
why each call belongs in the chain and where to find every option. If the
recommended generated/application path cannot import a required public type
without relying on a transitive package, treat it as an implementation/API
surface gap before documenting the pattern.

Prove fluent type propagation separately from runtime availability. A handler
can receive a resource, schema-validated message, or client at runtime while
the public builder chain still exposes it as broad or absent at compile time.
Do not publish a casted, copy-looking example as though inference works. Record
the source/type/test evidence as an implementation gap, keep the public guide
accurate, and use a source-validated boundary check only when it is the actual
supported pattern.

## Runtime topology, builder API, and handler context coverage

For any feature spanning processes or runtime components, create a topology
row in addition to method rows. Record the transport owner, business-handler
owner, discovery/registration path, startup order, monolith/direct-definition
path, distributed/event-driven path, readiness condition, and what happens if a
participant starts too late. A topology diagram is required when these facts
cannot be understood from one short sentence.

For every documented builder method, record enough API evidence to let a reader
use it without reverse-engineering a signature:

| Field | Required evidence |
| --- | --- |
| Method and outcome | Exported signature and the point in the builder chain where it belongs |
| Parameters | Required/optional status, type/accepted values, defaults, and invalid combinations |
| Runtime effect | Definition metadata, generated projection, registration, and execution source/tests |
| Example | A source-verified, minimal real builder chain |
| Failure and choice | Validation/capability/error path plus a decision or trade-off |
| Lookup boundary | Exact API reference when exhaustive type detail would make the task guide unreadable |

For each handler form, record positional inputs and its context properties by
primitive. Trace every capability back to the declaration that creates it:
resources from the service builder; command, stream, queue, and agent clients
from `can*` declarations; emitters from `canEmit`; metrics from metric
declarations; and stores/telemetry from the runtime base context. Queue workers
also require their lease/job controls and cancellation signal. Explain message
immutability, trusted principal/tenant propagation, and `function` versus arrow
function binding where relevant.

Record the service-container boundary separately: what the service builder
declares, what `getInstance(...)` receives from the composition root, what the
service instance owns, and what the runtime projects onto each callback
context. Verify the exact access path for validated service configuration,
resources, stores, logger, metrics, tracing, bridges, and declared downstream
clients instead of grouping them under a vague “dependency injection” claim.

For each HTTP-exposed primitive, add a parameter mapping row for every path and
query field. Record route/query metadata, the exact parameter-schema key, raw
HTTP type, runtime parsing/coercion, required/optional state in both OpenAPI and
the schema, handler access, and collision precedence. Query metadata alone is
not runtime validation.

## Adapter contract inheritance

For every adapter, inspect the public constructor and every implementation it
inherits before writing a default or guarantee. Keep a short trace in the
coverage row:

| Claim family | Required evidence |
| --- | --- |
| Availability and install | Package manifest/export and application wiring |
| Constructor options/defaults | Adapter config type plus constructor/default factory |
| Operation guards | Shared base class and adapter override |
| Cache/lifecycle | Shared base behavior plus adapter `start`/`destroy` implementation |
| Delivery/retry/DLQ/streaming | Capability matrix plus implementation/tests |
| Idempotency and ordering | Adapter capability plus exact enqueue/lease implementation and tests |
| Failure/absence behavior | Startup, connection, validation, and capability-validation paths |

Never extrapolate one adapter's behavior to another in the same package family.
When a shared base default changes, search and re-verify all provider pages,
capability tables, examples, and migration guidance that inherit it.

## Definition of complete

A topic is complete across its page graph when a reader can find:

- what it is, why it exists, and who owns or executes it;
- architecture, lifecycle, and relevant data/message flow;
- process ownership, startup/readiness order, and direct versus event-driven
  registration mode when the feature supports more than one composition;
- installation or scaffolding from the supported tool path;
- what is available by default and how each optional capability is installed, wired, enabled, and verified;
- smallest working configuration and expected result;
- common usage with a realistic example;
- available modes, adapters, or alternatives with selection guidance;
- detailed options, defaults, validation, and customization;
- testing approach and deterministic local substitutes;
- security/privacy boundaries and least-privilege requirements;
- reliability guarantees, retries, timeouts, idempotency, or consistency where applicable;
- observability, health, recovery, and troubleshooting;
- API reference and maintained example links;
- compatibility, deprecation, and migration guidance when behavior changed.

These elements may live across a hub and focused child pages. Avoid forcing every item into one page.

## API and configuration coverage

Rebuild TypeDoc JSON before using the API inventory. For each public package:

1. Confirm the package is included in the generated API pipeline and has a
   useful module summary and practical entry link. If it is absent, repair the
   generation input before adding handbook API links; do not manufacture a
   route from source names.
2. Identify the public classes, functions, builders, types, errors, and config surfaces users directly call or implement.
3. Link high-use and non-obvious surfaces from a practical handbook page.
4. Ensure public TSDoc has a concise summary and an example for non-obvious APIs.
5. Keep generated signatures in API pages; keep decisions and workflows in the handbook.

For a repository-wide snippet review, run
`node scripts/handbook-snippet-coverage.mjs`. It tracks only source-verified
Framework primitive builder calls and complete `defineHarness(...)` chains,
then checks for the exact generated API lookup in the local reading context.
Use it to prioritize and measure a coverage pass. It is intentionally a
non-blocking inventory until a specific method family has no remaining rows;
it cannot determine whether the surrounding prose is sufficient on its own.

After generating current TypeDoc data, run `npm run audit:handbook`. Its
public-surface phase reads every declared public method of the curated
application-facing Framework and Harness owner types from TypeDoc and requires
an exact member link in that product's handbook. Run
`npm run audit:handbook:surface` when only the surface failures are needed.
When an owner becomes user-facing, add it to
`scripts/handbook-public-surface-audit.mjs`; exclude inherited, protected,
implementation-adapter, error, and generic logger methods unless the handbook
deliberately teaches users to call or implement them. The audit proves lookup
coverage, not the quality or completeness of the surrounding task guidance.

For configuration, derive the documented table from current types, schemas, default factories, validation, and tests. Verify:

- exact key name and nested path;
- type and accepted values;
- default and the condition under which it applies;
- required state and validation error;
- precedence/resolution order;
- restart or live-update behavior;
- ownership and side effects;
- secret/sensitive handling;
- link to the exact API type.

If a public option has no user-facing reason to be set directly, keep it in API reference and explain the higher-level helper instead.

## Drift handling

- Intended behavior differs from implementation: do not paper over it in docs. Resolve the framework decision or implementation first.
- Handbook differs from implementation: update the canonical page and every dependent snippet/link in the same change.
- Two handbook pages disagree: select one canonical explanation, merge unique value, and redirect or narrow the other.
- Generated API differs from source: rebuild from current TypeDoc input before reviewing.
- Starter or CLI output differs from quickstart: align the supported generated path before publishing the tutorial.
- Provider compatibility is uncertain: verify official current documentation and state the verified range; do not infer it.
- A capability is intentionally internal: mark it not public in the matrix and keep it out of the handbook navigation.

## Audit procedure

1. Inventory public packages, exports, dependency classifications, and runtime loaders.
2. Inventory builders/primitives, handler contexts, adapters, stores, transports, CLI commands, config schemas, errors, feature flags, runtime bindings, and capabilities.
3. Inventory handbook routes, navigation entries, API modules, focused examples, and operations/security pages.
4. Join the inventories into the coverage matrix.
5. Test the main audience journeys and search-entry independence.
6. Rank gaps by user impact:
   - blocks first success;
   - risks incorrect/security-sensitive production use;
   - blocks adapter or architecture decisions;
   - omits common configuration or troubleshooting;
   - weakens reference or rare advanced usage.
7. Propose focused page changes, not a blanket rewrite.
8. Re-run the matrix and verification after implementation.

Report evidence and uncertainty. Do not convert an unverified gap into invented documentation.
