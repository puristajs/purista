import type { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { CommandSuccessResponse } from './CommandSuccessResponse'

/**
 * Checks if given message is type of CommandSuccessResponse
 *
 * @group Command
 * @param message
 * @returns boolean
 */
export const isCommandSuccessResponse = (message: EBMessage): message is CommandSuccessResponse => {
  return message.messageType === EBMessageType.CommandSuccessResponse
}
