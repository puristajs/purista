import type { InferIn, Schema } from '../../schema/index.js'

export type GetMessagePayloadType<
	PayloadSchema extends Schema | undefined,
	TransformInputPayloadSchema extends Schema | undefined,
> = TransformInputPayloadSchema extends Schema
	? InferIn<TransformInputPayloadSchema>
	: PayloadSchema extends Schema
		? InferIn<PayloadSchema>
		: unknown
