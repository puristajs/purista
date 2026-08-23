import type { HttpExposedServiceMeta } from '@purista/core/adapter'
import { StatusCode } from '@purista/core/adapter'
import type { OpenApiBuilder, OperationObject, ParameterObject, ResponsesObject } from 'openapi3-ts/oas31'

import { getErrorName } from './getErrorName.js'
import { getErrorResponseSchema } from './getErrorResponseSchema.js'
import { getParameterDefinition } from './getParameterDefinition.js'
import { getQueryDefinition } from './getQueryDefinition.js'
import { resolveHttpStreamingMode } from './streamTransport.js'

/**
 * OpenAPI generation settings needed by HTTP helper functions.
 */
export type Config = {
	/** Header name used to propagate an application trace id. */
	traceHeaderField?: string
	/** Problem details configuration used for generated error schemas. */
	problemDetails?: {
		typeBaseUri?: string
	}
}

/**
 * PURISTA owner metadata attached to generated OpenAPI operations.
 */
export type PuristaOpenApiOperationOwner = {
	/** Owning service name. */
	serviceName: string
	/** Owning service version. */
	serviceVersion: string
	/** Command or stream name exposed by the operation. */
	serviceTarget: string
}

/**
 * Adds one HTTP-exposed PURISTA command or stream operation to an OpenAPI document.
 *
 * The generated operation documents synchronous commands, async queue-backed
 * command responses, streamed SSE responses and aggregate stream responses
 * according to the command/stream HTTP metadata.
 */
export const addPathToOpenApi = (
	openApiBuilder: OpenApiBuilder,
	metadata: HttpExposedServiceMeta,
	path: string,
	config: Config,
	owner?: PuristaOpenApiOperationOwner,
) => {
	const expose = metadata.expose

	const method = expose.http.method.toLowerCase() as 'put' | 'post' | 'patch' | 'get' | 'delete'
	const httpMode = expose.http.mode ?? 'sync'

	const requestContentType = expose.contentTypeRequest ?? 'application/json'
	const _requestEncodingType = expose.contentEncodingRequest ?? 'utf-8'

	const responseContentType = expose.contentTypeResponse ?? 'application/json'
	const responseEncodingType = expose.contentEncodingResponse ?? 'utf-8'
	const exposeWithSchemas = expose as typeof expose & {
		outputPayload?: unknown
		chunkPayload?: unknown
		finalPayload?: unknown
	}

	const traceIdParameter: ParameterObject = {
		in: 'header',
		required: false,
		name: config.traceHeaderField ?? 'x-trace-id',
		schema: { type: 'string' },
		example: '022bcd32-0a7c-4635-90ce-7940d0b9793f',
		description: 'TraceID which can be used by business logic',
	}

	const traceParent: ParameterObject = {
		in: 'header',
		required: false,
		name: 'traceparent',
		schema: { type: 'string' },
		description: 'see: https://www.w3.org/TR/trace-context/#traceparent-header-field-values',
	}

	const securitySchema = Object.keys(openApiBuilder.rootDoc.components?.securitySchemes ?? {}).map(name => ({
		[name]: [],
	}))

	const streamMode = resolveHttpStreamingMode({
		explicitMode: expose.http.stream?.mode,
		isDeclaredStreamDefinition: 'chunkPayload' in exposeWithSchemas || 'finalPayload' in exposeWithSchemas,
		responseContentType,
	})
	const isStreamResponse = expose.contentTypeResponse === 'text/event-stream' && streamMode === 'stream'
	const isAggregateStream = streamMode === 'aggregate'
	const streamProtocol = expose.http.stream?.protocol
	const streamProtocolDoc = expose.http.stream?.documentationUrl
	const okCode =
		httpMode === 'async'
			? StatusCode.Accepted
			: isStreamResponse || isAggregateStream
				? StatusCode.OK
				: (exposeWithSchemas.outputPayload as { type?: unknown } | undefined)?.type
					? StatusCode.OK
					: StatusCode.NoContent

	const errorCodes: Set<StatusCode> = new Set(
		(expose.http.openApi?.additionalStatusCodes ?? []).filter(code => code !== StatusCode.Accepted),
	)

	if (expose.http.openApi?.isSecure) {
		errorCodes.add(StatusCode.Unauthorized)
	}

	if (expose.inputPayload?.type) {
		errorCodes.add(StatusCode.BadRequest)
	}

	if (method !== 'get' && method !== 'delete') {
		errorCodes.add(StatusCode.PayloadTooLarge)
	}

	const errArray = Array.from(errorCodes).sort((a, b) => a - b)

	for (const code of errArray) {
		openApiBuilder.addSchema(
			`error_${code}_schema`,
			getErrorResponseSchema(code, getErrorName(code), undefined, config.problemDetails),
		)
	}

	const errResponses = errArray.reduce((prev, code) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: small map construction
			...prev,
			[`${code}`]: {
				description: getErrorName(code),
				content: {
					'application/problem+json': {
						schema: {
							$ref: `#/components/schemas/error_${code}_schema`,
						},
					},
					'text/markdown': {
						schema: {
							type: 'string',
						},
					},
				},
			},
		}
	}, {} as ResponsesObject)

	const operation: OperationObject = {
		tags: expose.http.openApi?.tags,
		summary: expose.http.openApi?.summary,
		description: expose.http.openApi?.description,
		deprecated: expose.deprecated,
		operationId: expose.http.openApi?.operationId,
		security: securitySchema.length > 0 && expose.http.openApi?.isSecure ? securitySchema : [],
		...getPuristaOperationExtensions({
			metadata,
			owner,
			hasSecurityScheme: securitySchema.length > 0,
			isStream: isStreamResponse,
			isAggregateStream,
		}),
		parameters: [
			...getParameterDefinition(path, expose.parameter),
			...getQueryDefinition(expose.http.openApi?.query, expose.parameter),
			traceIdParameter,
			traceParent,
		],
		requestBody:
			method === 'get' || method === 'delete'
				? undefined
				: {
						content: {
							[requestContentType]: {
								schema: expose.inputPayload,
							},
						},
					},
		responses: {
			[`${okCode}`]: {
				description: isStreamResponse
					? [
							getErrorName(okCode),
							streamProtocol ? `SSE protocol: ${streamProtocol}.` : undefined,
							streamProtocolDoc ? `Protocol docs: ${streamProtocolDoc}` : undefined,
						]
							.filter(Boolean)
							.join(' ')
					: getErrorName(okCode),
				content:
					okCode === StatusCode.NoContent
						? undefined
						: {
								[responseContentType]: {
									schema:
										httpMode === 'async'
											? acceptedJobResponseSchema
											: isStreamResponse
												? {
														oneOf: [
															{
																type: 'object',
																properties: {
																	frameType: {
																		type: 'string',
																		enum: ['start', 'chunk', 'complete', 'error', 'cancel'],
																	},
																	sequence: {
																		type: 'integer',
																	},
																	chunk: exposeWithSchemas.chunkPayload,
																	final: exposeWithSchemas.finalPayload,
																	error: {
																		type: 'object',
																		properties: {
																			status: { type: 'integer' },
																			message: { type: 'string' },
																			isHandledError: { type: 'boolean' },
																			traceId: { type: 'string' },
																		},
																	},
																	reason: { type: 'string' },
																},
															},
															{
																type: 'object',
																properties: {
																	event: { type: 'string' },
																	data: {},
																},
																required: ['event', 'data'],
															},
														],
													}
												: isAggregateStream
													? (exposeWithSchemas.finalPayload ?? {
															type: 'object',
															additionalProperties: true,
														})
													: exposeWithSchemas.outputPayload,
									encoding: responseEncodingType,
									...(isStreamResponse && streamProtocol
										? ({ 'x-purista-stream-protocol': streamProtocol } as Record<string, unknown>)
										: {}),
									...(isStreamResponse && streamProtocolDoc
										? ({ 'x-purista-stream-protocol-docs': streamProtocolDoc } as Record<string, unknown>)
										: {}),
								},
							},
			},
			...errResponses,
		},
	}

	const pathConverted = path
		.split('/')
		.map(part => (part.startsWith(':') ? `{${part.replace(':', '').replace('?', '')}}` : part))
		.join('/')

	openApiBuilder.addPath(pathConverted, {
		[method]: operation,
	})
}

const acceptedJobResponseSchema = {
	type: 'object',
	properties: {
		jobId: { type: 'string', description: 'Queue job identifier for retry and ownership.' },
		runId: { type: 'string', description: 'Agent run identifier when the endpoint enqueues an agent job.' },
		status: { type: 'string', enum: ['queued'] },
		queue: { type: 'string', deprecated: true },
		queueName: { type: 'string' },
		scheduledAt: { type: 'number' },
		statusUrl: { type: 'string' },
		streamUrl: { type: 'string' },
	},
	required: ['jobId', 'status', 'queueName'],
	additionalProperties: true,
} as const

function getPuristaOperationExtensions(input: {
	metadata: HttpExposedServiceMeta
	owner?: PuristaOpenApiOperationOwner
	hasSecurityScheme: boolean
	isStream: boolean
	isAggregateStream: boolean
}): Record<string, unknown> {
	const expose = input.metadata.expose
	const isSecure = expose.http.openApi?.isSecure ?? true
	const runtimeMode =
		expose.http.mode === 'async'
			? 'async-job'
			: input.isStream
				? 'stream'
				: input.isAggregateStream
					? 'stream-aggregate'
					: 'sync'
	const endpointSecurity = !isSecure
		? 'public'
		: input.hasSecurityScheme
			? 'protected-with-security-scheme'
			: 'protected-application-middleware'
	const targetKey = input.isStream || input.isAggregateStream ? 'x-purista-stream-name' : 'x-purista-command-name'

	return {
		...(input.owner
			? {
					'x-purista-service-name': input.owner.serviceName,
					'x-purista-service-version': input.owner.serviceVersion,
					[targetKey]: input.owner.serviceTarget,
				}
			: {}),
		'x-purista-endpoint-security': endpointSecurity,
		'x-purista-tenant-aware': true,
		'x-purista-principal-aware': true,
		'x-purista-event-bridge': true,
		...(expose.http.mode === 'async' ? { 'x-purista-queue-bridge': true } : {}),
		'x-purista-runtime-mode': runtimeMode,
	}
}
