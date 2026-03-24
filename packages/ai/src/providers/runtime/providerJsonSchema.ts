import { type Schema as AiSdkSchema, jsonSchema } from '@ai-sdk/provider-utils'
import { type Schema, toJSONSchema } from '@purista/core'

type JsonSchemaObject = Record<string, unknown>

const isRecord = (value: unknown): value is JsonSchemaObject =>
	!!value && typeof value === 'object' && !Array.isArray(value)

const isStandardSchema = (value: unknown): value is Schema => isRecord(value) && '~standard' in value

type ValidationResult<T> =
	| {
			success: true
			value: T
	  }
	| {
			success: false
			error: Error
	  }

const isPlainJsonSchemaObject = (value: unknown): value is JsonSchemaObject => {
	if (!isRecord(value)) {
		return false
	}

	return !('~standard' in value) && !('jsonSchema' in value && 'validate' in value)
}

const isAiSdkSchema = <T = unknown>(value: unknown): value is AiSdkSchema<T> =>
	isRecord(value) && 'jsonSchema' in value && 'validate' in value

const getStandardSchemaValidator = <T = unknown>(value: unknown) => {
	if (!isRecord(value) || !('~standard' in value) || !isRecord(value['~standard'])) {
		return undefined
	}

	const validate = value['~standard'].validate
	return typeof validate === 'function'
		? async (input: unknown): Promise<ValidationResult<T>> => {
				const result = await validate(input)
				return 'value' in result
					? { success: true, value: result.value as T }
					: {
							success: false,
							error: new Error('Standard schema validation failed'),
						}
			}
		: undefined
}

const getZodValidator = <T = unknown>(value: unknown) => {
	if (!isRecord(value)) {
		return undefined
	}

	const safeParseAsync = value.safeParseAsync
	if (typeof safeParseAsync === 'function') {
		return async (input: unknown): Promise<ValidationResult<T>> => {
			const result = await safeParseAsync.call(value, input)
			return result.success ? { success: true, value: result.data as T } : { success: false, error: result.error }
		}
	}

	const safeParse = value.safeParse
	if (typeof safeParse === 'function') {
		return async (input: unknown): Promise<ValidationResult<T>> => {
			const result = safeParse.call(value, input)
			return result.success ? { success: true, value: result.data as T } : { success: false, error: result.error }
		}
	}

	return undefined
}

const resolveValidator = <T = unknown>(schema: unknown) =>
	(isAiSdkSchema<T>(schema) ? schema.validate : undefined) ??
	getStandardSchemaValidator<T>(schema) ??
	getZodValidator<T>(schema)

const sanitizeSchemaNode = (value: unknown): unknown => {
	if (Array.isArray(value)) {
		return value.map(item => sanitizeSchemaNode(item))
	}

	if (!isRecord(value)) {
		return value
	}

	const node: JsonSchemaObject = {}

	for (const [key, entry] of Object.entries(value)) {
		if (key === '$schema' || key === 'default') {
			continue
		}
		if (key === 'propertyNames') {
			continue
		}
		if (key === 'properties' && isRecord(entry)) {
			node.properties = Object.fromEntries(
				Object.entries(entry).map(([propertyName, propertySchema]) => [
					propertyName,
					sanitizeSchemaNode(propertySchema),
				]),
			)
			continue
		}
		if (key === 'additionalProperties') {
			node.additionalProperties = sanitizeSchemaNode(entry)
			continue
		}
		if (key === 'items') {
			node.items = sanitizeSchemaNode(entry)
			continue
		}
		if (key === 'prefixItems' && Array.isArray(entry)) {
			node.prefixItems = entry.map(item => sanitizeSchemaNode(item))
			continue
		}
		if (key === 'allOf' || key === 'anyOf' || key === 'oneOf') {
			node[key] = Array.isArray(entry) ? entry.map(item => sanitizeSchemaNode(item)) : entry
			continue
		}
		if (key === 'not') {
			node.not = sanitizeSchemaNode(entry)
			continue
		}
		if (key === '$defs' && isRecord(entry)) {
			node.$defs = Object.fromEntries(
				Object.entries(entry).map(([definitionName, definitionSchema]) => [
					definitionName,
					sanitizeSchemaNode(definitionSchema),
				]),
			)
			continue
		}
		node[key] = sanitizeSchemaNode(entry)
	}

	if ((node.type === 'object' || node.properties !== undefined) && node.additionalProperties === undefined) {
		node.additionalProperties = false
	}

	if ((node.type === 'object' || node.properties !== undefined) && isRecord(node.properties)) {
		node.required = Object.keys(node.properties)
	}

	return node
}

const resolveJsonSchema = async (schema: unknown): Promise<unknown> => {
	if (isStandardSchema(schema)) {
		return await toJSONSchema(schema)
	}
	return schema
}

/**
 * Compiles a schema into a provider-safe JSON Schema object for strict structured output.
 *
 * The compiler accepts PURISTA Standard Schema values as well as plain JSON Schema objects.
 * It normalizes nodes so provider strict-schema validators do not see unsupported keywords
 * such as `propertyNames`.
 */
export const compileProviderJsonSchema = async (schema: unknown): Promise<JsonSchemaObject | undefined> => {
	if (schema === undefined || schema === null) {
		return undefined
	}

	const resolvedSchema = await resolveJsonSchema(schema)
	if (!isRecord(resolvedSchema)) {
		throw new Error('Provider JSON schema must resolve to an object schema')
	}

	return sanitizeSchemaNode(resolvedSchema) as JsonSchemaObject
}

/**
 * Compiles an input schema into an AI SDK schema wrapper with provider-safe JSON Schema.
 *
 * This preserves validation for Standard Schema / Zod / AI SDK schemas while still sanitizing
 * the JSON Schema that is sent to strict providers.
 */
export const compileProviderAiSdkSchema = async <T = unknown>(schema: unknown): Promise<AiSdkSchema<T> | undefined> => {
	if (schema === undefined || schema === null) {
		return undefined
	}

	if (isPlainJsonSchemaObject(schema)) {
		const compiled = await compileProviderJsonSchema(schema)
		return compiled ? jsonSchema(compiled) : undefined
	}

	if (isAiSdkSchema<T>(schema)) {
		const compiled = await compileProviderJsonSchema(await schema.jsonSchema)
		return jsonSchema(compiled ?? (await schema.jsonSchema), {
			validate: schema.validate,
		})
	}

	const compiled = await compileProviderJsonSchema(schema)

	return jsonSchema(compiled ?? {}, {
		validate: resolveValidator<T>(schema),
	})
}
