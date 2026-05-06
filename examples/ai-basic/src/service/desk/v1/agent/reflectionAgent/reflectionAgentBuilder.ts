import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import type { ReflectionCritique } from './schema.js'
import { type ReflectionAgentInput, reflectionAgentInputSchema, reflectionAgentResponseSchema } from './schema.js'

export const reflectionAgentBuilder = deskV1ServiceBuilder
	.getAgentQueueBuilder('reflectionAgent', 'Runs a propose-reflect-refine loop and exposes reflection artifacts')
	.addPayloadSchema(reflectionAgentInputSchema)
	.addOutputSchema(reflectionAgentResponseSchema)
	.addModel('openai:gpt-4o-mini')
	.exposeAsHttpEndpoint('POST', 'agents/reflectionAgent')
	.setStreamProtocolAdapter('ai-sdk.ui-message')
	.setAgentFunction(async function (context, payload: ReflectionAgentInput) {
		await context.memory.conversation.addUser(payload.prompt, {
			sessionId: payload.sessionId,
			metadata: { scenario: 'reflection' },
		})

		const run = await context.memory.run.start({
			title: 'Developer desk reflection run',
		})

		const result = await context.ai.reflect.run<string, ReflectionCritique>({
			name: 'delivery-proposal',
			maxIterations: 2,
			draft: async ({ iteration, previousDraft }) =>
				previousDraft ??
				(await context.ai.models['openai:gpt-4o-mini'].generateText({
					prompt: `Draft version ${iteration} for this engineering proposal request:
${payload.prompt}`,
				})),
			critique: async ({ iteration, draft }) => ({
				accepted: iteration > 1 || draft.toLowerCase().includes('revision 2'),
				score: iteration > 1 || draft.toLowerCase().includes('revision 2') ? 9 : 6,
				notes:
					iteration > 1 || draft.toLowerCase().includes('revision 2')
						? ['Proposal is now concrete enough to execute.']
						: ['Add clearer sequencing, rollout constraints, and risk framing before accepting.'],
			}),
			accept: async ({ critique }) => critique.accepted,
			refine: async ({ iteration, draft, critique }) =>
				`${draft}

Revision ${iteration}: ${critique.notes.join(' ')}`,
		})

		const message = await context.ai.streamText({
			model: 'openai:gpt-4o-mini',
			prompt: `Summarize the final proposal revision for the developer.

Original request:
${payload.prompt}

Final draft:
${result.output}

Final critique:
${JSON.stringify(result.finalCritique, null, 2)}`,
		})

		await context.memory.conversation.addAssistant(message, {
			sessionId: payload.sessionId,
			metadata: { agent: 'reflectionAgent', scenario: 'reflection' },
		})
		await run.finish({
			status: 'completed',
			summary: 'Reflection loop completed',
			finalMessage: message,
		})

		return {
			message,
			output: {
				message,
				draft: result.output,
				critique: result.finalCritique,
				iterations: result.iterations,
				accepted: result.accepted,
			},
		}
	})
