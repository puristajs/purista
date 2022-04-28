import { Command, CommandSuccessResponse, EBMessageType } from '../types'

export const createSuccessResponse = <T>(originalEBMessage: Command, payload: T): CommandSuccessResponse<T> => {
  const successResponse: CommandSuccessResponse<T> = {
    id: originalEBMessage.id,
    correlationId: originalEBMessage.correlationId,
    traceId: originalEBMessage.traceId,
    timestamp: Date.now(),
    messageType: EBMessageType.CommandSuccessResponse,
    sender: {
      ...originalEBMessage.receiver,
    },
    receiver: {
      ...originalEBMessage.sender,
    },
    response: payload,
  }

  return successResponse
}
