import type { EBMessage } from '../types/index.js'
import { isCommand, isCommandSuccessResponse } from '../types/index.js'
import { isDevelop } from './isDevelop.impl.js'

/**
 * Helper function for logging.
 * Returns a message object, where fields which might contain sensitive data, are overwritten with string values.
 * For command messages, parameter and payload are overwritten with string values.
 *
 * For command success responses, the response field is overwritten.
 *
 * Command error responses are not changed.
 *
 * @group Helper
 */
export const getCleanedMessage = (
	message: Readonly<EBMessage>,
	stripeOutContent = !isDevelop(),
): Record<string, unknown> => {
	// return full message if stripeOutContent is set to false
	if (!stripeOutContent) {
		return message
	}

	const cleanedMessage: EBMessage = {
		...message,
	}

	if (isCommand(cleanedMessage)) {
		cleanedMessage.payload = {
			...cleanedMessage.payload,
			parameter: {
				all: '***removed from log***',
			},
			payload: '***removed from log***',
		}
	}

	if (isCommandSuccessResponse(cleanedMessage)) {
		cleanedMessage.payload = '***removed from log***'
	}

	return cleanedMessage
}
