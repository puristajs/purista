import type { SchemaObject } from 'openapi3-ts/oas31'
import type { FromEmitToOtherType } from '../core/types/FromEmitToOtherType.js'
import type { Schema } from '../schema/index.js'
import { validationToSchema } from '../zodOpenApi/validationToSchema.js'

export const convertEmitValidationsToSchema = async <T extends Record<string, Schema>>(
	emits: T,
): Promise<FromEmitToOtherType<T, SchemaObject>> => {
	const result: {
		[key: string]: SchemaObject
	} = {}

	for (const [key, schema] of Object.entries(emits)) {
		result[key] = (await validationToSchema(schema)) as SchemaObject
	}

	return result as FromEmitToOtherType<T, SchemaObject>
}
