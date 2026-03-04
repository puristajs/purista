import { AgentBuilder, type AgentHandlerContext, agentProtocolEnvelopeSchema } from '@purista/ai'
import { type SupportAgentInput, supportAgentInputSchema } from './schema.js'

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

export const supportAgent = new AgentBuilder({
	agentName: 'supportAgent',
	agentVersion: '1',
	description: 'Support agent using tool calls and optional delegation to triageAgent',
})
	.addPayloadSchema(supportAgentInputSchema)
	.defineModel('openai:gpt-5.2-mini')
	.persistConversation('user', { maxFrames: 20 })
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
		const userPrompt = payload.prompt ?? payload.message ?? ''
		const model = context.models['openai:gpt-5.2-mini']
		await context.conversation.addUser(userPrompt)

		context.stream.sendChunk('Checking FAQ knowledge...')
		const faqResult = await context.tools.invoke('support.1.lookupFaq', { question: userPrompt })
		const faqAnswer =
			typeof faqResult === 'object' && faqResult && 'answer' in faqResult && typeof faqResult.answer === 'string'
				? faqResult.answer
				: 'No matching FAQ article was found.'

		let triageSummary = ''
		if (/refund|enterprise|legal|urgent/i.test(userPrompt)) {
			context.stream.sendChunk('Escalating to triage agent...')
			const triagePayload: Record<string, unknown> = {
				prompt: userPrompt,
			}
			if (payload.sessionId) {
				triagePayload.sessionId = payload.sessionId
			}
			const triageResult = await context.tools.invoke('triageAgent.1.run', {
				...triagePayload,
			})
			triageSummary = getFinalMessage(triageResult)
		}

		context.stream.sendChunk('Generating final answer...')
		const result = await model.generate({
			prompt: [
				await context.conversation.buildPromptInput(),
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
		await context.conversation.addAssistant(answer)
		context.stream.sendFinal(answer)

		return {
			message: answer,
		}
	})
	.build()
