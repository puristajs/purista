import { ContentType } from '../ContentType'

export type CommandDefinitionMetadataBase = {
  expose: {
    contentTypeRequest?: ContentType
    contentEncodingRequest?: string
    contentTypeResponse?: ContentType
    contentEncodingResponse?: string
  }
}
