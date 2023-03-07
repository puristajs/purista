/**
 * Type of event bridge message
 */
export enum EBMessageType {
  /**
   * Command message type:
   * Message which is sent from a single sender to exactly one single receiver.
   * The sender expects a answer response from receiver within a specific time frame (ttl).
   * If the sender does not receive a answer within this time frame, the command will be rejected with timeout error.
   */
  Command = 'command', // a message which expects an answer message from receiver

  /** a success response from receiver of a command message */
  CommandSuccessResponse = 'commandSuccessResponse',

  /** a error response from receiver of a command message */
  CommandErrorResponse = 'commandErrorResponse',

  /**
   * Info message type:
   * Message which is sent from a single sender to unspecified receivers.
   * The sender does not expect any answer to this message and does not process any reply to this message.
   * Info messages are fire & forget broadcasting messages.
   */
  /** indicates that a service is booting */
  InfoServiceInit = 'infoServiceInit',
  /** indicates that a service is ready */
  InfoServiceReady = 'infoServiceReady',
  /** indicates that a service is not able to process requests (e.g. db not available) */
  InfoServiceNotReady = 'infoServiceNotReady',
  /** send when a service provides a new function */
  InfoServiceFunctionAdded = 'infoServiceFunctionAdded',
  /** indicates that a service is going to shut down and does no longer accept new requests */
  InfoServiceDrain = 'infoServiceDrain',
  /** last event from service before service is destroyed */
  InfoServiceShutdown = 'infoServiceShutdown',
  /** a service invoked a other function and did not get a answer within given ttl */
  InfoInvokeTimeout = 'infoInvokeTimeout',
  /** a subscription function is throwing */
  InfoSubscriptionError = 'infoSubscriptionError',
  /** a custom message / custom event */
  CustomMessage = 'customMessage',
}
