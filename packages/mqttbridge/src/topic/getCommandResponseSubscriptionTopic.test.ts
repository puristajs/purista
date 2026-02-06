import { getLoggerMock } from '@purista/core'
import { getCommandResponseSubscriptionTopic } from './getCommandResponseSubscriptionTopic.impl.js'
import { MqttBridge } from '../MqttEventBridge.js'

describe('getCommandResponseSubscriptionTopic', () => {
	it('returns the command response topic for the current instance', () => {
		const bridge = new MqttBridge({ logger: getLoggerMock().mock, instanceId: 'abc123' })

		const topic = getCommandResponseSubscriptionTopic.bind(bridge)()

		expect(topic).toBe('purista/+/+/+/+/+/+/+/+/abc123/+/+/+')
	})
})
