import { CustomMessage } from './CustomMessage'
import { EBMessage } from './EBMessage'
import { EBMessageType } from './EBMessageType.enum'

/**
 * Checks if a PURISTA message is type of custom message
 * @param message any PURISTA message
 * @returns true if message is type of custom message
 */
export const isCustomMessage = (message: EBMessage): message is CustomMessage => {
  return message.messageType === EBMessageType.CustomMessage
}
