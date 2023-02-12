import { CustomMessage } from './CustomMessage'
import { EBMessage } from './EBMessage'
import { EBMessageType } from './EBMessageType.enum'

export const isCustomMessage = (message: EBMessage): message is CustomMessage => {
  return message.messageType === EBMessageType.CustomMessage
}
