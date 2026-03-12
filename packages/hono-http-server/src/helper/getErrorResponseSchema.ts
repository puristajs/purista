import type { StatusCode } from '@purista/core'
import type { SchemaObject } from 'openapi3-ts/oas31'
import type { ProblemTypeConfig } from './problemDetails.js'
import { getProblemDetailsSchema } from './problemDetails.js'

export const getErrorResponseSchema = (
	code: StatusCode,
	message: string,
	schema?: SchemaObject,
	problemTypeConfig?: ProblemTypeConfig,
): SchemaObject => getProblemDetailsSchema(code, message, schema, problemTypeConfig)
