import { getNewInstanceId } from '@purista/core'

import { AmqpBridgeConfig } from './types'

export const getDefaultConfig = (): AmqpBridgeConfig => {
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
