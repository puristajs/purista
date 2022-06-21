import { HandledError } from '../HandledError.impl'
import { Command, CommandErrorResponse, EBMessageType, StatusCode } from '../types'
import { UnhandledError } from '../UnhandledError.impl'
import { getErrorMessageForCode } from './getErrorMessageForCode.impl'

/**
 * Creates a error response object based on original command
 * Toggles sender and receiver
 *
 * @param originalEBMessage
 * @param status
 * @param error
 * @returns CommandErrorResponse message object
 */
export const createErrorResponse = (
  originalEBMessage: Command,
  statusCode = StatusCode.InternalServerError,
  error?: unknown | string | Error | HandledError | UnhandledError,
): CommandErrorResponse => {
  let message = getErrorMessageForCode(statusCode)
  let data: unknown
  let status = statusCode
  let isHandledError = false

  // if it is a handled error we expose error code, message and additional data
  if (error instanceof HandledError) {
    message = error.message
    data = error.data
    status = error.errorCode
    isHandledError = true
  }

  // if it is a unhandled error we set the error to 500 Internal Server Error without additional data
  if (error instanceof UnhandledError) {
    if (error.errorCode >= 400 || error.errorCode < 500) {
      message = getErrorMessageForCode(error.errorCode)
      data = undefined
      status = error.errorCode
    } else {
      message = getErrorMessageForCode(StatusCode.InternalServerError)
      data = undefined
      status = StatusCode.InternalServerError
    }
  }

  const errorResponse: CommandErrorResponse = {
    id: originalEBMessage.id,
    isHandledError,
    traceId: originalEBMessage.traceId,
    correlationId: originalEBMessage.correlationId,
    timestamp: Date.now(),
    messageType: EBMessageType.CommandErrorResponse,
    sender: {
      ...originalEBMessage.receiver,
    },
    receiver: {
      ...originalEBMessage.sender,
    },
    response: {
      status,
      message,
      data,
    },
  }

  return errorResponse
}
