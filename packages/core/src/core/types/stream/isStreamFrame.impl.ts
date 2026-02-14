import type { StreamFrame } from './StreamFrame.js'
import type { StreamMessage } from './StreamMessage.js'

export const isStreamFrame = <Chunk = unknown, Final = unknown>(
	message: StreamMessage<Chunk, Final>,
): message is StreamFrame<Chunk, Final> => {
	const frameType = message.payload?.frameType
	return frameType !== 'open' && frameType !== 'cancel'
}
