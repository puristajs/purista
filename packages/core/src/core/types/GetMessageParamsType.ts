import type { InferIn, Schema } from '../../schema/index.js'

export type GetMessageParamsType<
	ParamsSchema extends Schema | undefined,
	TransformInputParamsSchema extends Schema | undefined,
> = TransformInputParamsSchema extends Schema
	? InferIn<TransformInputParamsSchema>
	: ParamsSchema extends Schema
		? InferIn<ParamsSchema>
		: unknown
