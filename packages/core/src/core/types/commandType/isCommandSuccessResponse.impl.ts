import type { EBMessage } from '../EBMessage.js'
import { EBMessageType } from '../EBMessageType.enum.js'
import type { CommandSuccessResponse } from './CommandSuccessResponse.js'

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
