import { join } from 'node:path/posix'

import { convertToSnakeCase } from '@purista/core'

import type { MqttBridge } from '../MqttEventBridge'

type GetCommandResponseSubscriptionTopicFn = (this: MqttBridge) => string
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
    convertToSnakeCase(this.instanceId as string),
    '+',
    '+',
    '+',
  )
}
