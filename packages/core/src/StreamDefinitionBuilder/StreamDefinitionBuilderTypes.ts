import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { Schema } from '../schema/index.js'

/** Type accumulator used by `StreamDefinitionBuilder` for schemas, invocations, events, and queue access. */
export type StreamDefinitionBuilderTypes<
	PayloadSchema extends Schema = Schema,
	ParamsSchema extends Schema = Schema,
	ChunkSchema extends Schema = Schema,
	FinalSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = InvokeList,
	StreamInvokes extends StreamInvokeList = StreamInvokeList,
	EmitList extends Record<string, Schema> = Record<string, Schema>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
> = {
	/** Schema that validates the stream payload. */
	PayloadSchema: PayloadSchema
	/** Schema that validates the stream parameters. */
	ParamsSchema: ParamsSchema
	/** Schema that validates each emitted stream chunk. */
	ChunkSchema: ChunkSchema
	/** Schema that validates the final stream payload. */
	FinalSchema: FinalSchema
	/** Service resources available in stream handlers and hooks. */
	Resources: Resources
	/** Commands this stream may invoke through the typed service proxy. */
	Invokes: Invokes
	/** Streams this stream may consume through the typed stream proxy. */
	StreamInvokes: StreamInvokes
	/** Custom events this stream may emit. */
	EmitList: EmitList
	/** Queues this stream may enqueue. */
	QueueInvokes: QueueInvokes
}
