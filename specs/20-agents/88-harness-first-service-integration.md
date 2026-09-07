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
Bedrock, Azure, storage, memory, sandbox, MCP transport, and UI adapters remain
separate application-selected packages. Release verification first packs and
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

## 4. Address-first agents and workflows

Each explicit Harness agent or workflow root has the normal public
service/version/target address. Each executable dependency needed for workflow
or subagent dispatch also has an exact Core-owned internal route. All PURISTA
root calls, workflow calls, model-selected subagent calls, and host-tool nested
target calls go through EventBridge, including same-service and same-process
calls. No client, dispatcher, workflow, tool, or mount runtime has a direct
local-execution fallback.

Portable and host-aware model tool handlers execute inside the receiving
Harness run; PURISTA operations declared by a host-aware tool use EventBridge.
The receiver is the input trust boundary. It validates and transforms the raw
logical input exactly once with the mounted target contract, applies root target
business guards to that validated value, executes the Harness target, validates
the outcome, and applies after guards. The EventBridge dispatcher transports
raw logical input and never validates or transforms it. The hosted Harness entry
points receive the already validated value, verify the exact contract identity,
and do not run input validation or transformation again.

The Framework propagates trusted tenant id, principal id, trace/correlation
context, deadlines, session/run ancestry, idempotency, and handled errors.
Stream and nested-agent cancellation propagate through EventBridge stream
control. Aggregate `run` propagates its deadline, but caller-side cancellation
after dispatch is not guaranteed by an EventBridge adapter that lacks
cancellable command invocation. Model input cannot supply or replace identity.

Application-controlled calls retain declaration-first builder methods:

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
derives the child result from the terminal outcome. It has no direct local
execution fallback. Stream control carries cancellation. Trusted identity,
lineage, budgets, and deadline are added by Core and cannot be supplied by the
model.

The Core dispatcher owns an immutable binding table keyed by each contract's
hidden Harness identity. Mount compilation binds each executable contract in
the private completed dependency closure to one service/version/target route.
Only explicit root contracts are exposed for application declarations, service
metadata, and generated clients. Builder declarations such as
`canInvokeAgent` and `canInvokeWorkflow` add their exact remote root-contract
identity and address. An unknown or structurally copied contract fails before
EventBridge dispatch; routing never falls back to `(kind, id)` strings.

An internal-only child route accepts only a Core-authored nested dispatch
envelope carrying the exact compiled contract identity. It rejects ordinary
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
approval event id. Aggregate EventBridge replies contain the exact
`HarnessTargetRunOutcome<Contract>` imported from Harness; failed and cancelled
aggregate execution rejects and follows the handled-error mapping in section
12. Once a stream passes input validation, before guards, and Harness startup,
it relays the exact `HarnessTargetExecutionEvent<Contract>` and includes one
terminal `run.finished`. Validation, before-guard, and startup failures occur
before `run.started` and use the normal EventBridge stream error; they do not
manufacture a Harness run id or terminal event. The EventBridge
`complete.final` value is the same
`HarnessTargetExecutionTerminalOutcome<Contract>` carried by that terminal
event, including sanitized `failed` and `cancelled` variants.

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
  cancel(reason?: string): Promise<void>
}

interface HarnessTargetClient<C extends AnyHarnessTargetContract> {
  run(
    input: C['$infer']['input'],
    options?: HarnessInvocationParameter,
  ): Promise<HarnessTargetRunOutcome<C>>
  stream(
    input: C['$infer']['input'],
    options?: HarnessInvocationParameter,
  ): Promise<HarnessExecutionStream<C>>
}
```

Internally the corresponding EventBridge handle is typed as
`StreamHandle<HarnessTargetExecutionEvent<C>,
HarnessTargetExecutionTerminalOutcome<C>>`. These three public Harness
projections preserve the root contract's exact update and reachable-interrupt
types. The client verifies that the terminal event and `complete.final` have
the same run id and status before ending iteration.

Nested dispatch adds a reserved internal transport envelope beside the logical
payload and public invocation parameter:

```ts
type HarnessDispatchContext = Readonly<{
  rootRunId: string
  parentRunId: string
  parentAgentId?: string
  parentWorkflowId?: string
  invocationId: string
  depth: number
  remainingDepth: number
  deadline?: number
}>
```

Core alone serializes and validates this envelope. The receiver reconstructs
the Harness dispatch request from it and EventBridge identity/trace headers,
then validates and transforms the raw logical payload exactly once before
calling `runHosted` or `streamHosted`. It is never passed to a model, accepted
from HTTP input, or exposed as a command payload/parameter schema. Harness emits
parent correlation on child execution events before Core relays them.

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

Mounting registers every explicit root as both an aggregate and stream
EventBridge target. The public target name is exactly the definition id. It also
registers the minimum internal routes required by workflow and subagent edges.
Those routes are absent from exported service definitions and ClientBuilder and
reject application-root invocation. There is no mount `publish` setting:
promotion to a public target happens only by making the definition an explicit
Harness root. Mounting rejects public target collisions with another root or an
existing command/stream target and rejects ambiguous internal route identity.

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
    workflows: {},
  },
})
```

Only exact explicit-root ids are accepted by `targets`. The option is inferred
from the Harness root contracts, so a dependency-only subagent is a compile-time
error. `beforeGuards` receive validated logical input. `afterGuards` receive the
exact validated `HarnessTargetRunOutcome<Contract>`, including only the
interrupt variants reachable from that root. They do not run for failed or
cancelled execution. A success event is emitted only for `completed` and its
payload is that completed outcome. The queue binding adds explicit typed enqueue
support; it does not change direct run/stream routing.

`durableResume: { identity: 'run-owner' }` is the sole v4 identity override for
an explicitly guarded human-review flow. It adds a durable Harness storage
requirement and requires a stable `sessionId`. On resume, Harness reopens with
the immutable tenant/principal identity that owns the stored run while PURISTA
still supplies the current authenticated caller to before/after guards and
host-aware tools. Core rejects a cross-tenant resume before Harness execution.
Without this option, normal trusted caller identity is projected for every
invocation and resume.

For streaming, Core completes input validation and `beforeGuards` before it
publishes the EventBridge start frame. `openStream` waits for that start or a
handled error, so an HTTP adapter can return the normal error response before
committing SSE headers. After startup, Core forwards progressive Harness events
immediately but withholds the Harness `run.finished` event and
`complete.final` while it evaluates `afterGuards`. If they pass, Core forwards
that terminal event and the identical final value. If an after guard rejects,
Core suppresses the Harness terminal, emits one replacement `run.finished`
with the same run id and a sanitized failed
`HarnessTargetExecutionTerminalOutcome<Contract>`, and uses that exact value
for `complete.final`. It does not emit an EventBridge error frame after
progressive delivery.

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

The browser projection is AI SDK UI Message Stream v1. Text and object updates,
tool and subagent activity, status, artifacts, errors, cancellation, and final
outcomes use the standard adapter. AI Elements and AI SDK clients work without
a PURISTA browser package.

The reference React client uses `DefaultChatTransport`, renders UI message
`parts`, handles the `approval-requested` tool state with
`addToolApprovalResponse`, and may use
`lastAssistantMessageIsCompleteWithApprovalResponses` to continue after a
decision. Conformance uses the official AI SDK UI stream reader. The maintained
UI uses AI Elements components for conversation, message, tool, prompt, and
confirmation presentation instead of custom chat primitives.

The reference client manifest pins the verified protocol set:
`ai@7.0.90`, `@ai-sdk/react@4.0.15`, `react@19.2.8`, and
`react-dom@19.2.8`. It initializes the default shadcn theme with
`npx shadcn@4.20.1 init --defaults`, then vendors `conversation`, `message`,
`prompt-input`, `tool`, `confirmation`, and `sources` with
`npx ai-elements@1.9.0 add ...`. The checked-in generated source and lockfile
are the reproducible artifact; tutorials show these published commands. Backend
`--http stream` adds `@purista/harness-ai-sdk-ui@^4.0.0` and `ai@^7.0.0`; the
React packages and vendored components belong to the optional UI scaffold.

Approval and human input are typed interrupted outcomes, not generic
exceptions. HTTP/stream adapters emit the standard approval representation and
never convert it to an internal-server error. The authenticated AI SDK stream
endpoint decodes the UI Message Stream v1 request, maps the last user message to
the agent input and stable session, and uses
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
  tool: { sessionId, runId, agentId, toolId, callId, idempotencyKey },
}
```

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

Core enters Harness only through the integrator-only `runHosted` and
`streamHosted` methods. Each call supplies the mounted target contract,
validated logical input, invocation options with session id, and the one
run-scoped `PuristaHostInvocation`. This is how the target adapter supplies the
opaque value consumed later by `createHostContext`; it is never placed in the
public service payload or parameter. These hosted methods verify the mounted
contract identity but do not validate or transform the logical input again.

Hosted `ai` configuration cannot contain logger or telemetry fields; the host
bindings replace them and Harness derives metrics from the telemetry bridge.
There are no generic lifecycle callbacks. Harness closes only the clients,
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
identical to the model and traverse the same validation, permission,
governance, approval, Guardrail, telemetry, and cancellation pipeline.

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
tool's exact input/output types and requires a stable `callId`. It runs through
the same Harness validation, checkpoint, permission, approval, Guardrail,
telemetry, cancellation, and error pipeline as a model-selected tool. A
host-aware tool receives only the PURISTA resources and address-first helpers
declared on its service builder. A workflow never receives a service resource,
EventBridge client, or registry directly.

## 7. Business guards and events

Mount target policies attach typed before and after guards. Guards verify
business authorization and invariants; authentication remains an HTTP
transport responsibility.

Successful target completion may be published as the declared command result
event. Manual emission is reserved for facts produced during execution rather
than duplicating successful command completion. Interrupted, rejected, failed,
and cancelled outcomes do not emit a success event.

`successEvent` is a literal event name. Core deterministically derives its
schema as
`Extract<HarnessTargetRunOutcome<Contract>, { status: 'completed' }>` from the
root contract, adds the resulting event contract to service definitions, and
uses that same schema for subscription typing and export. Reusing an existing
event name with a different canonical JSON Schema fails mount composition
before registration.

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

`defineHarnessQueueBinding(contract, queueBuilder, workerBuilder)` is pure and
synchronous. It rejects different queue names or a contract/binding mismatch
before service composition and returns one frozen value with:

```ts
type HarnessTargetQueueBinding<
  C extends AnyHarnessTargetContract,
  Queue = QueueDefinitionBuilder,
  Worker = QueueWorkerBuilder,
> = Readonly<{
  targetContract: C
  contract: C & Readonly<{
    queue: Readonly<{ name: string }>
  }>
  queue: Queue
  worker: Worker
}>
```

The queue payload is inferred from `C.$infer.input`; invocation options are the
queue parameter and never contain trusted identity. Mounting adds those schemas
to the supplied builders and adds the queue and one generated worker exactly
once. The worker declares the immediate target
with `canInvokeAgent(serviceName, serviceVersion, C)` or
`canInvokeWorkflow(serviceName, serviceVersion, C)`, so execution returns
through EventBridge even when worker and target share a process. It calls
`client.run(message.payload, message.parameter)`. A completed or interrupted
outcome settles the queue job successfully with that typed outcome. A retriable
`AgentAdmissionRejectedError` with `retryAfterMs` becomes the normal delayed
`QueueRetry`; other handled or unknown failures retain ordinary queue-worker
retry, nack, and dead-letter behavior. The supplied worker's
`setMaxParallelHandlers(...)` remains the first coarse concurrency control.

Using the returned queued contract in an outgoing declaration adds enqueue
without changing aggregate or stream behavior:

```ts
const command = apiV1ServiceBuilder
  .getCommandBuilder('requestSupportAnswer', 'Queue a support answer')
  .canInvokeAgent(
    'Support',
    '1',
    supportAnswerQueueBinding.contract,
  )
  .setCommandFunction(async function ({ agent, message }) {
    return agent.Support['1'].support.enqueue(
      message.payload,
      { sessionId: message.correlationId },
      { idempotencyKey: message.id },
    )
  })
```

The returned promise resolves to the normal typed PURISTA queue receipt.
Declaring the original root contract instead exposes only `run` and `stream`;
queue support never appears by inference from the target alone. Direct `run`
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
canonical shape; the enclosing service/version supplies the rest of the
address:

```ts
type MountedHarnessTargetDefinition = Readonly<{
  targetName: string
  kind: 'agent' | 'workflow'
  description?: string
  inputSchema: JSONSchema
  outputSchema: JSONSchema
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
}>
```

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

Core copies the frozen `harnessExecutionEventTypesV1` inventory from Harness
for every root. It derives `outputUpdates` and `resumableInterrupts` only from
that exact root contract: `updates: 'none'` becomes `[]`; otherwise it becomes
the one-element array `[contract.updates]`. File artifacts and progress remain
ordinary `output.file` and `output.progress` execution event types and are never
listed as target output-update modes. `HarnessInterruptKind` and the exact
contract `$infer.interrupt` relation are imported from Harness; Core does not
declare a parallel interrupt vocabulary or widen every target to all interrupt
kinds.

`mergeServiceDefinition`, `mergeIntoServiceDefinition`,
`ServiceBuilder.getFullServiceDefinition`, JSON export, and architecture
inspection preserve these maps. `getFullServiceDefinition()` resolves Standard
Schemas to serializable JSON Schema and never returns validator functions. For
every target, Core exports `inputSchema` from
`contract.input['~standard'].jsonSchema.input({ target: 'draft-2020-12' })`
and exports `outputSchema` from
`contract.output['~standard'].jsonSchema.output({ target: 'draft-2020-12' })`.
The input direction therefore describes `InferIn` values accepted at the
public boundary, while the output direction describes validated `Infer`
values. Missing JSON Schema support or conversion failure aborts service
composition and definition export atomically.
ClientBuilder generates address-first typed `agent` and `workflow` namespaces
from explicit root contracts only; it never generates HTTP routes or clients
for dependency metadata.

It never exports prompts, Skill files, tool handlers, resources, credentials,
provider configuration, MCP authentication, sandbox references, memory, or
conversation content.

## 10. File and dependency structure

```text
src/service/support/v1/
├── supportV1ServiceBuilder.ts
├── supportV1Service.ts
├── contract/
├── command/
├── subscription/
├── stream/
└── harness/
    ├── supportHarness.ts
    ├── catalog/<catalogName>/<catalogName>Catalog.ts
    ├── agent/<agentName>/<agentName>Agent.ts
    ├── agent/<agentName>/<agentName>Agent.test.ts
    ├── workflow/<workflowName>/<workflowName>Workflow.ts
    ├── workflow/<workflowName>/<workflowName>Workflow.test.ts
    ├── tool/<toolName>/<toolName>Tool.ts
    ├── tool/<toolName>/<toolName>Tool.test.ts
    ├── skill/<skill-name>/<skillName>Skill.ts
    ├── skill/<skill-name>/SKILL.md
    ├── skill/<skill-name>/<skillName>Skill.test.ts
    ├── mcp/<serverName>/<serverName>Mcp.ts
    └── mcp/<serverName>/<serverName>Mcp.test.ts
```

The import graph is a directed set of layers:

1. `contract/**` owns reusable schemas and address/contract-only exports and
   imports no builder or runtime module.
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

A command, stream, subscription, or queue worker that invokes a mounted target
imports the target's contract-only public export or the Harness root-contract
view; it never imports an agent/workflow definition or runtime instance. The
base builder does not import that consumer, so this remains acyclic. Another
service is referenced only through its exported address and root contract,
never its builder, dependency closure, or runtime.

Only required directories exist; generators do not create empty placeholders
or service-local barrel files. Tests are colocated. Contract schemas used by
another service live in a builder-free exported schema/contract module. Every
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
returns the aggregate outcome. A colocated builder test mocks the address-first
client and covers input/session and interrupted outcomes. `--http stream` creates protected target
`stream<AgentPascal>` in
`stream/stream<AgentPascal>/stream<AgentPascal>StreamBuilder.ts`, exposes the
same POST path, parses an AI SDK UI request, invokes the address-first agent
stream, and writes AI SDK UI v1 SSE events. Its colocated test covers message
mapping, v1 metadata/events, cancellation, and approval resume. The CLI never marks these public and
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
workspace links or copied packages. `starter`, `create-purista`, Voyage, and
all maintained examples use the same structure and APIs.

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
| durable revision, replay, or idempotency conflict | handled `409` |
| business guard, permission, or policy denial | handled `403` |
| agent or model admission rejection | handled `429` with retry metadata |
| timeout or expired deadline | handled `504` |
| interrupted outcome | successful typed outcome / HTTP `200`, never an error |
| stream cancellation | stream cancel terminal behavior |
| unknown internal failure | sanitized handled `500` |

Thrown application `HandledError` values retain their declared safe status and
data. Unknown provider or tool details are not exposed.

## 13. Testing and clean removal

Core tests cover mount lifecycle; additive `ai.model` plus `ai.models`
inference; optional production `storage` and `memory` upgrades; aggregate and
stream root registration; dependency-only non-public routes; EventBridge-only
workflow, subagent, and host-tool nested dispatch; identity and trace
propagation; cancellation; queues; business guards; successful-result events;
host-aware agent and workflow tool context inference; approval/resume;
validation and before-guard rejection before stream start; after-guard terminal
replacement without buffering progressive output; AI SDK UI stream conformance;
root-versus-dependency inspection/export; CLI snapshots; and fresh generated
project installation.

Compile-time tests prove that root contracts expose exact `$infer.input`,
`validatedInput`, `output`, `update`, and `interrupt` types; clients preserve
the Harness target outcome/event projections; a dependency-only target cannot
be declared, guarded, queued, exported, or generated as an application client;
workflow tools expose only declared literal ids and exact types; and invalid
model/storage/memory configurations fail where expected. Runtime tests fail if
a same-process child call bypasses EventBridge or if any registry/string lookup
can grant an undeclared capability.

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
CLI, starter, create-purista, Voyage, every example, Framework and Harness
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
release updates website navigation and cards, handbook source, all code blocks,
generated TypeDoc/API output, migration pages, `examples/**`,
`examples/banking/tutorial/**`, CLI blueprints, starter/create-purista, Voyage,
and canonical `purista/skills/**` plus mirrors. Public install snippets use npm
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
`voyage`, and `ai-harness` repositories. For `ai-harness`, it scans
`packages/**`, `examples/**`, `specs/**`, and root public Markdown files. It
excludes `node_modules`, `dist`, generated
coverage, `web/src/content/migration/**`, and the single negative fixture
`packages/harness/type-tests/removed-v3-api.ts`. TypeScript checks use the AST
for removed imports/exports, agent `handler` properties, mount `publish`
properties, and terminal calls on a `defineHarness` chain; prose checks use
fenced-code parsing. Internal compiler type names and unrelated `.build()` or
`.define()` methods are not findings. The allowlist is a checked constant in
the script and additions require a test fixture.
