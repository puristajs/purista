import { EBMessageAddress } from './EBMessageAddress'
import { EBMessageBase } from './EBMessageBase'
import { EBMessageType } from './EBMessageType.enum'

/**
 * A custom message is a message which can be used to pass business information.
 * The producer emits the message without knowledge about any consumer.
 * The producer does not expect a response from a consumer.
 */
export type CustomMessage<Payload = unknown> = {
  messageType: EBMessageType.CustomMessage
  eventName: string
  sender: EBMessageAddress
  receiver?: EBMessageAddress
  payload?: Payload
} & EBMessageBase
