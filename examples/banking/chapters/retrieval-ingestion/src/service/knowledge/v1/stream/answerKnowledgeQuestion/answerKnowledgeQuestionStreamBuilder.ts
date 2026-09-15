import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import {
	AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL,
	parseHarnessUIMessageRequest,
	pipeHarnessUIMessageStream,
} from '@purista/harness-ai-sdk-ui/v1'
import { z } from 'zod'
import { answerKnowledgeQuestionAgent } from '../../harness/agent/answerKnowledgeQuestion/answerKnowledgeQuestionAgent.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'

const inputSchema = z.object({ collectionId: z.string().min(1) }).passthrough()
const parameterSchema = z.object({})
const chunkSchema = z.object({ event: z.literal('data'), data: z.unknown() })
const finalSchema = z.void()

export const answerKnowledgeQuestionStreamBuilder = knowledgeV1ServiceBuilder
	.getStreamBuilder('streamAnswerKnowledgeQuestion', 'Stream a grounded answer through AI SDK UI Message Stream v1')
	.addPayloadSchema(inputSchema)
	.addParameterSchema(parameterSchema)
	.addChunkSchema(chunkSchema)
	.addFinalSchema(finalSchema)
	.canInvokeAgent(knowledgeV1ServiceBuilder.harnessTarget(answerKnowledgeQuestionAgent.contract))
	.exposeAsHttpStreamEndpoint('POST', 'knowledge/chat')
	.enableHttpSecurity(true)
	.setHttpStreamProtocol(AI_SDK_UI_MESSAGE_STREAM_V1_PROTOCOL)
	.setOpenApiSummary('Chat with authorized knowledge')
	.addOpenApiTags('knowledge', 'ai')
	.setStreamFunction(async function (context, payload, _parameter, writer) {
		const { tenantId, principalId } = context.message
		if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		const sessionId = createHash('sha256')
			.update(JSON.stringify([tenantId, principalId, payload.collectionId, payload.id]))
			.digest('base64url')
		const request = await parseHarnessUIMessageRequest(payload, { sessionId })
		const question = request.lastUserMessage.parts
			.flatMap((part) => (part.type === 'text' ? [part.text] : []))
			.join('\n')
		const target = context.agent.Knowledge['1'][answerKnowledgeQuestionAgent.contract.id]
		const events =
			request.resume === undefined
				? await target.stream({ collectionId: payload.collectionId, question }, { sessionId: request.sessionId })
				: await target.resume(request.resume).stream({ sessionId: request.sessionId })
		await pipeHarnessUIMessageStream(events, writer, request)
	})
