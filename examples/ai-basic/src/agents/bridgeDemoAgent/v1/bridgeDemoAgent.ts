import { AgentBuilder } from '@purista/ai'
import { type BridgeDemoAgentInput, bridgeDemoAgentInputSchema } from './schema.js'

export const bridgeDemoAgent = new AgentBuilder({
	agentName: 'bridgeDemoAgent',
	agentVersion: '1',
	description: 'Queued durable example that bridges PURISTA commands into an external AI SDK tool loop',
})
	.addPayloadSchema(bridgeDemoAgentInputSchema)
	.defineModel('openai:gpt-4o-mini', { capabilities: ['text', 'stream'] })
	.useSkills(['spec-elicitation', 'tool-loop-discipline'])
	.setExecutionMode('queued')
	.setExecutionPolicy({
		httpBehavior: 'attach-and-stream',
		recovery: 'resume-from-checkpoints',
		scopeFromPayload: ['sessionId'],
		maxAttempts: 2,
	})
	.persistConversation('user', { maxFrames: 10 })
	.canInvoke('support', '1', 'lookupFaq')
	.exposeAsHttpEndpoint('POST', 'agents/bridgeDemoAgent')
	.setSseProtocol('ai-sdk-ui-message')
	.setHandler<BridgeDemoAgentInput>(async (context, payload) => {
		const run = await context.runState.start({
			title: 'External bridge orchestration',
			phase: 'planning',
			extraScope: {
				sessionId: payload.sessionId ?? context.message.id,
			},
		})
		await context.conversation.addUser(payload.prompt)
		await run.plan([
			{ id: 'lookup', title: 'Lookup support guidance' },
			{ id: 'answer', title: 'Compose bridged answer' },
		])
		await run.update({ phase: 'running', status: 'running' })

		const answer = await run.step(
			'answer',
			async () =>
				await context.models['openai:gpt-4o-mini'].generateText({
					developerInstruction: [
						'Use the provided tools before answering.',
						'Return one concise answer that includes the FAQ guidance and a short urgency recommendation.',
					],
					prompt: [
						`Customer request: ${payload.prompt}`,
						'Use support.1.lookupFaq to retrieve the relevant guidance.',
					].join('\n'),
					onTextDelta: delta => context.stream.sendChunk(delta),
				}),
			{ detail: 'Running external bridge tool loop', checkpoint: 'bridge-answer' },
		)

		await context.conversation.addAssistant(answer)
		await run.setFinalMessage(answer)
		await run.finishSuccess(answer)
		context.stream.sendFinal(answer)
		return { message: answer }
	})
	.build()
