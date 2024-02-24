import type { QueryParameter } from '@purista/core'
import type { ParameterObject, SchemaObject } from 'openapi3-ts/oas31'
import { isReferenceObject } from 'openapi3-ts/oas31'

export const getQueryDefintion = (
  queryDefinition: QueryParameter<Record<string, unknown>>[] | undefined,
  parameterschema?: SchemaObject,
): ParameterObject[] => {
  if (!queryDefinition) {
    return []
  }

  return queryDefinition.map((queryParam) => {
    const name = queryParam.name
    const schema = parameterschema?.properties?.[name]
    const required = queryParam.required

    if (!!schema && isReferenceObject(schema)) {
      return {
        in: 'query',
        name,
        required,
        ...schema,
      }
    }

    return {
      in: 'query',
      name,
      required,
      schema,
      description: schema?.description ?? schema?.title,
    }
  })
}
