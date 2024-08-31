/* eslint-disable no-console */
import type { Schema } from '@typeschema/main'
import { toJSONSchema } from '@typeschema/main'
import type { SchemaObject } from 'openapi3-ts/oas31'
import { ZodType } from 'zod'

import { generateSchema } from './zodOpenApi.impl.js'

export const validationToSchema = async <T extends Schema>(schema?: T): Promise<SchemaObject | undefined> => {
	if (!schema) {
		return
	}
	if (schema instanceof ZodType) {
		return generateSchema(schema)
	}
	try {
		const jsonSchema = await toJSONSchema(schema)
		// nothing more needed as we use OpenAPI 3.1 which is valid JSON Schema
		return jsonSchema as SchemaObject
	} catch (error) {
		// biome-ignore lint/nursery/noConsole: Required
		console.error(error)
		// biome-ignore lint/nursery/noConsole: Required
		console.error('Did you installed peer dependencies?')
		// biome-ignore lint/nursery/noConsole: Required
		console.error('requires: @typeschema/[YOUR_SCHEMA_LIB]')
	}
}
