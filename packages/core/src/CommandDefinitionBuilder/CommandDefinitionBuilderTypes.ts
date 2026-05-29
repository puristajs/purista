import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { Schema } from '../schema/index.js'

/** Type accumulator used by `CommandDefinitionBuilder` for schemas, hooks, invocations, events, and queues. */
export type CommandDefinitionBuilderTypes<
	PayloadSchema extends Schema = Schema,
	ParamsSchema extends Schema = Schema,
	OutputSchema extends Schema = Schema,
	TransformInputPayloadSchema extends Schema = Schema,
	TransformInputParamsSchema extends Schema = Schema,
	TransformOutputSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = InvokeList,
	StreamInvokes extends StreamInvokeList = StreamInvokeList,
	EmitList extends Record<string, Schema> = Record<string, Schema>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
> = {
	/** Schema that validates the command handler payload. */
	PayloadSchema: PayloadSchema
	/** Schema that validates the command handler parameters. */
	ParamsSchema: ParamsSchema
	/** Schema that validates the command handler result. */
	OutputSchema: OutputSchema
	/** Schema that validates raw payload before `setTransformInput(...)`. */
	TransformInputPayloadSchema: TransformInputPayloadSchema
	/** Schema that validates raw parameters before `setTransformInput(...)`. */
	TransformInputParamsSchema: TransformInputParamsSchema
	/** Schema that validates the transformed output payload. */
	TransformOutputSchema: TransformOutputSchema
	/** Service resources available in command handlers and hooks. */
	Resources: Resources
	/** Commands this command may invoke through the typed service proxy. */
	Invokes: Invokes
	/** Streams this command may consume through the typed stream proxy. */
	StreamInvokes: StreamInvokes
	/** Custom events this command may emit. */
	EmitList: EmitList
	/** Queues this command may enqueue. */
	QueueInvokes: QueueInvokes
}
