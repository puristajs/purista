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

import { supportAgent } from '../../../../../agents/supportAgent/v1/supportAgent.js'
import { triageAgent } from '../../../../../agents/triageAgent/v1/triageAgent.js'
import { exampleSkills } from '../../../../../skills.js'
import { supportV1Service } from '../../index.js'

class DeterministicProvider implements ModelProvider {
	readonly name = 'deterministic-test-provider'
	readonly capabilities = { text: true, stream: true, json: true }

	async generate(request: ProviderRequest) {
		return {
			output: `COMMAND:${request.prompt}`,
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
					output: `COMMAND:${request.prompt}`,
					tokens: {
						prompt: request.prompt.length,
						completion: 10,
					},
				}
			},
			async *[Symbol.asyncIterator]() {
				yield {
					type: 'text-delta' as const,
					textDelta: `COMMAND:${request.prompt}`,
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

const createRunSupportAgentMessage = (instanceId: string): Command => ({
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
		serviceTarget: 'runSupportAgent',
	},
	payload: {
		payload: {
			prompt: 'How can I reset my password?',
		},
		parameter: {},
	},
})

describe('runSupportAgentCommandBuilder', () => {
	it('invokes supportAgent through context.invokeAgent and returns final message', async () => {
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
			const response = await eventBridge.invoke(createRunSupportAgentMessage(eventBridge.instanceId))
			expect(response).toEqual(
				expect.objectContaining({
					message: expect.stringContaining('COMMAND:'),
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
