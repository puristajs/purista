import type { StatusCode } from '@purista/core'
import type { SchemaObject } from 'openapi3-ts/oas31'
import type { ProblemTypeConfig } from './problemDetails.js'
import { getProblemDetailsSchema } from './problemDetails.js'

/**
 * Runs the getErrorResponseSchema helper exported by @purista/hono-http-server.
 * Expose only schemas and metadata that are safe for clients to inspect.
 */
/**
 * Builds the OpenAPI schema used for generated HTTP error responses.
 */
export const getErrorResponseSchema = (
	code: StatusCode,
	message: string,
	schema?: SchemaObject,
	problemTypeConfig?: ProblemTypeConfig,
): SchemaObject => getProblemDetailsSchema(code, message, schema, problemTypeConfig)
