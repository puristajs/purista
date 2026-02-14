import type { StreamMessage } from './StreamMessage.js'
import type { StreamOpenRequest } from './StreamOpenRequest.js'

export const isStreamOpenRequest = (message: StreamMessage): message is StreamOpenRequest => {
	return message.payload?.frameType === 'open'
}
