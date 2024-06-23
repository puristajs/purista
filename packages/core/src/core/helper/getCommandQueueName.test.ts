import type { EBMessageAddress } from '../types/index.js'
import { getCommandQueueName } from './getCommandQueueName.impl.js'

describe('creates a command function queue name', () => {
	it('returns a id string', () => {
		const address: EBMessageAddress = {
			serviceName: 'serviceName',
			serviceVersion: '1',
			serviceTarget: 'myFunction',
		}

		const id = getCommandQueueName(address)

		expect(id).toBe('cq-servicename-1-myfunction')
	})
})
