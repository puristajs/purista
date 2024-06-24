import { join } from 'node:path/posix'

import type { MqttBridge } from '../MqttEventBridge.js'

type GetSharedTopicNameFn = (this: MqttBridge, topic: string) => string

export const getSharedTopicName: GetSharedTopicNameFn = function (topic: string) {
	return join(this.config.shareTopicPrefix, this.config.shareTopicName, topic)
}
