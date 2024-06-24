import type { Http2SecureServer } from 'node:http2'

import type { FastifyCompressOptions } from '@fastify/compress'
import type { FastifyCorsOptions } from '@fastify/cors'
import type { FastifyHttp2SecureOptions, FastifyServerOptions } from 'fastify'
import { z } from 'zod'

// define the service config schema and the default service configuration

export const OPENAPI_DEFAULT_MOUNT_PATH = '/api'

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

export const FastifyHelmetOptionsSchema = z.object({
	enableCSPNonces: z.boolean().optional(),
	global: z.boolean().optional(),
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
export const httpServerServiceV1ConfigSchema = z.object({
	fastify: z.any(), //
	logLevel: z.enum(['info', 'error', 'warn', 'debug', 'trace', 'fatal']).optional(),
	port: z.number().int().min(1),
	host: z.string().optional().default('0.0.0.0'),
	domain: z.string().optional().default('localhost'),
	uploadDir: z.string().optional(),
	cookieSecret: z.string().optional(),
	apiMountPath: z.string().optional(),
	enableHelmet: z.boolean().optional().default(false),
	enableHealthz: z.boolean().optional().default(true),
	healthzFunction: z.function().args(z.any(), z.any()).returns(z.promise(z.void())).optional(),
	helmetOptions: FastifyHelmetOptionsSchema.optional(),
	enableCompress: z.boolean().optional().default(false),
	compressOptions: z.any().optional(),
	enableCors: z.boolean().optional().default(false),
	corsOptions: z.any().optional(),
	traceHeaderField: z.string().default('x-trace-id'),
	openApi: z
		.object({
			enabled: z.boolean().optional().default(true),
			path: z.string().optional().default('/api'),
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

export type HttpServerServiceV1ConfigRaw = z.input<typeof httpServerServiceV1ConfigSchema>

export type HttpServerServiceV1Config = HttpServerServiceV1ConfigRaw & {
	compressOptions?: FastifyCompressOptions
	fastify: Partial<FastifyServerOptions> & Partial<FastifyHttp2SecureOptions<Http2SecureServer>>
	corsOptions?: FastifyCorsOptions
}
