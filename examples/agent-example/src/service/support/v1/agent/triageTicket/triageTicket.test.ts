import { createAgentTestHarness, createScriptedHarnessModel } from '@purista/core'
import { describe, expect, it } from 'vitest'

import { supportV1Service } from '../../supportV1Service.js'
import { triageTicketAgentBuilder } from './triageTicketAgentBuilder.js'

describe('triageTicketAgentBuilder', () => {
	it('expands the attached agent into core PURISTA definitions', async () => {
		const definitions = await supportV1Service.resolveDefinitions()
		const queueNames = definitions.queues.map(queue => queue.queueName)
		const commandNames = definitions.commands.map(command => command.commandName)
		const streamNames = definitions.streams.map(stream => stream.streamName)

		expect(queueNames).toContain('agent:Support:1:triageTicket')
		expect(definitions.queueWorkers.map(worker => worker.queueName)).toContain('agent:Support:1:triageTicket')
		expect(commandNames).toContain('triageTicket')
		expect(streamNames).toContain('triageTicketStream')
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

		const triageTicketAgentDefinition = await triageTicketAgentBuilder.getDefinition()
		const harness = await createAgentTestHarness(triageTicketAgentDefinition, {
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
