import { describe, expect, it } from 'vitest'

import { supportV1Service } from './supportV1Service.js'

describe('supportV1Service', () => {
	it('contains native commands without generated agent transports', async () => {
		const definitions = await supportV1Service.resolveDefinitions()
		const commandNames = definitions.commands.map(command => command.commandName)

		expect(commandNames).toEqual(
			expect.arrayContaining([
				'getIncidentSnapshot',
				'getRunbook',
				'createIncidentBrief',
				'triageTicket',
				'requestRollbackReview',
				'decideRollbackReview',
				'executeApprovedRollback',
			]),
		)
		expect(definitions.queues).toEqual([])
		expect(definitions.queueWorkers).toEqual([])
		expect(definitions.streams).toEqual([])
	})
})
