import { join } from 'node:path/posix'

import { convertToSnakeCase } from '@purista/core'

import type { IMqttBridge } from '../types/IMqttBridge.js'

type GetCommandResponseSubscriptionTopicFn = (this: IMqttBridge) => string
export const getCommandResponseSubscriptionTopic: GetCommandResponseSubscriptionTopicFn = function () {
	return join(
		this.config.topicPrefix,
		'+',
		'+',
		'+',
		'+',
		'+',
		'+',
		'+',
		'+',
		convertToSnakeCase(this.instanceId as string),
		'+',
		'+',
		'+',
	)
}
