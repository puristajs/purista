import type { ModelProvider, ProviderRequest } from '@purista/ai'
import { DefaultEventBridge, initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { supportV1Service } from '../../../service/support/v1/index.js'
import { triageAgentDefinition } from '../../triageAgent/v1/triageAgent.js'
import { supportAgentDefinition } from './supportAgent.js'

class DeterministicProvider implements ModelProvider {
	readonly name = 'deterministic-test-provider'

	async generate(request: ProviderRequest) {
		return {
			output: `MODEL:${request.prompt}`,
			tokens: {
				prompt: request.prompt.length,
				completion: 12,
			},
			costUsd: 0,
		}
	}
}

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

describe('supportAgentDefinition', () => {
	it('uses tool calls, optional agent delegation, and emits final/telemetry frames', async () => {
		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()

		const provider = new DeterministicProvider()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger })
		const triageAgent = await triageAgentDefinition.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-5.2-mini': provider },
			poolConfig: { maxWorkers: 1 },
		})
		const supportAgent = await supportAgentDefinition.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-5.2-mini': provider },
			poolConfig: { maxWorkers: 1 },
		})

		await supportService.start()
		await triageAgent.start()
		await supportAgent.start()
		await waitForRegistration()

		try {
			const { envelopes } = await supportAgent.invoke({
				payload: {
					prompt: 'I need an urgent refund for enterprise billing',
					message: 'I need an urgent refund for enterprise billing',
					history: [],
					attachments: [],
				},
			})

			const toolFrames = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'tool' }> => frame.kind === 'tool',
				)

			const finalMessage = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> =>
						frame.kind === 'message' && frame.final === true,
				)
				.map(frame => frame.content)
				.at(-1)

			const telemetryFrames = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'telemetry' }> =>
						frame.kind === 'telemetry',
				)

			expect(toolFrames.some(frame => frame.toolName === 'support.1.lookupFaq' && frame.status === 'success')).toBe(
				true,
			)
			expect(toolFrames.some(frame => frame.toolName === 'triageAgent.1.run' && frame.status === 'success')).toBe(true)
			expect(finalMessage).toContain('MODEL:')
			expect(telemetryFrames.length).toBeGreaterThan(0)
		} finally {
			await supportAgent.stop()
			await triageAgent.stop()
			await supportService.destroy()
			await eventBridge.destroy()
		}
	})
})
