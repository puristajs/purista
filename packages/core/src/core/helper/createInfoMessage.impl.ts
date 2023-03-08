import { EBMessageAddress, InfoMessage, InfoMessageType } from '../types'
import { getNewEBMessageId } from './getNewEBMessageId.impl'
import { getNewTraceId } from './getNewTraceId.impl'

export const createInfoMessage = (
  messageType: InfoMessageType,
  sender: EBMessageAddress,
  additional?: Partial<InfoMessage>,
): Omit<InfoMessage, 'instanceId'> => {
  const info: Readonly<Omit<InfoMessage, 'instanceId'>> = Object.freeze({
    messageType,
    id: getNewEBMessageId(),
    traceId: getNewTraceId(),
    timestamp: Date.now(),
    contentType: 'application/json',
    contentEncoding: 'utf-8',
    sender,
    ...additional,
  })

  return info
}
