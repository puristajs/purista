import { EBMessage, isCommand, isCommandSuccessResponse } from '../types'

export const getCleanedMessage = (message: EBMessage): Record<string, unknown> => {
  const cleanedMessage: EBMessage = {
    ...message,
  }

  const nodeEnv = process.env.NODE_ENV || 'develop'

  if (nodeEnv.startsWith('develop')) {
    return cleanedMessage
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
