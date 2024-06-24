import type { EBMessage } from '../EBMessage.js'
import { EBMessageType } from '../EBMessageType.enum.js'
import type { CommandResponse } from './CommandResponse.js'

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
