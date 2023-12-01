import type { Options } from 'amqplib'

import type { Encoder } from './Encoder'
import type { Encrypter } from './Encrypter'

/**
 * AmqpBridge bridge config
 *
 * @see [amqplib documentation](https://amqp-node.github.io/amqplib/)
 */
export type AmqpBridgeConfig = {
  /** the AMQP exchage name to be used @default purista */
  exchangeName?: string
  /** the queue prefix to be used for all PURISTA queues except short living queues created by the broker on request @default purista */
  namePrefix?: string
  /** the AMQP exchange options */
  exchangeOptions?: Options.AssertExchange | undefined
  /** the AMQP broker url @default amqp://localhost */
  url?: string | Options.Connect
  /** socket options */
  socketOptions?: any
  /** the encoder(s) to be used for AMQP messages @default jsonEncoder  */
  encoder?: Encoder
  /** the encrypter(s) to be used for AMQP messages @default plain  */
  encrypter?: Encrypter
}
