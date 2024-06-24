import { getLoggerMock } from '@purista/core'

import type { MqttBridge } from '../MqttEventBridge.js'
import { getDefaultMqttBridgeConfig } from '../getDefaultMqttBridgeConfig.impl.js'
import { getCommandSubscriptionTopic } from './getCommandSubscriptionTopic.impl.js'

describe('getCommandSubscriptionTopic', () => {
	it('returns the command topic', () => {
		const bridge = {
			logger: getLoggerMock().mock,
			config: {
				...getDefaultMqttBridgeConfig(),
			},
		} as any as MqttBridge

		const topic = getCommandSubscriptionTopic.bind(bridge)({
			serviceName: 'testService',
			serviceVersion: '1',
			serviceTarget: 'testCommand',
		})

		expect(topic).toBe('purista/command/+/+/+/+/+/+/+/+/test_service/1/test_command')
	})
})
