import { Service } from '@purista/core/adapter'
import { z } from 'zod'

// define the service config schema and the default service configuration

/**
 * Default base path for generated HTTP command and stream endpoints.
 */
export const DEFAULT_API_MOUNT_PATH = '/api'

/**
 * Default maximum size, in bytes, accepted for an HTTP request body.
 *
 * Applications that intentionally accept larger payloads must set
 * `maxRequestBodyBytes` explicitly in the Hono service configuration.
 */
export const DEFAULT_MAX_REQUEST_BODY_BYTES = 1024 * 1024

/**
 * Default OpenAPI info block used when no application-specific metadata is supplied.
 */
export const OPENAPI_DEFAULT_INFO = {
	title: 'Server api',
	description: 'OpenApi definition for server endpoints',
	version: '1.0.0',
}
/** Schema for OpenAPI external documentation objects. */
export const ExternalDocumentationObjectSchema = z.object({
	description: z.string().optional(),
	url: z.string().url(),
})
/** Schema for OpenAPI tag objects. */
export const TagObjectSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	externalDocs: ExternalDocumentationObjectSchema.optional(),
})

/** Schema for the OpenAPI info object. */
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

/** Schema for OpenAPI server objects. */
export const ServerObjectSchema = z.object({
	url: z.string(),
	description: z.string().optional(),
	// Keep `any`: OpenAPI `variables` shape is external and passed through without narrowing.
	variables: z.any().optional(),
})

/** Schema for RFC 9457 problem details configuration. */
export const ProblemDetailsObjectSchema = z.object({
	typeBaseUri: z.string().min(1).optional(),
})

/**
 * Runtime configuration schema for the Hono HTTP service.
 *
 * Defaults keep the server explicit: health can be enabled separately,
 * generated OpenAPI is enabled, and dynamic route registration is disabled
 * unless the application opts in.
 */
export const honoServiceV1ConfigSchema = z.object({
	logLevel: z.enum(['info', 'error', 'warn', 'debug', 'trace', 'fatal']).optional().default('warn'),
	enableDynamicRoutes: z.boolean().default(false),
	streamRequestTimeoutMs: z.number().int().positive().optional().default(300000),
	/**
	 * Maximum number of bytes accepted for POST, PUT and PATCH request bodies.
	 *
	 * The default is 1 MiB. The limit is enforced for both `Content-Length`
	 * requests and streamed or chunked request bodies before PURISTA parses them.
	 */
	maxRequestBodyBytes: z.number().int().positive().optional().default(DEFAULT_MAX_REQUEST_BODY_BYTES),
	apiMountPath: z.string().optional().default(DEFAULT_API_MOUNT_PATH),
	enableHealth: z.boolean().optional().default(false),
	healthPath: z.string().optional().default('/healthz'),
	autoRegisterServicesFromConfig: z.boolean().optional().default(false),
	// Keep `any`: app-specific health/protection hooks are intentionally framework-agnostic.
	healthFunction: z.any().optional(),
	protectHandler: z.any().optional(),
	services: z
		.array(z.custom<Service<any>>(value => value instanceof Service, 'Expected a PURISTA service instance'))
		.optional()
		.default([]),
	traceHeaderField: z.string().default('x-trace-id'),
	problemDetails: ProblemDetailsObjectSchema.optional(),
	openApi: z
		.object({
			openapi: z.string().default('3.1.0'),
			enabled: z.boolean().optional().default(true),
			info: InfoObjectSchema,
			servers: z.array(ServerObjectSchema).optional(),
			// Keep `any`: OpenAPI object fragments are merged from dynamic command metadata.
			components: z.any().optional(),
			security: z.array(z.any()).optional(),
			externalDocs: ExternalDocumentationObjectSchema.optional(),
			tags: z.array(TagObjectSchema).optional(),
			paths: z.record(z.string(), z.record(z.string(), z.any())).optional(),
		})
		.optional(),
})

/**
 * Partial Hono service config accepted by `honoV1Service.getInstance`.
 *
 * Missing values are filled by the built-in Hono service configuration schema.
 */
export type HonoServiceV1ConfigPartial = z.input<typeof honoServiceV1ConfigSchema>

/**
 * Fully parsed Hono service config with defaults applied.
 */
export type HonoServiceV1Config = z.output<typeof honoServiceV1ConfigSchema>
