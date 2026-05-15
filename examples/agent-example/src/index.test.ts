import { createAgentTestHarness, createScriptedHarnessModel } from '@purista/core'
import { describe, expect, it } from 'vitest'

import { supportServiceBuilder, triageAgentDefinition } from './index.js'

describe('agent example', () => {
	it('expands the attached agent into core PURISTA definitions', async () => {
		const definitions = await supportServiceBuilder.resolveDefinitions()

		expect(definitions.queues[0]?.queueName).toBe('agent:Support:1:triageTicket')
		expect(definitions.queueWorkers[0]?.queueName).toBe('agent:Support:1:triageTicket')
		expect(definitions.commands[0]?.commandName).toBe('triageTicket')
		expect(definitions.streams[0]?.streamName).toBe('triageTicketStream')
	})

	it('runs with the provider-neutral scripted harness model', async () => {
		const model = createScriptedHarnessModel()
		model.enqueueObject({
			object: {
				priority: 'high',
				reason: 'The customer cannot sign in.',
			},
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
			finishReason: 'stop',
		})

		const harness = createAgentTestHarness(triageAgentDefinition, {
			models: {
				primary: {
					provider: model,
					model: 'support-triage',
					capabilities: ['object'],
				},
			},
		})

		const result = await harness.run({
			payload: {
				ticketId: 'SUP-123',
				text: 'I cannot sign in and payroll closes today.',
			},
		})

		expect(result).toEqual({
			priority: 'high',
			reason: 'The customer cannot sign in.',
		})
		expect(model.requests).toHaveLength(1)
	})
})
