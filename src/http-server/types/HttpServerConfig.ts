import { SecureServerOptions } from 'http2'
import type {
  ComponentsObject,
  ExternalDocumentationObject,
  InfoObject,
  SecurityRequirementObject,
  ServerObject,
  TagObject,
} from 'openapi3-ts'

import { LogLevelName } from '../../core'

export type HttpServerConfig = {
  logLevel?: LogLevelName
  port: number
  options: SecureServerOptions
  apiMountPath?: string
  openApi?: {
    enabled?: boolean
    path?: string
    info: InfoObject
    servers?: ServerObject[]
    components?: ComponentsObject
    security?: SecurityRequirementObject[]
    externalDocs?: ExternalDocumentationObject
    tags?: TagObject[]
  }
}
