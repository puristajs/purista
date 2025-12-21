import type { Infer, Schema } from '../../schema/index.js'
import type { EmptyObject } from './EmptyObject.js'

export type InferTypeOrEmptyObject<T extends Schema | undefined> = T extends Schema
	? Infer<T> extends EmptyObject
		? Infer<T>
		: EmptyObject
	: EmptyObject
