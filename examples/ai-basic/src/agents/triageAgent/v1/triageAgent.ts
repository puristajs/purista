import { AgentBuilder, type AgentHandlerContext } from '@purista/ai'

import { type TriageAgentInput, triageAgentInputSchema } from './schema.js'

type TriageAgentContext = AgentHandlerContext<TriageAgentInput, unknown>

export const triageAgent = new AgentBuilder({
	agentName: 'triageAgent',
	agentVersion: '1',
	description: 'Escalation helper agent',
})
	.addPayloadSchema(triageAgentInputSchema)
	.defineModel('openai:gpt-5.2-mini')
	.persistHistory('agent', { maxFrames: 10 })
	.setHandler<TriageAgentInput>(async function (context: TriageAgentContext, payload) {
		const model = context.models['openai:gpt-5.2-mini']

		context.stream.sendChunk('Escalation check in progress...')
		const result = await model.generate({
			prompt: `Classify this support ticket urgency and explain in one sentence: ${payload.prompt}`,
			metadata: {
				aiSdk: {
					temperature: 0,
				},
			},
		})

		const answer = result.output
		context.stream.sendFinal(answer)
		return {
			message: answer,
		}
	})
	.build()
