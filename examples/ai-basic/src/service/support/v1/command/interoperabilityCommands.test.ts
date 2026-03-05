import type { ModelProvider, ProviderJsonRequest, ProviderJsonResponse, ProviderRequest } from '@purista/ai'
import {
	type Command,
	DefaultEventBridge,
	EBMessageType,
	getNewEBMessageId,
	getNewTraceId,
	initLogger,
} from '@purista/core'
import { describe, expect, it } from 'vitest'

import { supportAgent } from '../../../../agents/supportAgent/v1/supportAgent.js'
import { triageAgent } from '../../../../agents/triageAgent/v1/triageAgent.js'
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
			const mcpTools = await eventBridge.invoke(
				createCommandMessage(eventBridge.instanceId, 'getMcpTools', {}),
			)
			expect(mcpTools).toEqual(
				expect.objectContaining({
					tools: expect.arrayContaining([
						expect.objectContaining({ name: 'supportAgent' }),
						expect.objectContaining({ name: 'triageAgent' }),
					]),
				}),
			)

			const mcpCall = await eventBridge.invoke(
				createCommandMessage(eventBridge.instanceId, 'runSupportMcp', {
					prompt: 'How can I request a refund for my order?',
				}),
			)
			expect(mcpCall).toEqual(
				expect.objectContaining({
					content: expect.any(Array),
				}),
			)

			const a2aCall = await eventBridge.invoke(
				createCommandMessage(eventBridge.instanceId, 'runSupportA2a', {
					prompt: 'How can I request a refund for my order?',
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
			await eventBridge.destroy()
		}
	})
})
