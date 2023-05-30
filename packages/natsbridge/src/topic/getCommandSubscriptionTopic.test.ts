import { getLoggerMock } from '@purista/core'

import { getDefaultNatsBridgeConfig } from '../getDefaultNatsBridgeConfig'
import type { NatsBridge } from '../NatsBridge'
import { getCommandSubscriptionTopic } from './getCommandSubscriptionTopic.impl'

describe('getCommandSubscriptionTopic', () => {
  it('returns the command topic', () => {
    const bridge = {
      logger: getLoggerMock().mock,
      config: {
        ...getDefaultNatsBridgeConfig(),
      },
    } as any as NatsBridge

    const topic = getCommandSubscriptionTopic.bind(bridge)({
      serviceName: 'testService',
      serviceVersion: '1',
      serviceTarget: 'testCommand',
    })

    expect(topic).toBe('purista.command.*.*.*.*.*.*.*.test_service.1.test_command')
  })
})
