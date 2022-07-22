import { EBMessageAddress } from '../types'
import { getSubscriptionQueueName } from './getSubscriptionQueueName.impl'

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
