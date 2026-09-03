# AI Harness Runtime

Use this reference for PURISTA v4 AI integration. `@purista/harness` is the
only AI definition DSL. PURISTA core mounts its immutable definitions, supplies
host integration, and exposes address-first invocation through EventBridge.

## Contents

- Architecture, definition, and mount policy
- Address-first invocation and host tools
- Runtime binding, queues, and browser streaming
- Multimodal output, durable work, testing, and operations

## Architecture

Keep four boundaries explicit:

1. **Harness definition**: model requirements, schemas, tools, skills, MCP
   servers, agents, workflows, guardrails, portable update modes.
2. **Service mount**: published targets, host tools, business guards, success
   events, trusted Framework context.
3. **Runtime binding**: concrete models, admission, artifacts, logger,
   telemetry, Harness storage, memory, sandbox, sandbox binding, workspace.
4. **Consumer adapter**: command, stream, queue worker, or HTTP protocol
   projection selected for one application use case.

Mounting never generates commands, streams, queues, workers, or HTTP routes.
Create those normal Framework primitives only when required.

## Define, compose, and mount

Use native Harness modules for focused agent, workflow, and tool files. Compose
them into exactly one portable definition per PURISTA service, then mount that
definition once. This gives model aliases, storage, admission, sandbox
ownership, and shutdown one unambiguous lifecycle.

```ts
import { commandAsHarnessTool } from '@purista/core'
import { defineHarness, defineHarnessModule, type BuilderState, type ModelAlias } from '@purista/harness'

type PrimaryModelState = BuilderState & { models: { primary: ModelAlias } }

const triageTicketAgent = defineHarnessModule<PrimaryModelState>()('support.agent.triage-ticket', {
  register(builder) {
    return builder.agent('triage_ticket', {
      input: triageInput,
      output: triageOutput,
      model: 'primary',
      instructions: 'Classify the ticket using only supplied evidence.',
      updates: 'none',
    })
  },
})

export const supportHarness = defineHarness({ name: 'support' })
  .requireModel('primary', { capabilities: ['object', 'tool_use'] })
  .hostTool('get_incident_snapshot', {
    kind: 'host',
    description: 'Load the current incident state',
    input: incidentIdSchema,
    output: incidentSnapshotSchema,
  })
  .use(triageTicketAgent)
  .define()

export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  publish: { agents: ['triage_ticket'] },
  hostTools: {
    get_incident_snapshot: commandAsHarnessTool('Support', '1', 'getIncidentSnapshot'),
  },
})
```

`mountHarness` is synchronous. The Harness definition is already resolved and
immutable. It may be called once per service builder. Publish only targets
owned by that service boundary and use native modules for further capabilities.

Use `targets.agents[target]` or `targets.workflows[target]` for:

- `beforeGuards`: authorize the action, object, tenant, and current state;
- `afterGuards`: validate a terminal outcome before it is returned/published;
- `successEvent`: publish a successfully completed outcome as a fact.

Put business guards on the published mounted target whenever callers may use
its EventBridge address directly. A guard only on an HTTP wrapper command does
not protect that address and can be bypassed by another service. Wrapper
commands and streams own transport/public contracts; target guards own access
to the published agent or workflow itself.

Content guardrails remain in Harness. Business authorization remains in mount
guards and the commands/resources that own business effects.

Output rails run only on final answer candidates. Intermediate tool-call responses skip output rails.

## Address-first invocation

Declare the exact service address and exported contract:

```ts
const command = service
  .getCommandBuilder('triageTicket', 'Classifies a ticket')
  .canInvokeAgent(
    'Support',
    '1',
    'triage_ticket',
    supportHarness.contracts.agents.triage_ticket,
  )
  .setCommandFunction(async function (context, input) {
    const outcome = await context.agent.Support['1'].triage_ticket.run(input)
    if (outcome.status !== 'completed') return mapInterruption(outcome)
    return outcome.output
  })
```

Use `canInvokeWorkflow(...)` and `context.workflow` for workflows. Both
`.run(input, options?)` and `.stream(input, options?)` always cross
EventBridge, including in one process. Never dispatch by definition reference.

The definition owns one final output schema and an update policy
(`none`, `text-delta`, or `object-snapshot`). The consumer chooses aggregate
or streaming delivery:

- `.run` returns `RunOutcome<Output>`;
- `.stream` returns a cancellable, one-use
  `AsyncIterable<ExecutionEvent<Output>>`;
- the terminal `run.finished` event carries the same outcome shape.

Approval and external waits are `interrupted` outcomes. They are not
exceptions and must not become HTTP 500 responses.

At the PURISTA mount boundary, validation maps to `400`, permission, policy,
and `DECISION_BLOCKED` map to `403`, model admission maps to `429` with retry
metadata, timeout maps to `504`, and unexpected internal failures map to `500`.
Do not catch these errors only to serialize a second ad-hoc response format.

## Host tools

Use `commandAsHarnessTool(service, version, target, options?)` when a native
Harness host-tool contract maps directly to one PURISTA command. Use
`mapInput` and `mapOutput` only for deliberate contract differences.

Use `ServiceBuilder.getHarnessHostToolBuilder(contract)` for a tool handler
that needs declared PURISTA capabilities. It supports command invocation,
mounted agent/workflow invocation, stream consumption, queueing, emitting, and
service resources. Declare every capability before `setHandler`.

The handler context receives trusted tenant/principal identity, trace and
correlation ids, Harness session/run/tool/call ids, and a stable idempotency
key. Model input cannot override trusted identity. Side-effecting commands
should accept and enforce the idempotency key.

## Runtime binding

```ts
const service = await supportV1Service.getInstance(eventBridge, {
  resources,
  queueBridge,
  ai: {
    models: {
      primary: { provider, model: 'provider-model-id' },
    },
    admission: modelAdmission,
    storage: harnessStorage,
    memory,
    sandbox,
    sandboxBinding,
    workspace,
    artifacts,
    telemetry: { contentCaptureMode: 'NO_CONTENT' },
  },
})
```

Configure only capabilities required by the mounted definition. Startup fails
when required models, host tools, storage, or runtime capabilities are missing.
Keep provider credentials in application secret configuration.

`admission` is a Harness `ModelAdmission` adapter. Its `acquire(request)`
method returns a lease whose `release()` method runs after the provider call or
stream finishes. Use a local or distributed adapter to enforce provider
concurrency and rate policy. It is not a numeric configuration object.

PURISTA StateStore owns supported application/session key-value state.
`HarnessStorage` owns AI sessions, runs, checkpoints, and waits. A database
resource owns transactional domain records. A sandbox/workspace owns execution
files. Do not substitute one boundary for another.

A mounted target accepts an application-owned logical `sessionId`, then scopes
it with trusted tenant and principal identity before opening Harness storage.
When an authorized application command must inspect or delete that same
session through `HarnessStorage`, derive its opaque storage id with
`createHarnessSessionStorageId(context.message, logicalSessionId)`. Do not
duplicate the hashing algorithm, query storage with the logical id, or use the
session id as authorization.

## Queue admission and retry

Harness admission controls provider-call capacity through that adapter. Put a
normal PURISTA queue and worker before a mounted target when work also needs
durable acceptance, delayed retry, dead letters, replay, or fleet-wide
concurrency control. The worker calls the address-first target. Convert
retryable provider/runtime failures with `toHarnessQueueRetry(error)`; do not
sleep through long provider retry windows.

For a published target, prefer `defineHarnessQueueBinding(contract, queue,
worker)`. Pass the binding under `targets.agents.<name>.queue` or
`targets.workflows.<name>.queue`, and pass `binding.contract` to
`canInvokeAgent(...)` or `canInvokeWorkflow(...)`. Only that wrapped contract
adds `.enqueue(input, invocationOptions, queueOptions)` to the typed client.
Direct contracts remain unqueued. The integration-owned worker always invokes
the target through EventBridge and preserves trusted tenant/principal metadata.

## Browser streaming

Keep the internal stream provider-neutral. For browser chat, create an explicit
PURISTA stream and adapt events using `@purista/harness-ai-sdk-ui/v1`:

```ts
import { createHarnessUIMessageSseEvents } from '@purista/harness-ai-sdk-ui/v1'

const stream = service
  .getStreamBuilder('assistantChat', 'Streams assistant messages')
  .addPayloadSchema(chatInput)
  .addChunkSchema(uiMessageSseEventSchema)
  .canInvokeAgent('Support', '1', 'assistant', harness.contracts.agents.assistant)
  .exposeAsHttpStreamEndpoint('POST', 'assistant')
  .setHttpStreamProtocol('ai-sdk-ui-message-stream-v1')
  .setHttpResponseHeaders({ 'x-vercel-ai-ui-message-stream': 'v1' })
  .setStreamFunction(async function (context, input, _parameter, writer) {
    const execution = await context.agent.Support['1'].assistant.stream(input)
    writer.onCancel(reason => void execution.cancel(reason))
    for await (const event of createHarnessUIMessageSseEvents(execution)) {
      if (writer.cancelled) return
      await writer.write(event)
    }
    await writer.close()
  })
```

AI SDK `useChat` and AI Elements can consume this standard protocol. Do not
create a PURISTA client protocol or custom chat component library. Additional
protocols must live in separate adapters.

## Multimodal and structured output

Declare text, structured output, embedding, image, audio, and video needs in the
Harness definition and model requirements. Keep media as typed Harness
artifacts/references. Do not force binary provider payloads through ordinary
JSON command contracts unless the application contract deliberately owns that
representation.

## Durable work and approvals

Use stable product-owned `sessionId` and `runId` values. Persist review
tasks in an application database with tenant, principal/role scope, action
digest, revision, expiry, decision, and idempotency data. Approve or reject
through protected commands, reauthorize on resume, and resume the same Harness
run. Never execute a side effect merely because the model requested approval.

When an authorized reviewer must resume a run originally owned by another
principal, opt in only on that mounted workflow target:

```ts
targets: {
  workflows: {
    review_action: {
      durableResume: { identity: 'run-owner' },
      beforeGuards: { reviewAccess: requireReviewAccess },
    },
  },
}
```

The current reviewer remains visible to mount guards and host integrations;
only the Harness run owner is restored for durable resume. PURISTA rejects a
cross-tenant resume. The guard must load the tenant-scoped review record,
compare the stored run/session/action digest, and authorize the current
reviewer before any resume or effect.

## Testing

Test each boundary independently:

- native Harness definition with `FakeModelProvider` and scripted tool/model
  behavior;
- PURISTA commands, streams, and workers with context mocks and address-first
  target stubs;
- mount policy with business guard, host-tool identity/resource, success-event,
  and lifecycle tests;
- queues with retry/idempotency fixtures;
- UI Message Stream v1 with deterministic `ExecutionEvent` fixtures,
  cancellation, tool calls, approvals, terminal outcome, and error mapping;
- selected real providers/adapters in separate credentialed integration tests.

Do not use a live provider in unit tests. Do not mock the implementation detail
under test while leaving the public contract unverified.

## Security and operations

- Authentication establishes trusted identity; business guards authorize use.
- Minimize prompts, tool input, events, streams, logs, traces, and metrics.
- Default production telemetry to no content capture.
- Keep tool operations idempotent and least-privileged.
- Fail readiness when required runtime capabilities are unavailable.
- Destroy the service once; do not create per-request Harness instances.
