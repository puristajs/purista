import type { Schema } from '@typeschema/main'
import type { EmptyObject, InvokeList } from '../core/index.js'

export type CommandDefinitionBuilderTypes<
	PayloadSchema extends Schema = Schema,
	ParamsSchema extends Schema = Schema,
	OutputSchema extends Schema = Schema,
	TransformInputPayloadSchema extends Schema = Schema,
	TransformInputParamsSchema extends Schema = Schema,
	TransformOutputSchema extends Schema = Schema,
	Resources extends Record<string, any> = EmptyObject,
	Invokes extends InvokeList = InvokeList,
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
	EmitList: EmitList
}
