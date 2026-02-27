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

export const supportAgentDefinition = AgentBuilder.create({
	agentName: 'supportAgent',
	agentVersion: '1',
	description: 'Answers basic support FAQs using canned responses',
})
	.addPayloadSchema(supportAgentInputSchema)
	.persistHistory({ storeName: 'aiConversation', maxFrames: 20 })
	.setConcurrency({ poolId: 'support', maxWorkers: 2 })
	.exposeAsHttpEndpoint('POST', 'agents/supportAgent')
	.setStreamingMode('sse')
	.setHandler<SupportAgentInput>(async function (context: SupportAgentContext, payload) {
		const sessionId = payload.sessionId ?? context.message.id ?? 'session'

		context.protocol.emitMessage({ content: 'Let me check that for you...', partial: true })
		const answer = `Reset instructions: open the profile page and click "Reset Password". (Question: ${payload.prompt})`
		context.protocol.emitMessage({ content: answer, final: true })

		await context.session.save(buildSessionRecord(sessionId, answer))

		return {
			message: answer,
		}
	})
	.build()
