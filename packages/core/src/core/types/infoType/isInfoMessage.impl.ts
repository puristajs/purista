import type { EBMessage } from '../EBMessage.js'
import type { InfoMessage } from './InfoMessage.js'
import { infoMessageTypes } from './InfoMessage.js'

export const isInfoMessage = (message: EBMessage): message is InfoMessage => {
	return infoMessageTypes.includes(message.messageType)
}
