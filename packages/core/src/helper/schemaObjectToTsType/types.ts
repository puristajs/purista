import type { OpenAPIV3 } from 'openapi-types'

/** Context passed to all submodules */
export interface GlobalContext {
  additionalProperties: boolean
  alphabetize: boolean
  emptyObjectsUnknown: boolean
  defaultNonNullable: boolean
  discriminators: { [$ref: string]: OpenAPIV3.DiscriminatorObject }
  immutableTypes: boolean
  indentLv: number
  operations: Record<
    string,
    {
      comment?: string
      operationType: string
    }
  >
  parameters: Record<string, OpenAPIV3.ParameterObject>
  pathParamsAsTypes: boolean
  silent: boolean
  supportArrayLength: boolean
  excludeDeprecated: boolean
}
