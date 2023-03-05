import type { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { CommandResponse } from './CommandResponse'

export const isCommandResponse = (message: EBMessage): message is CommandResponse => {
  return (
    message.messageType === EBMessageType.CommandSuccessResponse ||
    message.messageType === EBMessageType.CommandErrorResponse
  )
}
