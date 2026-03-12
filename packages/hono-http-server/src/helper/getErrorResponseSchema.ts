import type { StatusCode } from '@purista/core'
import type { SchemaObject } from 'openapi3-ts/oas31'

import { getProblemDetailsSchema } from './problemDetails.js'

export const getErrorResponseSchema = (code: StatusCode, message: string, schema?: SchemaObject): SchemaObject =>
	getProblemDetailsSchema(code, message, schema)
