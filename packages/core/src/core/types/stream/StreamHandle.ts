import type { CorrelationId } from '../CorrelationId.js'
import type { StreamFrame } from './StreamFrame.js'

export interface StreamHandle<Chunk = unknown, Final = unknown>
	extends AsyncIterable<Readonly<StreamFrame<Chunk, Final>>> {
	readonly sessionId: CorrelationId
	cancel(reason?: string): Promise<void>
}
