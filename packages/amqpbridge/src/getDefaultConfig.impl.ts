import { getNewInstanceId } from '@purista/core'

import { RabbitMQEventBridgeConfig } from './types'

export const getDefaultConfig = (): RabbitMQEventBridgeConfig => {
  return {
    defaultCommandTimeout: 30000,
    exchangeName: 'purista',
    namePrefix: 'purista',
    url: 'amqp://localhost',
    instanceId: getNewInstanceId(),
    encoder: {},
    encrypter: {},
  }
}
