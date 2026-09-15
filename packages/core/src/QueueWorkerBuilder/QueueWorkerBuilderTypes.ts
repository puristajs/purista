import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { Schema } from '../schema/index.js'

/** Type accumulator used by `QueueWorkerBuilder` for handler capabilities. */
export type QueueWorkerBuilderTypes<
	PayloadSchema extends Schema = Schema,
	ParamsSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = InvokeList,
	StreamInvokes extends StreamInvokeList = StreamInvokeList,
	EmitList extends Record<string, Schema> = Record<string, Schema>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
> = {
	/** Schema that validates the leased queue payload. */
	PayloadSchema: PayloadSchema
	/** Schema that validates the leased queue parameters. */
	ParamsSchema: ParamsSchema
	/** Service resources available in queue worker handlers and hooks. */
	Resources: Resources
	/** Commands this queue worker may invoke through the typed service proxy. */
	Invokes: Invokes
	/** Streams this queue worker may consume through the typed stream proxy. */
	StreamInvokes: StreamInvokes
	/** Custom events this queue worker may emit. */
	EmitList: EmitList
	/** Queues this queue worker may enqueue. */
	QueueInvokes: QueueInvokes
}
