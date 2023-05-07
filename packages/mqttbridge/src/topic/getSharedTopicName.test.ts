import { getLoggerMock } from '@purista/core'

import { getDefaultMqttBridgeConfig } from '../getDefaultMqttBridgeConfig.impl'
import type { MqttBridge } from '../MqttEventBridge'
import { getSharedTopicName } from './getSharedTopicName.impl'

describe('getSharedTopicName', () => {
  it('returns the topic name for a topic to be a shared one', () => {
    const bridge = {
      logger: getLoggerMock().mock,
      config: {
        ...getDefaultMqttBridgeConfig(),
      },
    } as any as MqttBridge

    const originalTopic = 'purista/command/test_service/1/test_command'
    const topic = getSharedTopicName.bind(bridge)(originalTopic)

    expect(topic).toBe('$share/purista/purista/command/test_service/1/test_command')
  })
})
