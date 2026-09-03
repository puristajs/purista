# Topic Lifecycle and Task Flow

## Contents

- [Purpose](#purpose)
- [Define the semantic contract](#define-the-semantic-contract)
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

## Define the semantic contract

Before presenting implementation stages, explain the primitive without builder
terminology:

| Question | Required answer |
| --- | --- |
| Who initiates it? | Caller, publisher, scheduler, queue producer, model loop, or runtime. |
| What is selected? | One named recipient, zero-to-many matching consumers, a queue, or a session. |
| Who waits? | Name whether the initiator waits for validation, acceptance, progressive output, completion, or nothing. |
| What is the normal result? | Response, named result event, custom event, queue receipt, frames/final, acknowledgement, or persisted state. |
| What remains decoupled? | State what the implementation does not declare, discover, await, or guarantee about callers and consumers. |
| Which metadata crosses the boundary? | Trusted principal/tenant, trace/correlation, sender, job/session, and any primitive-specific identity. |

Be precise about “does not know.” A command may not name its callers but its
runtime context can still contain caller identity and sender metadata. A
publisher may not declare subscribers while the delivery adapter still knows
registered consumers. Describe contractual coupling, not pretend the runtime
has no metadata.

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

For each stage, record its input, output, ordering, allowed side effects,
failure type, external serialization, internal signal, and stages skipped after
failure. Verify input and output failures independently. Caller-owned input can
often return actionable validation details; invalid application output should
normally remain an internal error so credentials, PII, provider responses, and
implementation data cannot leak.

Keep three error views distinct: the original in-process error, its persisted
or telemetry serialization, and the smaller application-owned public response.
Redacted or sanitized internal metadata is not automatically approved for an
untrusted caller.

For a streaming API, verify and document the producer, bounded buffer and
backpressure behavior, content-bearing event variants, public event allowlist,
terminal error behavior, and exact cancellation mechanism. Breaking iteration
or closing a transport is not cancellation unless the implementation
propagates an abort/cancellation signal. Compare detach/release, dispose,
close/delete, and process shutdown by stating exactly what each method removes
and retains.

Do not treat fluent call order as execution order. Trace how the builder stores
the configuration, which schemas are exported as public/exposure metadata, and
how the runtime invokes it. A transform can create two distinct contracts:
received representation → raw schema → input transform → domain input schema,
and domain output schema → output transform → response-representation schema.
Place guards against the values their callback types actually receive. Record
whether callbacks inside one stage run serially or concurrently.

Create a small lifecycle diagram on the hub when the flow has at least three
meaningful stages or a branch that changes the result. Label lifecycle edges
and failure exits when they remain legible. If failure arrows make the normal
order difficult to read at the page's default width, keep the ordered normal
path in the diagram and put the complete failure classification, public
serialization, and skipped-stage behavior in an adjacent table. A planning
diagram must be corrected when implementation or tests disagree.

Do not force the complete lifecycle into one unreadable diagram. Split at real
semantic boundaries when each part answers a distinct question, such as
“How does untrusted input reach the handler?” and “How does a handler result
become the caller response?” Keep optional branches visible in the relevant
part and retain one ordered stage table beneath the diagrams. The split must
not hide ordering across boundaries: adjacent diagrams name the same handoff.

## Turn the lifecycle into reader tasks

Convert lifecycle stages into pages by reader outcome:

- define and obtain a first result;
- explain default validation, expected business, and unexpected failure
  behavior beside that first result;
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
├── Add a required synchronous dependency
├── Produce the normal result/event/completion
├── Add independent events, durable work, or stream composition
├── Validate, transform, guard, and implement advanced boundaries
├── Use primitive-specific resources, stores, context, and controls
├── Expose or consume through supported transports
├── Handle advanced failure, recovery, cancellation, or delivery
└── Test the primitive
```

The hub owns:

- fit and nearest alternatives;
- semantic contract: initiator, recipient/consumer relationship, wait boundary,
  normal result, and decoupling;
- component/process ownership;
- the complete verified lifecycle;
- a smallest useful path and expected evidence;
- the ordered child-task map;
- default versus opt-in runtime/adapter behavior; and
- the critical security, reliability, or transaction boundary.

Do not turn the hub into the longest tutorial while child pages remain thin.
Move task implementation to focused pages and keep enough code on the hub to
make the first path concrete.

Carry a single realistic scenario through sibling task pages where the domain
still fits. Keep identifiers, schema names, outcomes, and failure semantics
stable; show only the newly introduced delta. Do not preserve a scenario when
it obscures the primitive or requires invented infrastructure.

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

Use this ownership split for recurring cross-cutting material:

| Concern | Shared canonical owner | Primitive page keeps |
| --- | --- | --- |
| Application resource | Service resource declaration, runtime injection, lifecycle ownership, and test replacement | Exact resource member used by this callback and the local consequence |
| State/config/secret store | Choice, composition-root wiring, shared operations, adapter availability, and safety | Primitive-local store use only when it changes that primitive's outcome |
| Handler context | Common positional inputs, trusted message model, stores, resources, telemetry, and declaration-based typing | Exact callback signature, extra clients/controls, and enabling builder declaration |
| Errors | Shared classification, `HandledError` disclosure boundary, unexpected-failure policy, and observability | Exact lifecycle exits, transport/delivery mapping, recovery, retry, cancellation, or settlement |

Do not retain a second full builder chain or options table merely to make a
shared page feel substantial. A lookup table plus exact links can be the useful
job of a shared page; a primitive page must still contain the specific delta a
reader cannot infer from the shared model.

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
