import type { Schema } from '@typeschema/main'

export type EmitSchemaList<T> = {
	[K in keyof T]: Schema
}
