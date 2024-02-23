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
    const { default: convertJsonToOpenApi } = await import('@openapi-contrib/json-schema-to-openapi-schema')
    const jsonSchema = await toJSONSchema(schema)

    const openApiSchema = await (convertJsonToOpenApi as any)(jsonSchema)

    return openApiSchema as unknown as SchemaObject
  } catch (error) {
    console.error(error)
    console.error('Did you installed peer dependencies?')
    console.error('requires: @openapi-contrib/json-schema-to-openapi-schema')
    console.error('requires: @typeschema/[YOUR_SCHEMA_LIB]')
  }
}
