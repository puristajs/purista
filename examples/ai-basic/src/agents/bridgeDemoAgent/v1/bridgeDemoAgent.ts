import { AgentBuilder } from '@purista/ai'
import { type BridgeDemoAgentInput, bridgeDemoAgentInputSchema } from './schema.js'

// biome-ignore lint/correctness/useHookAtTopLevel: AgentBuilder.useSkills is a builder method, not a React hook.
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
		const run = await context.memory.run.start({
			title: 'External bridge orchestration',
			phase: 'planning',
			extraScope: {
				sessionId: payload.sessionId ?? context.input.message.id,
			},
		})
		await context.memory.conversation.addUser(payload.prompt)
		await run.plan([
			{ id: 'lookup', title: 'Lookup support guidance' },
			{ id: 'answer', title: 'Compose bridged answer' },
		])
		await run.update({ phase: 'running', status: 'running' })

		const answer = await run.step(
			'answer',
			async () =>
				await context.ai.models['openai:gpt-4o-mini'].generateText({
					developerInstruction: [
						'Use the provided tools before answering.',
						'Return one concise answer that includes the FAQ guidance and a short urgency recommendation.',
					],
					prompt: [
						`Customer request: ${payload.prompt}`,
						'Use support.1.lookupFaq to retrieve the relevant guidance.',
					].join('\n'),
					onTextDelta: delta => context.io.stream.sendChunk(delta),
				}),
			{ detail: 'Running external bridge tool loop', checkpoint: 'bridge-answer' },
		)

		await context.memory.conversation.addAssistant(answer)
		await run.setFinalMessage(answer)
		await run.finishSuccess(answer)
		context.io.stream.sendFinal(answer)
		return { message: answer }
	})
	.build()
