import type { Infer, Schema } from '@typeschema/main'
import type { EmptyObject } from './EmptyObject.js'

export type InferTypeOrEmptyObject<T extends Schema | undefined> = T extends Schema
	? Infer<T> extends EmptyObject
		? Infer<T>
		: EmptyObject
	: EmptyObject
