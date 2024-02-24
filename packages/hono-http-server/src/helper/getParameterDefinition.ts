import type { ParameterObject, SchemaObject } from 'openapi3-ts/oas31'
import { isReferenceObject } from 'openapi3-ts/oas31'

const findPathParamsRegex = /:[^:/]+/gm

export const getParameterDefinition = (path: string, parameterschema?: SchemaObject): ParameterObject[] => {
  const routeParams: string[] = []
  let m: RegExpExecArray | null

  while ((m = findPathParamsRegex.exec(path)) !== null) {
    if (m.index === findPathParamsRegex.lastIndex) {
      findPathParamsRegex.lastIndex++
    }

    routeParams.push(...m.map((name) => name))
  }

  return routeParams.map((pathParamName) => {
    const name = pathParamName.replace('?', '').replace(':', '')
    const required = !pathParamName.endsWith('?')

    const schema = parameterschema?.properties?.[name]

    if (!!schema && isReferenceObject(schema)) {
      return {
        in: 'path',
        name,
        required,
        ...schema,
      }
    }

    return {
      in: 'path',
      name,
      required,
      schema,
      description: schema?.description ?? schema?.title,
    }
  })
}
