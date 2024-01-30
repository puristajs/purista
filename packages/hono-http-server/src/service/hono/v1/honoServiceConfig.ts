import { Service } from '@purista/core'
import { z } from 'zod'

// define the service config schema and the default service configuration

export const DEFAULT_API_MOUNT_PATH = '/api'

export const OPENAPI_DEFAULT_INFO = {
  title: 'Server api',
  description: 'OpenApi definition for server endpoints',
  version: '1.0.0',
}

export const ExternalDocumentationObjectSchema = z.object({
  description: z.string().optional(),
  url: z.string().url(),
})

export const TagObjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  externalDocs: ExternalDocumentationObjectSchema.optional(),
})

export const InfoObjectSchema = z.object({
  title: z.string().default('PURISTA'),
  description: z.string().default('OpenApi definition for server endpoints'),
  termsOfService: z.string().optional(),
  contact: z
    .object({
      name: z.string().optional(),
      url: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  license: z
    .object({
      name: z.string(),
      url: z.string().optional(),
    })
    .optional(),
  version: z.string().default('1.0.0'),
})

export const ServerObjectSchema = z.object({
  url: z.string(),
  description: z.string().optional(),
  variables: z.any().optional(),
})
export const honoServiceV1ConfigSchema = z.object({
  logLevel: z.enum(['info', 'error', 'warn', 'debug', 'trace', 'fatal']).optional(),
  enableDynamicRoutes: z.boolean().default(false),
  apiMountPath: z.string().optional().default(DEFAULT_API_MOUNT_PATH),
  enableHealth: z.boolean().optional().default(true),
  healthPath: z.string().optional().default('/healthz'),
  healthFunction: z.any().default(function () {}),
  protectHandler: z.any().default(function () {}),
  services: z.array(z.instanceof(Service)).optional().default([]),
  traceHeaderField: z.string().default('x-trace-id'),
  openApi: z
    .object({
      openapi: z.string().default('3.1.0'),
      enabled: z.boolean().optional().default(true),
      info: InfoObjectSchema,
      servers: z.array(ServerObjectSchema).optional(),
      components: z.any().optional(),
      security: z.array(z.any()).optional(),
      externalDocs: ExternalDocumentationObjectSchema.optional(),
      tags: z.array(TagObjectSchema).optional(),
      paths: z.record(z.string(), z.record(z.string(), z.any())).optional(),
    })
    .optional(),
})

export type HonoServiceV1Config = z.output<typeof honoServiceV1ConfigSchema>
