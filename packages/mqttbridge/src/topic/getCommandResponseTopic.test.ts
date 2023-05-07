import { getLoggerMock } from '@purista/core'

import { getDefaultMqttBridgeConfig } from '../getDefaultMqttBridgeConfig.impl'
import type { MqttBridge } from '../MqttEventBridge'
import { getCommandResponseTopic } from './getCommandResponseTopic.impl'

describe('getCommandResponseTopic', () => {
  it('returns the command response topic for the current instance', () => {
    const bridge = {
      logger: getLoggerMock().mock,
      instanceId: 'abc123',
      config: {
        ...getDefaultMqttBridgeConfig(),
      },
    } as any as MqttBridge

    const topic = getCommandResponseTopic.bind(bridge)()

    expect(topic).toBe('purista/response/abc123')
  })
})
