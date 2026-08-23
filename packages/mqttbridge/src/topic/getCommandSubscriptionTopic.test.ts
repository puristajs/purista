import { getLoggerMock } from '@purista/core/adapter'
import { describe, expect, it } from 'vitest'
import { MqttBridge } from '../MqttEventBridge.js'
import { getCommandSubscriptionTopic } from './getCommandSubscriptionTopic.impl.js'

describe('getCommandSubscriptionTopic', () => {
	it('returns the command topic', () => {
		const bridge = new MqttBridge({ logger: getLoggerMock().mock })

		const topic = getCommandSubscriptionTopic.bind(bridge)({
			serviceName: 'testService',
			serviceVersion: '1',
			serviceTarget: 'testCommand',
		})

		expect(topic).toBe('purista/command/+/+/+/+/+/+/+/+/test_service/1/test_command')
	})
})
