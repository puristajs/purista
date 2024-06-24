import { getLoggerMock } from '@purista/core'

import type { MqttBridge } from '../MqttEventBridge.js'
import { getDefaultMqttBridgeConfig } from '../getDefaultMqttBridgeConfig.impl.js'
import { getCommandResponseSubscriptionTopic } from './getCommandResponseSubscriptionTopic.impl.js'

describe('getCommandResponseSubscriptionTopic', () => {
	it('returns the command response topic for the current instance', () => {
		const bridge = {
			logger: getLoggerMock().mock,
			instanceId: 'abc123',
			config: {
				...getDefaultMqttBridgeConfig(),
			},
		} as any as MqttBridge

		const topic = getCommandResponseSubscriptionTopic.bind(bridge)()

		expect(topic).toBe('purista/+/+/+/+/+/+/+/+/abc123/+/+/+')
	})
})
