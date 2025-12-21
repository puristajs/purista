import type { Schema } from '../../schema/index.js'

export type EmitSchemaList<T> = {
	[K in keyof T]: Schema
}
