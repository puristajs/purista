import type {
	ModelProvider,
	ProviderJsonRequest,
	ProviderJsonResponse,
	ProviderRequest,
	ProviderResponse,
} from '@purista/ai'
import { DefaultEventBridge, initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { supportV1Service } from '../../../service/support/v1/index.js'
import { triageAgent } from '../../triageAgent/v1/triageAgent.js'
import { supportAgent } from './supportAgent.js'

class DeterministicProvider implements ModelProvider {
	readonly name = 'deterministic-test-provider'
	readonly capabilities = { text: true, stream: true }

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

	async generateJson<T = unknown>(_request: ProviderJsonRequest): Promise<ProviderJsonResponse<T>> {
		return {
			data: {
				urgency: 'low',
				explanation: 'deterministic explanation',
				nextSteps: 'deterministic next steps',
			} as T,
			text: '{"urgency":"low"}',
			tokens: {
				prompt: 1,
				completion: 1,
			},
		}
	}
}

class FailingProvider implements ModelProvider {
	readonly name = 'failing-test-provider'
	readonly capabilities = { text: true }

	async generate(_request: ProviderRequest): Promise<ProviderResponse> {
		throw new Error('upstream model unavailable')
	}

	async generateJson<T = unknown>(_request: ProviderJsonRequest): Promise<ProviderJsonResponse<T>> {
		throw new Error('upstream model unavailable')
	}
}

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

describe('supportAgent', () => {
	it('uses tool calls, optional agent delegation, and emits final/telemetry frames', async () => {
		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()

		const provider = new DeterministicProvider()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger })
		const triageAgentInstance = await triageAgent.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			poolConfig: { maxWorkers: 1 },
		})
		const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			poolConfig: { maxWorkers: 1 },
		})

		await supportService.start()
		await triageAgentInstance.start()
		await supportAgentInstance.start()
		await waitForRegistration()

		try {
			const { envelopes } = await supportAgentInstance.invoke({
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
			await supportAgentInstance.stop()
			await triageAgentInstance.stop()
			await supportService.destroy()
			await eventBridge.destroy()
		}
	})

	it('continues with faq-only fallback when triage delegation fails', async () => {
		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()

		const supportProvider = new DeterministicProvider()
		const triageProvider = new FailingProvider()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger })
		const triageAgentInstance = await triageAgent.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-4o-mini': triageProvider },
			poolConfig: { maxWorkers: 1 },
		})
		const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-4o-mini': supportProvider },
			poolConfig: { maxWorkers: 1 },
		})

		await supportService.start()
		await triageAgentInstance.start()
		await supportAgentInstance.start()
		await waitForRegistration()

		try {
			const { envelopes } = await supportAgentInstance.invoke({
				payload: {
					prompt: 'urgent refund request',
					message: 'urgent refund request',
					history: [],
					attachments: [],
				},
			})

			const finalMessage = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> =>
						frame.kind === 'message' && frame.final === true,
				)
				.map(frame => frame.content)
				.at(-1)

			const toolFrames = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'tool' }> => frame.kind === 'tool',
				)

			expect(toolFrames.some(frame => frame.toolName === 'triageAgent.1.run' && frame.status === 'success')).toBe(true)
			expect(
				envelopes.some(
					envelope =>
						envelope.frame.kind === 'message' &&
						envelope.frame.content === 'Triage unavailable right now, continuing with FAQ guidance.',
				),
			).toBe(true)
			expect(finalMessage).toContain('MODEL:')
		} finally {
			await supportAgentInstance.stop()
			await triageAgentInstance.stop()
			await supportService.destroy()
			await eventBridge.destroy()
		}
	})
})
