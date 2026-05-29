import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import type { SchemaObject } from 'openapi3-ts/oas31'
import type { AnySchema } from 'yup'
import type { ZodType } from 'zod'

/**
 * Common Standard Schema abstraction used across PURISTA boundaries.
 *
 * Commands, subscriptions, streams, queues, configuration, and custom metrics
 * use schemas for runtime validation and documentation generation.
 */
export type Schema = StandardSchemaV1
/** Infers output type from a schema. */
export type Infer<TSchema extends Schema> = StandardSchemaV1.InferOutput<TSchema>
/** Infers input type from a schema. */
export type InferIn<TSchema extends Schema> = StandardSchemaV1.InferInput<TSchema>

/**
 * Unified validation result shape for all supported schema vendors.
 *
 * Validation issues can be safely surfaced as contract errors, but raw input
 * values should not be logged alongside them unless explicitly safe.
 */
export type ValidationResult<TOutput> =
	| { success: true; data: TOutput }
	| { success: false; issues: ReadonlyArray<StandardSchemaV1.Issue> }

export type JsonSchemaOptions = {
	target?: StandardJSONSchemaV1.Target
	mode?: 'input' | 'output'
}

const isStandardJsonSchema = (
	props: StandardSchemaV1.Props,
): props is StandardSchemaV1.Props & StandardJSONSchemaV1.Props =>
	'jsonSchema' in props && typeof (props as StandardJSONSchemaV1.Props).jsonSchema === 'object'

const isYupSchema = (schema: unknown): schema is AnySchema =>
	!!schema && typeof schema === 'object' && '__isYupSchema__' in schema

type ZodModuleShape = {
	z?: {
		ZodUndefined?: unknown
		ZodVoid?: unknown
		toJSONSchema?: (
			schema: ZodType,
			options: {
				target: StandardJSONSchemaV1.Target
				io: 'input' | 'output'
				unrepresentable: 'any'
			},
		) => unknown
	}
	toJSONSchema?: (
		schema: ZodType,
		options: {
			target: StandardJSONSchemaV1.Target
			io: 'input' | 'output'
			unrepresentable: 'any'
		},
	) => unknown
}

const isInstanceOf = (value: unknown, ctor: unknown) => typeof ctor === 'function' && value instanceof ctor

const getZodToJSONSchema = (zodModule: ZodModuleShape) => zodModule.z?.toJSONSchema ?? zodModule.toJSONSchema

/**
 * Validates input data with a Standard Schema compatible validator.
 *
 * @example
 * ```ts
 * const result = await validate(schema, input)
 * if (!result.success) {
 *   throw new HandledError(StatusCode.BadRequest, 'invalid input', result.issues)
 * }
 * ```
 */
export const validate = async <TSchema extends Schema>(
	schema: TSchema,
	value: unknown,
): Promise<ValidationResult<Infer<TSchema>>> => {
	const result = await schema['~standard'].validate(value)

	if (Array.isArray(result.issues) && result.issues.length > 0) {
		return { success: false, issues: result.issues }
	}

	return { success: true, data: (result as { value: Infer<TSchema> }).value }
}

/**
 * Converts supported schema formats into OpenAPI-compatible JSON Schema.
 *
 * Used by API documentation and service definition export helpers.
 */
export const toJSONSchema = async (schema: Schema, options?: JsonSchemaOptions): Promise<SchemaObject> => {
	const standardProps = schema['~standard']
	const target = options?.target ?? 'draft-2020-12'
	const mode = options?.mode ?? 'output'

	if (isYupSchema(schema)) {
		try {
			const { convertSchema } = await import('@sodaru/yup-to-json-schema')
			return convertSchema(schema) as SchemaObject
		} catch (error) {
			const err = new Error(
				'Yup JSON schema conversion requires the optional dependency `@sodaru/yup-to-json-schema` to be installed.',
			)
			;(err as { cause?: unknown }).cause = error
			throw err
		}
	}

	if (standardProps.vendor === 'zod') {
		const zodModule = (await import('zod')) as ZodModuleShape
		const maybeZod = schema as ZodType
		if (isInstanceOf(maybeZod, zodModule.z?.ZodUndefined) || isInstanceOf(maybeZod, zodModule.z?.ZodVoid)) {
			return { type: 'null' } as SchemaObject
		}
		try {
			const toZodJsonSchema = getZodToJSONSchema(zodModule)
			if (typeof toZodJsonSchema !== 'function') {
				throw new TypeError('zod does not expose a toJSONSchema function')
			}
			return toZodJsonSchema(maybeZod, {
				target,
				io: mode,
				unrepresentable: 'any',
			}) as SchemaObject
		} catch (error) {
			const originalError = error as Error
			const message = originalError?.message ?? ''
			if (message.includes('Void cannot be represented') || message.includes('Undefined cannot be represented')) {
				return { type: 'null' } as SchemaObject
			}
			const err = new Error('Zod JSON schema conversion requires zod@^4 to be installed.')
			;(err as { cause?: unknown }).cause = error
			throw err
		}
	}

	if (isStandardJsonSchema(standardProps)) {
		try {
			return (
				mode === 'input' ? standardProps.jsonSchema.input({ target }) : standardProps.jsonSchema.output({ target })
			) as SchemaObject
		} catch (error) {
			const err = new Error('Failed to convert Standard Schema to JSON Schema.')
			;(err as { cause?: unknown }).cause = error
			throw err
		}
	}

	throw new Error('Schema does not support JSON schema conversion.')
}
