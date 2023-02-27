import { FastifyCompressOptions } from '@fastify/compress'
import { FastifyCorsOptions } from '@fastify/cors'
import { FastifyHelmetOptions } from '@fastify/helmet'
import { LogLevelName } from '@purista/core'
import { FastifyHttp2SecureOptions, FastifyServerOptions } from 'fastify'
import { Http2SecureServer } from 'http2'
import type {
  ComponentsObject,
  ExternalDocumentationObject,
  InfoObject,
  SecurityRequirementObject,
  ServerObject,
  TagObject,
} from 'openapi3-ts'

export type HttpServerConfig = {
  fastify: Partial<FastifyServerOptions> & Partial<FastifyHttp2SecureOptions<Http2SecureServer>>
  logLevel?: LogLevelName
  port: number
  host?: string
  domain: string
  uploadDir?: string
  cookieSecret?: string
  apiMountPath?: string
  enableHelmet?: boolean
  enableHealthz?: boolean
  helmetOptions?: FastifyHelmetOptions
  enableCompress?: boolean
  compressOptions?: FastifyCompressOptions
  enableCors?: boolean
  corsOptions?: FastifyCorsOptions
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
