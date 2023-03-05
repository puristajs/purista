import type { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { CommandSuccessResponse } from './CommandSuccessResponse'

export const isCommandSuccessResponse = (message: EBMessage): message is CommandSuccessResponse => {
  return message.messageType === EBMessageType.CommandSuccessResponse
}
