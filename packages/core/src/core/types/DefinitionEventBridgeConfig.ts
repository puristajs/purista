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
}
