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

  CommandSuccessResponse = 'commandSuccessResponse', // a success response from receiver of a command message

  CommandErrorResponse = 'commandErrorResponse', // a error response from receiver of a command message

  /**
   * Info message type:
   * Message which is sent from a single sender to unspecified receivers.
   * The sender does not expect any answer to this message and does not process any reply to this message.
   * Info messages are fire & forget broadcasting messages.
   */
  InfoServiceInit = 'infoServiceInit', // indicates that a service is booting
  InfoServiceReady = 'infoServiceReady', // indicates that a service is ready
  InfoServiceNotReady = 'infoServiceNotReady', // indicates that a service is not able to process requests (e.g. db not available)
  InfoServiceFunctionAdded = 'infoServiceFunctionAdded', // send when a service provides a new function
  InfoServiceDrain = 'infoServiceDrain', // indicates that a service is going to shut down and does no longer accept new requests
  InfoServiceShutdown = 'infoServiceShutdown', // last event from service before service is destroyed
}
