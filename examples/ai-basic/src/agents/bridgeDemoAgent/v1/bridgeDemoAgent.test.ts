import { createAgentTestHarness, getFinalAssistantText, getRunStateArtifacts, ScriptedModel } from '@purista/ai'
import { DefaultEventBridge, DefaultQueueBridge, initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'

import { supportV1Service } from '../../../service/support/v1/index.js'
import { bridgeDemoAgent } from './bridgeDemoAgent.js'

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

describe('bridgeDemoAgent', () => {
	it('bridges PURISTA commands and child agents into an AI SDK tool loop', async () => {
		const logger = initLogger('error')
		const queueBridge = new DefaultQueueBridge()
		const provider = new ScriptedModel().nextStream(async request => {
			const aiSdk = request.metadata?.aiSdk as
				| {
						tools?: Record<string, { execute?: (input: unknown, options: unknown) => Promise<unknown> }>
				  }
				| undefined
			const lookupFaq = aiSdk?.tools?.['support.1.lookupFaq']
			if (!lookupFaq?.execute) {
				return ['Missing bridged tools.']
			}
			const faq = (await lookupFaq.execute(
				{ question: 'urgent refund request after duplicate charge' },
				{} as never,
			)) as { answer?: string }
			return [`Bridge answer: ${String(faq.answer ?? '')}`]
		})
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger, queueBridge })
		await supportService.start()
		const bridgeDemoAgentHarness = await createAgentTestHarness(bridgeDemoAgent, {
			eventBridge,
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			queueBridge,
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		await waitForRegistration()

		try {
			const result = await bridgeDemoAgentHarness.run({
				payload: {
					prompt: 'urgent refund request after duplicate charge',
					sessionId: 'bridge-demo-session',
				},
			})

			expect(
				Object.keys((provider.calls[0]?.request.metadata?.aiSdk as { tools?: object } | undefined)?.tools ?? {}),
			).toEqual(expect.arrayContaining(['support.1.lookupFaq']))
			expect(getFinalAssistantText(result.envelopes)).toContain('Bridge answer:')
			expect(getRunStateArtifacts(result.envelopes).length).toBeGreaterThan(0)
		} finally {
			await bridgeDemoAgentHarness.destroy()
			await supportService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})

	it('falls back to the message id when no sessionId is provided', async () => {
		const logger = initLogger('error')
		const queueBridge = new DefaultQueueBridge()
		const provider = new ScriptedModel().nextText(async request => {
			const aiSdk = request.metadata?.aiSdk as
				| {
						tools?: Record<string, { execute?: (input: unknown, options: unknown) => Promise<unknown> }>
				  }
				| undefined
			const lookupFaq = aiSdk?.tools?.['support.1.lookupFaq']
			const faq = (await lookupFaq?.execute?.(
				{ question: 'urgent refund request after duplicate charge' },
				{} as never,
			)) as { answer?: string } | undefined
			return `Bridge answer: ${String(faq?.answer ?? '')}`
		})
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger, queueBridge })
		await supportService.start()
		const bridgeDemoAgentHarness = await createAgentTestHarness(bridgeDemoAgent, {
			eventBridge,
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			queueBridge,
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		await waitForRegistration()

		try {
			const result = await bridgeDemoAgentHarness.run({
				payload: {
					prompt: 'urgent refund request after duplicate charge',
				},
			})
			expect(result.finalMessage).toContain('Bridge answer:')
		} finally {
			await bridgeDemoAgentHarness.destroy()
			await supportService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})
})
