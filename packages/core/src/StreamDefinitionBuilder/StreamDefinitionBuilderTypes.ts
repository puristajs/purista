import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { Schema } from '../schema/index.js'

export type StreamDefinitionBuilderTypes<
	PayloadSchema extends Schema = Schema,
	ParamsSchema extends Schema = Schema,
	ChunkSchema extends Schema = Schema,
	FinalSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = InvokeList,
	StreamInvokes extends StreamInvokeList = StreamInvokeList,
	EmitList extends Record<string, Schema> = Record<string, Schema>,
> = {
	PayloadSchema: PayloadSchema
	ParamsSchema: ParamsSchema
	ChunkSchema: ChunkSchema
	FinalSchema: FinalSchema
	Resources: Resources
	Invokes: Invokes
	StreamInvokes: StreamInvokes
	EmitList: EmitList
}
