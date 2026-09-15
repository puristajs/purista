---
title: Invoke and expose a mounted agent
description: Call mounted targets through typed EventBridge clients and add protected command or AI SDK stream projections for HTTP.
order: 399
---

Mounted agents and workflows are service addresses. They do not become HTTP
routes automatically. A caller imports the direct definition and declares the
address:

```ts title="src/service/support/v1/command/runAnswerSupportQuestion/runAnswerSupportQuestionCommandBuilder.ts"
import type { HarnessTargetRunOutcome } from '@purista/harness'
import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'
import { answerSupportQuestionAgent } from '../../harness/agent/answerSupportQuestion/answerSupportQuestionAgent.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'

type AgentOutcome = HarnessTargetRunOutcome<typeof answerSupportQuestionAgent.contract>
type AgentResult = { sessionId: string; outcome: AgentOutcome }
type AgentInterrupt = Extract<AgentOutcome, { status: 'interrupted' }>['interrupt']

const payloadSchema = z.object({
	input: z.string().min(1),
	conversationId: z.string().min(1).optional(),
})
const interruptSchema = z.json() as unknown as z.ZodType<AgentInterrupt, AgentInterrupt>
const outputSchema = z.object({
	sessionId: z.string().min(1),
	outcome: z.discriminatedUnion('status', [
		z.object({
			status: z.literal('completed'),
			runId: z.string().min(1),
			output: answerSupportQuestionAgent.contract.output,
		}),
		z.object({
			status: z.literal('interrupted'),
			runId: z.string().min(1),
			interrupt: interruptSchema,
		}),
	]),
}) as unknown as z.ZodType<AgentResult, AgentResult>

export const runAnswerSupportQuestionCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('runAnswerSupportQuestion', 'Answer a support question')
	.addPayloadSchema(payloadSchema)
	.addParameterSchema(z.object({}))
	.addOutputSchema(outputSchema)
	.canInvokeAgent(supportV1ServiceBuilder.harnessTarget(answerSupportQuestionAgent.contract))
	.exposeAsHttpEndpoint('POST', 'ai/answer-support-question')
	.enableHttpSecurity(true)
	.setCommandFunction(async function (context, payload) {
		if (context.message.principalId === undefined) {
			throw new HandledError(StatusCode.Unauthorized, 'Authenticated principal identity is required')
		}
		const sessionId = createHash('sha256')
			.update(JSON.stringify([
				context.message.tenantId ?? '',
				context.message.principalId,
				payload.conversationId ?? 'default',
			]))
			.digest('base64url')
		return context.agent.Support['1'][answerSupportQuestionAgent.contract.id].run(
			payload.input,
			{ sessionId },
		)
	})
```

[`harnessTarget(contract)`](/handbook/api/classes/_purista_core.ServiceBuilder/#harnesstarget)
binds the authentic contract to the service builder's own address. This avoids
string duplication and does not require the finished service definition, so it
does not introduce a circular import.
[`canInvokeAgent(target)`](/handbook/api/classes/_purista_core.CommandDefinitionBuilder/#caninvokeagent)
adds typed `.run(...)`, `.stream(...)`, and `.resume(...)` clients to the handler context. An
aggregate call returns `{ sessionId, outcome }`. Keep that envelope in the
public command contract so a client can distinguish completion from an
approval or another interruption.

The command is the application contract. It owns HTTP exposure, request
validation, the public response schema, and business guards. Marking it as
protected lets the Hono protect middleware authenticate the caller and attach
the verified principal and tenant to the message. Command and mounted-target
guards then authorize the business action. The agent remains
transport-independent. The call crosses EventBridge even when caller and target
run in the same process.

Pass a server-derived `sessionId` when later requests should share context:

```ts title="Continue one conversation"
const result = await context.agent.Support['1'][answerSupportQuestionAgent.contract.id].run(
	question,
	{ sessionId: deriveHarnessSessionId(context.message, conversationId) },
)
```

`deriveHarnessSessionId(...)` is application code. It should create an opaque,
stable value from the authenticated tenant and principal plus the authorized
conversation key.

The runtime scopes storage with trusted tenant and principal identity. The
browser may supply a product conversation key, but the authenticated server
must bind it to tenant and principal identity and derive the Harness session
ID. A session ID is correlation data, not proof of authorization.

## Aggregate HTTP

Wrap `.run(...)` in a command and expose that command with
`.exposeAsHttpEndpoint(...)`. Protect the route with
`.enableHttpSecurity(true)`. The output schema should describe both completed
and interrupted outcomes and preserve the target's output type.

For a new agent, the CLI can generate this projection together with the agent:

```bash title="Generate an aggregate HTTP projection"
npm run add:agent -- answer-another-question --model-alias answering \
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
  AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL,
  parseHarnessUIMessageRequest,
  pipeHarnessUIMessageStream,
} from '@purista/harness-ai-sdk-ui/v1'
import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'

const inputSchema = z.object({ id: z.string().min(1) }).passthrough()
const chunkSchema = z.object({ event: z.literal('data'), data: z.unknown() })

export const streamAssistantStreamBuilder = supportV1ServiceBuilder
  .getStreamBuilder('streamAssistant', 'Stream assistant UI messages')
  .addPayloadSchema(inputSchema)
  .addParameterSchema(z.object({}))
  .addChunkSchema(chunkSchema)
  .addFinalSchema(z.void())
  .canInvokeAgent(supportV1ServiceBuilder.harnessTarget(assistantAgent.contract))
  .exposeAsHttpStreamEndpoint('POST', 'ai/assistant')
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
    const request = await parseHarnessUIMessageRequest(payload, {
      sessionId: trustedSessionId,
    })
    const input = request.lastUserMessage.parts
      .flatMap(part => part.type === 'text' ? [part.text] : [])
      .join('\n')

    const target = context.agent.Support['1'][assistantAgent.contract.id]
    const events = request.resume === undefined
      ? await target.stream(input, { sessionId: request.sessionId })
      : await target.resume(request.resume).stream({ sessionId: request.sessionId })

    await pipeHarnessUIMessageStream(events, writer, request)
  })
```

[`canInvokeAgent(target)`](/handbook/api/classes/_purista_core.StreamDefinitionBuilder/#caninvokeagent)
adds the mounted agent client to this stream handler. The call still crosses
EventBridge and applies the target policy.

`setHttpStreamProtocol(...)` selects direct streaming and disables automatic
chunk aggregation. The Hono server recognizes the protocol identifier and sets
the standard content type, caching, connection, buffering, and
`x-vercel-ai-ui-message-stream` headers. Do not add those headers in the stream
definition.

`pipeHarnessUIMessageStream(...)` projects and forwards the data-only protocol
records, writes `[DONE]`, closes a successful stream, and propagates browser
cancellation to the addressed Harness execution. Cancellation cannot undo
provider or tool effects that already started.

The CLI generates this projection with `--http stream`. A resume request uses
`target.resume(request.resume).stream(...)` and remains a normal HTTP response,
so approval flows do not become server errors. Browser clients can use AI SDK
`useChat` or AI Elements without a PURISTA-specific client library.

HTTP authentication comes from the Hono protect middleware. Target guards still
authorize the business action at the mounted address.
