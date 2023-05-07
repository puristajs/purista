import { join } from 'node:path/posix'

import type { InstanceId } from '@purista/core'

import type { MqttBridge } from '../MqttEventBridge'

type GetCommandResponseTopicFn = (this: MqttBridge, instanceId?: InstanceId) => string
export const getCommandResponseTopic: GetCommandResponseTopicFn = function (instanceId?: InstanceId) {
  return join(this.config.topicPrefix, 'response', instanceId || this.instanceId)
}
