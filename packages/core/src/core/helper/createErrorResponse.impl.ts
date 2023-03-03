import { HandledError, UnhandledError } from '../Error'
import { Command, CommandErrorResponse, EBMessageType, StatusCode, TraceId } from '../types'
import { getErrorMessageForCode } from './getErrorMessageForCode.impl'
import { getNewTraceId } from './getNewTraceId.impl'
import { serializeOtp } from './serializeOtp'

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
  const message = getErrorMessageForCode(statusCode)
  const status = statusCode
  const isHandledError = error instanceof HandledError

  let errorTraceId: TraceId | undefined
  if (error instanceof HandledError || error instanceof UnhandledError) {
    errorTraceId = error.traceId
  }

  const traceId = originalEBMessage.traceId || errorTraceId || getNewTraceId()

  const errorResponse: Readonly<Omit<CommandErrorResponse, 'instanceId'>> = Object.freeze({
    id: originalEBMessage.id,
    isHandledError,
    traceId,
    correlationId: originalEBMessage.correlationId,
    timestamp: Date.now(),
    messageType: EBMessageType.CommandErrorResponse,
    sender: {
      ...originalEBMessage.receiver,
    },
    receiver: {
      ...originalEBMessage.sender,
    },
    payload:
      error instanceof HandledError
        ? error.getErrorResponse(traceId)
        : {
            status,
            message,
            traceId,
          },
    otp: serializeOtp(),
  })

  return errorResponse
}
