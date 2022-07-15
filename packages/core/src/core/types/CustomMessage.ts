import { EBMessage } from './EBMessage'
import { EBMessageAddress } from './EBMessageAddress'
import { EBMessageBase } from './EBMessageBase'
import { EBMessageType } from './EBMessageType.enum'

export type CustomMessage<Payload = unknown> = {
  messageType: EBMessageType.CustomMessage
  eventName: string
  sender: EBMessageAddress
  payload?: Payload
} & EBMessageBase

export const isCustomMessage = (message: EBMessage): message is CustomMessage => {
  return message.messageType === EBMessageType.CustomMessage
}
