# Harness-first service integration

**Status:** active repository-owner-approved v4 clean-break contract; readiness
evidence must bind this exact revision.

**Decision date:** 2026-09-07.

This is the PURISTA companion to
`ai-harness/specs/42-composable-definitions-and-catalogs.md` and is the only
active PURISTA agent-integration contract. Obsolete alternative integration
specs are removed rather than retained with precedence rules. There is no
compatibility API, deprecated alias, generated migration adapter, dual path, or
legacy runtime behavior.

## 1. Goal and ownership

PURISTA mounts native `@purista/harness` definitions without duplicating agent,
workflow, tool, Skill, MCP, Guardrail, model, output, stream, or approval
contracts.

Harness owns definition factories, catalogs, model loops, workflows, model and
tool execution, Skills, MCP, Guardrails, storage, memory, sandbox/workspace,
portable events, interrupted outcomes, and standalone execution.

The native immutable Harness catalog is the only public registry-like authoring
surface. It packages strongly typed definition references for reuse. PURISTA
does not add a tool, Skill, agent, workflow, model, or runtime registry. Mutable
global registries, string lookup, general service locators, and late-bound
capability discovery are outside this contract.

Framework Core owns service/version/target addresses, EventBridge routing,
business guards, trusted tenant/principal propagation, service resources,
queues, subscriptions, events, HTTP/OpenAPI projection, service lifecycle,
exported service metadata, testing helpers, and host-aware tool context.

`@purista/harness` never imports a Framework package. Core depends only on its
provider-neutral public contracts. Provider and deployment adapters remain
application dependencies.

`@purista/core@4.0.0` has a normal runtime dependency on
`@purista/harness@^4.0.0`; no separate integration package exists. Core imports
only public provider-neutral SPI and runtime symbols. OpenAI, Anthropic, Google,
Bedrock, Azure, storage, memory, sandbox, MCP transport, and the server-side
`@purista/harness-ai-sdk-ui` adapter remain application-selected packages.
Release verification first packs and
installs Harness v4 tarballs into PURISTA without workspace links.
Registry-clean downstream lockfile and scaffold proofs run only after the
corresponding Harness and PURISTA packages are published.

## 2. Minimal mounted agent

AI definitions live below the service version that owns them:

```ts
// service/support/v1/harness/agent/support/supportAgent.ts
export const supportAgent = defineAgent('support', {
  instructions: 'Answer the customer clearly and concisely.',
})
```

This is a complete text agent. Harness supplies the documented default string
input/output schemas, uses the validated string directly as the prompt, selects
the `primary` model alias, derives text streaming, and applies bounded safe loop
defaults. A beginner does not need a prompt mapper, catalog, output-mode flag,
tool list, storage, memory, sandbox, queue, or mount policy. Adding any of those
later refines the same definition and bootstrap shape.

```ts
// service/support/v1/harness/supportHarness.ts
export const supportHarness = defineHarness({ name: 'support' })
  .addAgent(supportAgent)
```

```ts
// service/support/v1/supportV1Service.ts
export const supportV1Service = supportV1ServiceBuilder
  .mountHarness(supportHarness)
```

```ts
const support = await supportV1Service.getInstance(eventBridge, {
  ai: {
    model: {
      provider: openai({ apiKey: process.env.OPENAI_API_KEY! }),
      model: 'gpt-5-mini',
    },
  },
})
```

`mountHarness` policy is optional. Mounting never creates an HTTP endpoint or a
durable queue. Safe defaults retain Harness limits, content-free telemetry, and
permission defaults. Target guards, success events, explicit queue delivery,
storage, memory, or sandbox bindings extend the same composition.

## 3. Mount lifecycle and runtime configuration

`ServiceBuilder.mountHarness(definition, policy?)` is available once per
service builder. Several catalogs and definitions are composed into one
Harness definition before mounting. One service instance creates one Harness
runtime and shuts it down exactly once.

The mounted definition contributes its exact runtime requirements to
`ServiceBuilder.getInstance(...)`. Runtime model configuration is additive and
stable as the graph grows:

- `ai.model` binds the `primary` alias and is required exactly when the graph
  requires `primary`;
- `ai.models` is the exact readonly record of required non-primary aliases;
- a graph that requires both accepts both fields without moving `primary` into
  `ai.models`;
- a graph without `primary` rejects `ai.model`; and
- missing, duplicate, unknown, or capability-incompatible model bindings fail
  before target registration.

For example, adding retrieval to a basic text agent extends the same bootstrap
instead of rewriting it:

```ts
const support = await supportV1Service.getInstance(eventBridge, {
  ai: {
    model: {
      provider: openaiProvider,
      model: 'gpt-5.5',
    },
    models: {
      embeddings: {
        provider: openaiProvider,
        model: 'text-embedding-3-large',
      },
    },
  },
})
```

`ai.storage` and `ai.memory` remain legal optional production upgrades when the
graph can use Harness defaults. They become required when compiled durability
or memory capabilities require them. Supplying either adapter does not grant an
undeclared agent or workflow capability. MCP bindings, sandbox, durable
workspace, artifact store, optional agent admission, and model admission appear
only when accepted or required by the definition.

MCP definitions statically require server ids and tool contracts only. The
application chooses each server's HTTP or stdio binding in `ai.mcp`. Selecting
stdio makes the spawn-capable sandbox inside that exact binding mandatory;
Core validates the complete branch before registering targets. It does not add
a separate graph-level sandbox requirement merely because an MCP server exists.

Core injects service resources, logger, metrics/telemetry bridge, trusted host
context, host-tool implementations, and the EventBridge dispatcher. Those
host-owned values do not appear in the public `ai` option and cannot be
overridden by application configuration.

Missing, additional, or capability-incompatible bindings fail before the
service registers a target. Startup failure unregisters partial registrations
and closes owned resources. Shutdown is idempotent and follows Harness
ownership contracts.

Before initialization, the mounted runtime consumes the complete frozen target
projection set and validates exact one-to-one coverage with
`visitHostedHarnessTargets`, root/dependency visibility, target identity,
address uniqueness, policy ownership, completed-event collisions, export
digests, route revisions, and command/stream address collisions. Validation is
effect-free. Only after the entire set passes does Core create one dispatcher,
instantiate one runtime through `instantiateHostedHarness`, and begin route
registration. Completed-event contracts are composition metadata, not runtime
registrations. Core never derives a schema, target export, export digest, route
revision, or completed-event contract in the mounted runtime.

For every root, Core registers one public aggregate receiver and one strict
dual-envelope stream receiver at the root's normal address. The aggregate
receiver accepts only a public root invocation. The stream receiver first
validates a closed discriminated union before any guard, Harness, EventBridge,
storage, or other effect: a public root envelope calls `streamHosted` and
applies that root's policies; an authenticated nested envelope targeting that
same root calls `streamDispatched` and applies no root `beforeGuards`,
`afterGuards`, `successEvent`, queue, or durable-resume policy. Core does not
create an additional internal address for a root. For every dependency-only
target, it registers one internal nested-only stream receiver that calls
`streamDispatched` and rejects a public root envelope before effects. Reusing
the same target id for two logical addresses remains a composition error even
when the targets would have different digests.

The receiver matrix is normative:

| mounted target | Core receiver | accepted envelope | Harness entry point | root policy |
| --- | --- | --- | --- | --- |
| explicit root | aggregate | public root only | `runHosted` | before/after guards, durable resume, completed event |
| explicit root | aggregate | nested dispatch | reject before effects | none |
| explicit root | stream | public root | `streamHosted` | before/after guards, durable resume, completed event |
| explicit root | same stream receiver | nested dispatch | `streamDispatched` | none |
| dependency only | internal stream | nested dispatch only | `streamDispatched` | none |
| dependency only | internal stream | public root | reject before effects | none |

All receiver branches require matching target export digest, trusted identity
and W3C trace headers, deadline and cancellation propagation, and exact
direct-target run/parent correlation. Fresh input is validated and transformed
exactly once by the receiver; durable resume restores validated input and never
re-runs the transform. Missing, duplicate, mismatched, descendant-only, or
post-terminal direct terminals fail the protocol, and aggregate and stream
completion use the same authoritative frozen outcome.

If any target registration fails, Core unregisters every registration
made by that startup attempt in reverse order and closes the hosted Harness.
Shutdown first stops new target ingress, cancels active streams, unregisters
root and dependency routes, and closes the hosted Harness exactly once; only
afterward does normal service resource and EventBridge shutdown continue.
Repeated shutdown is idempotent, and cleanup errors preserve the original
startup or execution failure as the primary error.

## 4. Address-first agents and workflows

Each explicit Harness agent or workflow root has the normal public
service/version/target address, and nested dispatch to that root uses its same
stream address. Each dependency-only executable needed for workflow or
subagent dispatch has an exact Core-owned internal route. All PURISTA
root calls, workflow calls, model-selected subagent calls, and host-tool nested
target calls go through EventBridge, including same-service and same-process
calls. No client, dispatcher, workflow, tool, or mount runtime has a direct
local-execution fallback.

Portable and host-aware model tool handlers execute inside the receiving
Harness run; PURISTA operations declared by a host-aware tool use EventBridge.
The receiver is the input trust boundary. A public aggregate or public branch
of a root stream receiver validates and transforms a fresh raw logical input
exactly once with the mounted root contract, then supplies both `wireInput` and
the validated `input` to `runHosted` or `streamHosted`. A resume supplies the
same `wireInput`, forbids `input`, and lets Harness compare the wire value and
restore the prior validated input from trusted durable state. The nested branch
of that root stream receiver and each
dependency-only internal receiver authenticate the reserved Core dispatch
envelope, resolve the exact target from the private compiled dependency closure,
validate and transform a fresh delivery exactly once, and call
`streamDispatched` without root policy. A resume delivery is checked against its
stored wire input and is not transformed again. The EventBridge dispatcher
transports raw logical input and never validates or transforms it. Every hosted
Harness entry point receives the appropriate already validated value or strict
resume union, verifies the exact contract identity, and does not repeat input
validation or transformation.

Every public hosted root request has this strict union and required per-request
authorization callback:

```ts
type HostedTargetAuthorizationRequest<
  Target extends AnyHarnessTargetContract,
> = Readonly<{
  delivery: 'fresh' | 'resume'
  target: Target
  input: HarnessValidatedTargetInput<Target>
}>

type HostedTargetAuthorizer<
  Target extends AnyHarnessTargetContract,
> = (
  request: HostedTargetAuthorizationRequest<Target>,
) => void | Promise<void>

type HostedFreshInvokeOptions<
  Target extends AnyHarnessTargetContract,
> = Omit<HostedInvokeOptions<Target>, 'resume' | 'resumeIdentity'> &
  Readonly<{ resume?: never; resumeIdentity?: never }>

type HostedResumeInvokeOptions<
  Target extends AnyHarnessTargetContract,
> = Omit<
  HostedInvokeOptions<Target>,
  'resume' | 'resumeIdentity' | 'idempotencyKey'
> & Readonly<{
  resume: HarnessTargetApprovalResume<Target>
  resumeIdentity?: 'current-caller' | 'stored-run-owner'
  idempotencyKey?: never
}>

type HostedTargetRequest<
  Target extends AnyHarnessTargetContract,
  HostInvocation,
> =
  | Readonly<{
      delivery: 'fresh'
      target: Target
      wireInput: HarnessTargetInput<Target>
      input: HarnessValidatedTargetInput<Target>
      invokeOptions: HostedFreshInvokeOptions<Target>
      hostInvocation: HostInvocation
      authorize: HostedTargetAuthorizer<Target>
    }>
  | Readonly<{
      delivery: 'resume'
      target: Target
      wireInput: HarnessTargetInput<Target>
      input?: never
      invokeOptions: HostedResumeInvokeOptions<Target>
      hostInvocation: HostInvocation
      authorize: HostedTargetAuthorizer<Target>
    }>
```

Core creates `authorize` for each request and closes over only that root's
business `beforeGuards` and current authenticated reviewer context. The
`HostedTargetAuthorizer` receives exactly `{delivery,target,input}`; neither
`HostInvocation` nor stored owner identity is exposed through its argument.
Harness invokes it once with the fresh or restored deeply frozen validated
input.

Every resume mode, `current-caller` and `stored-run-owner`, first validates the
strict request, loads and validates the addressed run, session, target, original
wire input, immutable identity, and continuation, compares the supplied wire
input, and restores the same deeply frozen `RunRecord.validatedInput`. That
field is required and immutable for agent and workflow runs, is persisted
atomically beside the canonical pre-transform `RunRecord.input`, and is never
reconstructed by rerunning the target input schema. The selected mode's complete
identity comparison then runs before `authorize`; stored-run-owner also requires
its exact same-tenant check. A resume request forbids an own
`idempotencyKey` property even when its value is `undefined`.

After asynchronous authorization returns, Harness rechecks abort and absolute
deadline and re-reads the exact immutable run revision it authorized. A terminal
approval-receipt replay revalidates that same terminal revision and receipt,
then returns the stored terminal outcome without acquiring a lease, executing,
transforming input, or publishing another event. A changed terminal revision,
receipt, target, input, identity, or session fails before replay. A nonterminal
continuation instead calls `acquireRun` with the optimistic revision and
checkpoint expectation; the returned under-lease record must match the same
immutable fields and validated input before execution. A concurrent loser may
have completed authorization but can never execute or replay a changed
terminal. Business guards therefore must be safe to retry and cannot rely on
exactly-once side effects. Authorization runs before runtime, model, tool,
memory, sandbox, workspace, or event effects and before a run/stream start is
published. A callback `HandledError` propagates unchanged through Core; an
unknown throw or rejection is sanitized. Core `afterGuards` remain terminal
postconditions outside Harness and are never passed through this callback.

The Framework propagates trusted tenant id, principal id, trace/correlation
context, deadlines, session/run ancestry, idempotency, and handled errors.
Stream and nested-agent cancellation propagate through EventBridge stream
control. Aggregate `run` propagates its deadline, but caller-side cancellation
after dispatch is not guaranteed by an EventBridge adapter that lacks
cancellable command invocation. Model input cannot supply or replace identity.

Application-controlled calls within the producer's source graph retain
declaration-first builder methods:

```ts
const command = supportV1ServiceBuilder
  .getCommandBuilder('answerQuestion', 'Answer a question')
  .canInvokeAgent(
    'Support',
    '1',
    supportHarness.contracts.agents.support,
  )
  .setCommandFunction(async function ({ message, agent }) {
    return agent.Support['1'].support.run(message.payload)
  })
```

`canInvokeAgent(serviceName, serviceVersion, contract)` and
`canInvokeWorkflow(serviceName, serviceVersion, contract)` derive
`serviceTarget` from the contract's literal `id`. Callers do not repeat a target
string that could disagree with the contract. The mounted address has no alias
in v4. These methods declare outgoing application dependencies; they do not
wrap, register, or locally call a target. A model-selected subagent relation is
declared on `defineAgent` and is compiled into an EventBridge-backed
`HarnessTargetDispatcher` when mounted.

Core implements `HarnessTargetDispatcher.open` for model-selected subagents,
workflow-declared agent calls, and scoped host-tool target calls. It calls
`EventBridge.openStream()` for the mounted child address, relays child Harness
events with their original child run id and parent invocation correlation, and
derives the child result from the dispatch stream's canonical terminal result.
The receiving adapter calls `streamDispatched`, including when the authentic
target is a dependency-only agent or workflow. The target reference and its
input, output, update, and interrupt types come from an integrator-only compiled
closure contract; application code, service exports, generated clients, and
inspection metadata never receive that contract or an invocation surface for
private dependencies. There is no direct local-execution fallback. Stream
control carries cancellation. Trusted identity, lineage, budgets, and deadline
are added by Core and cannot be supplied by the model.

### Generated cross-service contracts

A service in another package does not import the producer's Harness, agent,
workflow, service builder, or final service. `ClientBuilder` writes
one builder-free branded artifact per exported root to this canonical path:

```text
src/generated/purista/<service-kebab>/v<service-version>/harness/
  <agent|workflow>/<target-kebab>TargetContract.ts
```

For example, the Support v1 agent above produces:

```ts
// generated file; do not edit
import {
  createGeneratedHarnessSchema,
  createRemoteHarnessTargetContract,
  harnessExecutionEventTypesV1,
  type SerializedHarnessTargetExportV1,
} from '@purista/core'

const serializedTarget = {
  targetName: 'support',
  kind: 'agent',
  inputSchema: { type: 'string' },
  validatedInputSchema: { type: 'string' },
  outputSchema: { type: 'string' },
  updateSchema: { type: 'string' },
  interruptSchema: false,
  invocation: {
    aggregate: true,
    stream: true,
    resumableInterrupts: [],
  },
  stream: {
    protocol: 'harness-execution-events-v1',
    eventTypes: harnessExecutionEventTypesV1,
    outputUpdates: ['text-delta'],
  },
  exportDigest: 'sha256:4f3a…',
} as const satisfies SerializedHarnessTargetExportV1

const targetAddress = {
  serviceName: 'Support',
  serviceVersion: '1',
  serviceTarget: 'support',
} as const

const inputSchema =
  createGeneratedHarnessSchema<string>(serializedTarget.inputSchema)
const validatedInputSchema =
  createGeneratedHarnessSchema<string>(serializedTarget.validatedInputSchema)
const outputSchema =
  createGeneratedHarnessSchema<string>(serializedTarget.outputSchema)

export const supportTargetContract =
  createRemoteHarnessTargetContract({
    schemaVersion: 1,
    address: targetAddress,
    target: serializedTarget,
    schemas: {
      input: inputSchema,
      validatedInput: validatedInputSchema,
      output: outputSchema,
    },
  })
```

`SerializedHarnessTargetExportV1` is the closed raw-JSON transport and export
shape defined in section 9. It is distinct from every generated Standard Schema
wrapper. The abbreviated digest above stands for the full 64 lowercase
hexadecimal characters. The generated module imports only `@purista/core` and
generated type helpers; it has no import into `src/service/**`.

Core exposes this exact validation-only wrapper for generated artifacts:

```ts
type GeneratedHarnessSchema<Value extends JsonValue> =
  StandardSchemaV1<Value, Value> & StandardJSONSchemaV1<Value, Value>

declare function createGeneratedHarnessSchema<Value extends JsonValue>(
  jsonSchema: JSONSchema,
): GeneratedHarnessSchema<Value>
```

`GeneratedHarnessSchema<Value>` is exactly a validation-only
`ModelSchema<Value, Value>`. The factory canonically clones and deeply freezes
the supplied JSON Schema once. Both Standard JSON Schema directions return that
same canonical frozen projection, and Standard Schema `validate` accepts a JSON
value only when the projection accepts it and returns the identical input
reference. It performs no transform, coercion, default insertion,
normalization, or object recreation. It has no output schema distinct from its
input schema. In particular, the generated artifact does not attempt to recreate
the producer's possibly transforming input Standard Schema. The producer's
local mounted contract validates and transforms fresh wire input exactly once,
inside the receiver. A resume uses stored validated input and does not run that
transform again. Core does not install the generated input wrapper as an
EventBridge sender-side payload schema; doing so would add a second validation
boundary and could transform before the receiver.

The hydration source and result are exact:

```ts
type RemoteHarnessSerializedTargetV1<
  Kind extends HarnessTargetKind,
  Id extends string,
  Updates extends HarnessOutputUpdateKind,
  Interrupts extends readonly HarnessInterruptKind[],
> = Omit<SerializedHarnessTargetExportV1, 'queue'> & Readonly<{
    targetName: Id
    kind: Kind
    invocation: Readonly<{
      aggregate: true
      stream: true
      resumableInterrupts: Interrupts
    }>
    stream: Readonly<{
      protocol: 'harness-execution-events-v1'
      eventTypes: typeof harnessExecutionEventTypesV1
      outputUpdates: Updates extends 'none' ? readonly [] : readonly [Updates]
    }>
}>

type AnyRemoteHarnessSerializedTargetV1 = RemoteHarnessSerializedTargetV1<
  HarnessTargetKind,
  string,
  HarnessOutputUpdateKind,
  readonly HarnessInterruptKind[]
>

type RemoteHarnessTargetContractSourceBaseV1 = Readonly<{
  schemaVersion: 1
  address: HarnessTargetAddress
  target: AnyRemoteHarnessSerializedTargetV1
  schemas: Readonly<{
    input: ModelSchema
    validatedInput: ModelSchema
    output: ModelSchema
  }>
}>

type RemoteHarnessTargetContractSourceV1 =
  RemoteHarnessTargetContractSourceBaseV1 &
  Readonly<{ target: Readonly<{ queue?: never }> }>

type QueuedRemoteHarnessTargetContractSourceV1 =
  RemoteHarnessTargetContractSourceBaseV1 &
  Readonly<{
    target: Readonly<{ queue: Readonly<{ name: string }> }>
  }>

type RemoteHarnessTargetSourceAddressAgreement<
  S extends RemoteHarnessTargetContractSourceBaseV1,
> = Readonly<{
  address: S['address'] & Readonly<{
    serviceTarget: S['target']['targetName']
  }>
}>

type RemoteHarnessTargetAddressFor<
  S extends RemoteHarnessTargetContractSourceBaseV1,
> = Readonly<{
  serviceName: S['address']['serviceName']
  serviceVersion: S['address']['serviceVersion']
  serviceTarget: S['target']['targetName']
}>

type RemoteHarnessTargetUpdatesFor<
  S extends RemoteHarnessTargetContractSourceBaseV1,
> = S['target']['stream']['outputUpdates'] extends readonly []
  ? 'none'
  : S['target']['stream']['outputUpdates'] extends readonly [
        infer Update extends Exclude<HarnessOutputUpdateKind, 'none'>,
      ]
    ? Update
    : never

type GeneratedHarnessInferenceForSource<
  S extends RemoteHarnessTargetContractSourceBaseV1,
> = HarnessTargetInferenceFor<
  InferIn<S['schemas']['input']> & JsonValue,
  Infer<S['schemas']['validatedInput']> & JsonValue,
  Infer<S['schemas']['output']> & JsonValue,
  RemoteHarnessTargetUpdatesFor<S>,
  S['target']['invocation']['resumableInterrupts']
>

declare function createRemoteHarnessTargetContract<
  const S extends RemoteHarnessTargetContractSourceV1,
>(
  source: S & RemoteHarnessTargetSourceAddressAgreement<S>,
): UnqueuedRemoteHarnessTargetContract<S>

declare function createRemoteHarnessTargetContract<
  const S extends QueuedRemoteHarnessTargetContractSourceV1,
>(
  source: S & RemoteHarnessTargetSourceAddressAgreement<S>,
): QueuedRemoteHarnessTargetContract<S>
```

Hydration requires closed plain JSON for `address` and `target`, exact
address/target-kind/id agreement, factory-authentic validation-only generated
schema wrappers for input, validated input, and output, exact
wrapper/serialized-schema agreement, exact presence and literal name agreement
for `queue`, and a valid
export digest before returning. It clones and freezes the raw JSON, adds a
module-private Core brand, and returns an immutable remote
contract whose frozen phantom `$infer` is exactly the generated public
`HarnessTargetInferenceFor`, including `validatedInput`, `update`, and `interrupt`.
Those phantom types come from generator-owned TypeScript declarations, not from
a second runtime transform. `createRemoteHarnessTargetContract` is a pure Core
hydration function intended for generated files. It is not another builder,
definition factory, registry, or executable Harness target. Hand-authored calls
are unsupported, and checked generated files are always overwritten.

Its public type is an addressed refinement of the sole Harness contract type,
not a parallel inference contract:

```ts
declare class RemoteHarnessTargetAuthenticity<
  QueueName extends string | null,
> {
  private readonly queueName: QueueName
}

type HarnessTargetAddress = Readonly<{
  serviceName: string
  serviceVersion: string
  serviceTarget: string
}>

type RemoteHarnessTargetContract<
  S extends RemoteHarnessTargetContractSourceBaseV1,
  QueueName extends string | null,
> = HarnessTargetContract<
  S['target']['kind'],
  S['target']['targetName'],
  S['schemas']['input'],
  S['schemas']['output'],
  RemoteHarnessTargetUpdatesFor<S>,
  S['target']['invocation']['resumableInterrupts'],
  GeneratedHarnessInferenceForSource<S>
> & RemoteHarnessTargetAuthenticity<QueueName> & Readonly<{
  address: RemoteHarnessTargetAddressFor<S>
  exportDigest: `sha256:${string}`
}>

type UnqueuedRemoteHarnessTargetContract<
  S extends RemoteHarnessTargetContractSourceV1,
> = RemoteHarnessTargetContract<S, null> & Readonly<{ queue?: never }>

type QueuedRemoteHarnessTargetContract<
  S extends QueuedRemoteHarnessTargetContractSourceV1,
> = RemoteHarnessTargetContract<
  S,
  S['target']['queue']['name']
> & Readonly<{
  queue: Readonly<{ name: S['target']['queue']['name'] }>
}>
```

The overload inference is verified with TypeScript 6.0.3 using one concrete
generated source. This proof deliberately gives wire input, validated input,
and output different types and retains the literal queued capability:

```ts
type Wire = Readonly<{ raw: string }>
type Validated = Readonly<{ normalized: number }>
type Output = Readonly<{ accepted: boolean }>

declare const wireSchema: GeneratedHarnessSchema<Wire>
declare const validatedSchema: GeneratedHarnessSchema<Validated>
declare const resultSchema: GeneratedHarnessSchema<Output>
declare const queuedTargetExport:
  RemoteHarnessSerializedTargetV1<
    'agent',
    'typedSupport',
    'object-snapshot',
    readonly ['tool-approval']
  > & Readonly<{
    queue: Readonly<{ name: 'support-jobs' }>
  }>

const typedSupport = createRemoteHarnessTargetContract({
  schemaVersion: 1,
  address: {
    serviceName: 'Support',
    serviceVersion: '1',
    serviceTarget: 'typedSupport',
  },
  target: queuedTargetExport,
  schemas: {
    input: wireSchema,
    validatedInput: validatedSchema,
    output: resultSchema,
  },
} as const)

type Exact<Left, Right> =
  [Left] extends [Right]
    ? [Right] extends [Left] ? true : false
    : false
type Expect<Condition extends true> = Condition

type _WireIsExact = Expect<
  Exact<HarnessTargetInput<typeof typedSupport>, Wire>
>
type _ValidatedIsExact = Expect<
  Exact<HarnessValidatedTargetInput<typeof typedSupport>, Validated>
>
type _OutputIsExact = Expect<
  Exact<HarnessTargetOutput<typeof typedSupport>, Output>
>
type _QueueCapabilityIsExact = Expect<
  Exact<typeof typedSupport.queue.name, 'support-jobs'>
>
type _QueuedCapabilityIsNominal = Expect<
  Exact<
    typeof typedSupport extends RemoteHarnessTargetAuthenticity<
      infer QueueName
    > ? QueueName : never,
    'support-jobs'
  >
>
```

The seventh Harness contract generic is used directly; hydration does not use
an `Omit`/intersection replacement for `$infer` and accepts no caller-supplied
inference projection. Each overload infers one concrete generated source and
extracts its exact `S['schemas']['input']`, `S['schemas']['validatedInput']`,
and `S['schemas']['output']` witnesses directly; it never constrains an invariant generated
schema through a broad generated-schema instantiation. The Harness-exported
`HarnessTargetInferenceFor` helper then derives wire input, validated input,
output, update, and interrupt from those witnesses plus the literal update and
interrupt declarations. A mismatched output schema/value, update mode/value,
or interrupt tuple/value therefore fails at the source boundary rather than
being repaired by a handwritten inference argument. The hydrator repeats the
corresponding closed export/schema checks at runtime. It validates the
generated validated-input witness against `validatedInputSchema` but never
executes that witness as the producer's transform.

The separate queued and unqueued overloads are equally exact; there is no broad
or default queue generic and no `never` conditional that can collapse an
unqueued contract incorrectly. A serialized export with `queue`
hydrates a nominal remote contract with the same frozen literal `queue.name`
and records that capability in the remote factory's package-private authentic
record; its generated client exposes `enqueue`. An export without `queue`
produces a remote contract with no queue member, no recorded capability, and no
enqueue operation. Builder validation requires either the exact local WeakMap
reference or the nominal remote type plus its recorded WeakMap capability; a
structural `{queue}` member never grants enqueue. Missing, additional, copied,
or mismatched queue metadata fails before the contract can reach a builder or
dispatcher.

The generated inference owns the same exact `$infer` and discriminants as its
local `HarnessTargetContract`; Core and clients keep using the Harness-exported
outcome and event helper types. A non-exported class private brand provides the
nominal type boundary, while a module-private WeakMap proves at runtime that the
value came through the generated hydration boundary in the current process.
Neither is a wire credential.

The remote declaration contains its address, so the cross-service form is
concise and cannot pair a valid contract with another address:

```ts
const command = apiV1ServiceBuilder
  .getCommandBuilder('answerQuestion', 'Answer a question')
  .canInvokeAgent(supportTargetContract)
  .setCommandFunction(async function ({ message, agent }) {
    return agent.Support['1'].support.run(message.payload)
  })
```

`canInvokeWorkflow(remoteContract)` is identical for a workflow. A generated
remote contract's exact queue member controls whether its client also has
`enqueue`. For a producer-local root, the three-argument overload accepts either
the original authentic target contract or an authentic
`QueuedHarnessTargetReference`; only the latter adds enqueue. These overloads
add one exact address-first outgoing dependency and infer clients from the
contract's `$infer`; neither imports or registers executable code.

Every exported root has the `exportDigest` already stored in its
`MountedHarnessTargetProjection`. Its exact canonical preimage is defined in
section 5. Absent optional members are omitted and ordered arrays retain
contract order. The digest therefore changes when any public schema, update,
interrupt, invocation, stream, queue, kind, or address contract changes.

For a dependency-only child target, projection computes the same addressed
contract digest for its private route. That digest is shared only by
Core-authored nested dispatch and never appears in service exports, generated
artifacts, ClientBuilder output, or root invocation declarations. Knowing a
digest does not promote the child or make its internal EventBridge route accept
an application-root call.

The normal EventBridge receiver address remains the routing authority. Core
adds only the public `exportDigest` to a reserved invocation-contract envelope;
it never serializes a hidden Harness identity, Core brand, definition token, or
implementation object. A public receiver resolves the local mounted root by
the EventBridge address, compares the supplied digest with that root's current
export digest, builds the strict fresh/resume request, supplies the root before
guards through the required per-request `authorize` callback, and calls
`runHosted` or `streamHosted` with the receiver-local Harness identity. Only the
fresh branch validates and transforms wire input; the resume branch forwards
the original wire value and lets Harness restore validated input. A nested
envelope accepted by a root stream
receiver, or by a dependency-only internal receiver, resolves the exact compiled
target and calls `streamDispatched` without root policy; it never promotes a
dependency to a public root. An unknown public address is
`404`; a digest mismatch is a handled `409` `harness_contract_mismatch` before
guard, handler, tool, or model effects. Digest matching detects generated-client
drift and is not authentication or authorization. Trusted identity and
business guards remain authoritative.

The Core dispatcher owns an immutable local binding table keyed by each direct
contract's hidden Harness identity or generated remote contract's Core brand.
It consumes the finalized bindings from the frozen mounted projections and
binds each visited executable contract to one service/version/target route.
Only explicit root contracts are exposed for application declarations, service
metadata, and generated clients. Builder declarations such as
`canInvokeAgent` and `canInvokeWorkflow` add their exact remote root-contract
identity, address, and export digest. An unknown, structurally copied, or
digest-invalid contract fails before EventBridge dispatch; routing never falls
back to `(kind, id)` strings.

An internal-only child route accepts only a Core-authored nested dispatch
envelope selected from the exact compiled identity. The wire envelope carries
its address and export digest, never that hidden identity. It rejects ordinary
root invocation. Making that definition an explicit `.addAgent(...)`,
`.addWorkflow(...)`, or catalog root promotes it to a public target without
creating a second definition or execution path.

The serialized invocation parameter is deliberately smaller than Harness
`InvokeOptions`:

```ts
type HarnessInvocationParameter = Readonly<{
  sessionId?: string
  timeoutMs?: number
  idempotencyKey?: string
  metadata?: Record<string, string | number | boolean | null>
  durable?: DurableInvokeOptions
  resume?: ToolApprovalResume
}>
```

`signal`, trusted identity, lineage, trace context, and opaque host context are
host-created and never serialized in model input. `resume` and
`idempotencyKey` are mutually exclusive; resume replay protection uses the
approval event id.

Core creates one stable root `invocationId` at the first public aggregate,
stream, or enqueue ingress. Callers cannot provide or replace it. Before the
first enqueue or EventBridge dispatch, Core resolves
`sessionId = suppliedSessionId ?? invocationId` and freezes both values in
reserved Framework metadata. Transport retry, queue retry, redelivery, and
approval resume reuse those exact values; no worker or receiver generates a
replacement. A later conversational turn creates a new invocation id and
supplies the session id returned by the preceding turn. Harness binds the
projected tenant/principal identity to that session and fails closed before
execution when any later call or resume attempts to reuse it with a different
identity. The logical payload and public parameter never contain the root
invocation id or trusted identity. This transport invocation id is not a
Harness run id and is never compared with `outcome.runId`; Harness alone creates
or restores the root run id.

Aggregate EventBridge replies contain the exact
`HarnessTargetRunOutcome<Contract>` imported from Harness inside a frozen
Framework result that also returns the resolved session id:

```ts
type HarnessTargetRunResult<C extends AnyHarnessTargetContract> = Readonly<{
  sessionId: CorrelationId
  outcome: HarnessTargetRunOutcome<C>
}>

export type HarnessTargetQueueEnqueueResult = Readonly<
  QueueEnqueueResult & {
    readonly sessionId: CorrelationId
  }
>
```

Core aggregate command clients and their aggregate HTTP projections return
`HarnessTargetRunResult<C>`, the `{ sessionId, outcome }` wrapper above. Native
standalone Harness `run(...)` remains unchanged and returns a raw `RunOutcome`;
for contract `C`, Core projects that union as `HarnessTargetRunOutcome<C>`.
The Framework wrapper is not a Harness runtime result. A queued Framework
invocation returns the separate `HarnessTargetQueueEnqueueResult`, so accepting
work never masquerades as its eventual run outcome.

Failed and cancelled aggregate execution rejects and follows the handled-error
mapping in section 12. Once a stream passes input validation, before guards,
and Harness startup, it relays the exact
`HarnessTargetExecutionEvent<Contract>` and includes one terminal
`run.finished`. Validation, before-guard, and startup failures occur before
`run.started` and use the normal EventBridge stream error; they do not
manufacture a Harness run id or terminal event.

For every hosted or nested stream, the returned `dispatchStream.result` is the
single authoritative terminal promise. Core freezes that resolved terminal
outcome once. It forwards non-terminal events and correlated descendant
terminals, but withholds the direct target's candidate `run.finished` until
`result` resolves. It then derives the one public direct-target `run.finished`,
the EventBridge `complete.final`, aggregate nested-call consumption, and any
after-guard replacement from that value. If the candidate terminal event and
`result`, or an independently transported terminal event and `complete.final`,
arrive through separate transport fields, the receiver requires full RFC 8785
canonical JSON equality of the complete terminal outcomes. A run-id/status-only
comparison is insufficient. Missing, duplicated, or unequal terminal
representations are protocol failures and are never accepted as a successful
target result.

`HarnessTargetContract.$infer` is the sole contract-only type source and
contains exact `input`, `validatedInput`, `output`, `update`, and `interrupt`
members. It is a compile-time phantom with the Harness-defined frozen empty
runtime value; Core never reads or serializes it. Core imports Harness's
`HarnessTargetRunOutcome<Contract>` and
`HarnessTargetExecutionEvent<Contract>` projections rather than copying their
conditional-type equations or widening interruption to all Harness interrupt
families. The generated address-first client has this semantic shape:

```ts
interface HarnessExecutionStream<C extends AnyHarnessTargetContract>
  extends AsyncIterable<HarnessTargetExecutionEvent<C>> {
  readonly sessionId: CorrelationId
  readonly result: Promise<HarnessTargetExecutionTerminalOutcome<C>>
  cancel(reason?: string): Promise<void>
}

export type HarnessEnqueueOptions = Omit<
  QueueEnqueueOptions<unknown, HarnessInvocationParameter>,
  'queueName' | 'payload' | 'parameter'
>

type DirectHarnessTargetClient<C extends AnyHarnessTargetContract> = Readonly<{
  run(
    input: C['$infer']['input'],
    options?: HarnessInvocationParameter,
  ): Promise<HarnessTargetRunResult<C>>
  stream(
    input: C['$infer']['input'],
    options?: HarnessInvocationParameter,
  ): Promise<HarnessExecutionStream<C>>
}>

type QueuedHarnessTargetClient<
  C extends AnyHarnessTargetContract,
> = DirectHarnessTargetClient<C> & Readonly<{
  enqueue(
    input: C['$infer']['input'],
    parameter?: HarnessInvocationParameter,
    options?: HarnessEnqueueOptions,
  ): Promise<HarnessTargetQueueEnqueueResult>
}>

type HarnessTargetClient<Source> =
  Source extends QueuedHarnessTargetReference<infer C, string>
    ? QueuedHarnessTargetClient<C>
    : Source extends AnyHarnessTargetContract &
        RemoteHarnessTargetAuthenticity<infer QueueName>
      ? QueueName extends string
        ? QueuedHarnessTargetClient<Source>
        : DirectHarnessTargetClient<Source>
      : Source extends AnyHarnessTargetContract
        ? DirectHarnessTargetClient<Source>
        : never
```

`HarnessEnqueueOptions` is the normal PURISTA queue enqueue options with
`queueName`, `payload`, and `parameter` omitted because the generated client
already supplies those values. The conditional branches inspect only the
non-exported nominal authenticity class of a hydrated remote contract or the
non-exported nominal local queued reference. They never infer enqueue from a
structural `queue` property. Only an authentic queued source receives
`enqueue`, whose return type is exactly `HarnessTargetQueueEnqueueResult`.

Internally the corresponding EventBridge handle is typed as
`StreamHandle<HarnessTargetExecutionEvent<C>,
HarnessTargetExecutionTerminalOutcome<C>>`. These three public Harness
projections preserve the root contract's exact update and reachable-interrupt
types. `HarnessExecutionStream.sessionId`, aggregate
`HarnessTargetRunResult.sessionId`, and the session id on a queued target
receipt are the same resolved public session identity. The client verifies full
RFC 8785 canonical equality between the direct-target terminal event and
`complete.final` before ending iteration.

Nested dispatch adds a reserved internal transport envelope beside the logical
payload and public invocation parameter:

```ts
type HarnessRootInvocationContext = Readonly<{
  invocationId: CorrelationId
  sessionId: CorrelationId
}>

type HarnessDispatchContext = Readonly<{
  sessionId: string
  rootRunId: string
  parentRunId: string
  invocationId: string
  depth: number
  remainingDepth: number
  deadline?: number
  idempotencyKey?: string
} & (
  | Readonly<{ parentAgentId: string; parentWorkflowId?: never }>
  | Readonly<{ parentAgentId?: never; parentWorkflowId: string }>
)>

type HarnessInvocationContractEnvelope = Readonly<{
  schemaVersion: 1
  exportDigest: `sha256:${string}`
}>
```

Core alone serializes and validates these envelopes. The contract envelope is
required for root and internal child calls. The root invocation context is
required for every public root and queued delivery; the nested dispatch context
replaces it for child calls and has the exact one-parent ancestry union expected
by Harness. Neither contains a hidden definition identity or brand. The
receiver reconstructs
the Harness dispatch request from them and EventBridge identity/trace headers,
then validates and transforms a fresh raw logical payload exactly once before
calling `streamDispatched`; a resume skips transformation and supplies the
strict resume delivery instead. It is never passed to a model, accepted from
HTTP input, or exposed as a command payload/parameter schema. The ancestry
union requires exactly one parent target id. Harness emits parent correlation
on child execution events before Core relays them.

Host-tool `context.agent` and `context.workflow` clients are generated only for
builder-declared dependencies and bind every call to the current host-tool run.
They preserve the current root run, session, trusted identity, trace, and
deadline; set `parentRunId` to the current Harness run; create a fresh stable
invocation id; and propagate cancellation. Callers cannot override those
values. Core sends agent and workflow calls through the addressed target's
EventBridge stream and consumes it when an aggregate result is requested, so a
nested interruption suspends and later resumes the original root rather than
becoming an error. The reserved `HarnessDispatchContext` is the common
transport envelope for model-selected subagents, workflow-declared agent calls,
and host-tool agent/workflow calls. Only `remainingDepth` propagates;
step/tool/subagent-call limits are local to each target invocation.

Every agent has `loop.maxDepth`; every workflow has `maxDepth`, with the Harness
default used when omitted. A root target starts at depth zero and its configured
maximum. Every nested agent or workflow edge consumes one. The caller passes
`parentRemainingDepth - 1` as the transmitted child ceiling; the receiving
target applies `min(transmittedRemainingDepth, itsConfiguredMaxDepth)`. A
nonpositive budget rejects before EventBridge dispatch. A host-tool call itself does not consume
depth, but an agent/workflow call made by that tool does. Replaying a completed
logical child call does not consume depth again.

## 5. Executable roots, dependency closure, and HTTP

Harness keeps explicit executable roots separate from their recursive dependency
closure:

- `.addAgent(definition)` and `.addWorkflow(definition)` add one public root;
- `.use(catalog)` adds only the agent and workflow roots explicitly packaged by
  that catalog;
- tools, Skills, MCP servers, subagents, and other definitions reached from a
  root enter the private compiled dependency closure without becoming public
  roots; and
- catalog membership alone grants no runtime capability and publishes no
  target.

A leaf-only catalog remains valid for typed reuse but cannot be passed to
`.use(...)`, because it would activate no root. Type checking rejects that call;
erased JavaScript fails graph composition with a stable configuration error.

The Harness authoring surface has no `.addTool(...)`, `.addSkill(...)`, or
`.addMcpServer(...)`. Small applications reference those definitions directly
from an agent or workflow. Reusable applications package them in
`defineCatalog(...)` and then reference the typed catalog member from a root.
Both paths compile the same hidden definition identity.

```ts
const bankingCapabilities = defineCatalog('bankingCapabilities', {
  tools: [lookupTransaction],
  skills: [customerSupportPolicy],
})

const answerQuestion = defineAgent('answerQuestion', {
  instructions: 'Answer using verified account information.',
  tools: [bankingCapabilities.tools.lookupTransaction],
  skills: [bankingCapabilities.skills.customerSupportPolicy],
})

const supportTargets = defineCatalog('supportTargets', {
  agents: [answerQuestion],
})

const supportHarness = defineHarness({ name: 'support' })
  .use(supportTargets)
```

Using `bankingCapabilities` as a typed value grants only the definitions
referenced by `answerQuestion`. Using `supportTargets` makes its explicitly
listed agent a Harness root. Neither catalog creates a second registry.

`harness.contracts` and `harness.$infer` contain executable roots only. Public
`inspect()` output separates roots from sanitized dependency ids. The integrator
SPI exposes Core only the typed private closure metadata required for host-tool
binding and internal EventBridge child routing; it does not expose a mutable
registry or an application invocation surface.

Core obtains executable target identity only through the integrator-only
`visitHostedHarnessTargets(definition, visitor)` function. Harness authenticates
the exact definition through its package-private compiled blueprint, then visits
each original agent and workflow target contract in deterministic kind/id order.
Each visit contains only the exact target contract and `visibility: 'root' |
'dependency'`; root visibility is decided by exact contract identity against the
definition's explicit roots. A copied, reflected, foreign, or non-Harness
definition fails before the visitor runs. The integrator subpath is trusted host
TCB for Framework integration and is not a supported application API. That
package boundary is not claimed to be a JavaScript security sandbox: an honest
host callback may retain an entry it receives. The API nevertheless exposes no
compiled graph, index, lookup function, mutable registry, handler, tool,
definition owner token, or invocation helper. It is exported only from
`@purista/harness/integrator` and never from the Harness root.

The visitor runs once for every target and never after its callback throws. A
callback failure propagates unchanged and aborts projection before effects. An
authenticated definition that yields no executable target is an invalid mount
and fails before dispatcher creation or registration.

Core consumes those visits once to create exactly one projection of this
normative shape per target:

```ts
type MountedHarnessTargetPolicyDescriptor = Readonly<{
  beforeGuardKeys: readonly string[]
  afterGuardKeys: readonly string[]
  durableResume: 'stored-run-owner' | null
  successEvent: string | null
  queueName: string | null
}>

type MountedHarnessCompletedEvent<
  C extends AnyHarnessTargetContract,
> = Readonly<{
  name: string
  schema: StandardSchemaV1<
    Extract<HarnessTargetRunOutcome<C>, { status: 'completed' }>,
    Extract<HarnessTargetRunOutcome<C>, { status: 'completed' }>
  >
  jsonSchema: JSONSchema
}>

type MountedHarnessTargetProjection<
  C extends AnyHarnessTargetContract,
> = Readonly<{
  // Borrowed authentic values. Core never clones or freezes these.
  target: C
  standardSchemas: Readonly<{
    input: C['input']
    output: C['output']
  }>

  // Core-owned containers and cloned JSON. All are deeply frozen.
  visibility: 'root' | 'dependency'
  address: HarnessTargetAddress
  policy: MountedHarnessTargetPolicyDescriptor | null
  jsonSchemas: Readonly<{
    input: JSONSchema
    validatedInput: JSONSchema
    output: JSONSchema
    update: JSONSchema
    interrupt: JSONSchema
  }>
  targetExport: Omit<SerializedHarnessTargetExportV1, 'exportDigest'>
  exportDigest: `sha256:${string}`
  mountRevision: string
  routeBindingRevision: `sha256:${string}`
  routeBinding: HarnessTargetRouteBinding<C>
  completedEvent?: MountedHarnessCompletedEvent<C>
}>
```

The projection is the sole mounted representation shared by service-definition
export and runtime registration. `target` and `standardSchemas` are borrowed
references owned by Harness; Core must not deep-freeze, clone, wrap, or mutate
them. Core deep-clones and freezes every JSON schema before storing it and
deep-freezes only its own address, policy, export, route-binding, completed-event,
and enclosing projection containers. A root projection's policy is exact. Its
queue name is copied only after the complete mount-policy binding authenticates
through the private queue-reference WeakMap and its stored contract is the exact
root contract. Projection snapshots only that binding's frozen literal queue
name. A dependency projection always has `policy: null` and never receives queue
metadata, guards, durable policy, or a completed event.

The optional completed-event contract contains the literal event name, a
Core-owned validation-only Standard Schema over
`Extract<HarnessTargetRunOutcome<C>, { status: 'completed' }>`, and a cloned
canonical JSON Schema. It never reuses or calls the target's original output
schema or transform. The corresponding root service-definition entry is exactly
`{ ...targetExport, exportDigest }`; dependency projections retain the same
private projection fields but are never placed in callable maps.

The export digest is lowercase SHA-256 over the UTF-8 RFC 8785 canonical JSON
representation of this exact preimage:

```ts
[
  'purista.harness-target-export.v1',
  { address, target: targetExport },
]
```

Core resolves `mountRevision` once as
`options.revision ?? definition.revision ?? serviceVersion`. The route-binding
revision is lowercase SHA-256 over the UTF-8 RFC 8785
canonical JSON representation of this exact preimage:

```ts
[
  'purista.harness-target-route-revision.v1',
  {
    address,
    target: targetExport,
    exportDigest,
    visibility,
    mountRevision,
    policy,
    receiverProtocolRevision: 'purista.eventbridge-harness-receiver.v1',
  },
]
```

`policy` is the stored deterministic descriptor shown above. Guard keys are
sorted lexicographically; absent guard sets are empty arrays, and absent durable
mode, success event, or queue name are `null`. Function source, closure state,
object identity, and runtime-generated names are never hashed. An application
must supply a new explicit `options.revision` when guard or other policy behavior
changes without a service version or Harness definition revision change.

The fixed receiver protocol revision changes only when receiver routing,
validation, transformation, correlation, or terminal semantics change. Core
constructs every EventBridge route binding from the stored projection. Runtime,
service export, generated artifacts, queue integration, and invocation helpers
consume the stored fields and never re-run schema conversion or recompute either
digest.

Mounting registers every explicit root as both an aggregate and stream
EventBridge target. The public target name is exactly the definition id. Its one
stream receiver accepts the closed public-root or nested-dispatch envelope union
described in section 3; a root never gets a second internal route or address.
Mounting registers a nested-only internal stream route only for each
dependency-only target required by workflow or subagent edges. Those routes are
absent from exported service definitions and ClientBuilder and reject
application-root invocation. There is no mount `publish` setting: promotion to
a public target happens only by making the definition an explicit Harness root.
Mounting rejects public target collisions with another root or an existing
command/stream target, the same target id at conflicting logical addresses, and
ambiguous internal route identity.

The optional policy is exact and target keyed:

```ts
supportV1ServiceBuilder.mountHarness(supportHarness, {
  targets: {
    agents: {
      support: {
        beforeGuards: { authorizeAccountAccess },
        afterGuards: { protectSupportAnswer },
        successEvent: 'supportAnswerCompleted',
        queue: supportAnswerQueueBinding,
        durableResume: { identity: 'run-owner' },
      },
    },
  },
})
```

`targets`, `targets.agents`, and `targets.workflows` are optional exact maps.
Generators and examples omit an empty map instead of emitting `{}`. If every
root uses defaults, the entire policy argument is omitted. Only exact
explicit-root ids are accepted by `targets`. The option is inferred
from the Harness root contracts, so a dependency-only subagent is a compile-time
error. Dependency-only targets receive no entry from this map. `beforeGuards`
receive validated logical input. `afterGuards` receive the exact validated
`HarnessTargetRunOutcome<Contract>`, including only the interrupt variants
reachable from that root. They do not run for failed or cancelled execution. A
success event is emitted only for `completed` and its payload is that completed
outcome. Queue policy metadata may be retained in the root projection, but the
mounted runtime ignores it for aggregate, stream, and dependency routing.
The same options object may contain a nonempty explicit `revision` used only as
the mount revision described above; it grants no target or runtime capability.

`durableResume: { identity: 'run-owner' }` is the sole v4 identity override for
an explicitly guarded human-review flow. It is legal only on an explicit root
whose compiled closure can reach a `tool-approval` interruption and whose exact
policy declares at least one `beforeGuard`. The mount types reject any other
use, and erased JavaScript fails composition before schema conversion,
registration, storage, or execution. The mode adds a durable Harness storage
requirement and requires a stable `sessionId`.

On resume, Core authenticates the current reviewer, builds the request-scoped
`authorize` callback for that root's PURISTA before guards, and asks the
hosted Harness boundary to resume in `stored-run-owner` mode. Both current and
stored identities must contain nonempty `tenantId` and `principalId`, and their
`tenantId` values must match exactly. Harness validates that stored state and
tenant relationship first, restores the prior validated input, and only then
invokes the callback exactly once with the current reviewer context. Harness
rejects a cross-tenant caller, missing or invalid current or stored identity, or
identity/run mismatch before the callback and before agent, workflow, tool,
model, or other execution effects. An identity mismatch is a handled `409`, a
business-guard denial is `403`, and a storage operational failure is a sanitized
`500`.

Harness restores the immutable stored identity only inside trusted execution
scopes that must act as the original run owner: Harness storage, memory,
sandbox/workspace, portable tool context, and nested dispatcher/EventBridge
authentication metadata. A PURISTA host-tool handler and all PURISTA before and
after guards instead receive the current reviewer identity. Stored identity is
forbidden from public payloads, outcomes, handled or unhandled errors,
inspection, application-visible host context, logs, telemetry, and emitted
events. This is a data-flow restriction across trusted host code, not a claim
that the integrator package boundary is a security sandbox. Without this option,
normal trusted caller identity is projected for every invocation and resume;
Harness's ordinary immutable session-identity binding still rejects
cross-identity session reuse.

The Core transport `invocationId` is stable transport correlation and supplies
the default `sessionId`; it is not a Harness root `runId`. Harness creates or
restores the root run id. Resume `runId`, target outcomes, execution events, and
terminal correlation use that Harness-owned run id, while transport retry and
redelivery retain the independent Core invocation id.

For streaming, the hosted boundary completes input validation/restoration and
the Core `authorize` callback before it publishes the EventBridge start frame.
`openStream` waits for that start or a
handled error, so an HTTP adapter can return the normal error response before
committing SSE headers. After startup, Core forwards progressive Harness events
immediately but withholds terminal publication while it awaits the hosted
stream's authoritative frozen `result` and evaluates `afterGuards`. If they
pass, Core uses that result object for both the direct-target `run.finished`
outcome and `complete.final`. If an after guard rejects, Core derives and
freezes one sanitized failed
`HarnessTargetExecutionTerminalOutcome<Contract>` with the same run id, uses
that one object for the replacement `run.finished` and `complete.final`, and
suppresses the original Harness terminal. It does not emit an EventBridge error
frame after progressive delivery. Any adapter that transports the two terminal
representations separately must prove full RFC 8785 canonical equality before
settling the public stream.

After guards are terminal postconditions. They may prevent an aggregate result
or turn a stream's terminal status into failure, but they cannot retract content
already delivered. Business authorization that must prevent any disclosure
belongs in `beforeGuards`; incremental model-output protection belongs in
Harness output Guardrails.

HTTP remains a projection of a command or stream contract:

- aggregate access uses a command;
- progressive AI output uses a stream;
- queued work uses a native queue binding; and
- no special agent HTTP handler or generated consumer library is introduced.

The Hono package owns authentication through `protectMiddleware`: it verifies
the token and supplies trusted tenant/principal identity. Command, stream,
subscription, workflow, and mounted-target guards own business authorization.
Public endpoints are explicitly marked public. Handler errors use PURISTA
handled errors and the configured error handler rather than hand-built problem
responses.

Registering any protected endpoint without an application protection
middleware fails server startup. `protectMiddleware` authenticates: it reads,
verifies, and decrypts the credential, then sets trusted principal and tenant
identity on the request message. Target guards authorize business actions.

The only UI-facing Framework contract is transport/protocol support for the
standard AI SDK UI Message Stream v1. The versioned server-side adapter
`@purista/harness-ai-sdk-ui/v1` maps Harness execution events to that protocol
for both standalone Harness HTTP integrations and PURISTA HTTP stream
boundaries. Text and object updates, tool and subagent activity, status,
artifacts, errors, cancellation, and final outcomes use this one standard
mapping. The adapter is not a UI application, browser package, component
library, proprietary protocol, or custom consumer library.

The tutorial React UI demonstrates the protocol with `DefaultChatTransport`,
renders UI message `parts`, handles the `approval-requested` tool state with
`addToolApprovalResponse`, and may use
`lastAssistantMessageIsCompleteWithApprovalResponses` to continue after a
decision. Conformance uses the official AI SDK UI stream reader. The tutorial
UI uses AI Elements components for conversation, message, tool, prompt, and
confirmation presentation instead of custom chat primitives.

The tutorial client manifest pins the verified protocol set:
`ai@7.0.90`, `@ai-sdk/react@4.0.93`, `react@19.2.8`, and
`react-dom@19.2.8`. It initializes the default shadcn theme with
`npx shadcn@4.20.1 init --defaults`, then vendors the AI Elements 1.9.0
`conversation`, `message`, `prompt-input`, `tool`, `confirmation`, and
`sources` registry components with the pinned shadcn CLI. The checked-in generated source and lockfile
are the reproducible artifact; tutorials show these published commands. Backend
`--http stream` adds `@purista/harness-ai-sdk-ui@^4.0.0` and its tested
`ai@^7.0.0` peer for the standard Message Stream protocol. The React packages
and vendored components belong only to the optional tutorial UI scaffold, not
to PURISTA or Harness.

Approval and human input are typed interrupted outcomes, not generic
exceptions. HTTP/stream adapters emit the standard approval representation and
never convert it to an internal-server error. The authenticated AI SDK stream
endpoint decodes the UI Message Stream v1 request, uses the standard
`DefaultChatTransport` body `id` as the stable Harness session id, maps the last
user message to the agent input, and uses
`parseHarnessToolApprovalResume(...)` for approval-response parts. It reopens
the same address-first target stream with `resume`; Harness validates run,
interrupt, revision, event, and decision ids. A resume request does not also
set `idempotencyKey`. Non-chat applications may expose a separate guarded
PURISTA resume command, but the standard browser flow does not require one.

The browser always resumes the original root service target. Public outcome and
resume `runId` values identify that root invocation; child agent/run/call ids
remain correlated approval metadata resolved through durable Harness storage.
Any graph capable of tool approval or delegated interruption therefore requires
a durable storage binding before service startup.

Standalone HTTP integrations may use
`createHarnessUIMessageStreamResponse(...)`. A PURISTA stream handler uses
`parseHarnessUIMessageRequest`, opens the address-first target stream, converts
it with `createHarnessUIMessageSseEvents`, and writes those data-only events to
the PURISTA stream writer. Its metadata sets protocol
`ai-sdk-ui-message-stream-v1` and header
`x-vercel-ai-ui-message-stream: v1`. The adapter package pins AI SDK v7 for this
protocol. Conformance proves that an interrupted stream remains HTTP 200,
emits a standard approval part, accepts approval or rejection on the next
`DefaultChatTransport` request, resumes the same run, and completes.
Once an SSE response has started, a failed or cancelled Harness stream remains
HTTP 200 and the AI SDK adapter maps its sanitized terminal outcome to the
standard failure/cancellation status and finish parts defined by the Harness
protocol adapter. A failure while opening the stream, before response headers
are committed, uses the normal handled HTTP error mapping. Neither path invents
a PURISTA-specific browser event or client library.

## 6. Host-aware PURISTA tools

Ordinary users define a resource-aware Harness tool from the service builder:

```ts
const lookupTransaction = supportV1ServiceBuilder
  .defineTool('lookupTransaction', {
    description: 'Load one transaction visible to the current customer.',
    input: lookupTransactionInputSchema,
    output: lookupTransactionOutputSchema,
  })
  .canInvoke(
    'Transaction',
    '1',
    'getTransaction',
    getTransactionOutputSchema,
    getTransactionPayloadSchema,
    getTransactionParameterSchema,
  )
  .canConsumeStream(
    'Transaction',
    '1',
    'updates',
    transactionUpdateSchema,
    transactionUpdatePayloadSchema,
    transactionUpdateParameterSchema,
  )
  .canEnqueue('transactionReview', transactionReviewPayloadSchema)
  .canEmit('transactionInspected', transactionInspectedSchema)
  .setHandler(async function (context, input) {
    return context.service.Transaction['1'].getTransaction(
      { transactionId: input.transactionId },
      {},
    )
  })
```

The resulting immutable definition is placed directly in an agent's `tools`
array. `setHandler` returns that final frozen definition; there is no
`getDefinition()` step. Its exact context is:

```ts
{
  message,
  identity,
  resources,
  service,
  stream,
  queue,
  emit,
  agent,
  workflow,
  step,
  logger,
  metrics,
  signal,
  trace,
  tool: {
    sessionId,
    runId,
    toolId,
    callId,
    idempotencyKey,
    caller: HarnessExecutionCaller,
  },
}
```

The Harness-owned `HarnessExecutionCaller` is discriminated because a tool
selected by an agent has an agent owner, while a tool called directly by
workflow code does not. An agent running inside a workflow may additionally
carry that workflow id for correlation. A workflow caller never receives a
synthetic agent id. Harness model and tool events, MCP request-header context,
portable tool context, and the PURISTA host-tool projection use this same union.

The tool receives resources declared by its owning `ServiceBuilder`. Outgoing
command, stream, queue, event, agent, and workflow helpers appear only when
declared on the tool builder.

Host-tool agent/workflow clients expose aggregate `run(input, { callId })`
only. The stable call id is required within the tool invocation. Harness owns
the nested checkpoint: the same id, target, and canonically equivalent
validated input replays the completed child or resumes its interruption; reuse
with another target or input fails closed. Core builds these typed clients from
the `nestedTargets` invoker in `HarnessHostContextRequest`, so they cannot
bypass the Harness checkpoint or EventBridge dispatcher. A private Harness
child-interrupt signal suspends the root and is never mapped to a PURISTA tool
error. Parent cancellation cancels the child stream. Progressive target clients
are not exposed in host tools in v4. Authors wrap any earlier non-idempotent
side effect in `context.step(id, handler)` when a later nested call may
interrupt; unmanaged effects have the same replay limitation as unmanaged
workflow effects.
Core maps `HarnessHostContextRequest.checkpointStep` directly to
`PuristaToolContext.step`; it does not implement another step store or replay
algorithm. The function retains the existing `WorkflowContext.step` and
`DurableStepOptions` behavior.

The final host-tool definition carries a hidden brand for the originating
`ServiceBuilder` lineage. `mountHarness` accepts it only on that exact lineage
and fails composition before target registration on a mismatch. Portable tools
have no owner brand. A catalog containing a host-aware tool therefore remains
reusable only by service builders with the matching lineage.

`mountHarness` performs this composition check through the integrator-only
`assertHarnessHostToolOwner(definition, owner)` function. Harness authenticates
the definition and owner token, reads its private compiled graph, and compares
the exact owner of every host tool in stable tool-id order. The function returns
no graph or owner metadata. The hosted runtime calls the same check again before
initializing runtime resources, so the early Framework check and the runtime
boundary use one implementation.

Core creates one owner token per `ServiceBuilder` lineage and passes it through
`defineHostTool<Id, Input, Output, PuristaToolContext>(owner, ...)` from
`@purista/harness/integrator`; its handler remains embedded but absent from
inspection metadata. Core instantiates the graph with
`instantiateHostedHarness(...)`, supplying the exact
`HarnessHostBindings<PuristaHostInvocation, PuristaToolContext>` contract: its
service-builder owner token, EventBridge `HarnessTargetDispatcher`, a
pure `projectIdentity` function, a pure `projectTraceContext` function, a
per-tool-call `createHostContext` factory, service logger, and telemetry bridge.
`PuristaHostInvocation` is created by the
receiving target adapter from its trusted message and service resources; it is
opaque to Harness and never enters model input, persistence, or public
invocation parameters. The context factory binds the declared resource and
outgoing-operation helpers plus the current target/tool/session/run/root/
invocation/deadline/signal values.

Core's identity projector reads only the authenticated sender identity from the
trusted message and returns `{tenantId?,principalId?}`. Its trace projector
reads only the EventBridge/telemetry W3C carrier and returns
`{traceparent,tracestate?}`. Harness calls each projector once at hosted entry,
normalizes and freezes the result, and never inspects `PuristaHostInvocation`
itself. Projected values are absent from the service payload and cannot be
supplied by application callers. The Core dispatcher places the same trusted
identity and the current W3C trace carrier into every nested
`HarnessTargetDispatchRequest`.

Core enters Harness only through the integrator-only `runHosted`,
`streamHosted`, and `streamDispatched` methods. Public root adapters alone call
`runHosted` or `streamHosted`; each call supplies the strict fresh/resume union,
the original wire input, fresh validated input only when applicable, invocation
options with the resolved session id, the one run-scoped
`PuristaHostInvocation`, and the required Core-owned `authorize` callback.
An authenticated internal nested
receiver calls `streamDispatched` with an exact agent or workflow from the
integrator-only compiled dependency closure plus the strict fresh/resume
delivery. This is how the target adapter supplies the opaque value consumed
later by `createHostContext`; it is never placed in the public service payload
or parameter. These hosted methods verify exact contract identity and do not
repeat input validation or transformation. On resume, Harness restores
validated input and invokes the callback only after its stored-state and
same-tenant checks. Core never converts a
dependency-only target into a root contract to execute it.

Hosted `ai` configuration cannot contain logger or telemetry fields; the host
bindings replace them and Harness derives metrics from the telemetry bridge.
There are no instance-wide generic lifecycle callbacks; `authorize` is the
single request-scoped authorization seam described above. Harness closes only the clients,
processes, and internal adapters it creates and never closes Core's dispatcher,
context-factory dependencies, logger, telemetry, EventBridge, or service
resources. Service shutdown stops new target calls, shuts down the Harness
instance, and only then closes service resources and EventBridge.
Application code never supplies a host binding map. Ordinary Harness
`getInstance()` rejects graphs containing host-aware tools; focused tests use
the integrator testing surface with fake host bindings.
`getHarnessHostToolBuilder`, application-authored mount binding maps, and
`commandAsHarnessTool` are removed from normal application authoring. No tool
context exposes a general service locator or runtime registry.

Portable tools use `defineTool` from `@purista/harness`. Both kinds look
identical to the model. A model-selected call traverses the agent's validation,
permission, governance, approval, Guardrail, telemetry, and cancellation
pipeline. A direct workflow call follows the application-controlled boundary
below.

Workflows declare an exact tool array. This is the only way a workflow receives
a tool invoker:

```ts
const ingestKnowledge = defineWorkflow('ingestKnowledge', {
  input: ingestKnowledgeInputSchema,
  output: ingestKnowledgeOutputSchema,
  models: {
    embeddings: { capabilities: ['embeddings'] },
  },
  tools: [storeChunks],
  async handler(context) {
    const result = await context.models.embeddings.embed(
      { input: context.input.chunks.map(chunk => chunk.text) },
      { callId: 'embedChunks' },
    )

    await context.tools.storeChunks.run(
      { chunks: context.input.chunks, embeddings: result.embeddings },
      { callId: 'storeChunks' },
    )

    return { stored: context.input.chunks.length }
  },
})
```

`context.tools` is keyed by each tool's literal definition id; duplicate ids are
rejected and v4 adds no workflow-local aliases. Each invoker preserves the
tool's exact input/output types and requires a stable `callId`. A direct
workflow call is trusted application-controlled orchestration: Harness applies
definition identity, input/output validation, host context, identity and trace,
timeout, cancellation, correlated events, telemetry, and checkpoint/replay. It
does not borrow an agent's exposure, permission, governance, approval, or
Guardrail policy because no agent owns that call. A host-aware tool definition
is not a separate business-authorization boundary. Every guarded PURISTA command, stream, mounted
agent, or mounted workflow it invokes still enters through its address-first
client and runs that operation's own guards. Queue enqueue and event emission
remain explicit declared capabilities; authorization that must occur before
those side effects belongs in the mounted workflow root's `beforeGuards` or in
a guarded operation invoked before them. Authorization for the workflow as a
whole may therefore be declared as a before guard on that mounted workflow
root. A workflow never receives a service resource, EventBridge client, or
registry directly.

## 7. Business guards and events

Mount target policies attach typed before and after guards. Guards verify
business authorization and invariants; authentication remains an HTTP
transport responsibility. A tool definition does not acquire a synthetic
authorization boundary. An invoked guarded PURISTA operation keeps and
evaluates its own guard, and a mounted workflow root may define `beforeGuards`
for authorization that must cover the workflow and its side effects as a whole.

Successful target completion may be published as the declared command result
event. Manual emission is reserved for facts produced during execution rather
than duplicating successful command completion. Interrupted, rejected, failed,
and cancelled outcomes do not emit a success event.

`successEvent` is a literal event name. During projection, Core
deterministically derives its schema as
`Extract<HarnessTargetRunOutcome<Contract>, { status: 'completed' }>` from the
root contract. Core creates a new validation-only Standard Schema and cloned
canonical closed JSON Schema for `{ status: 'completed', runId, output }` using
the already projected `outputSchema`, freezes the optional
`completedEvent` metadata on the root projection, adds the same metadata to
service definitions, and uses it for subscription typing and export. This
schema validates and returns the already frozen completed JSON value unchanged;
it never invokes or reconstructs the target output schema's transform.
Projection checks all ordinary and mounted event names and canonical JSON
Schemas atomically. Reusing an existing event name with a different canonical
JSON Schema fails composition before instance creation, route registration, or
runtime effects. Dependency projections never have a completed event.

The completed-event contract is composition metadata only. The mounted runtime
does not register or unregister it. After a completed outcome passes all after
guards, a public root receiver makes one publication attempt using the same
authoritative frozen outcome as the event payload, aggregate result, direct
`run.finished`, and stream `complete.final` as applicable. The payload includes
the stable Harness `runId` so consumers can deduplicate. This is not an exactly-once
delivery guarantee: retrying a receiver execution after an uncertain transport
failure may publish the event again, so event consumers must be idempotent.

Interrupted, failed, cancelled, guard-replaced, or protocol-failed executions
publish no completed event. Aggregate publication failure returns a sanitized
handled `500` and never returns success. A failure after a stream has started
emits one sanitized failed direct terminal in place of the completed terminal,
settles the transport result with that same failed terminal rather than a
completed result, and publishes no success event. Publication failure can never
be reported as successful completion.

## 8. Queues and admission

Queueing is an explicit PURISTA delivery option on a root. The complete binding
uses normal queue and worker builders:

```ts
const supportAnswerQueueBinding = defineHarnessQueueBinding(
  supportHarness.contracts.agents.support,
  supportV1ServiceBuilder.getQueueBuilder(
    'support.answer',
    'Run support answers in the background',
  ),
  supportV1ServiceBuilder
    .getQueueWorkerBuilder('support.answer', 'support-answer-worker')
    .setMaxParallelHandlers(4),
)

export const supportV1Service = supportV1ServiceBuilder.mountHarness(
  supportHarness,
  {
    targets: {
      agents: {
        support: { queue: supportAnswerQueueBinding },
      },
    },
  },
)
```

Ownership is split deliberately. Canonical mounted-target projection may copy
the root policy's queue name into `targetExport` so the export digest commits to
that public capability. The P4-005 projection slice owns the pure
`defineHarnessQueueBinding` reference factory, its private WeakMap authenticity
check, and the immutable queue-name snapshot stored in an exact root projection.
It does not construct a queue, worker, queue receiver, enqueue client, retry
policy, generated remote marker, or generated client. P4-046 owns queue and
worker construction, queue delivery runtime, queue-specific service export,
generated remote queue-marker hydration, and local/generated `enqueue` clients.
The mounted aggregate/stream lifecycle consumes no queue object and never routes
`run`, `stream`, workflow, subagent, or host-tool calls through a queue.
Dependency-only projections cannot carry queue metadata.

`defineHarnessQueueBinding(contract, queueBuilder, workerBuilder)` is pure and
synchronous. It rejects different queue names or a contract/binding mismatch
before service composition and returns one frozen value with:

```ts
declare class QueuedHarnessTargetReferenceAuthenticity {
  private readonly authenticity: void
}

type QueuedHarnessTargetReference<
  C extends AnyHarnessTargetContract,
  QueueName extends string,
> = QueuedHarnessTargetReferenceAuthenticity & Readonly<{
  contract: C
  queue: Readonly<{ name: QueueName }>
}>

export type HarnessTargetQueueBinding<
  C extends AnyHarnessTargetContract,
  QueueName extends string,
  Queue = QueueDefinitionBuilder,
  Worker = QueueWorkerBuilder,
> = Readonly<{
  targetContract: C
  reference: QueuedHarnessTargetReference<C, QueueName>
  queue: Queue
  worker: Worker
}>
```

The non-exported class above contributes a compile-time private brand and no
reflectable runtime property. Core creates each reference, freezes its owned containers, preserves
`reference.contract === targetContract === C`, and records the exact reference,
contract, and queue-name tuple in a module-private `WeakMap`. That WeakMap is the
runtime authenticity boundary. Mount policy consumes the complete binding;
`canInvokeAgent(serviceName, serviceVersion, reference)` and
`canInvokeWorkflow(serviceName, serviceVersion, reference)` have explicit local
overloads for the authentic reference and validate it before declaration or
effects. A plain object, spread copy, reflected copy, different queue name,
different contract, or reference from another binding is rejected. No public
predicate, registry, mutable marker, or structural fallback exists.

The queue result is closed rather than generic: an authenticated
`QueuedHarnessTargetReference` makes the local address-first client infer
`HarnessTargetQueueEnqueueResult`. The unchanged original `C` continues to infer
only `run` and `stream`. An application, adapter, or generated contract cannot
substitute or widen the enqueue receipt type.

The queue payload is inferred from `C.$infer.input`; invocation options are the
queue parameter and never contain trusted identity. Queue integration adds those
schemas to the supplied builders and adds the queue and one generated worker
exactly once. The worker declares the immediate target
with `canInvokeAgent(serviceName, serviceVersion, C)` or
`canInvokeWorkflow(serviceName, serviceVersion, C)`, so execution returns
through EventBridge even when worker and target share a process. It calls
`client.run(message.payload, message.parameter)`. Enqueue ingress creates the
stable root invocation id and resolves the session id before writing the job;
the reserved queue envelope carries both unchanged through delivery and every
retry. The generated worker must use those values and never derive them from a
delivery id or retry attempt. A completed or interrupted outcome settles the
queue job successfully with the typed `HarnessTargetRunResult`, including the
same resolved session id. A retriable `AgentAdmissionRejectedError` with
`retryAfterMs` becomes the normal delayed `QueueRetry`; other handled or unknown
failures retain ordinary queue-worker retry, nack, and dead-letter behavior. The supplied worker's
`setMaxParallelHandlers(...)` remains the first coarse concurrency control.

Using the returned queued reference in an outgoing declaration adds enqueue
without changing aggregate or stream behavior:

```ts
const command = apiV1ServiceBuilder
  .getCommandBuilder('requestSupportAnswer', 'Queue a support answer')
  .canInvokeAgent(
    'Support',
    '1',
    supportAnswerQueueBinding.reference,
  )
  .setCommandFunction(async function ({ agent, message }) {
    return agent.Support['1'].support.enqueue(
      message.payload,
      { sessionId: message.correlationId },
      { idempotencyKey: message.id },
    )
  })
```

The returned promise resolves to exactly
`HarnessTargetQueueEnqueueResult`. If the caller omits `sessionId`, Core first
uses the stable root ingress `invocationId` as the session id, writes that value
into the reserved queue envelope, and returns it on the receipt. A later turn
or approval resume reuses the returned session id; retry and redelivery reuse
the original root invocation id as well.
Declaring the original root contract instead exposes only `run` and `stream`;
queue support never appears by inference from the target alone. The reference
is a Core declaration capability and is never passed to Harness. Direct `run`
and `stream`, workflow calls, and model-selected subagents remain EventBridge
operations and do not traverse the durable queue. Queue delivery retains
trusted identity, tracing, idempotency, retry/defer metadata, and the logical
input contract.

Harness `AgentAdmission` limits concurrent root execution trees regardless of
direct or queued entry. Descendants with the same `rootRunId` join the
reentrant reference-counted lease so a parent cannot deadlock waiting for a
child at capacity one. Parent `maxParallelSubagents` bounds fan-out. Provider
admission separately controls provider/model/credential rate windows. A queue
worker may convert `AgentAdmissionRejectedError` into a delayed retry only when
it is retriable and includes `retryAfterMs`. These are distinct controls.

## 9. Exported service definitions

`exportServiceDefinitions` adds root-only `agents` and `workflows` maps to
`ServiceDefinitions` and `FullServiceDefinition`. A dependency-only subagent is
never serialized into either callable-target map. Each root entry has this
canonical shape assembled from its frozen `MountedHarnessTargetProjection`;
the enclosing service/version supplies the rest of the address:

```ts
type SerializedHarnessTargetExportV1 = Readonly<{
  targetName: string
  kind: 'agent' | 'workflow'
  description?: string
  inputSchema: JSONSchema
  validatedInputSchema: JSONSchema
  outputSchema: JSONSchema
  updateSchema: JSONSchema
  interruptSchema: JSONSchema
  invocation: Readonly<{
    aggregate: true
    stream: true
    resumableInterrupts: readonly HarnessInterruptKind[]
  }>
  stream: Readonly<{
    protocol: 'harness-execution-events-v1'
    eventTypes: typeof harnessExecutionEventTypesV1
    outputUpdates: readonly ('text-delta' | 'object-snapshot')[]
  }>
  queue?: Readonly<{ name: string }>
  exportDigest: `sha256:${string}`
}>
```

`SerializedHarnessTargetExportV1` is closed, plain JSON. It contains no
Standard Schema wrapper, validator, transform, brand, target contract, handler,
or borrowed object reference. The five schema members are canonical JSON Schema
values cloned into the projection. `queue` is present only for an exact explicit
root queue binding and is absent from every dependency projection and every
unbound root.

The service export also includes one sanitized, non-callable composition view:

```ts
type MountedHarnessDefinition = Readonly<{
  name: string
  roots: Readonly<{
    agents: readonly string[]
    workflows: readonly string[]
  }>
  dependencies: Readonly<{
    tools: readonly string[]
    skills: readonly string[]
    mcpServers: readonly string[]
    agents: readonly string[]
    workflows: readonly string[]
  }>
}>

type ServiceDefinitions = Readonly<{
  // existing service metadata and root-only agents/workflows maps
  harness?: MountedHarnessDefinition
}>
```

`roots` is identical to the keys in the callable maps. `dependencies` lists the
sanitized recursive closure excluding those roots. These arrays support
architecture inspection only: they carry no schemas, addresses, handlers, or
invocation rights, and ClientBuilder does not create clients from them.

Projection copies the frozen `harnessExecutionEventTypesV1` inventory from
Harness for every target. It derives `outputUpdates` and
`resumableInterrupts` only from that exact contract: `updates: 'none'` becomes
`[]`; otherwise it becomes the one-element array `[contract.updates]`. File
artifacts and progress remain ordinary `output.file` and `output.progress`
execution event types and are never listed as target output-update modes.
`HarnessInterruptKind` and the exact contract `$infer.interrupt` relation are
imported from Harness; Core does not declare a parallel interrupt vocabulary or
widen every target to all interrupt kinds.

`mergeServiceDefinition`, `mergeIntoServiceDefinition`,
`ServiceBuilder.getFullServiceDefinition`, JSON export, and architecture
inspection preserve these maps. Projection obtains `inputSchema` from
`contract.input['~standard'].jsonSchema.input({ target: 'draft-2020-12' })`
and `validatedInputSchema` from
`contract.input['~standard'].jsonSchema.output({ target: 'draft-2020-12' })`.
It obtains `outputSchema` from
`contract.output['~standard'].jsonSchema.output({ target: 'draft-2020-12' })`.
The input direction therefore describes `InferIn` values accepted at the
public boundary, while the output direction describes validated `Infer`
values. `updateSchema` is the JSON Schema for the exact `$infer.update` value;
`updates: 'none'` uses the always-invalid JSON Schema `false` for `never`.
`interruptSchema` is the JSON Schema for the exact reachable
`$infer.interrupt` union and likewise uses `false` when no interruption is
reachable. Missing JSON Schema support or conversion failure aborts service
composition and projection atomically. Projection computes `exportDigest` only
after this closed addressed export is complete, using section 5's canonical
preimage. `getFullServiceDefinition()` consumes the already frozen projection
and never returns validator functions. It, merge helpers, JSON export,
architecture inspection, generated artifacts, and mounted runtime serialize or
consume stored fields and never resolve a schema or compute a digest again.

Representation ownership is fixed: Harness owns authentic target contracts and
the private compiled closure; the P4-005 Core projection layer owns
`MountedHarnessTargetProjection`, canonical JSON Schema conversion,
`targetExport`, `exportDigest`, `routeBindingRevision`, and completed-event
contracts, plus the pure `QueuedHarnessTargetReference` factory/authenticity
record and queue-name projection snapshot; the P4-004 mounted runtime only
validates and executes those projections; and P4-046 queue integration only consumes exact root projection
metadata to construct queue runtime, queue-specific exports, and enqueue
clients. P4-004 ignores queue metadata for routing and never gives root policy
to a dependency. No layer defines a parallel target, outcome, event, schema,
digest, route, or queue-receipt representation.

The prerequisite Harness remediation must include its public `RunRecord` and
creation/finalization storage request types, strict stored-record validator,
in-memory and SQLite adapters, fake storage, hosted runtime, and their runtime,
type, and adapter-conformance tests. For `kind:'agent'|'workflow'`, creation
requires both canonical wire `input` and the once-transformed deeply frozen
`validatedInput`; both remain immutable across acquisition, interruption,
terminalization, exact retry, and replay. Child-task records retain their own
existing input contract and forbid this root `validatedInput` field. Every
adapter must persist, clone, validate, and return the field identically; no
adapter may synthesize it during a read or resume. The implementation plan must
own those storage paths in the same prerequisite ticket as the hosted
authorizer/replay change so Core never integrates against a partial record
contract.

ClientBuilder generates the branded target-contract artifact plus the
address-first typed `agent` or `workflow` namespace for each explicit root. It
regenerates both atomically from the same export and digest and never generates
HTTP routes or clients for dependency metadata.

It never exports prompts, Skill files, tool handlers, resources, credentials,
provider configuration, MCP authentication, sandbox references, memory, or
conversation content.

## 10. File and dependency structure

```text
src/
├── service/support/v1/
│   ├── supportV1ServiceBuilder.ts
│   ├── supportV1Service.ts
│   ├── contract/
│   ├── command/
│   ├── subscription/
│   ├── stream/
│   └── harness/
│       ├── supportHarness.ts
│       ├── catalog/<catalogName>/<catalogName>Catalog.ts
│       ├── agent/<agentName>/<agentName>Agent.ts
│       ├── agent/<agentName>/<agentName>Agent.test.ts
│       ├── workflow/<workflowName>/<workflowName>Workflow.ts
│       ├── workflow/<workflowName>/<workflowName>Workflow.test.ts
│       ├── tool/<toolName>/<toolName>Tool.ts
│       ├── tool/<toolName>/<toolName>Tool.test.ts
│       ├── skill/<skill-name>/<skillName>Skill.ts
│       ├── skill/<skill-name>/SKILL.md
│       ├── skill/<skill-name>/<skillName>Skill.test.ts
│       ├── mcp/<serverName>/<serverName>Mcp.ts
│       └── mcp/<serverName>/<serverName>Mcp.test.ts
└── generated/purista/support/v1/harness/
    ├── agent/supportTargetContract.ts
    └── workflow/<target-kebab>TargetContract.ts
```

The import graph is a directed set of layers:

1. `contract/**` owns producer schemas shared within the service and imports no
   builder or runtime module. `generated/**` is a separate consumer-side layer
   generated only from serialized service exports; it never imports
   `service/**`.
2. `supportV1ServiceBuilder.ts` owns service info and resource types. It may
   import `contract/**` but never imports commands, tools, agents, workflows,
   catalogs, the Harness, or the final service.
3. Host-aware tool files import the base builder and contract-only modules.
4. Agent and workflow files import schemas, tools, Skills, MCP definitions, and
   lower-level agent definitions through direct files. They never import the
   Harness or final service. Agent-to-agent cycles fail Harness compilation.
5. Catalog files import definitions they package. `supportHarness.ts` imports
   catalog and target definitions and selects roots.
6. `supportV1Service.ts` is the composition root. It imports the base builder,
   command/subscription/stream definitions, and Harness, then calls
   `mountHarness(...)` once.

A same-service command, stream, subscription, or queue worker that invokes a
mounted target imports the Harness root-contract view; it never imports an
agent/workflow implementation or runtime instance. A different service imports
only its generated nominally authenticated target contract under
`generated/**`. The base
builder imports neither consumer, so both paths remain acyclic. No consumer
imports another service's builder, dependency closure, Harness composition, or
runtime.

Only required directories exist; generators do not create empty placeholders
or service-local barrel files. Tests are colocated. Cross-service schemas and
contracts live only in builder-free generated artifacts. Every
model-selectable subagent is part of the same Harness graph and service version;
it is internal unless explicitly promoted to a root. Cross-service agent calls
are application-controlled address-first calls to exported roots in this
release.

## 11. CLI and generated applications

The CLI supports `purista add harness`, `purista add agent`,
`purista add workflow`, `purista add tool`, `purista add skill`, and
`purista add mcp`.

`purista add agent` is the beginner path. It asks for service/version/name,
creates the service-owned Harness folder when absent, emits a minimal string
agent and deterministic test, adds it to the Harness, mounts the Harness when
needed, and adds public package dependencies. Other generators add one focused
definition and test. The deterministic v4 command contract and flags are
defined in the companion Harness spec; agent definitions always support both
aggregate and stream, while `--http none|command|stream` chooses only an HTTP
projection.

The default Harness name is the lower-camel service name. `add agent` and
`add workflow` create and mount it when absent and add their definition as a
root. `add tool --kind portable|purista`, `add skill`, and `add mcp` create
reusable leaf definitions but do not add them to a Harness or grant them; a
later typed agent/workflow reference brings them into the dependency closure.
The CLI never emits `.addTool(...)`, `.addSkill(...)`, or `.addMcpServer(...)`.
Agent, workflow, tool, Skill, and MCP tests use the colocated filenames in
section 10. An empty
Harness command creates no test.

`--http command` creates protected target `run<AgentPascal>` in
`command/run<AgentPascal>/run<AgentPascal>CommandBuilder.ts`, exposes
`POST ai/<agent-kebab>`, accepts `{ input: string, sessionId?: string }`, and
returns `{ sessionId, outcome }`. The returned session id is the supplied value
or the root invocation id that Core created before dispatch. A colocated builder
test mocks the address-first client and covers input/session, generated-session
reuse, and interrupted outcomes. `--http stream` creates protected target
`stream<AgentPascal>` in
`stream/stream<AgentPascal>/stream<AgentPascal>StreamBuilder.ts`, exposes the
same POST path, parses an AI SDK UI request, invokes the address-first agent
stream with the request's standard transport `id` as `sessionId`, and writes AI
SDK UI v1 SSE events. Its colocated test covers message mapping, stable transport
id/session reuse, v1 metadata/events, cancellation, and approval resume. The CLI never marks these public and
reports that the Hono server needs `setProtectMiddleware(...)` before startup.
The distinct wrapper target cannot collide with the mounted agent id.

Existing files or duplicate ids fail before mutation. Canonical generated
Harness composition is updated with AST edits. Noncanonical service composition
is not rewritten: the CLI makes no partial graph change and prints the exact
manual composition required. The release package map uses
`@purista/harness@^4.0.0`; the standard first-agent path also installs
`@purista/harness-openai@^4.0.0`, adds `OPENAI_API_KEY` to `.env.example`, and
adds the canonical additive `ai.model` bootstrap. Generated wrappers use
`canInvokeAgent(serviceName, serviceVersion, contract)` without a repeated
target string. Generated tests use
`@purista/harness/testing` and need no credentials.

Generated projects use published-package installation commands and never
workspace links or copied packages. `starter`, `create-purista`, and all
maintained examples use the same structure and APIs.

This clean break releases `create-purista@3.0.0`. Reproducible tutorial setup
uses its published pinned form:

```sh
npm create purista@3.0.0 example-bank -- --runtime node --event-bridge default --non-interactive --defaults
```

Release order is fixed: publish Harness v4; converge, verify, and publish all
public PURISTA packages at `4.0.0`; publish `create-purista@3.0.0`; then
regenerate downstream and tutorial lockfiles from the public npm registry. A
local workspace link, copied package, tarball substitution, or unpublished
version never counts as registry-clean tutorial or generated-project evidence.
Merge, tag, and publish remain explicit repository-owner actions.

## 12. Error and outcome mapping

Core and Hono use one mapping:

| Harness result | PURISTA/HTTP behavior |
| --- | --- |
| schema or invocation validation | handled `400` |
| missing addressed target | handled `404` |
| target export digest, durable revision, replay, idempotency, session-identity, or stored-run-owner tenant/identity conflict | handled `409` |
| business guard, permission, or policy denial | handled `403` |
| agent or model admission rejection | handled `429` with retry metadata |
| timeout or expired deadline | handled `504` |
| interrupted outcome | successful typed outcome / HTTP `200`, never an error |
| stream cancellation | stream cancel terminal behavior |
| durable storage operational failure | sanitized handled `500` |
| unknown internal failure | sanitized handled `500` |

Thrown application `HandledError` values retain their declared safe status and
data. Unknown provider or tool details are not exposed.

## 13. Testing and clean removal

Core tests cover mount lifecycle; additive `ai.model` plus `ai.models`
inference; optional production `storage` and `memory` upgrades; aggregate and
stream root registration; dependency-only non-public `streamDispatched` routes;
authentic `visitHostedHarnessTargets` traversal with exact one-projection-per-
target cardinality; visitor failure propagation; empty-graph rejection; proof
that an honestly retained callback entry exposes no graph, index, lookup,
mutable registry, handler, or tool; root/dependency classification by original
contract identity; canonical Standard and JSON Schema projection; proof that
borrowed targets and Standard Schemas are neither cloned nor frozen while every
Core-owned container and cloned JSON value is deeply frozen; fixed export-digest
and route-revision preimages including resolved mount revision, the complete
deterministic policy descriptor, and the receiver protocol revision; revision
changes for every address/schema/visibility/policy input and an explicit
mount-revision bump when function behavior changes; proof that export, runtime,
generated clients, and queues consume the same frozen projection without
recomputation; EventBridge-only
workflow, subagent, and host-tool nested dispatch; identity and trace
propagation; stable root invocation/session creation before direct dispatch and
enqueue; proof that Core transport invocation id and Harness root run id remain
distinct and correctly correlated; unchanged identity across transport retry,
queue retry, and approval resume; returned session reuse on later turns;
ordinary cross-identity session rejection; strict hosted root fresh/resume union
validation with `wireInput` on both branches, validated `input` on fresh only,
and an own resume `idempotencyKey: undefined` rejected before effects; proof
that current-caller and stored-run-owner resumes both validate run/session/
target/wire/continuation, restore the identical deeply frozen validated input,
and invoke the exact `{delivery,target,input}` authorizer with no host invocation
or stored identity argument; exact authorizer ordering after stored-state and
identity checks but before execution effects/start events; post-authorization
abort/deadline recheck; terminal approval replay that re-reads the authorized
terminal revision and receipt, returns lease-free, and performs no execution,
event, or transform; nonterminal atomic acquire-run revision/checkpoint CAS
where a losing request may authorize but never executes; unchanged
`HandledError` propagation
and sanitized unknown authorizer errors; compile-time and erased-JavaScript
rejection of `stored-run-owner` on a dependency, a root without reachable
tool-approval, or a root without a before guard; `stored-run-owner` resume with
the current reviewer in PURISTA guards and host-tool context, stored identity in
Harness storage/memory/sandbox/portable-tool and nested-dispatch authentication
scopes, exact tenant match, nonempty current and stored tenant/principal ids,
and cross-tenant/missing/invalid stored-identity rejection before execution;
deep absence of stored identity from public payloads, outcomes, errors,
inspection, logs, telemetry, and events, with exact `409`/`403`/sanitized `500`
mapping; cancellation; pure queue-reference creation and frozen projection
snapshot; exact `reference.contract === targetContract` identity and queue-name
parity; plain/spread/reflected binding or reference, wrong-name, wrong-contract,
and cross-binding reference rejection before declaration or effects;
original-contract run/stream-only
clients versus reference-derived enqueue; generated nominal queued/unqueued
capability parity with no structural `{queue}` capability; queues; business guards; completed-event schema
collision and one publication attempt per receiver execution only after
completed outcomes pass after guards; validation-only completed schema with no
output-transform re-entry; stable run-id payload and consumer deduplication
across possible retry redelivery; aggregate publication failure with no success
and post-start stream publication failure replacing completion with one failed
terminal;
host-aware agent and workflow tool context inference; approval/resume;
validation and before-guard rejection before stream start; after-guard terminal
replacement without buffering progressive output; AI SDK UI stream conformance;
root-versus-dependency inspection/export; CLI snapshots; and fresh generated
project installation. ClientBuilder tests snapshot the canonical generated
artifact path, builder-free imports, deterministic RFC 8785 digest, and exact
root contract types. Cross-process tests prove address plus matching digest
dispatches to the receiver-local root, while an altered address, stale digest,
or modified generated schema fails before business or model effects and no
hidden identity or brand appears on the wire. Nested cross-process tests prove
that a dependency-only target enters only through `streamDispatched`; a root
aggregate receiver rejects nested envelopes; and a root's one stream address
routes a public closed envelope to `streamHosted` with root policy while routing
a nested closed envelope to `streamDispatched` without guards, success event,
queue, or durable policy. There is no second root address. Malformed, ambiguous,
or mixed envelopes fail before effects, and same-id route collisions fail
composition. Stream transport
tests derive completion from `dispatchStream.result` and reject terminal event
versus `complete.final` pairs that share run id and status but differ anywhere
else in their RFC 8785 canonical representation. Failure-matrix tests cover
malformed or wrong-kind root/nested envelopes, digest and address mismatch,
fresh versus resume validation and transform counts, identity/trace/deadline/
cancellation propagation, direct versus descendant correlation, missing/
duplicate/post-terminal frames, completed/interrupted/failed/cancelled terminal
outcomes on aggregate and stream roots, internal dependency interruption and
resume, partial-registration rollback, absence of completed-event runtime
registration, and idempotent shutdown ordering. Generated-contract tests
distinguish raw `SerializedHarnessTargetExportV1` JSON from the three concrete
validation-only Standard Schema witnesses, use asymmetric wire and
validated-input types, prove each wrapper returns the identical JSON value
without transform, coercion, or defaults, and prove only the producer receiver invokes its input
transform exactly once. They also prove that output schema/value, update mode/
value, and interrupt tuple/value mismatches fail at the remote factory type
boundary without a handwritten inference escape hatch, that each witness
matches its serialized schema, and that malformed queue presence/name fails
hydration.

Harness storage conformance tests cover agent and workflow creation with exact
wire and validated inputs; deep freezing and readback in memory, SQLite, and
fake adapters; missing, malformed, mutable, or changed validated input; exact
create/acquire/finalize retry; nonterminal resume CAS; and terminal approval
replay after restart. They prove the authorizer always receives the persisted
validated value, terminal replay performs no lease acquisition or new event,
and stored-run-owner execution scopes still receive the stored identity while
the authorizer, host tools, and Core guards receive the current reviewer.

Compile-time tests prove that root contracts expose exact `$infer.input`,
`validatedInput`, `output`, `update`, and `interrupt` types; clients preserve
the Harness target outcome/event projections; a dependency-only target cannot
be declared, guarded, queued, exported, or generated as an application client;
the integrator visitor retains the exact compiled target union without exposing
the graph or appearing at the Harness root entrypoint; mounted projections
retain the exact borrowed target/Standard Schema types and completed-outcome
contract while dependency projections cannot carry root policy or queue
metadata; generated remote contracts derive exact `input`, `validatedInput`,
`output`, `update`, and `interrupt` phantom inference from three concrete schema
witnesses without recreating a producer transform or accepting caller-supplied
inference, and reject every output/update/interrupt mismatch;
`HostedTargetAuthorizer` exposes only the exact frozen authorization request,
fresh requests require input, resume requests forbid it and any own
idempotency-key property, and local queue references retain exact contract and
queue-name inference while copies cannot satisfy the authentic builder
overload; workflow tools expose only declared
literal ids and exact types; and invalid
model/storage/memory configurations fail where expected. They also require the
exact nested ancestry XOR: an agent parent forbids `parentWorkflowId`, a
workflow parent forbids `parentAgentId`, and neither missing nor dual parent ids
compile. Runtime tests fail if a same-process child call bypasses EventBridge,
if a nested envelope is sent to an aggregate hosted entry point, if either
branch of a dual-envelope root stream reaches the wrong hosted entry point or
inherits the wrong policy, or if any registry/string lookup can grant an
undeclared capability. Import-cycle tests
fail when generated contracts import `service/**` or when a producer imports
`generated/**`.

The release removes the former attached-agent builders and generated target
expansion, `AgentQueueBuilder`, raw Harness merging, top-level
`src/harness/<service>` guidance, `defineHarnessModule`, `BuilderState`-based
application code, `.define()`, `.build()`, custom agent handlers,
`getHarnessHostToolBuilder`, normal-use manual host-tool bindings, and every
public tool/Skill/agent registry, Harness `.addTool(...)`, `.addSkill(...)`, or
`.addMcpServer(...)`, direct local target fallback, four-argument
`canInvokeAgent`/`canInvokeWorkflow` call, compatibility shim, or stale
generated artifact.

Migration pages show concise before/after source changes. No compatibility or
migration behavior exists in Core or Harness runtime code.

Completion requires aligned Harness/Core implementation, providers/adapters,
CLI, starter, create-purista, every example, Framework and Harness
handbooks, API reference, migration pages, tutorial prose and runnable banking
source, navigation/cards/diagrams, package-install proofs, canonical Skills and
mirrors, generated site output, audits, type/unit/integration/conformance tests,
cycle checks, and removed-pattern scans.

## 14. Tutorial and documentation acceptance

`examples/banking/tutorial/course.json` is the canonical tutorial manifest. Its
capability-first order remains: project, Hono, static UI, REST commands,
database resource, authentication, StateStore sessions, business guards,
transforms, external resources, result events, subscriptions, streams, queues,
schedules, observability, distributed runtime, then the AI section
(`classification-agent` through `agent-evaluation`). Banking supplies one small
coherent example; page titles, goals, and explanations teach Framework
capabilities.

Every chapter is independently usable and split into short setup, build, run,
and testing pages. Each page states the learning goal, shows the CLI command,
explains every new file and important line in easy English, applies only the
code introduced so far, and ends with an observable checkpoint. Commands,
subscriptions, streams, queue workers, guards, transforms, resources, agents,
workflows, and adapters include framework-level tests with typed context mocks.
Required services use `compose.yaml`; the demo UI uses React, shadcn default
theme, AI Elements, and AI SDK `useChat` without custom chat components.

The RAG chapter is one complete Harness-based path:

1. a PURISTA ingestion command obtains approved source content;
2. a Harness workflow uses a declared embeddings model;
3. a declared host-aware workflow tool stores chunks, metadata, and embeddings
   through a database/vector resource;
4. a host-aware retrieval tool queries that resource with trusted tenant data;
5. the answer agent receives the retrieval tool and the model chooses when to
   call it;
6. a command and stream expose aggregate and AI SDK UI v1 responses;
7. the UI renders citations, status, streaming text, tool activity, and
   approvals; and
8. tests cover chunking/embedding persistence, resource mocking, retrieval
   authorization, model-selected tool calls, no-result behavior, streamed
   answers, approval/resume, and an end-to-end local run.

StateStore is used only for session-like application state. Transactions,
knowledge chunks, embeddings, and business records use database resources.

Documentation ownership is explicit: Harness concepts and standalone examples
live in the Harness handbook/API; PURISTA mounting, address-first invocation,
authentication/authorization, host tools, HTTP, queueing, and testing live in
the Framework handbook/API; worked construction lives in Tutorials. The
Harness adapter reference documents `@purista/harness-ai-sdk-ui/v1` as a
server-side standard-protocol boundary, Framework HTTP examples demonstrate
calling that adapter, and only the tutorial owns a React/AI Elements application
UI. The
release updates website navigation and cards, handbook source, all code blocks,
generated TypeDoc/API output, migration pages, `examples/**`,
`examples/banking/tutorial/**`, CLI blueprints, starter/create-purista, and
canonical `purista/skills/**` plus mirrors. Public install snippets use npm
package names and release versions, never workspace links or copied packages.

Removal audits are scoped to authoring surfaces and use allowlists for migration
before-examples, internal implementation names, and negative fixtures. They
fail on recommended uses of `defineHarnessModule`, `HarnessModuleBuilder`,
public `BuilderState`, terminal Harness `.define()`/`.build()`, custom agent
handlers, top-level `src/harness`, `getHarnessHostToolBuilder`, manual host-tool
binding maps, mounted-target `publish` policies, Harness `.addTool(...)`,
`.addSkill(...)`, `.addMcpServer(...)`, direct target execution inside a
PURISTA service, or public mutable registries.

`scripts/check-harness-v4-authoring.mjs` owns that audit. It scans source and
documentation extensions under `packages/**`, `examples/**`,
`web/src/content/**`, `skills/**`, and the sibling `starter`, `create-purista`,
and `ai-harness` repositories. For `ai-harness`, it scans
`packages/**`, `examples/**`, `specs/**`, and root public Markdown files. It
excludes `node_modules`, `dist`, generated
coverage, `web/src/content/migration/**`, and the single negative fixture
`packages/harness/type-tests/removed-v3-api.ts`. TypeScript checks use the AST
for removed imports/exports, agent `handler` properties, mount `publish`
properties, and terminal calls on a `defineHarness` chain; prose checks use
fenced-code parsing. Internal compiler type names and unrelated `.build()` or
`.define()` methods are not findings. The allowlist is a checked constant in
the script and additions require a test fixture.
