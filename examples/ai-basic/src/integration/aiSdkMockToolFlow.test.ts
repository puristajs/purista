import { type AgentProtocolEnvelope, AiSdkProvider } from '@purista/ai'
import { DefaultEventBridge, initLogger } from '@purista/core'
import { simulateReadableStream } from 'ai'
import { MockLanguageModelV3 } from 'ai/test'
import { describe, expect, it } from 'vitest'

import { supportAgent } from '../agents/supportAgent/v1/supportAgent.js'
import { supportV1Service } from '../service/support/v1/index.js'

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

const getMessageFrames = (envelopes: AgentProtocolEnvelope[]) =>
	envelopes
		.map(envelope => envelope.frame)
		.filter(
			(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> => frame.kind === 'message',
		)

describe('ai-basic integration with ai/test mock model', () => {
	it('streams mocked AI SDK output while executing allowlisted tools', async () => {
		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()

		const streamModel = new MockLanguageModelV3({
			provider: 'mock-provider',
			modelId: 'mock-stream-model',
			doStream: (async () => ({
				stream: simulateReadableStream({
					chunks: [
						{ type: 'stream-start', warnings: [] },
						{ type: 'text-start', id: 'text-1' },
						{ type: 'text-delta', id: 'text-1', delta: 'Mocked answer: ' },
						{ type: 'text-delta', id: 'text-1', delta: 'reset your password in account settings.' },
						{ type: 'text-end', id: 'text-1' },
						{
							type: 'finish',
							finishReason: 'stop',
							usage: {
								inputTokens: { total: 11, noCache: undefined, cacheRead: undefined, cacheWrite: undefined },
								outputTokens: { total: 9, reasoning: undefined, accepted: undefined, rejected: undefined },
								totalTokens: 20,
							},
						},
					],
					chunkDelayInMs: 0,
				}),
			})) as any,
		})

		const provider = new AiSdkProvider({
			model: streamModel as any,
			systemPrompt: 'You are a support helper.',
		})

		const supportService = await supportV1Service.getInstance(eventBridge, { logger })
		const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
			logger,
			models: {
				'openai:gpt-4o-mini': provider,
			},
			poolConfig: { maxWorkers: 1 },
		})

		await supportService.start()
		await supportAgentInstance.start()
		await waitForRegistration()

		try {
			const { envelopes } = await supportAgentInstance.invoke({
				payload: {
					prompt: 'How do I reset my password?',
					message: 'How do I reset my password?',
					history: [],
					attachments: [],
				},
			})

			const toolFrames = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'tool' }> => frame.kind === 'tool',
				)

			expect(toolFrames.some(frame => frame.toolName === 'support.1.lookupFaq' && frame.status === 'success')).toBe(
				true,
			)

			const messageFrames = getMessageFrames(envelopes)
			const partialFrames = messageFrames.filter(frame => frame.partial === true)
			const finalFrame = [...messageFrames].reverse().find(frame => frame.final === true)

			expect(partialFrames.length).toBeGreaterThan(1)
			expect(finalFrame?.content).toContain('Mocked answer: reset your password in account settings.')
			expect(envelopes.some(envelope => envelope.frame.kind === 'telemetry')).toBe(true)
		} finally {
			await supportAgentInstance.stop()
			await supportService.destroy()
			await eventBridge.destroy()
		}
	})
})
