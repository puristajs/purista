import type { SchemaObject } from 'openapi3-ts/oas31'
import type { ZodType } from 'zod/v4'

export type OpenApiZodAny = ZodType & {
	metaOpenApi?: SchemaObject | SchemaObject[]
}

export const extendApi = <TSchema extends ZodType>(schema: TSchema, meta: SchemaObject | SchemaObject[]): TSchema => {
	;(schema as OpenApiZodAny).metaOpenApi = meta
	return schema
}
