import { AgentBuilder, type AgentHandlerContext, type SessionRecord } from '@purista/ai'
import { type SupportAgentInput, supportAgentInputSchema } from './schema.js'

const buildSessionRecord = (sessionId: string, lastOutput: string): SessionRecord => ({
	sessionId,
	data: {
		lastOutput,
	},
	updatedAt: Date.now(),
})

type SupportAgentContext = AgentHandlerContext<SupportAgentInput, unknown>

export const supportAgentDefinition = new AgentBuilder({
	agentName: 'supportAgent',
	agentVersion: '1',
	description: 'Answers basic support FAQs using canned responses',
})
	.addPayloadSchema(supportAgentInputSchema)
	.defineModel('openai:gpt-5.2-mini')
	.persistHistory({ storeName: 'aiConversation', maxFrames: 20 })
	.setConcurrency({ poolId: 'support' })
	.exposeAsHttpEndpoint('POST', 'agents/supportAgent')
	.setHandler<SupportAgentInput>(async function (context: SupportAgentContext, payload) {
		const sessionId = payload.sessionId ?? context.message.id ?? 'session'
		const model = context.models['openai:gpt-5.2-mini']

		context.stream.sendChunk('Let me check that for you...')
		const result = await model.generate({
			prompt: payload.prompt,
			context: payload.context,
			metadata: {
				aiSdk: {
					temperature: 0.2,
				},
			},
		})
		const answer = result.output
		context.stream.sendFinal(answer)

		await context.session.save(buildSessionRecord(sessionId, answer))

		return {
			message: answer,
		}
	})
	.build()
