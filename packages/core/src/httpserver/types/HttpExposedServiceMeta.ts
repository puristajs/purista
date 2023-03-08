import type { SchemaObject } from 'openapi3-ts'

import { CommandDefinitionMetadataBase, StatusCode } from '../../core'
import { QueryParameter } from './QueryParameter'

export type HttpExposedServiceMeta<ParameterType = {}> = CommandDefinitionMetadataBase & {
  expose: {
    http: {
      method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
      path: string
      openApi?: {
        isSecure: boolean
        description: string
        summary: string
        tags?: string[]
        inputPayload?: SchemaObject
        parameter?: SchemaObject
        query?: QueryParameter<ParameterType>[]
        outputPayload?: SchemaObject
        additionalStatusCodes?: StatusCode[]
        operationId?: string
      }
    }
  }
}
