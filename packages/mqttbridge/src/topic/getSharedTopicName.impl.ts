import { join } from 'node:path/posix'

import type { IMqttBridge } from '../types/IMqttBridge.js'

type GetSharedTopicNameFn = (this: IMqttBridge, topic: string) => string

export const getSharedTopicName: GetSharedTopicNameFn = function (topic: string) {
	return join(this.config.shareTopicPrefix, this.config.shareTopicName, topic)
}
