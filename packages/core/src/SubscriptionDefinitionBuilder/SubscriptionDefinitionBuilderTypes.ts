import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { Schema } from '../schema/index.js'

export type SubscriptionDefinitionBuilderTypes<
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
> = {
	PayloadSchema: PayloadSchema
	ParamsSchema: ParamsSchema
	OutputSchema: OutputSchema
	TransformInputPayloadSchema: TransformInputPayloadSchema
	TransformInputParamsSchema: TransformInputParamsSchema
	TransformOutputSchema: TransformOutputSchema
	Resources: Resources
	Invokes: Invokes
	StreamInvokes: StreamInvokes
	EmitList: EmitList
}
