import {
	AI_SDK_UI_MESSAGE_STREAM_V1_HEADERS,
	createHarnessUIMessageSseEvents,
	parseHarnessUIMessageRequest,
} from '@purista/harness-ai-sdk-ui/v1'
import { z } from 'zod'
import { answerKnowledgeQuestionAgent } from '../../harness/agent/answerKnowledgeQuestion/answerKnowledgeQuestionAgent.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'

const inputSchema = z.object({ collectionId: z.string().min(1) }).passthrough()
const parameterSchema = z.object({})
const chunkSchema = z.object({ event: z.literal('data'), data: z.unknown() })
const finalSchema = z.void()
const protocolHeaders = {
	'x-vercel-ai-ui-message-stream': AI_SDK_UI_MESSAGE_STREAM_V1_HEADERS['x-vercel-ai-ui-message-stream'],
	'x-accel-buffering': AI_SDK_UI_MESSAGE_STREAM_V1_HEADERS['x-accel-buffering'],
}

export const answerKnowledgeQuestionStreamBuilder = knowledgeV1ServiceBuilder
	.getStreamBuilder('streamAnswerKnowledgeQuestion', 'Stream a grounded answer through AI SDK UI Message Stream v1')
	.addPayloadSchema(inputSchema)
	.addParameterSchema(parameterSchema)
	.addChunkSchema(chunkSchema)
	.addFinalSchema(finalSchema)
	.canInvokeAgent('Knowledge', '1', answerKnowledgeQuestionAgent.contract)
	.exposeAsHttpStreamEndpoint('POST', 'knowledge/chat')
	.enableHttpSecurity(true)
	.enableChunkAggregation(false)
	.setHttpStreamingMode('stream')
	.setHttpStreamProtocol('ai-sdk-ui-message-stream-v1')
	.setHttpResponseHeaders(protocolHeaders)
	.setOpenApiSummary('Chat with authorized knowledge')
	.addOpenApiTags('knowledge', 'ai')
	.setStreamFunction(async function (context, payload, _parameter, writer) {
		const request = await parseHarnessUIMessageRequest(payload)
		const question = request.lastUserMessage.parts
			.flatMap((part) => (part.type === 'text' ? [part.text] : []))
			.join('\n')
		const events = await context.agent.Knowledge['1'][answerKnowledgeQuestionAgent.contract.id].stream(
			{ collectionId: payload.collectionId, question },
			request.resume === undefined
				? { sessionId: request.sessionId }
				: { sessionId: request.sessionId, resume: request.resume },
		)
		let cancellation = Promise.resolve()
		writer.onCancel((reason) => {
			cancellation = events.cancel(reason)
		})
		try {
			for await (const record of createHarnessUIMessageSseEvents(events, {
				sessionId: request.sessionId,
				...(request.assistantMessageId === undefined ? {} : { messageId: request.assistantMessageId }),
			})) {
				await writer.write(record)
			}
			if (!writer.cancelled) await writer.close()
		} finally {
			await cancellation
		}
	})
