import { describe, expect, it } from 'vitest'

import { supportV1Service } from './supportV1Service.js'

describe('supportV1Service', () => {
	it('contains deterministic command tools and multi-agent definitions', async () => {
		const definitions = await supportV1Service.resolveDefinitions()
		const commandNames = definitions.commands.map(command => command.commandName)
		const queueNames = definitions.queues.map(queue => queue.queueName)

		expect(commandNames).toEqual(
			expect.arrayContaining([
				'getIncidentSnapshot',
				'getRunbook',
				'createIncidentBrief',
				'triageTicket',
				'analyzeSignals',
				'assessRollbackRisk',
				'coordinateIncidentResponse',
			]),
		)
		expect(queueNames).toEqual(
			expect.arrayContaining([
				'agent:Support:1:triageTicket',
				'agent:Support:1:analyzeSignals',
				'agent:Support:1:assessRollbackRisk',
				'agent:Support:1:coordinateIncidentResponse',
			]),
		)
		expect(definitions.queueWorkers).toHaveLength(4)
		expect(definitions.streams.map(stream => stream.streamName)).toEqual(
			expect.arrayContaining([
				'triageTicketStream',
				'analyzeSignalsStream',
				'assessRollbackRiskStream',
				'coordinateIncidentResponseStream',
			]),
		)
	})
})
