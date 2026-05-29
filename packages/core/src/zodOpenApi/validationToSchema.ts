/* eslint-disable no-console */

import type { SchemaObject } from 'openapi3-ts/oas31'
import type { Schema } from '../schema/index.js'
import { toJSONSchema } from '../schema/index.js'

/**
 * Convert an optional Standard Schema-compatible validator to OpenAPI schema.
 *
 * Returns `undefined` when no schema is provided or conversion fails. Conversion
 * errors are written to console for build-time diagnostics because this helper
 * is primarily used while generating service definitions and API docs.
 *
 * @example
 * ```ts
 * const openApiSchema = await validationToSchema(z.object({ id: z.string() }))
 * ```
 *
 * @group Schema
 */
export const validationToSchema = async <T extends Schema>(schema?: T): Promise<SchemaObject | undefined> => {
	if (!schema) {
		return
	}
	try {
		const jsonSchema = await toJSONSchema(schema)
		// nothing more needed as we use OpenAPI 3.1 which is valid JSON Schema
		return jsonSchema as SchemaObject
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: Required
		console.error(error)
		// biome-ignore lint/suspicious/noConsole: Required
		console.error('Make sure your schema library supports Standard Schema JSON conversion.')
	}
}
