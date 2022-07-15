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
  originalEBMessage: Readonly<Command>,
  statusCode = StatusCode.InternalServerError,
  error?: unknown | string | Error | HandledError | UnhandledError,
): Readonly<Omit<CommandErrorResponse, 'instanceId'>> => {
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

  const errorResponse: Readonly<Omit<CommandErrorResponse, 'instanceId'>> = Object.freeze({
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
    payload: {
      status,
      message,
      data,
    },
  })

  return errorResponse
}
