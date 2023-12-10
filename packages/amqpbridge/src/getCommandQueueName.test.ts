import { getCommandQueueName } from './getCommandQueueName.impl.js'

describe('getCommandQueueName', () => {
  it('returns the correct command queue name with prefix', () => {
    const address = {
      serviceName: 'serviceA',
      serviceVersion: '1',
      serviceTarget: 'handler',
    }
    const prefix = 'myapp'
    const expectedQueueName = 'myapp.cmd.serviceA.1.handler'
    const result = getCommandQueueName(address, prefix)
    expect(result).toBe(expectedQueueName)
  })

  it('returns the correct command queue name without prefix', () => {
    const address = {
      serviceName: 'serviceB',
      serviceVersion: '2',
      serviceTarget: 'handler',
    }
    const expectedQueueName = 'cmd.serviceB.2.handler'
    const result = getCommandQueueName(address)
    expect(result).toBe(expectedQueueName)
  })

  it('returns the correct command queue name with empty prefix', () => {
    const address = {
      serviceName: 'serviceC',
      serviceVersion: '3',
      serviceTarget: 'handler',
    }
    const prefix = ''
    const expectedQueueName = 'cmd.serviceC.3.handler'
    const result = getCommandQueueName(address, prefix)
    expect(result).toBe(expectedQueueName)
  })

  it('returns the correct command queue name with prefix that already ends with a dot', () => {
    const address = {
      serviceName: 'serviceD',
      serviceVersion: '4',
      serviceTarget: 'handler',
    }
    const prefix = 'myapp.'
    const expectedQueueName = 'myapp.cmd.serviceD.4.handler'
    const result = getCommandQueueName(address, prefix)
    expect(result).toBe(expectedQueueName)
  })
})
