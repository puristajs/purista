import { Options } from 'amqplib'

import { Encoder } from './Encoder'
import { Encrypter } from './Encrypter'

/**
 * RabbitMQ bridge config
 */
export type RabbitMQEventBridgeConfig = {
  instanceId: string
  defaultCommandTimeout: number
  exchangeName: string
  namePrefix?: string
  exchangeOptions?: Options.AssertExchange
  url: string | Options.Connect
  socketOptions?: any
  encoder?: Encoder
  encrypter?: Encrypter
}
