import { Command, CommandSuccessResponse, EBMessageType } from '../types'
import { getNewTraceId } from './getNewTraceId.impl'

export const createSuccessResponse = <T>(
  originalEBMessage: Readonly<Command>,
  payload: T,
): Readonly<CommandSuccessResponse<T>> => {
  const successResponse: CommandSuccessResponse<T> = Object.freeze({
    id: originalEBMessage.id,
    correlationId: originalEBMessage.correlationId,
    traceId: originalEBMessage.traceId || getNewTraceId(),
    timestamp: Date.now(),
    messageType: EBMessageType.CommandSuccessResponse,
    sender: {
      ...originalEBMessage.receiver,
    },
    receiver: {
      ...originalEBMessage.sender,
    },
    response: payload,
  })

  return successResponse
}
