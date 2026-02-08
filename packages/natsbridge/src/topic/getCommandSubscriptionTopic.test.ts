import { getLoggerMock, safeBind } from '@purista/core'

import { NatsBridge } from '../NatsBridge.js'
import { getCommandSubscriptionTopic } from './getCommandSubscriptionTopic.impl.js'

describe('getCommandSubscriptionTopic', () => {
	it('returns the command topic', () => {
		const bridge = new NatsBridge({ logger: getLoggerMock().mock })

		const topic = safeBind(
			getCommandSubscriptionTopic,
			bridge,
		)({
			serviceName: 'testService',
			serviceVersion: '1',
			serviceTarget: 'testCommand',
		})

		expect(topic).toBe('purista.command.*.*.*.*.*.*.*.*.test_service.1.test_command')
	})
})
