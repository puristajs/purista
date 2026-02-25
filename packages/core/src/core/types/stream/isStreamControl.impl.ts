import type { StreamControl } from './StreamControl.js'
import type { StreamMessage } from './StreamMessage.js'

export const isStreamControl = (message: StreamMessage): message is StreamControl => {
	return message.payload?.frameType === 'cancel'
}
