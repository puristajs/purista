import { AI_SDK_UI_MESSAGE_STREAM_V1_HEADERS, createHarnessUIMessageSseEvents } from '@purista/harness-ai-sdk-ui/v1'
import { knowledgeHarness } from '../../harness/knowledgeHarnessMount.js'
import { knowledgeV1ServiceBuilder } from '../../knowledgeV1ServiceBuilder.js'
import {
	aiSdkUiMessageSseEventSchema,
	answerKnowledgeQuestionFinalSchema,
	answerKnowledgeQuestionHttpInputSchema,
} from '../../schema.js'
import { latestUserText } from './latestUserText.js'

export const answerKnowledgeQuestionStreamBuilder = knowledgeV1ServiceBuilder
	.getStreamBuilder('answerKnowledgeQuestion', 'Stream a grounded answer through AI SDK UI Message Stream v1')
	.addPayloadSchema(answerKnowledgeQuestionHttpInputSchema)
	.addChunkSchema(aiSdkUiMessageSseEventSchema)
	.addFinalSchema(answerKnowledgeQuestionFinalSchema)
	.canInvokeWorkflow(
		'Knowledge',
		'1',
		'answer_knowledge_question',
		knowledgeHarness.contracts.workflows.answer_knowledge_question,
	)
	.exposeAsHttpStreamEndpoint('POST', 'knowledge/chat')
	.setHttpStreamProtocol('ai-sdk-ui-message-stream-v1')
	.setHttpResponseHeaders(AI_SDK_UI_MESSAGE_STREAM_V1_HEADERS)
	.setOpenApiSummary('Chat with authorized knowledge')
	.addOpenApiTags('knowledge', 'ai')
	.setStreamFunction(async function (context, payload, _parameter, writer) {
		const execution = await context.workflow.Knowledge['1'].answer_knowledge_question.stream(
			{
				collectionId: payload.collectionId,
				question: latestUserText(payload.messages),
			},
			{ sessionId: `knowledge-chat:${payload.id}` },
		)
		writer.onCancel(() => {
			void execution.cancel('browser disconnected')
		})

		for await (const event of createHarnessUIMessageSseEvents(execution)) {
			if (writer.cancelled) return
			await writer.write(event)
		}
		if (!writer.cancelled) await writer.close({ status: 'completed' })
	})
