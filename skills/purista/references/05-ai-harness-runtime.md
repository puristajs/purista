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

## Define and mount

```ts
import { commandAsHarnessTool } from '@purista/core'
import { defineHarness } from '@purista/harness'

export const incidentHarness = defineHarness({ name: 'incident-support' })
  .requireModel('primary', { capabilities: ['object', 'tool_use'] })
  .hostTool('get_incident_snapshot', {
    kind: 'host',
    description: 'Load the current incident state',
    input: incidentIdSchema,
    output: incidentSnapshotSchema,
  })
  .agent('triage_ticket', {
    input: triageInput,
    output: triageOutput,
    model: 'primary',
    instructions: 'Classify the ticket using only supplied evidence.',
    updates: 'none',
  })
  .define()

export const supportV1Service = supportV1ServiceBuilder.mountHarness(incidentHarness, {
  publish: { agents: ['triage_ticket'] },
  hostTools: {
    get_incident_snapshot: commandAsHarnessTool('Support', '1', 'getIncidentSnapshot'),
  },
})
```

`mountHarness` is synchronous. The Harness definition is already resolved and
immutable. Publish only targets owned by that service boundary.

Use `targets.agents[target]` or `targets.workflows[target]` for:

- `beforeGuards`: authorize the action, object, tenant, and current state;
- `afterGuards`: validate a terminal outcome before it is returned/published;
- `successEvent`: publish a successfully completed outcome as a fact.

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
    incidentHarness.contracts.agents.triage_ticket,
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
    admission: { maxConcurrentRuns: 8 },
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

PURISTA StateStore owns supported application/session key-value state.
`HarnessStorage` owns AI sessions, runs, checkpoints, and waits. A database
resource owns transactional domain records. A sandbox/workspace owns execution
files. Do not substitute one boundary for another.

## Queue admission and retry

Harness admission limits concurrent active runs within an instance. Put a
normal PURISTA queue and worker before a mounted target when work also needs
durable acceptance, delayed retry, dead letters, replay, or fleet-wide
concurrency control. The worker calls the address-first target. Convert
retryable provider/runtime failures with `toHarnessQueueRetry(error)`; do not
sleep through long provider retry windows.

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
