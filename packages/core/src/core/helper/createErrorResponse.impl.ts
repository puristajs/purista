import { HandledError, UnhandledError } from '../Error/index.js'
import type { Command, CommandErrorResponse, InstanceId, TraceId } from '../types/index.js'
import { EBMessageType, StatusCode } from '../types/index.js'
import { getErrorMessageForCode } from './getErrorMessageForCode.impl.js'
import { getNewTraceId } from './getNewTraceId.impl.js'
import { serializeOtp } from './serializeOtp.impl.js'

/**
 * Creates a error response object based on original command
 * Toggles sender and receiver
 *
 * @param originalEBMessage
 * @param status
 * @param error
 * @returns CommandErrorResponse message object
 *
 * @group Helper
 */
export const createErrorResponse = (
  instanceId: InstanceId,
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

  const errorResponse: Readonly<CommandErrorResponse> = Object.freeze({
    id: originalEBMessage.id,
    isHandledError,
    traceId,
    principalId: originalEBMessage.principalId,
    tenantId: originalEBMessage.tenantId,
    contentType: 'application/json',
    contentEncoding: 'utf-8',
    correlationId: originalEBMessage.correlationId,
    timestamp: Date.now(),
    messageType: EBMessageType.CommandErrorResponse,
    sender: {
      ...originalEBMessage.receiver,
      instanceId,
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
