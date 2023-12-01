import { HandledError, UnhandledError } from '../Error'
import type { Command, CommandErrorResponse, InstanceId, TraceId } from '../types'
import { EBMessageType, StatusCode } from '../types'
import { getErrorMessageForCode } from './getErrorMessageForCode.impl'
import { getNewTraceId } from './getNewTraceId.impl'
import { serializeOtp } from './serializeOtp.impl'

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
