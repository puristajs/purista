import type { ModelProvider, ProviderRequest } from '@purista/ai'
import { DefaultEventBridge, getNewTraceId, initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'

import { supportAgent } from '../../../../../agents/supportAgent/v1/supportAgent.js'
import { triageAgent } from '../../../../../agents/triageAgent/v1/triageAgent.js'
import { supportV1Service } from '../../index.js'

class DeterministicProvider implements ModelProvider {
	readonly name = 'deterministic-test-provider'

	async generate(request: ProviderRequest) {
		return {
			output: `STREAM:${request.prompt}`,
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

describe('runSupportAgentStreamBuilder', () => {
	it('streams agent protocol envelopes before final completion', async () => {
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
			const handle = await eventBridge.openStream({
				traceId: getNewTraceId(),
				sender: {
					serviceName: 'testClient',
					serviceVersion: '1',
					serviceTarget: 'integration',
					instanceId: eventBridge.instanceId,
				},
				receiver: {
					serviceName: 'support',
					serviceVersion: '1',
					serviceTarget: 'runSupportAgentStream',
				},
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				payload: {
					frameType: 'open',
					payload: {
						prompt: 'How can I reset my password?',
					},
					parameter: {},
				},
			})

			const frameTypes: string[] = []
			let sawEnvelopeChunk = false
			for await (const frame of handle) {
				frameTypes.push(frame.payload.frameType)
				if (frame.payload.frameType === 'chunk') {
					expect(Array.isArray(frame.payload.chunk)).toBe(false)
					expect(frame.payload.chunk).toMatchObject({
						version: 'purista.ai/1.0',
						frame: expect.objectContaining({
							kind: expect.any(String),
						}),
					})
					sawEnvelopeChunk = true
				}
			}

			expect(sawEnvelopeChunk).toBe(true)
			expect(frameTypes.at(0)).toBe('start')
			expect(frameTypes.at(-1)).toBe('complete')
		} finally {
			await supportAgentInstance.stop()
			await triageAgentInstance.stop()
			await supportService.destroy()
			await eventBridge.destroy()
		}
	})
})
