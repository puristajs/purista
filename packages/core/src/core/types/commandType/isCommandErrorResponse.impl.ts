import type { EBMessage } from '../EBMessage.js'
import { EBMessageType } from '../EBMessageType.enum.js'
import type { CommandErrorResponse } from './CommandErrorResponse.js'

/**
 * Checks if given message is type of CommandErrorResponse
 *
 * @group Command
 * @param message
 * @returns boolean
 */
export const isCommandErrorResponse = (message: EBMessage | unknown): message is CommandErrorResponse => {
  if (typeof message !== 'object' || message === null) {
    return false
  }
  const m = message as CommandErrorResponse
  return m.messageType === EBMessageType.CommandErrorResponse
}
