import { type Schema as ValidationSchema, toJSONSchema } from '@typeschema/main'
import type { SchemaObject } from 'openapi3-ts/oas31'

import type { FromInvokeToOtherType } from '../core/types/index.js'

type InputType = {
	[serviceName: string]: {
		[serviceVersion: string]: {
			[name: string]: {
				outputSchema?: ValidationSchema
				payloadSchema?: ValidationSchema
				parameterSchema?: ValidationSchema
			}
		}
	}
}

type ResultType = {
	[serviceName: string]: {
		[serviceVersion: string]: {
			[name: string]: {
				outputSchema?: SchemaObject
				payloadSchema?: SchemaObject
				parameterSchema?: SchemaObject
			}
		}
	}
}

export const convertInvokeValidationsToSchema = async <T extends InputType>(
	invokes: T,
): Promise<
	FromInvokeToOtherType<
		T,
		{ outputSchema?: SchemaObject; payloadSchema?: SchemaObject; parameterSchema?: SchemaObject }
	>
> => {
	const result: ResultType = {}

	for (const [serviceName, versions] of Object.entries(invokes)) {
		result[serviceName] = { ...result[serviceName] }
		for (const [serviceVersion, commands] of Object.entries(versions)) {
			result[serviceName][serviceVersion] = { ...result[serviceName][serviceVersion] }
			for (const [command, schemas] of Object.entries(commands)) {
				result[serviceName][serviceVersion][command] = { ...result[serviceName][serviceVersion][command] }
				const [outputSchema, payloadSchema, parameterSchema] = await Promise.all([
					schemas.outputSchema
						? toJSONSchema(schemas.outputSchema)
						: new Promise<undefined>(resolve => resolve(undefined)),
					schemas.payloadSchema
						? toJSONSchema(schemas.payloadSchema)
						: new Promise<undefined>(resolve => resolve(undefined)),
					schemas.parameterSchema
						? toJSONSchema(schemas.parameterSchema)
						: new Promise<undefined>(resolve => resolve(undefined)),
				])

				result[serviceName][serviceVersion][command] = {
					outputSchema: outputSchema as SchemaObject,
					payloadSchema: payloadSchema as SchemaObject,
					parameterSchema: parameterSchema as SchemaObject,
				}
			}
		}
	}
	return result as FromInvokeToOtherType<
		T,
		{ outputSchema?: SchemaObject; payloadSchema?: SchemaObject; parameterSchema?: SchemaObject }
	>
}
