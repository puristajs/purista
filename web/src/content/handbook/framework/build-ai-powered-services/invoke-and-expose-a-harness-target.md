---
title: Invoke and expose a mounted agent
description: Call mounted targets through typed EventBridge clients and add protected command or AI SDK stream projections for HTTP.
order: 399
---

Mounted agents and workflows are service addresses. They do not become HTTP
routes automatically. A caller imports the direct definition and declares the
address:

```ts title="Declare an agent invocation"
const triageCommandBuilder = supportV1ServiceBuilder
  .getCommandBuilder('triageTicket', 'Classifies a support ticket')
  .canInvokeAgent('Support', '1', triageTicketAgent.contract)
  .setCommandFunction(async function (context, input) {
    return context.agent.Support['1'][triageTicketAgent.contract.id].run(input)
  })
```

[`canInvokeAgent(service, version, contract)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvokeagent)
adds typed `.run(...)` and `.stream(...)` clients to the handler context. An
aggregate call returns `{ sessionId, outcome }`. Keep that envelope in the
public command contract so a client can distinguish completion from an
approval or another interruption.

Pass a product-owned `sessionId` when later requests should share context:

```ts title="Continue one conversation"
const result = await context.agent.Support['1'][triageTicketAgent.contract.id].run(
  input,
  { sessionId: `support:${conversationId}` },
)
```

The runtime scopes storage with trusted tenant and principal identity. A
session id is correlation data, not proof of authorization.

## Aggregate HTTP

Wrap `.run(...)` in a command and expose that command with
`.exposeAsHttpEndpoint(...)`. Protect the route with
`.enableHttpSecurity(true)`. The output schema should describe both completed
and interrupted outcomes and preserve the target's output type.

The CLI can generate this projection:

```bash title="Generate an aggregate HTTP projection"
npm run add:agent -- triage-ticket \
  --service support \
  --service-version 1 \
  --http command
```

## AI SDK UI Message Stream v1

Use a PURISTA stream as the HTTP projection. Parse the standard request, pass a
fresh or resumed session to the mounted agent, and translate portable execution
events with the v1 adapter:

```ts title="Expose AI SDK UI Message Stream v1"
import {
  createHarnessUIMessageSseEvents,
  parseHarnessUIMessageRequest,
} from '@purista/harness-ai-sdk-ui/v1'
import { z } from 'zod'

const chunkSchema = z.object({ event: z.literal('data'), data: z.unknown() })

export const streamAssistantStreamBuilder = supportV1ServiceBuilder
  .getStreamBuilder('streamAssistant', 'Stream assistant UI messages')
  .addPayloadSchema(z.unknown())
  .addParameterSchema(z.object({}))
  .addChunkSchema(chunkSchema)
  .addFinalSchema(z.void())
  .canInvokeAgent('Support', '1', assistantAgent.contract)
  .exposeAsHttpStreamEndpoint('POST', 'ai/assistant')
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

    const events = await context.agent.Support['1'][assistantAgent.contract.id].stream(
      input,
      request.resume === undefined
        ? { sessionId: request.sessionId }
        : { sessionId: request.sessionId, resume: request.resume },
    )

    let cancellation = Promise.resolve()
    writer.onCancel(reason => {
      cancellation = events.cancel(reason)
    })

    try {
      for await (const record of createHarnessUIMessageSseEvents(events, {
        sessionId: request.sessionId,
        ...(request.assistantMessageId === undefined
          ? {}
          : { messageId: request.assistantMessageId }),
      })) {
        await writer.write(record)
      }
      if (!writer.cancelled) await writer.close()
    } finally {
      await cancellation
    }
  })
```

[`canInvokeAgent(service, version, contract)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#caninvokeagent)
adds the mounted agent client to this stream handler. The call still crosses
EventBridge and applies the target policy.

The adapter emits data-only SSE records and owns the protocol completion marker.
PURISTA owns the HTTP stream and closes it after the adapter finishes.
Cancellation requests upstream cancellation and then waits for it; it cannot
undo provider or tool effects that already started.

The CLI generates this projection with `--http stream`. A resume request sends
`{ sessionId, resume }` to the target and remains a normal HTTP response, so
approval flows do not become server errors. Browser clients can use AI SDK
`useChat` or AI Elements without a PURISTA-specific client library.

HTTP authentication comes from the Hono protect middleware. Target guards still
authorize the business action at the mounted address.
