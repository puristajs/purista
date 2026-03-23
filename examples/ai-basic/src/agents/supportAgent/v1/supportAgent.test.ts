import { createAgentTestHarness, ScriptedModel } from '@purista/ai'
import { DefaultQueueBridge, initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { exampleSkills } from '../../../skills.js'
import { supportV1Service } from '../../../service/support/v1/index.js'
import { triageAgent } from '../../triageAgent/v1/triageAgent.js'
import { supportAgent } from './supportAgent.js'

describe('supportAgent', () => {
	it('uses tool calls, optional agent delegation, and emits final/telemetry frames', async () => {
		const logger = initLogger('error')
		const queueBridge = new DefaultQueueBridge()
		const triageModel = new ScriptedModel().nextJson({
			urgency: 'low',
			explanation: 'deterministic explanation',
			nextSteps: 'deterministic next steps',
		})
		const supportModel = new ScriptedModel().nextText(request => `MODEL:${request.prompt}`)

		const triageHarness = await createAgentTestHarness(triageAgent, {
			logger,
			models: { 'openai:gpt-4o-mini': triageModel },
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		const supportService = await supportV1Service.getInstance(triageHarness.eventBridge, { logger })
		await supportService.start()
		const supportHarness = await createAgentTestHarness(supportAgent, {
			eventBridge: triageHarness.eventBridge,
			logger,
			models: { 'openai:gpt-4o-mini': supportModel },
			queueBridge,
			resources: {
				supportPolicy: {
					developerInstruction: 'Keep answers concise and actionable.',
				},
			},
			skills: exampleSkills,
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		await new Promise(resolve => setTimeout(resolve, 25))

		try {
			const result = await supportHarness.run({
				payload: {
					prompt: 'This is an urgent enterprise production incident, escalate if needed.',
					message: 'This is an urgent enterprise production incident, escalate if needed.',
					history: [],
					attachments: [],
				},
			})

			expect(result.finalMessage).toContain('MODEL:')
			expect(result.runStateArtifacts.length).toBeGreaterThan(0)
		} finally {
			await supportHarness.destroy()
			await supportService.destroy()
			await triageHarness.destroy()
			await queueBridge.destroy()
		}
	})

	it('continues with tool-based fallback when triage delegation fails', async () => {
		const logger = initLogger('error')
		const queueBridge = new DefaultQueueBridge()
		const supportModel = new ScriptedModel().nextText(request => `MODEL:${request.prompt}`)
		const triageModel = new ScriptedModel().nextError(() => new Error('upstream model unavailable'))

		const triageHarness = await createAgentTestHarness(triageAgent, {
			logger,
			models: { 'openai:gpt-4o-mini': triageModel },
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})
		const supportService = await supportV1Service.getInstance(triageHarness.eventBridge, { logger })
		await supportService.start()
		const supportHarness = await createAgentTestHarness(supportAgent, {
			eventBridge: triageHarness.eventBridge,
			logger,
			models: { 'openai:gpt-4o-mini': supportModel },
			queueBridge,
			resources: {
				supportPolicy: {
					developerInstruction: 'Keep answers concise and actionable.',
				},
			},
			skills: exampleSkills,
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		await new Promise(resolve => setTimeout(resolve, 25))

		try {
			const result = await supportHarness.run({
				payload: {
					prompt: 'urgent enterprise incident',
					message: 'urgent enterprise incident',
					history: [],
					attachments: [],
				},
			})

			expect(result.finalMessage).toContain('MODEL:')
			expect(result.runStateArtifacts.length).toBeGreaterThan(0)
		} finally {
			await supportHarness.destroy()
			await supportService.destroy()
			await triageHarness.destroy()
			await queueBridge.destroy()
		}
	})
})
