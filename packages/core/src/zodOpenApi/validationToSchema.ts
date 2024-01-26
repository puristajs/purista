import type { Schema } from '@decs/typeschema'
import type { SchemaObject } from 'openapi3-ts/oas31'
import { ZodType } from 'zod'

import { generateSchema } from './zodOpenApi.impl.js'

export const validationToSchema = <T extends Schema>(schema?: T): SchemaObject | undefined => {
  if (!schema) {
    return
  }
  if (schema instanceof ZodType) {
    return generateSchema(schema)
  }
  // eslint-disable-next-line no-console
  console.warn('Validation schema does not support auto generation of OpenApi definition')
}
