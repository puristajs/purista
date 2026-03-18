import { MockModel, testAgent } from '@purista/ai'
import { DefaultQueueBridge, initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { supportV1Service } from '../../../service/support/v1/index.js'
import { triageAgent } from '../../triageAgent/v1/triageAgent.js'
import { supportAgent } from './supportAgent.js'

describe('supportAgent', () => {
	it('uses tool calls, optional agent delegation, and emits final/telemetry frames', async () => {
		const logger = initLogger('error')
		const queueBridge = new DefaultQueueBridge()
		const model = new MockModel()
			.on(/.*/)
			.reply(request => `MODEL:${request.prompt}`)
			.onJson(/Classify this request urgency/i)
			.reply({
				urgency: 'low',
				explanation: 'deterministic explanation',
				nextSteps: 'deterministic next steps',
			})

		const { eventBridge, destroy: destroyTriage } = await testAgent(triageAgent, {
			logger,
			models: { 'openai:gpt-4o-mini': model },
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		const supportService = await supportV1Service.getInstance(eventBridge, { logger })
		await supportService.start()
		const { instance: supportAgentInstance, destroy: destroySupport } = await testAgent(supportAgent, {
			eventBridge,
			logger,
			models: { 'openai:gpt-4o-mini': model },
			queueBridge,
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		await new Promise(resolve => setTimeout(resolve, 25))

		try {
			const { envelopes } = await supportAgentInstance.invoke({
				payload: {
					prompt: 'This is an urgent enterprise production incident, escalate if needed.',
					message: 'This is an urgent enterprise production incident, escalate if needed.',
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

			const runStateFrames = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'artifact' }> =>
						frame.kind === 'artifact' && frame.artifactId === 'run-state',
				)

			expect(finalMessage).toContain('MODEL:')
			expect(runStateFrames.length).toBeGreaterThan(0)
		} finally {
			await destroySupport()
			await supportService.destroy()
			await destroyTriage()
			await queueBridge.destroy()
		}
	})

	it('continues with tool-based fallback when triage delegation fails', async () => {
		const logger = initLogger('error')
		const queueBridge = new DefaultQueueBridge()
		const supportModel = new MockModel().on(/.*/).reply(request => `MODEL:${request.prompt}`)
		const triageModel = new MockModel().onJson(/Classify this request urgency/i).reply(() => {
			throw new Error('upstream model unavailable')
		})

		const { eventBridge, destroy: destroyTriage } = await testAgent(triageAgent, {
			logger,
			models: { 'openai:gpt-4o-mini': triageModel },
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})
		const supportService = await supportV1Service.getInstance(eventBridge, { logger })
		await supportService.start()
		const { instance: supportAgentInstance, destroy: destroySupport } = await testAgent(supportAgent, {
			eventBridge,
			logger,
			models: { 'openai:gpt-4o-mini': supportModel },
			queueBridge,
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		await new Promise(resolve => setTimeout(resolve, 25))

		try {
			const { envelopes } = await supportAgentInstance.invoke({
				payload: {
					prompt: 'urgent enterprise incident',
					message: 'urgent enterprise incident',
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

			const runStateFrames = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'artifact' }> =>
						frame.kind === 'artifact' && frame.artifactId === 'run-state',
				)

			expect(finalMessage).toContain('MODEL:')
			expect(runStateFrames.length).toBeGreaterThan(0)
		} finally {
			await destroySupport()
			await supportService.destroy()
			await destroyTriage()
			await queueBridge.destroy()
		}
	})
})
