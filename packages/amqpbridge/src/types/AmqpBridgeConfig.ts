import { Options } from 'amqplib'

import { Encoder } from './Encoder'
import { Encrypter } from './Encrypter'

/**
 * AmqpBridge bridge config
 *
 * @see [amqplib documentation](https://amqp-node.github.io/amqplib/)
 */
export type AmqpBridgeConfig = {
  /** the AMQP exchage name to be used */
  exchangeName: string
  /** the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request */
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
