import { InfoMessage, InfoMessageType } from '../types'
import { getNewEBMessageId } from './getNewEBMessageId.impl'
import { getNewTraceId } from './getNewTraceId.impl'

export const createInfoMessage = (
  messageType: InfoMessageType,
  serviceName: string,
  serviceVersion: string,
  serviceTarget?: string,
  data?: Record<string, unknown>,
): InfoMessage => {
  const info: InfoMessage = {
    messageType,
    id: getNewEBMessageId(),
    traceId: getNewTraceId(),
    timestamp: Date.now(),
    sender: {
      serviceName,
      serviceVersion,
      serviceTarget: serviceTarget || '',
    },
    data,
  }

  return info
}
