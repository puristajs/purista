import type { SchemaObject } from 'openapi3-ts'

import { StatusCode } from '../../core'
import { ContentType } from './ContentType'
import { QueryParameter } from './QueryParameter'

export type HttpExposedServiceMeta = {
  expose: {
    http: {
      method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
      path: string
      contentType?: ContentType // if not set we expect 'application/json'
      contentTypeResponse?: ContentType // if not set we expect 'application/json'
      openApi?: {
        isSecure: boolean
        description: string
        summary: string
        tags?: string[]
        inputPayload?: SchemaObject
        parameter?: SchemaObject
        query?: QueryParameter[]
        outputPayload?: SchemaObject
        additionalStatusCodes?: StatusCode[]
        operationId?: string
      }
    }
  }
}
