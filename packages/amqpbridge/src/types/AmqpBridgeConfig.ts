import { Options } from 'amqplib'

import { Encoder } from './Encoder'
import { Encrypter } from './Encrypter'

/**
 * AmqpBridge bridge config
 */
export type AmqpBridgeConfig = {
  /** the instance id of the event bridge */
  instanceId: string
  /** the default timeout */
  defaultCommandTimeout: number
  /** the mqtt exchage name to be used */
  exchangeName: string
  /** the queue prefix to be used */
  namePrefix?: string
  /** the AMQP exchange options */
  exchangeOptions?: Options.AssertExchange
  /** the AMQP broker url */
  url: string | Options.Connect
  /** socket options */
  socketOptions?: any
  /** the encoder(s) to be used for AMQP messages */
  encoder?: Encoder
  /** the encrypter(s) to be used for AMQP messages */
  encrypter?: Encrypter
}
