import { type AgentProtocolEnvelope, type ModelProvider, type ProviderRequest, testAgent } from '@purista/ai'
import { DefaultEventBridge, DefaultQueueBridge, initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'

import { supportV1Service } from '../../../service/support/v1/index.js'
import { bridgeDemoAgent } from './bridgeDemoAgent.js'

class BridgeScriptedProvider implements ModelProvider {
	readonly name = 'bridge-scripted-provider'
	readonly capabilities = { text: true, stream: true }
	readonly requests: ProviderRequest[] = []

	async generate(request: ProviderRequest) {
		this.requests.push(request)
		const output = await this.buildOutput(request)
		return {
			output,
			tokens: {
				prompt: request.prompt.length,
				completion: output.length,
			},
			costUsd: 0,
		}
	}

	stream(request: ProviderRequest) {
		this.requests.push(request)
		const outputPromise = this.buildOutput(request)
		let emitted = false
		return {
			async final() {
				const output = await outputPromise
				return {
					output,
					tokens: {
						prompt: request.prompt.length,
						completion: output.length,
					},
					costUsd: 0,
				}
			},
			async *[Symbol.asyncIterator]() {
				if (emitted) {
					return
				}
				emitted = true
				const output = await outputPromise
				yield {
					type: 'text-delta' as const,
					textDelta: output,
				}
			},
		}
	}

	private async buildOutput(request: ProviderRequest) {
		const aiSdk = request.metadata?.aiSdk as
			| {
					tools?: Record<string, { execute?: (input: unknown, options: unknown) => Promise<unknown> }>
			  }
			| undefined
		const lookupFaq = aiSdk?.tools?.['support.1.lookupFaq']
		if (!lookupFaq?.execute) {
			return 'Missing bridged tools.'
		}
		const faq = (await lookupFaq.execute(
			{ question: 'urgent refund request after duplicate charge' },
			{} as never,
		)) as { answer?: string }
		return `Bridge answer: ${String(faq.answer ?? '')}`
	}
}

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

const getMessageFrames = (envelopes: AgentProtocolEnvelope[]) =>
	envelopes
		.map(envelope => envelope.frame)
		.filter(
			(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> => frame.kind === 'message',
		)

describe('bridgeDemoAgent', () => {
	it('bridges PURISTA commands and child agents into an AI SDK tool loop', async () => {
		const logger = initLogger('error')
		const queueBridge = new DefaultQueueBridge()
		const provider = new BridgeScriptedProvider()
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger, queueBridge })
		await supportService.start()
		const { instance: bridgeDemoAgentInstance, destroy: destroyBridgeDemo } = await testAgent(bridgeDemoAgent, {
			eventBridge,
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			queueBridge,
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		await waitForRegistration()

		try {
			const { envelopes } = await bridgeDemoAgentInstance.invoke({
				payload: {
					prompt: 'urgent refund request after duplicate charge',
					sessionId: 'bridge-demo-session',
				},
			})

			const messageFrames = getMessageFrames(envelopes)
			const finalFrame = [...messageFrames].reverse().find(frame => frame.final === true)
			const runStateFrames = envelopes
				.map(envelope => envelope.frame)
				.filter(
					(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'artifact' }> =>
						frame.kind === 'artifact' && frame.artifactId === 'run-state',
				)

			expect(
				Object.keys((provider.requests[0]?.metadata?.aiSdk as { tools?: object } | undefined)?.tools ?? {}),
			).toEqual(expect.arrayContaining(['support.1.lookupFaq']))
			expect(finalFrame?.content).toContain('Bridge answer:')
			expect(runStateFrames.length).toBeGreaterThan(0)
		} finally {
			await destroyBridgeDemo()
			await supportService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})

	it('falls back to the message id when no sessionId is provided', async () => {
		const logger = initLogger('error')
		const queueBridge = new DefaultQueueBridge()
		const provider = new BridgeScriptedProvider()
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger, queueBridge })
		await supportService.start()
		const { instance: bridgeDemoAgentInstance, destroy: destroyBridgeDemo } = await testAgent(bridgeDemoAgent, {
			eventBridge,
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			queueBridge,
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		await waitForRegistration()

		try {
			const { envelopes } = await bridgeDemoAgentInstance.invoke({
				payload: {
					prompt: 'urgent refund request after duplicate charge',
				},
			})

			const finalFrame = [...getMessageFrames(envelopes)].reverse().find(frame => frame.final === true)
			expect(finalFrame?.content).toContain('Bridge answer:')
		} finally {
			await destroyBridgeDemo()
			await supportService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})
})
