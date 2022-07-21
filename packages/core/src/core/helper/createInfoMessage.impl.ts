import { InfoMessage, InfoMessageType } from '../types'
import { getNewEBMessageId } from './getNewEBMessageId.impl'
import { getNewTraceId } from './getNewTraceId.impl'

export const createInfoMessage = (
  messageType: InfoMessageType,
  serviceName: string,
  serviceVersion: string,
  serviceTarget?: string,
  payload?: Record<string, unknown>,
): Omit<InfoMessage, 'instanceId'> => {
  const info: Readonly<Omit<InfoMessage, 'instanceId'>> = Object.freeze({
    messageType,
    id: getNewEBMessageId(),
    traceId: getNewTraceId(),
    timestamp: Date.now(),
    sender: {
      serviceName,
      serviceVersion,
      serviceTarget: serviceTarget || '',
    },
    payload,
  })

  return info
}
