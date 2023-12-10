import type { EBMessageSenderAddress, InfoMessage, InfoMessageType } from '../types/index.js'
import { getNewEBMessageId } from './getNewEBMessageId.impl.js'
import { getNewTraceId } from './getNewTraceId.impl.js'

/**
 *
 * @param messageType
 * @param sender
 * @param additional
 * @returns
 *
 * @group Helper
 */
export const createInfoMessage = (
  messageType: InfoMessageType,
  sender: EBMessageSenderAddress,
  additional?: Partial<InfoMessage>,
): InfoMessage => {
  const info: Readonly<InfoMessage> = Object.freeze({
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
