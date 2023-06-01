import { join } from 'node:path/posix'

import { convertToSnakeCase, EBMessageAddress, EBMessageType } from '@purista/core'

import type { MqttBridge } from '../MqttEventBridge'

type GetCommandTopicFn = (this: MqttBridge, address: EBMessageAddress) => string

export const getCommandSubscriptionTopic: GetCommandTopicFn = function (address) {
  return join(
    this.config.topicPrefix,
    convertToSnakeCase(EBMessageType.Command),
    convertToSnakeCase('+'),
    convertToSnakeCase('+'),
    convertToSnakeCase('+'),
    convertToSnakeCase('+'),
    convertToSnakeCase('+'),
    convertToSnakeCase('+'),
    convertToSnakeCase('+'),
    convertToSnakeCase(address.serviceName),
    convertToSnakeCase(address.serviceVersion),
    convertToSnakeCase(address.serviceTarget),
  )
}
