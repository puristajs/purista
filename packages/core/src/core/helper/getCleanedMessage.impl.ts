import { EBMessage, isCommand, isCommandSuccessResponse } from '../types'
import { isDevelop } from './isDevelop.impl'

/**
 * Helper function for logging.
 * Returns a message object, where fields which might contain sensitive data, are overwritten with string values.
 * For command messages, parameter and payload are overwritten with string values.
 *
 * For command success responses, the response field is overwritten.
 *
 * Command error responses are not changed.
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
    cleanedMessage.command = {
      ...cleanedMessage.command,
      parameter: {
        all: '***removed from log***',
      },
      payload: '***removed from log***',
    }
  }

  if (isCommandSuccessResponse(cleanedMessage)) {
    cleanedMessage.response = '***removed from log***'
  }

  return cleanedMessage
}
