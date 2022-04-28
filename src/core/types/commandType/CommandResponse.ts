import { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { CommandErrorResponse } from './CommandErrorResponse'
import { CommandSuccessResponse } from './CommandSuccessResponse'

/**
 * CommandResponse is a response to a specific previously received command which can be either a success or failure
 */
export type CommandResponse<T = unknown> = CommandSuccessResponse<T> | CommandErrorResponse

export const isCommandResponse = (message: EBMessage): message is CommandResponse => {
  return (
    message.messageType === EBMessageType.CommandSuccessResponse ||
    message.messageType === EBMessageType.CommandErrorResponse
  )
}
