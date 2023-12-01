import type { Command, CommandSuccessResponse, InstanceId } from '../types'
import { EBMessageType } from '../types'
import { getNewTraceId } from './getNewTraceId.impl'

/**
 *
 * @param originalEBMessage
 * @param payload
 * @param eventName
 * @param contentType
 * @param contentEncoding
 * @returns
 *
 * @group Helper
 */
export const createSuccessResponse = <T>(
  instanceId: InstanceId,
  originalEBMessage: Readonly<Command>,
  payload: T,
  eventName?: string,
  contentType = 'application/json',
  contentEncoding = 'utf-8',
): Readonly<CommandSuccessResponse<T>> => {
  const successResponse: CommandSuccessResponse<T> = Object.freeze({
    id: originalEBMessage.id,
    correlationId: originalEBMessage.correlationId,
    traceId: originalEBMessage.traceId || getNewTraceId(),
    principalId: originalEBMessage.principalId,
    tenantId: originalEBMessage.tenantId,
    contentType,
    contentEncoding,
    timestamp: Date.now(),
    eventName,
    messageType: EBMessageType.CommandSuccessResponse,
    sender: {
      ...originalEBMessage.receiver,
      instanceId,
    },
    receiver: {
      ...originalEBMessage.sender,
    },
    payload,
  })

  return successResponse
}
