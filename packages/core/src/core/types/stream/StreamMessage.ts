import type { StreamControl } from './StreamControl.js'
import type { StreamFrame } from './StreamFrame.js'
import type { StreamOpenRequest } from './StreamOpenRequest.js'

export type StreamMessage<Chunk = unknown, Final = unknown> =
	| StreamOpenRequest
	| StreamControl
	| StreamFrame<Chunk, Final>
