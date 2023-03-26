import { EBMessageAddress } from './EBMessageAddress'
import { EBMessageBase } from './EBMessageBase'
import { EBMessageType } from './EBMessageType.enum'

/**
 * A custom message is a message which can be used to pass business information.
 * The producer emits the message without knowledge about any consumer.
 * The producer does not expect a response from a consumer.
 */
export type CustomMessage<Payload = unknown> = {
  /** Message type musst be EBMessageType.CustomMessage */
  messageType: EBMessageType.CustomMessage
  /** the event name assigned to this custom message */
  eventName: string
  /** the sender of the event */
  sender: EBMessageAddress
  /** an optional receiver */
  receiver?: EBMessageAddress
  /** the message payload */
  payload?: Payload
} & EBMessageBase
