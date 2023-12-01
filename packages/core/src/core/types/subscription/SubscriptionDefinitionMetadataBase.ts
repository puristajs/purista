import type { SchemaObject } from 'openapi3-ts/oas31'

import type { ContentType } from '../ContentType'

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
