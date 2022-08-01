import { Options } from 'amqplib'

import { Encoder } from './Encoder'
import { Encrypter } from './Encrypter'

/**
 * AmqpBridge bridge config
 */
export type AmqpBridgeConfig = {
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
