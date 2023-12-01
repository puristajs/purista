import type { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import type { CommandResponse } from './CommandResponse'

/**
 * Checks if given message is type of CommandResponse (success or error)
 *
 * @group Command
 * @param message
 * @returns boolean
 */
export const isCommandResponse = (message: EBMessage): message is CommandResponse => {
  return (
    message.messageType === EBMessageType.CommandSuccessResponse ||
    message.messageType === EBMessageType.CommandErrorResponse
  )
}
