import { MockModel, testAgent } from '@purista/ai'
import { initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { supportV1Service } from '../../../service/support/v1/index.js'
import { triageAgent } from '../../triageAgent/v1/triageAgent.js'
import { supportAgent } from './supportAgent.js'

describe('supportAgent', () => {
	it('uses tool calls, optional agent delegation, and emits final/telemetry frames', async () => {
		const logger = initLogger('error')
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
			expect(finalMessage).toContain('MODEL:')
			expect(telemetryFrames.length).toBeGreaterThan(0)
		} finally {
			await destroySupport()
			await supportService.destroy()
			await destroyTriage()
		}
	})

	it('continues with tool-based fallback when triage delegation fails', async () => {
		const logger = initLogger('error')
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

			expect(
				envelopes.some(
					envelope =>
						envelope.frame.kind === 'message' &&
						envelope.frame.content === 'Triage unavailable right now, continuing with tool-based guidance.',
				),
			).toBe(true)
			expect(finalMessage).toContain('MODEL:')
		} finally {
			await destroySupport()
			await supportService.destroy()
			await destroyTriage()
		}
	})
})
