# Topic Lifecycle and Task Flow

## Contents

- [Purpose](#purpose)
- [Start from the runtime lifecycle](#start-from-the-runtime-lifecycle)
- [Turn the lifecycle into reader tasks](#turn-the-lifecycle-into-reader-tasks)
- [Primitive topic pattern](#primitive-topic-pattern)
- [Place methods and context capabilities](#place-methods-and-context-capabilities)
- [Keep concept chapters durable](#keep-concept-chapters-durable)
- [Test both reader journeys](#test-both-reader-journeys)
- [Plan autonomous documentation work](#plan-autonomous-documentation-work)
- [Completion gate](#completion-gate)

## Purpose

Broad feature coverage can still produce poor documentation when methods are
grouped by implementation family, detailed behavior is hidden under an
unrelated title, or a hub lists pages without explaining execution order.

For executable Framework and Harness capabilities, derive the page graph from
the verified runtime lifecycle and the reader's sequence of tasks. Do not copy
the source-file layout or split every builder method into a page.

## Start from the runtime lifecycle

Before outlining a primitive or executable capability:

1. Trace its definition/build order from current public implementation.
2. Trace runtime execution from receipt/creation through validation,
   transforms, guards, handler/model/tool execution, output, result/event,
   acknowledgement, projection, retry, cancellation, and cleanup as applicable.
3. Trace every exit path: validation error, expected rejection, unexpected
   failure, transport failure, disconnect, retry, dead letter, cancellation,
   shutdown, and partial result.
4. Trace process ownership, registration/discovery, startup/readiness, and
   monolith/distributed differences.
5. Confirm order and branching with focused tests. Source order without runtime
   tests is insufficient when callbacks or generated definitions intervene.

Create a small lifecycle diagram on the hub when the flow has at least three
meaningful stages or a branch that changes the result. Label lifecycle edges
and failure exits. A planning diagram must be corrected when implementation or
tests disagree.

## Turn the lifecycle into reader tasks

Convert lifecycle stages into pages by reader outcome:

- define and obtain a first result;
- validate or transform input;
- implement the handler/callback;
- publish or consume a success/result event;
- invoke, enqueue, stream, emit, or call another capability;
- use resources, stores, identity, telemetry, and runtime controls;
- expose through a supported transport;
- handle primitive-specific failure/recovery; and
- test deterministically and at the real-adapter boundary.

A page title must name the outcome a reader searches for. Do not hide
`canEnqueue` and `canEmit` under “Call another service,” combine success events
with an unrelated error task, or put stream HTTP exposure only in a termination
page.

Apply the usefulness and split gates:

- split when a task has a distinct question, sufficient source-backed setup,
  configuration, result, failure boundary, and next step;
- keep closely related lifecycle stages on one page when readers would need to
  bounce between short fragments to complete one task; and
- omit an unsupported stage instead of adding a placeholder for symmetry.

## Primitive topic pattern

A substantial primitive chapter normally follows this sequence:

```text
Overview and verified lifecycle
├── Create and verify the smallest definition
├── Validate, transform, guard, and implement
├── Produce the normal result/event/completion
├── Compose with other capabilities by reader outcome
├── Use primitive-specific resources, stores, context, and controls
├── Expose or consume through supported transports
├── Handle failure, recovery, cancellation, or delivery
└── Test the primitive
```

The hub owns:

- fit and nearest alternatives;
- component/process ownership;
- the complete verified lifecycle;
- a smallest useful path and expected evidence;
- the ordered child-task map;
- default versus opt-in runtime/adapter behavior; and
- the critical security, reliability, or transaction boundary.

Do not turn the hub into the longest tutorial while child pages remain thin.
Move task implementation to focused pages and keep enough code on the hub to
make the first path concrete.

## Place methods and context capabilities

Maintain a per-method or cohesive-overload ledger. Each row records:

- exact symbol and signature;
- lifecycle stage and reader task;
- parameters, accepted values, defaults, and interactions;
- runtime or generated-definition effect;
- context property/control unlocked by the declaration;
- validation, startup, or runtime failure behavior;
- source and focused test evidence; and
- exact canonical page and heading, reference-only reason, or
  not-user-facing reason.

“Mentioned” is not a coverage state. The page title or an obvious parent task
map must make the capability discoverable using the reader's likely words. A
guide/reference row also requires a direct link to the exact generated API
symbol when that route exists.

The task page that achieves the method's outcome owns its practical
explanation. The generated API page owns exhaustive signatures. A shared
handler-context page may explain immutable messages, trusted principal/tenant
propagation, common stores, resources, logging, metrics, and declaration-based
typing, but every primitive page must list its exact positional inputs,
additional context clients/controls, and enabling declarations.

## Keep concept chapters durable

Concept chapters own stable mental models, boundaries, invariants, and decision
criteria. They must not compete with task pages for:

- exact builder order and method tables;
- callback signatures and context members;
- adapter installation and configuration;
- transport projection options;
- retry, acknowledgement, lease, or cancellation controls;
- logging/OpenTelemetry setup; or
- deterministic test implementation.

During a restructure, rehome detailed material only after its task page exists
and the content-unit retention row points to the exact new heading. Keep a
short consequence and canonical link in the concept page.

## Test both reader journeys

### Learning journey

Role-play a developer unfamiliar with the product. Starting at the hub, verify
that the reader can:

1. decide that the capability fits;
2. identify prerequisites and availability;
3. create, run, and verify the first result;
4. add one advanced capability without hidden setup;
5. understand the important failure/security boundary; and
6. reach exposure, testing, operations, or an alternative in logical order.

### Lookup journey

Role-play an existing user who knows the capability exists. From the hub or a
search result, verify that the reader can locate within two navigation
decisions:

- an exact method and parameter/default table;
- the declaration that unlocks a context member;
- optional installation, wiring, and absence behavior;
- lifecycle/startup or supported topology;
- primitive-specific failure/recovery behavior; and
- deterministic, real-adapter, or live-evaluation boundaries.

Record the route taken and any misleading page title or duplicate answer. Do
not accept a journey merely because site search returns some page containing
the symbol.

For test helpers, require the same lookup quality: explain constructor/function
parameters, defaults, returned controls and stubs, cleanup, what the helper
proves, and what still requires a production adapter or live evaluation.

## Plan autonomous documentation work

For parallel or low-cost autonomous agents, create one bounded ticket per page
graph or cohesive slice. Every ticket requires:

- exact objective and reader question;
- exact write scope and read-only evidence scope;
- dependencies and required artifact versions;
- page jobs and lifecycle positions;
- retained content-unit IDs and public-surface ledger IDs;
- required example, observable result, diagram, and decision table;
- canonical ownership and cross-link rules;
- explicit exclusions and halt conditions;
- acceptance journeys and verification commands; and
- handoff evidence.

One integration owner exclusively edits the manifest, redirects, shared
navigation/layout, search, breadcrumbs, and previous/next graph. Content agents
must not opportunistically edit sibling chapters. Run a serial pilot for one
representative primitive before copying a new pattern across parallel tickets.

Agents stop instead of inventing when source/spec/tests disagree, a public
surface cannot be found, defaults or failure behavior are uncertain, a page
fails the usefulness gate, a snippet cannot be verified, or another ticket owns
the required canonical page/file.

## Completion gate

A topic graph is complete only when:

- its hub shows the verified runtime lifecycle and ordered reader tasks;
- the first result is runnable or traceable to maintained executable evidence;
- every child has one distinct job and passes the independent-page test;
- all public methods/context capabilities have exact canonical ownership;
- advanced composition capabilities are discoverable by their reader outcome;
- primitive-specific exposure, failure, security, and testing are close to the
  implementation task;
- no concept page competes with detailed task guidance;
- both learning and lookup journeys pass; and
- every replaced content unit and route has a verified disposition.
