import { Complete } from '@purista/core'

import { AmqpBridgeConfig } from './types'

export const getDefaultConfig = (): Complete<AmqpBridgeConfig> & { exchangeName: string; url: string } => {
  return {
    exchangeName: 'purista',
    namePrefix: 'purista',
    url: 'amqp://localhost',
    encoder: {},
    encrypter: {},
    socketOptions: undefined,
    exchangeOptions: undefined,
  }
}
