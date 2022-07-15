import { Command, CommandSuccessResponse, EBMessageType } from '../types'
import { getNewTraceId } from './getNewTraceId.impl'

export const createSuccessResponse = <T>(
  originalEBMessage: Readonly<Command>,
  payload: T,
  eventName?: string,
): Readonly<Omit<CommandSuccessResponse<T>, 'instanceId'>> => {
  const successResponse: Omit<CommandSuccessResponse<T>, 'instanceId'> = Object.freeze({
    id: originalEBMessage.id,
    correlationId: originalEBMessage.correlationId,
    traceId: originalEBMessage.traceId || getNewTraceId(),
    timestamp: Date.now(),
    eventName,
    messageType: EBMessageType.CommandSuccessResponse,
    sender: {
      ...originalEBMessage.receiver,
    },
    receiver: {
      ...originalEBMessage.sender,
    },
    payload,
  })

  return successResponse
}
