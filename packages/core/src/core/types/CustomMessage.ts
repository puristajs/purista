import { EBMessage } from './EBMessage'
import { EBMessageBase } from './EBMessageBase'
import { EBMessageType } from './EBMessageType.enum'

export type CustomMessage<T = unknown> = {
  messageType: EBMessageType.CustomMessage
  eventName: string
  sender: {
    serviceName: string
    serviceVersion: string
  }
  payload?: T
} & EBMessageBase

export const isCustomMessage = (message: EBMessage): message is CustomMessage => {
  return message.messageType === EBMessageType.CustomMessage
}
