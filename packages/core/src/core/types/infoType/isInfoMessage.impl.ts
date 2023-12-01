import type { EBMessage } from '../EBMessage'
import type { InfoMessage } from './InfoMessage'
import { infoMessageTypes } from './InfoMessage'

export const isInfoMessage = (message: EBMessage): message is InfoMessage => {
  return infoMessageTypes.includes(message.messageType)
}
