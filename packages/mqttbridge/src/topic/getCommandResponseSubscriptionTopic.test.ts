import { getLoggerMock } from '@purista/core/adapter'
import { describe, expect, it } from 'vitest'
import { MqttBridge } from '../MqttEventBridge.js'
import { getCommandResponseSubscriptionTopic } from './getCommandResponseSubscriptionTopic.impl.js'

describe('getCommandResponseSubscriptionTopic', () => {
	it('returns the command response topic for the current instance', () => {
		const bridge = new MqttBridge({ logger: getLoggerMock().mock, instanceId: 'abc123' })

		const topic = getCommandResponseSubscriptionTopic.bind(bridge)()

		expect(topic).toBe('purista/+/+/+/+/+/+/+/+/abc123/+/+/+')
	})
})
