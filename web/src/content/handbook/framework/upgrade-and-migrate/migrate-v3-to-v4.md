---
title: Migrate from PURISTA v3 to v4
description: Replace legacy attached-agent projections with native Harness definitions, explicit service mounts, address-first calls, and deliberate HTTP adapters.
order: 1120
---

PURISTA v4 is a clean break for AI integration. Move agent and workflow
definitions to native @purista/harness modules, mount one composed definition
in the service, and create Framework primitives only for application behavior
that needs their delivery or exposure guarantees.

There is no runtime compatibility layer. Update the service boundary, callers,
stored Harness data, and deployment together.

## Align packages and layout

Keep the published @purista/* packages on one v4 release line. Add
@purista/harness to the application that owns definitions, plus provider,
storage, sandbox, memory, MCP, or UI adapter packages only when the composition
root uses them. Remove the old agentPath setting. Put native modules below the
owning service version, for example `src/service/support/v1/harness/`, and
keep the final service as that graph's only Framework composition root.

## Define and mount the Harness graph

Replace generated agent builders with leaf definitions and additive composition:

~~~ts title="src/service/support/v1/harness/supportHarness.ts"
import { defineAgent, defineHarness, defineWorkflow } from '@purista/harness'

export const triage = defineAgent('triage', {
  model: 'assistant',
  instructions: 'Classify the ticket and return the next action.',
})

export const supportWorkflow = defineWorkflow('support', {
  input: triage.contract.input,
  output: triage.contract.output,
  agents: [triage],
  handler: async context => context.agents.triage.run(context.input, {
    callId: 'support-triage',
  }),
})

export const supportHarness = defineHarness({ name: 'support' })
  .addAgent(triage)
  .addWorkflow(supportWorkflow)
~~~

Mount the definition once on the final service builder. Bind model providers,
storage, memory, sandbox, concurrency, telemetry, and other runtime facilities
when the service starts; the definition remains portable.

~~~ts title="src/service/support/v1/supportV1Service.ts"
export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness)
~~~

mountHarness(definition) is the service lifecycle boundary. It does not turn
every Harness target into a command, stream, or queue.

## Move callers to target contracts

Create a Framework command, stream, subscription, or queue only when that
application boundary is required. For a caller in the same service, declare the
target contract with the current address-first helper:

~~~ts title="src/service/support/v1/command/triage/triageCommandBuilder.ts"
export const triageCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('triage', 'Classify one ticket')
  .canInvokeAgent(supportV1ServiceBuilder.harnessTarget(triage.contract))
  .setCommandFunction(async function (context, payload) {
    const { sessionId, outcome } = await context.agent.Support['1'].triage.run(payload)
    return { sessionId, outcome }
  })
~~~

Use the typed target client supplied by the handler context and pass the target
input. Addressed `run` returns `{ sessionId, outcome }`; addressed `stream`
returns an execution stream. Handle completed, interrupted, failed, and
cancelled outcomes explicitly. Approval and external waits are outcomes that
can be resumed, not generic application errors.

For durable admission, replace a generated agent queue projection with a native
queue binding for the exact root contract:

~~~ts title="src/service/support/v1/supportV1Service.ts"
// Before: generated attached-agent queue projection
// After: one nominal binding, then one matching mount policy
import { defineHarnessQueueBinding } from '@purista/core'

const triageQueue = defineHarnessQueueBinding(
  triage.contract,
  triageQueueBuilder,
  triageQueueWorkerBuilder,
)

const supportHarnessPolicy = supportV1ServiceBuilder.defineHarnessPolicy(supportHarness, {
  agents: { triage: { queue: triageQueue } },
})

export const supportV1Service = supportV1ServiceBuilder.mountHarness(
  supportHarness,
  supportHarnessPolicy,
)

const enqueueTriage = commandBuilder
  .canInvokeAgent(supportV1ServiceBuilder.harnessTarget(triageQueue.reference))
  .setCommandFunction(async function (context, payload) {
    return context.agent.Support['1'].triage.enqueue(payload)
  })
~~~

The binding's nominal `reference` is the only value that grants `enqueue` to a
caller. Do not recreate the removed generated agent transport projections.

## Expose HTTP deliberately

Choose a command or stream projection for an HTTP route and map authentication,
tenant identity, request schemas, response status, and cancellation explicitly.
For browser chat, replace a generated public agent route with a protected
Framework stream projection and the published `@purista/harness-ai-sdk-ui/v1`
adapter:

~~~ts title="src/service/support/v1/stream/streamTriage/streamTriageStreamBuilder.ts"
// Before: generated attached-agent HTTP route
// After: a protected wrapper around the addressed target
import {
  AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL,
  parseHarnessUIMessageRequest,
  pipeHarnessUIMessageStream,
} from '@purista/harness-ai-sdk-ui/v1'
import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'

const inputSchema = z.object({ id: z.string().min(1) }).passthrough()
const parameterSchema = z.object({})
const chunkSchema = z.object({ event: z.literal('data'), data: z.unknown() })
const finalSchema = z.void()

export const streamTriage = supportV1ServiceBuilder
  .getStreamBuilder('streamTriage', 'Stream ticket triage')
  .addPayloadSchema(inputSchema)
  .addParameterSchema(parameterSchema)
  .addChunkSchema(chunkSchema)
  .addFinalSchema(finalSchema)
  .canInvokeAgent(supportV1ServiceBuilder.harnessTarget(triage.contract))
  .exposeAsHttpStreamEndpoint('POST', 'ai/triage')
  .enableHttpSecurity(true)
  .setHttpStreamProtocol(AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL)
  .setStreamFunction(async function (context, payload, _parameter, writer) {
    if (context.message.principalId === undefined) {
      throw new HandledError(StatusCode.Unauthorized, 'Authenticated principal identity is required')
    }
    const trustedSessionId = createHash('sha256')
      .update(JSON.stringify([
        context.message.tenantId ?? '',
        context.message.principalId,
        payload.id,
      ]))
      .digest('base64url')
    const request = await parseHarnessUIMessageRequest(payload, { sessionId: trustedSessionId })
    const input = request.lastUserMessage.parts
      .flatMap(part => part.type === 'text' ? [part.text] : [])
      .join('\n')
    const target = context.agent.Support['1'][triage.contract.id]
    const events = request.resume === undefined
      ? await target.stream(input, { sessionId: request.sessionId })
      : await target.resume(request.resume).stream({ sessionId: request.sessionId })
    await pipeHarnessUIMessageStream(events, writer, request)
  })
~~~

Configure `honoService.setProtectMiddleware(...)` before startup. That
middleware authenticates the request and sets trusted `principalId` and
`tenantId`; business authorization remains a guard on the mounted target.
For example, decode the transport credential there, set those two variables,
and return `next()`; do not put business authorization in the HTTP wrapper.
The protocol declaration makes the Hono server add the standard response
headers. The pipe helper owns projection, completion, stream closing, and
disconnect cancellation. The Harness definition stays transport-neutral.

## Move runtime bindings

Construct one runtime instance for the mounted definition with the exact
`ai.models` map required by its graph. Configure complete-run and provider-call
limits under `ai.concurrency: { runs, modelCalls }`. Keep sandbox execution
and deployment consent together under `ai.sandbox: { adapter, policy }`.
PURISTA StateStore remains
for Framework application state; Harness storage and memory own Harness
sessions, run history, durable steps, and retrieval state. Domain records stay
behind application resources.

## Test the new boundary

Use FakeModelProvider for deterministic definition tests. Test service mounts
and address-first calls with Framework testing helpers, then test the selected
storage, sandbox, queue, HTTP, and UI adapters at their own boundary. Cover
authorization, host-tool identity, interruption/resume, cancellation, instance
closure, and redaction. Live model quality belongs in evaluations.

Before deployment, search source for removed builder and generated projection
names, typecheck and build the application, export service definitions, and
exercise aggregate, streaming, queued, approval, and instance-close paths.
