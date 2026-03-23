import type { ModelProvider, ProviderJsonRequest, ProviderJsonResponse, ProviderRequest } from '@purista/ai'
import {
	type Command,
	DefaultEventBridge,
	DefaultQueueBridge,
	EBMessageType,
	getNewEBMessageId,
	getNewTraceId,
	initLogger,
} from '@purista/core'
import { describe, expect, it } from 'vitest'

import { supportAgent } from '../../../../agents/supportAgent/v1/supportAgent.js'
import { triageAgent } from '../../../../agents/triageAgent/v1/triageAgent.js'
import { exampleSkills } from '../../../../skills.js'
import { supportV1Service } from '../index.js'

class DeterministicProvider implements ModelProvider {
	readonly name = 'deterministic-test-provider'
	readonly capabilities = { text: true, stream: true, json: true }

	async generate(request: ProviderRequest) {
		return {
			output: `INTEROP:${request.prompt}`,
			tokens: {
				prompt: request.prompt.length,
				completion: 10,
			},
			costUsd: 0,
		}
	}

	stream(request: ProviderRequest) {
		return {
			async final() {
				return {
					output: `INTEROP:${request.prompt}`,
					tokens: {
						prompt: request.prompt.length,
						completion: 10,
					},
				}
			},
			async *[Symbol.asyncIterator]() {
				yield {
					type: 'text-delta' as const,
					textDelta: `INTEROP:${request.prompt}`,
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

const createCommandMessage = (instanceId: string, target: string, payload: Record<string, unknown>): Command => ({
	id: getNewEBMessageId(),
	timestamp: Date.now(),
	traceId: getNewTraceId(),
	correlationId: getNewEBMessageId(),
	messageType: EBMessageType.Command,
	contentType: 'application/json',
	contentEncoding: 'utf-8',
	sender: {
		serviceName: 'testClient',
		serviceVersion: '1',
		serviceTarget: 'integration',
		instanceId,
	},
	receiver: {
		serviceName: 'support',
		serviceVersion: '1',
		serviceTarget: target,
	},
	payload: {
		payload,
		parameter: {},
	},
})

describe('support interoperability commands', () => {
	it('returns MCP tools and maps invoke results to MCP and A2A shapes', async () => {
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
			skills: exampleSkills,
			queueBridge,
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})

		await supportService.start()
		await triageAgentInstance.start()
		await supportAgentInstance.start()
		await waitForRegistration()

		try {
			const mcpTools = await eventBridge.invoke(createCommandMessage(eventBridge.instanceId, 'getMcpTools', {}))
			expect(mcpTools).toEqual(
				expect.objectContaining({
					tools: expect.arrayContaining([
						expect.objectContaining({ name: 'supportAgent' }),
						expect.objectContaining({ name: 'triageAgent' }),
						expect.objectContaining({ name: 'support.1.lookupFaq' }),
					]),
				}),
			)

			const mcpCall = await eventBridge.invoke(
				createCommandMessage(eventBridge.instanceId, 'runSupportMcp', {
					name: 'supportAgent',
					arguments: {
						prompt: 'Summarize https://purista.dev and calculate 12*(8+4).',
					},
				}),
			)
			expect(mcpCall).toEqual(
				expect.objectContaining({
					content: expect.any(Array),
				}),
			)

			const mcpCommandCall = await eventBridge.invoke(
				createCommandMessage(eventBridge.instanceId, 'runSupportMcp', {
					name: 'support.1.calculate',
					arguments: {
						expression: '6*7',
					},
				}),
			)
			expect(mcpCommandCall).toEqual(
				expect.objectContaining({
					content: expect.arrayContaining([
						expect.objectContaining({
							type: 'json',
						}),
					]),
				}),
			)

			const a2aCall = await eventBridge.invoke(
				createCommandMessage(eventBridge.instanceId, 'runSupportA2a', {
					prompt: 'Fetch https://purista.dev and list key topics.',
				}),
			)
			expect(a2aCall).toEqual(
				expect.objectContaining({
					messages: expect.arrayContaining([
						expect.objectContaining({
							frameType: expect.any(String),
							sender: expect.objectContaining({ service: expect.any(String) }),
						}),
					]),
				}),
			)
		} finally {
			await supportAgentInstance.stop()
			await triageAgentInstance.stop()
			await supportService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})
})
