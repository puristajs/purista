import { Command, CommandResponse, EBMessage, EBMessageAddress, HttpExposedServiceMeta } from '@purista/core'

/**
 * The HttpEventBridgeClient connects the HTTPEventBridge with the sidecar service.
 * This client is responsible for the communication to the sidecar service.
 */
export interface HttpEventBridgeClient {
  /**
   * Generate the url path of the command.
   * This url is a POST endpoint and expects a command message as payload
   * @param address
   * @returns url path of endpoint
   */
  getInternalPathForCommand: (address: EBMessageAddress) => string

  /**
   * Generate the url path of the command based on the command builder `exposeAsHttpEndpoint` settings.
   * This url is a POST endpoint and expects the payload and parameter as defined for exposing.
   * @param address
   * @returns url path of endpoint
   */
  getApiPathForCommand: (addess: EBMessageAddress, metadata: HttpExposedServiceMeta) => string

  /**
   * Generate the url path of the subscription.
   * This url is a POST endpoint.
   * The expected payload is a EBMessage or an CloudEvent with an EBMessage as data depending on config settings
   * @param address
   * @returns url path of endpoint
   */
  getInternalPathForSubscription: (address: EBMessageAddress) => string

  /**
   * Invoke a command
   * @param command Command
   * @param headers optional HTTP header
   * @param timeout the command timeout
   * @returns
   */
  invoke: (command: Command, headers?: Record<string, string>, timeout?: number) => Promise<CommandResponse>

  /**
   * Send a EBMessage as event to the underlaying message infrastructure.
   * @param message
   * @param headers
   * @returns
   */
  sendEvent: (message: EBMessage, headers?: Record<string, string>) => Promise<void>

  /**
   * Checks if the sidecar container is available to be able to send events and invoke commands
   * @returns boolean
   */
  isSidecarAvailable: () => Promise<boolean>
}
