import type { Infer, Schema } from '@typeschema/main'
import type { ZodUnknown, ZodVoid } from 'zod'
import type { EmptyObject } from './EmptyObject.js'

export type CommandDefinitionBuilderTypes<
	Resources extends {} = EmptyObject,
	MessagePayloadType = unknown,
	MessageParamsType = EmptyObject,
	MessageResultType extends Infer<ResultSchema> = any,
	PayloadSchema extends Schema = ZodUnknown,
	ParameterSchema extends Schema = ZodUnknown,
	ResultSchema extends Schema = ZodVoid,
	Invokes = EmptyObject,
	EmitListType = EmptyObject,
> = {
	Resources: Resources
	MessagePayloadType: MessagePayloadType
	MessageParamsType: MessageParamsType
	MessageResultType: MessageResultType
	PayloadSchema: PayloadSchema
	ParameterSchema: ParameterSchema
	ResultSchema: ResultSchema
	Invokes: Invokes
	EmitListType: EmitListType
}
