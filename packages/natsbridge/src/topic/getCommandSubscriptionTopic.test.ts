import { getLoggerMock, safeBind } from '@purista/core'

import { getDefaultNatsBridgeConfig } from '../getDefaultNatsBridgeConfig.js'
import type { INatsBridge } from '../types/INatsBridge.js'
import { getCommandSubscriptionTopic } from './getCommandSubscriptionTopic.impl.js'

describe('getCommandSubscriptionTopic', () => {
	it('returns the command topic', () => {
		const bridge = {
			logger: getLoggerMock().mock,
			config: {
				...getDefaultNatsBridgeConfig(),
			},
		} as any as INatsBridge

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
