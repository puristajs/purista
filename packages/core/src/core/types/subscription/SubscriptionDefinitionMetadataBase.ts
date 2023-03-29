import type { SchemaObject } from 'openapi3-ts'

import { ContentType } from '../ContentType'

export type SubscriptionDefinitionMetadataBase = {
  expose: {
    contentTypeRequest?: ContentType
    contentEncodingRequest?: string
    contentTypeResponse?: ContentType
    contentEncodingResponse?: string
    inputPayload?: SchemaObject
    outputPayload?: SchemaObject
    parameter?: SchemaObject
  }
}
