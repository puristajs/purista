import type { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import type { Command } from './Command'

/**
 * Checks if given message is type of Command
 *
 * @group Command
 * @param message
 * @returns boolean
 */
export const isCommand = (message: EBMessage): message is Command => {
  return message.messageType === EBMessageType.Command
}
