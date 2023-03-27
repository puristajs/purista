import { AmqpBridgeConfig } from './types'

export const getDefaultConfig = (): AmqpBridgeConfig => {
  return {
    exchangeName: 'purista',
    namePrefix: 'purista',
    url: 'amqp://localhost',
    encoder: {},
    encrypter: {},
  }
}
