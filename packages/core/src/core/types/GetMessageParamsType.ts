import type { InferIn, Schema } from '@typeschema/main'

export type GetMessageParamsType<
	ParamsSchema extends Schema | undefined,
	TransformInputParamsSchema extends Schema | undefined,
> = TransformInputParamsSchema extends Schema
	? InferIn<TransformInputParamsSchema>
	: ParamsSchema extends Schema
		? InferIn<ParamsSchema>
		: unknown
