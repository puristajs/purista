export type DefinitionEventBridgeConfig = {
  /**
   * Advise the underlaying message broker to store messages if no consumer is available.
   * Messages will be send as soon as the service is able to consume.
   * */
  durable?: boolean
  /**
   * Send the acknowledge to message broker as soon as the message arrives
   * - defaults to true for commands
   * - defaults to false for subscriptions
   *
   * */
  autoacknowledge?: boolean
  /**
   * If set to true, the event bridge is adviced to deliver one message to at least one consumer instance.
   * True is the default value.
   * If set to false, the event bridge is adviced to deliver one message to all consumer instances.
   *
   * Use case: Receiving Info of message, which need to be passed to all instance to keep information in sync.
   *
   * In serverless environments, this flag should not have any effect
   *
   * @default true
   */
  shared?: boolean
}
