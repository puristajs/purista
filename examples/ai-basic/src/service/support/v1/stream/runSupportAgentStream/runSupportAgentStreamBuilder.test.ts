import type { ModelProvider, ProviderJsonRequest, ProviderJsonResponse, ProviderRequest } from '@purista/ai'
import { DefaultEventBridge, DefaultQueueBridge, getNewTraceId, initLogger } from '@purista/core'
import { describe, expect, it } from 'vitest'

import { supportAgent } from '../../../../../agents/supportAgent/v1/supportAgent.js'
import { triageAgent } from '../../../../../agents/triageAgent/v1/triageAgent.js'
import { exampleSkills } from '../../../../../skills.js'
import { supportV1Service } from '../../index.js'

class DeterministicProvider implements ModelProvider {
	readonly name = 'deterministic-test-provider'
	readonly capabilities = { text: true, stream: true, json: true }

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

	stream(request: ProviderRequest) {
		return {
			async final() {
				return {
					output: `STREAM:${request.prompt}`,
					tokens: {
						prompt: request.prompt.length,
						completion: 12,
					},
				}
			},
			async *[Symbol.asyncIterator]() {
				yield {
					type: 'text-delta' as const,
					textDelta: `STREAM:${request.prompt}`,
				}
			},
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

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

describe('runSupportAgentStreamBuilder', () => {
	it('streams agent protocol envelopes before final completion', async () => {
		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const queueBridge = new DefaultQueueBridge()

		const provider = new DeterministicProvider()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger, queueBridge })
		const triageAgentInstance = await triageAgent.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})
		const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			resources: {
				supportPolicy: {
					developerInstruction: 'Keep answers concise and actionable.',
				},
			},
			skills: exampleSkills,
			queueBridge,
			poolConfig: { maxConcurrencyPerInstance: 1 },
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
			const chunkMessageIds: string[] = []
			let finalMessageIds: string[] = []
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
					if (frame.payload.chunk && typeof frame.payload.chunk === 'object' && 'messageId' in frame.payload.chunk) {
						chunkMessageIds.push(String(frame.payload.chunk.messageId))
					}
				}
				if (frame.payload.frameType === 'complete') {
					const finalPayload =
						frame.payload.final && typeof frame.payload.final === 'object'
							? (frame.payload.final as { envelopes?: unknown[] })
							: undefined
					finalMessageIds = Array.isArray(finalPayload?.envelopes)
						? finalPayload.envelopes.flatMap(envelope => {
								if (!envelope || typeof envelope !== 'object' || !('messageId' in envelope)) {
									return []
								}
								return [String(envelope.messageId)]
							})
						: []
				}
			}

			expect(sawEnvelopeChunk).toBe(true)
			expect(frameTypes.at(0)).toBe('start')
			expect(frameTypes.at(-1)).toBe('complete')
			expect(new Set(finalMessageIds)).toEqual(new Set(chunkMessageIds))
		} finally {
			await supportAgentInstance.stop()
			await triageAgentInstance.stop()
			await supportService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})
})
