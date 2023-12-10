import type { EBMessageAddress } from '@purista/core'

import { getSubscriptionQueueName } from './getSubscriptionQueueName.impl.js'

describe('getSubscriptionQueueName', () => {
  it('should return the correct subscription queue name with prefix', () => {
    const address: EBMessageAddress = {
      serviceName: 'example',
      serviceVersion: '1.0.0',
      serviceTarget: 'test',
    }
    const prefix = 'myprefix'
    const expected = 'myprefix.sub.example.1.0.0.test'
    const result = getSubscriptionQueueName(address, prefix)
    expect(result).toEqual(expected)
  })

  it('should return the correct subscription queue name without prefix', () => {
    const address: EBMessageAddress = {
      serviceName: 'example',
      serviceVersion: '1.0.0',
      serviceTarget: 'test',
    }
    const expected = 'sub.example.1.0.0.test'
    const result = getSubscriptionQueueName(address)
    expect(result).toEqual(expected)
  })
})
