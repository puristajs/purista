import { AgentBuilder, type AgentHandlerContext } from '@purista/ai'
import { z } from 'zod/v4'

import { type TriageAgentInput, triageAgentInputSchema } from './schema.js'

type TriageAgentContext = AgentHandlerContext<TriageAgentInput, unknown>
const triageJsonSchema = z.object({
	urgency: z.enum(['low', 'medium', 'high']),
	explanation: z.string().min(1),
	nextSteps: z.string().min(1),
})

export const triageAgent = new AgentBuilder({
	agentName: 'triageAgent',
	agentVersion: '1',
	description: 'Escalation helper agent',
})
	.addPayloadSchema(triageAgentInputSchema)
	.defineModel('openai:gpt-4o-mini', { capabilities: ['text', 'json'] })
	.persistConversation('agent', { maxFrames: 10 })
	.setHandler<TriageAgentInput>(async function (context: TriageAgentContext, payload) {
		const model = context.models['openai:gpt-4o-mini']
		const generateJson = model.generateJson
		if (typeof generateJson !== 'function') {
			throw new Error('Configured triage model does not support JSON generation')
		}

		context.stream.sendChunk('Escalation check in progress...')
		const result = await generateJson<z.infer<typeof triageJsonSchema>>({
			prompt: `Classify this request urgency and produce JSON with urgency, explanation, and nextSteps: ${payload.prompt}`,
			schema: triageJsonSchema,
			metadata: {
				aiSdk: {
					temperature: 0,
				},
			},
		})

		const answer = `**Urgency Classification:** ${result.data.urgency}\n\n**Explanation:** ${result.data.explanation}\n\n**Next Steps:** ${result.data.nextSteps}`
		context.stream.sendFinal(answer)
		return {
			message: answer,
		}
	})
	.build()
