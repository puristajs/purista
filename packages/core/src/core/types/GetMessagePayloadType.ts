import type { InferIn, Schema } from '@typeschema/main'

export type GetMessagePayloadType<
	PayloadSchema extends Schema | undefined,
	TransformInputPayloadSchema extends Schema | undefined,
> = TransformInputPayloadSchema extends Schema
	? InferIn<TransformInputPayloadSchema>
	: PayloadSchema extends Schema
		? InferIn<PayloadSchema>
		: unknown
