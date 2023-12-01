import type { CommandDefinitionMetadataBase, Prettify, StatusCode } from '../../../core'
import type { QueryParameter } from './QueryParameter'

export type HttpExposedServiceMeta<ParameterType = {}> = Prettify<
  CommandDefinitionMetadataBase & {
    expose: {
      http: {
        method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
        path: string
        openApi?: {
          isSecure: boolean
          description: string
          summary: string
          tags?: string[]
          query?: QueryParameter<ParameterType>[]
          additionalStatusCodes?: StatusCode[]
          operationId?: string
        }
      }
    }
  }
>
