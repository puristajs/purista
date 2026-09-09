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
storage, memory, sandbox, admission, telemetry, and other runtime facilities
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
  .canInvokeAgent('Support', '1', triage.contract)
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

export const supportV1Service = supportV1ServiceBuilder.mountHarness(supportHarness, {
  targets: { agents: { triage: { queue: triageQueue } } },
})

const enqueueTriage = commandBuilder
  .canInvokeAgent('Support', '1', triageQueue.reference)
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
import { createHarnessUIMessageSseEvents, parseHarnessUIMessageRequest } from '@purista/harness-ai-sdk-ui/v1'
import { z } from 'zod'

const inputSchema = z.unknown()
const parameterSchema = z.object({})
const chunkSchema = z.object({ event: z.literal('data'), data: z.unknown() })
const finalSchema = z.void()

export const streamTriage = supportV1ServiceBuilder
  .getStreamBuilder('streamTriage', 'Stream ticket triage')
  .addPayloadSchema(inputSchema)
  .addParameterSchema(parameterSchema)
  .addChunkSchema(chunkSchema)
  .addFinalSchema(finalSchema)
  .canInvokeAgent('Support', '1', triage.contract)
  .exposeAsHttpStreamEndpoint('POST', 'ai/triage')
  .enableHttpSecurity(true)
  .enableChunkAggregation(false)
  .setHttpStreamingMode('stream')
  .setHttpStreamProtocol('ai-sdk-ui-message-stream-v1')
  .setHttpResponseHeaders({ 'x-vercel-ai-ui-message-stream': 'v1' })
  .setStreamFunction(async function (context, payload, _parameter, writer) {
    const request = await parseHarnessUIMessageRequest(payload)
    const input = request.lastUserMessage.parts
      .flatMap(part => part.type === 'text' ? [part.text] : [])
      .join('\n')
    const events = await context.agent.Support['1'][triage.contract.id].stream(
      input,
      request.resume === undefined
        ? { sessionId: request.sessionId }
        : { sessionId: request.sessionId, resume: request.resume },
    )
    let cancellation = Promise.resolve()
    writer.onCancel(reason => { cancellation = events.cancel(reason) })
    try {
      for await (const event of createHarnessUIMessageSseEvents(events, {
        sessionId: request.sessionId,
        ...(request.assistantMessageId === undefined
          ? {}
          : { messageId: request.assistantMessageId }),
      })) {
        await writer.write(event)
      }
      if (!writer.cancelled) await writer.close()
    } finally {
      await cancellation
    }
  })
~~~

Configure `honoService.setProtectMiddleware(...)` before startup. That
middleware authenticates the request and sets trusted `principalId` and
`tenantId`; business authorization remains a guard on the mounted target.
For example, decode the transport credential there, set those two variables,
and return `next()`; do not put business authorization in the HTTP wrapper.
Keep stream protocol headers and session identifiers at the HTTP boundary; the
Harness definition stays transport-neutral.

## Move runtime bindings

Construct one runtime instance for the mounted definition with the concrete
model and optional bindings required by its graph. PURISTA StateStore remains
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
