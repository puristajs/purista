---
title: Invoke and expose a mounted agent
description: Call mounted targets through typed EventBridge clients and add explicit command or stream adapters for external consumers.
order: 399
---

Mounted targets are internal service addresses. They do not automatically
become HTTP endpoints. Every internal caller declares the exact address and
portable contract:

```ts title="Declare an agent invocation"
const triageCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('triageTicket', 'Classifies a support ticket')
  .canInvokeAgent(
  'Support',
  '1',
  'triage_ticket',
  supportHarness.contracts.agents.triage_ticket,
  )
```

[`canInvokeAgent(service, version, target, contract)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvokeagent)
declares the address and adds a typed aggregate and streaming client to this
command's handler context.
[`canUseHarnessModel(alias, contract)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#canuseharnessmodel)
is the separate choice for deterministic command code that needs one mounted
model handle without an agent invocation; it does not publish a target address.
[`getCommandBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getcommandbuilder)
creates that caller-owned command contract.

The handler receives both delivery choices:

```ts title="Choose aggregate or streaming invocation"
const result = await context.agent.Support['1'].triage_ticket.run(input)
const events = await context.agent.Support['1'].triage_ticket.stream(input)
```

## Session identity and stored history

Pass an application-owned logical `sessionId` when later calls should share a
Harness conversation or run context:

```ts title="Use one logical conversation id"
const logicalSessionId = `support:${conversationId}`
const result = await context.agent.Support['1'].triage_ticket.run(input, {
  sessionId: logicalSessionId,
})
```

The mounted runtime combines that value with trusted tenant and principal
identity and stores the session under an opaque id. Two callers therefore do
not share a session merely because they supply the same logical id.

An authorized application command that reads or clears the same data directly
through `HarnessStorage` must derive the identical storage id:

```ts title="Resolve the mounted Harness storage id"
import { createHarnessSessionStorageId } from '@purista/core'

const storageSessionId = createHarnessSessionStorageId(
  context.message,
  `support:${conversationId}`,
)
const messages = await harnessStorage.listMessages(storageSessionId)
```

Use trusted message identity and apply a business guard before storage access.
The logical or opaque session id is correlation data, not proof of authority.

## Aggregate HTTP

Wrap `.run(...)` in a normal command, add the command schemas, and call
`.exposeAsHttpEndpoint(...)`. Decide how interrupted outcomes appear in the
public contract; do not assume every command may silently wait for approval.

## Browser streaming

Wrap `.stream(...)` in a PURISTA stream and project provider-neutral execution
events with the dedicated adapter. The
[`addPayloadSchema(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addpayloadschema)
call validates the public stream request:

```ts title="Expose AI SDK UI Message Stream v1"
import { createHarnessUIMessageSseEvents } from '@purista/harness-ai-sdk-ui/v1'
import { z } from 'zod'

const uiMessageSseEventSchema = z.object({
  event: z.literal('data'),
  data: z.unknown(),
})

export const chatStreamBuilder = supportV1ServiceBuilder
  .getStreamBuilder('chat', 'Streams assistant UI messages')
  .addPayloadSchema(chatInputSchema)
  .addChunkSchema(uiMessageSseEventSchema)
  .canInvokeAgent('Support', '1', 'assistant', supportHarness.contracts.agents.assistant)
  .exposeAsHttpStreamEndpoint('POST', 'chat')
  .setHttpStreamProtocol('ai-sdk-ui-message-stream-v1')
  .setHttpResponseHeaders({ 'x-vercel-ai-ui-message-stream': 'v1' })
  .setStreamFunction(async function (context, input, _parameter, stream) {
    const execution = await context.agent.Support['1'].assistant.stream(input)
    stream.onCancel(reason => void execution.cancel(reason))
    for await (const event of createHarnessUIMessageSseEvents(execution)) {
      if (stream.cancelled) return
      await stream.write(event)
    }
    await stream.close()
  })
```

Here,
[`canInvokeAgent(service, version, target, contract)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#caninvokeagent)
adds the same typed EventBridge client to the stream handler. It does not
bypass the mounted target's schemas or business guards.
The returned execution's
[`cancel(reason?)`](/handbook/api/interfaces/_purista_core.HarnessExecutionStream/#cancel)
requests cancellation through the EventBridge stream session; it is not a
rollback guarantee for provider or tool side effects that already started.

The adapter owns only AI SDK UI Message Stream v1 encoding. PURISTA stream and Harness execution
contracts stay provider-neutral, so another protocol can be added later as a
separate adapter. Browser code can use AI SDK `useChat` and AI Elements
without a PURISTA client library.

The public stream chain uses
[`getStreamBuilder(...)`](/handbook/api/classes/_purista_core.ServiceBuilder/#getstreambuilder),
[`addChunkSchema(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#addchunkschema),
[`exposeAsHttpStreamEndpoint(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#exposeashttpstreamendpoint),
[`setHttpStreamProtocol(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#sethttpstreamprotocol),
and
[`setStreamFunction(...)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#setstreamfunction).
These calls define the application-owned HTTP projection and its validated SSE
chunks; the UI adapter only translates the portable Harness event stream.
