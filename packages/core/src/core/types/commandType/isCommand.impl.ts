import type { EBMessage } from '../EBMessage.js'
import { EBMessageType } from '../EBMessageType.enum.js'
import type { Command } from './Command.js'

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
