import { EBMessageAddress } from './EBMessageAddress'
import { EBMessageBase } from './EBMessageBase'
import { EBMessageType } from './EBMessageType.enum'

export type CustomMessage<Payload = unknown> = {
  messageType: EBMessageType.CustomMessage
  eventName: string
  sender: EBMessageAddress
  receiver?: EBMessageAddress
  payload?: Payload
} & EBMessageBase
