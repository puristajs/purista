import { describe, expect, it } from 'vitest'

import { supportV1Service } from './supportV1Service.js'

describe('supportV1Service', () => {
	it('contains the triage ticket agent definitions', async () => {
		const definitions = await supportV1Service.resolveDefinitions()

		expect(definitions.queues[0]?.queueName).toBe('agent:Support:1:triageTicket')
		expect(definitions.queueWorkers[0]?.queueName).toBe('agent:Support:1:triageTicket')
		expect(definitions.commands[0]?.commandName).toBe('triageTicket')
		expect(definitions.streams[0]?.streamName).toBe('triageTicketStream')
	})
})
