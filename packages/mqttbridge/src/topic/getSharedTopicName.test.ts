import { getLoggerMock } from '@purista/core'
import { MqttBridge } from '../MqttEventBridge.js'
import { getSharedTopicName } from './getSharedTopicName.impl.js'

describe('getSharedTopicName', () => {
	it('returns the topic name for a topic to be a shared one', () => {
		const bridge = new MqttBridge({ logger: getLoggerMock().mock })

		const originalTopic = 'purista/command/test_service/1/test_command'
		const topic = getSharedTopicName.bind(bridge)(originalTopic)

		expect(topic).toBe('$share/sharedpurista/purista/command/test_service/1/test_command')
	})
})
