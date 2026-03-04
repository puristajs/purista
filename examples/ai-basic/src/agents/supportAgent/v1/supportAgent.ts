import { AgentBuilder, type AgentHandlerContext, agentProtocolEnvelopeSchema, type SessionRecord } from '@purista/ai'
import { type SupportAgentInput, supportAgentInputSchema } from './schema.js'

const buildSessionRecord = (sessionId: string, lastOutput: string): SessionRecord => ({
	sessionId,
	data: {
		lastOutput,
	},
	updatedAt: Date.now(),
})

type SupportAgentContext = AgentHandlerContext<SupportAgentInput, unknown>

const getFinalMessage = (value: unknown): string => {
	const envelopes = agentProtocolEnvelopeSchema.array().parse(value)
	return (
		envelopes
			.map(envelope => envelope.frame)
			.filter(
				(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> =>
					frame.kind === 'message' && frame.final === true,
			)
			.map(frame => frame.content)
			.at(-1)
			?.trim() ?? ''
	)
}

export const supportAgentDefinition = new AgentBuilder({
	agentName: 'supportAgent',
	agentVersion: '1',
	description: 'Support agent using tool calls and optional delegation to triageAgent',
})
	.addPayloadSchema(supportAgentInputSchema)
	.defineModel('openai:gpt-5.2-mini')
	.persistHistory({ storeName: 'aiConversation', maxFrames: 20 })
	.setConcurrency({ poolId: 'support' })
	.allowTool({
		serviceName: 'support',
		serviceVersion: '1',
		commandName: 'lookupFaq',
	})
	.allowTool({
		serviceName: 'triageAgent',
		serviceVersion: '1',
		commandName: 'run',
	})
	.exposeAsHttpEndpoint('POST', 'agents/supportAgent', 'application/json', undefined, 'text/event-stream')
	.setHandler<SupportAgentInput>(async function (context: SupportAgentContext, payload) {
		const sessionId = payload.sessionId ?? context.message.id ?? 'session'
		const userPrompt = payload.prompt ?? payload.message ?? ''
		const model = context.models['openai:gpt-5.2-mini']

		context.stream.sendChunk('Checking FAQ knowledge...')
		const faqResult = await context.tools.invoke('support.1.lookupFaq', { question: userPrompt })
		const faqAnswer =
			typeof faqResult === 'object' && faqResult && 'answer' in faqResult && typeof faqResult.answer === 'string'
				? faqResult.answer
				: 'No matching FAQ article was found.'

		let triageSummary = ''
		if (/refund|enterprise|legal|urgent/i.test(userPrompt)) {
			context.stream.sendChunk('Escalating to triage agent...')
			const triageResult = await context.tools.invoke('triageAgent.1.run', {
				prompt: userPrompt,
				sessionId,
			})
			triageSummary = getFinalMessage(triageResult)
		}

		context.stream.sendChunk('Generating final answer...')
		const result = await model.generate({
			prompt: [
				`Customer prompt: ${userPrompt}`,
				`FAQ answer: ${faqAnswer}`,
				triageSummary ? `Triage summary: ${triageSummary}` : undefined,
			]
				.filter(Boolean)
				.join('\n'),
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
