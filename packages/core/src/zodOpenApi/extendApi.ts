import type { SchemaObject } from 'openapi3-ts/oas31'
import type { ZodType } from 'zod'

/**
 * Zod schema augmented with PURISTA OpenAPI metadata.
 *
 * @group Schema
 */
export type OpenApiZodAny = ZodType & {
	/** OpenAPI schema metadata attached by {@link extendApi}. */
	metaOpenApi?: SchemaObject | SchemaObject[]
}

/**
 * Attach OpenAPI metadata to a Zod schema.
 *
 * @example
 * ```ts
 * const UserId = extendApi(z.string(), { description: 'Public user id' })
 * ```
 *
 * @group Schema
 */
export const extendApi = <TSchema extends ZodType>(schema: TSchema, meta: SchemaObject | SchemaObject[]): TSchema => {
	;(schema as OpenApiZodAny).metaOpenApi = meta
	return schema
}
