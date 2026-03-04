import type { ModelProvider, ProviderRequest } from '@purista/ai'
import {
	type Command,
	DefaultEventBridge,
	EBMessageType,
	getNewEBMessageId,
	getNewTraceId,
	initLogger,
} from '@purista/core'
import { describe, expect, it } from 'vitest'

import { supportAgentDefinition } from '../../../../../agents/supportAgent/v1/supportAgent.js'
import { triageAgentDefinition } from '../../../../../agents/triageAgent/v1/triageAgent.js'
import { supportV1Service } from '../../index.js'

class DeterministicProvider implements ModelProvider {
	readonly name = 'deterministic-test-provider'

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

		const provider = new DeterministicProvider()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger })
		const triageAgent = await triageAgentDefinition.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-5.2-mini': provider },
			poolConfig: { maxWorkers: 1 },
		})
		const supportAgent = await supportAgentDefinition.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-5.2-mini': provider },
			poolConfig: { maxWorkers: 1 },
		})

		await supportService.start()
		await triageAgent.start()
		await supportAgent.start()
		await waitForRegistration()

		try {
			const response = await eventBridge.invoke(createRunSupportAgentMessage(eventBridge.instanceId))
			expect(response).toEqual(
				expect.objectContaining({
					message: expect.stringContaining('COMMAND:'),
				}),
			)
		} finally {
			await supportAgent.stop()
			await triageAgent.stop()
			await supportService.destroy()
			await eventBridge.destroy()
		}
	})
})
