import type { EBMessageAddress } from '../types/index.js'
import { getSubscriptionQueueName } from './getSubscriptionQueueName.impl.js'

describe('creates a subscription queue name', () => {
	it('returns a id string', () => {
		const address: EBMessageAddress = {
			serviceName: 'serviceName',
			serviceVersion: '1',
			serviceTarget: 'mySubscription',
		}

		const id = getSubscriptionQueueName(address)

		expect(id).toBe('sq-servicename-1-mysubscription')
	})
})
