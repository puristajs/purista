import { posix } from 'node:path'

import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import {
	ATTR_HTTP_REQUEST_METHOD,
	ATTR_HTTP_RESPONSE_STATUS_CODE,
	ATTR_HTTP_ROUTE,
} from '@opentelemetry/semantic-conventions'
import type {
	Command,
	CommandDefinitionMetadataBase,
	EBMessageAddress,
	EmptyObject,
	HttpExposedServiceMeta,
	QueueEnqueueResult,
	ServiceClassTypes,
	ServiceConstructorInput,
	StreamHandle,
} from '@purista/core'
import { HandledError, isHttpExposedServiceMeta, Service, StatusCode, safeBind, UnhandledError } from '@purista/core'
import type { Handler } from 'hono'
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { HTTPException } from 'hono/http-exception'
import { PatternRouter } from 'hono/router/pattern-router'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { OpenApiBuilder } from 'openapi3-ts/oas31'

import { addPathToOpenApi } from '../../../helper/addPathToOpenApi.js'
import { createHttpLogFields } from '../../../helper/logging.js'
import {
	negotiateProblemRepresentation,
	renderProblemDetailsMarkdown,
	toProblemDetails,
} from '../../../helper/problemDetails.js'
import {
	collectAggregateStreamResult,
	encodeProtocolSseEvent,
	isProtocolSseEvent,
	isTransportControlFrame,
	resolveHttpStreamingMode,
	type StreamTransportFramePayload,
} from '../../../helper/streamTransport.js'
import type { BindingsBase } from '../../../types/BindingsBase.js'
import type { EndpointProtectMiddleware } from '../../../types/EndpointProtectMiddleware.js'

const assertAsyncHttpResult = (result: unknown): QueueEnqueueResult => {
	if (!result || typeof result !== 'object') {
		throw new UnhandledError(StatusCode.InternalServerError, 'Async endpoint must return queue enqueue result')
	}
	const candidate = result as Partial<QueueEnqueueResult>
	if (typeof candidate.jobId !== 'string' || typeof candidate.queueName !== 'string') {
		throw new UnhandledError(StatusCode.InternalServerError, 'Async endpoint must return queue enqueue result')
	}
	return {
		jobId: candidate.jobId,
		queueName: candidate.queueName,
		scheduledAt: candidate.scheduledAt,
		...(typeof (candidate as { runId?: unknown }).runId === 'string'
			? { runId: (candidate as { runId: string }).runId }
			: {}),
	}
}

/** Service instance accepted by the Hono HTTP projection registry. */
export type AnyService = Service<any>

import type { HealthFunction } from '../../../types/HealthFunction.js'
import type { VariablesBase } from '../../../types/VariablesBase.js'
import type { HonoServiceV1Config } from './honoServiceConfig.js'

/**
 * PURISTA service that exposes command, stream and async queue-backed endpoints through Hono.
 *
 * Register services before `start()` to project their HTTP metadata into Hono
 * routes and OpenAPI paths. Synchronous endpoints invoke commands directly,
 * stream endpoints open PURISTA stream definitions, and async endpoints return
 * `202 Accepted` with queue job information from the owning command.
 *
 * The web server listener is started by the application after this service has
 * started.
 *
 * Minimal example:
 *
 * @example
 * ```typescript
 * import { serve } from '@hono/node-server'
 * import { DefaultEventBridge } from '@purista/core'
 * import { honoV1Service } from '@purista/hono-http-server'
 *
 * // create and init our eventbridge
 * const eventBridge = new DefaultEventBridge()
 * await eventBridge.start()
 *
 * // add your service
 * const pingService = await pingV1Service.getInstance(eventBridge)
 * await pingService.start()
 *
 * const honoService = await honoV1Service.getInstance(eventBridge, {
 *   serviceConfig: {
 *     enableDynamicRoutes: false,
 *   }
 * })
 * honoService.registerService(pingService)
 * await honoService.start()
 *
 * const _serverInstance = serve({
 *   fetch: honoService.app.fetch,
 *   port: 3000,
 * })
 *
 * ```
 */
export class HonoServiceClass<
	Bindings extends BindingsBase = BindingsBase,
	Variables extends VariablesBase = VariablesBase,
> extends Service<ServiceClassTypes<HonoServiceV1Config>> {
	/**
	 * Hono application hosting health, OpenAPI and generated endpoint routes.
	 */
	public app

	/**
	 * OpenAPI builder populated as command and stream endpoints are registered.
	 */
	public openApi: OpenApiBuilder

	private knownServices: Set<string> = new Set()
	private knownEndpoints: Map<string, string> = new Map()

	private isAvailable = false

	/** Creates the Hono service runtime and configures routing, health, and protection defaults. */
	constructor(config: ServiceConstructorInput<ServiceClassTypes<HonoServiceV1Config, EmptyObject>>) {
		super(config)
		this.openApi = new OpenApiBuilder(this.config.openApi)

		this.config.healthFunction = this.config.healthFunction ?? async function () {}
		this.config.protectHandler =
			this.config.protectHandler ??
			async function (c: Parameters<Handler>[0], n: Parameters<Handler>[1]) {
				void c
				return n()
			}

		if (this.config.enableDynamicRoutes) {
			this.app = new Hono<{ Bindings: Bindings; Variables: Variables }>({ router: new PatternRouter() })
		} else {
			this.app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
			this.subscriptionDefinitionList = []
		}
	}

	/**
	 * Narrows Hono `Bindings` and `Variables` types for middleware and handlers.
	 *
	 * @returns The same service instance with updated generic types.
	 */
	setHonoTypes<
		E extends { Bindings?: Record<string, unknown>; Variables?: Record<string, unknown> } = {
			Bindings: EmptyObject
			Variables: EmptyObject
		},
	>() {
		return this as unknown as HonoServiceClass<Bindings & E['Bindings'], Variables & E['Variables']>
	}

	/**
	 * Sets the callback used by the configured health endpoint.
	 *
	 * Throw from this callback when the process should fail health checks.
	 *
	 * @param fn - Health callback bound to this service instance.
	 */
	setHealthFunction(fn: HealthFunction<typeof this>) {
		this.config.healthFunction = fn
		return this
	}

	/**
	 * Sets middleware for endpoints marked as protected in HTTP metadata.
	 *
	 * The middleware can also enrich `additionalParameter`, `principalId` and
	 * `tenantId` Hono variables before the generated command or stream handler
	 * calls PURISTA.
	 *
	 * @example
	 * ```typescript
	 * honoService.setProtectMiddleware(async function (c, next) {
	 *   c.set('principalId', 'user-123')
	 *   c.set('tenantId', 'tenant-a')
	 *   return next()
	 * })
	 * ```
	 *
	 * @param fn - Hono middleware for protected endpoints.
	 */
	setProtectMiddleware(fn: EndpointProtectMiddleware<typeof this, Bindings, Variables>) {
		this.config.protectHandler = fn
		return this
	}

	private sendProblemResponse(
		c: Parameters<Handler>[0],
		error: unknown,
		statusCode?: StatusCode | ContentfulStatusCode,
	) {
		const problem = toProblemDetails(error, {
			statusCode,
			traceId: c.get('traceId') ?? c.req.header(this.config.traceHeaderField),
			instance: c.req.path,
			problemTypeConfig: this.config.problemDetails,
		})
		const representation = negotiateProblemRepresentation(c.req.header('accept'))
		c.header('vary', 'accept')
		if (representation === 'markdown') {
			c.header('content-type', 'text/markdown; charset=utf-8')
			return c.body(renderProblemDetailsMarkdown(problem), problem.status as ContentfulStatusCode)
		}
		c.header('content-type', 'application/problem+json; charset=utf-8')
		return c.body(JSON.stringify(problem), problem.status as ContentfulStatusCode)
	}

	/**
	 * Starts the service and registers health, OpenAPI and error handling routes.
	 *
	 * If configured, services from `services` are registered automatically before
	 * the service becomes available.
	 */
	async start() {
		if (this.config.enableHealth) {
			this.openApi.addPath(this.config.healthPath, {
				get: {
					summary: 'server health check',
					description: 'Returns a 200 response as long as the configured health function does not throw',
					responses: {
						'200': {
							'application/json': {},
						},
					},
				},
			})

			this.app.get(this.config.healthPath, async c => {
				const con = propagation.extract(context.active(), c.req.raw.headers)
				return await this.startActiveSpan('healthHandler', { kind: SpanKind.SERVER }, con, async span => {
					span.setAttribute(ATTR_HTTP_ROUTE, this.config.healthPath)
					span.setAttribute(ATTR_HTTP_REQUEST_METHOD, 'GET')

					const traceId = c.req.header(this.config.traceHeaderField)
					if (traceId) {
						c.header(this.config.traceHeaderField, traceId)
					}

					if (!this.isAvailable) {
						const err = new HandledError(StatusCode.ServiceUnavailable, 'server not available')
						span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, err.errorCode)
						return this.sendProblemResponse(c, err, StatusCode.ServiceUnavailable)
					}

					try {
						await this.config.healthFunction.call(this)
						span.setStatus({
							code: SpanStatusCode.OK,
							message: 'OK',
						})
						const okErr = new HandledError(StatusCode.OK)
						span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, okErr.errorCode)
						return c.json(okErr.getErrorResponse(), okErr.errorCode as ContentfulStatusCode)
					} catch (err) {
						span.recordException(err as Error)
						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: (err as Error).message,
						})
						span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, StatusCode.InternalServerError)
						return this.sendProblemResponse(c, HandledError.fromError(err), StatusCode.InternalServerError)
					}
				})
			})
		}

		this.app.use('*', async (c, next) => {
			if (!this.isAvailable) {
				throw new HandledError(StatusCode.ServiceUnavailable, 'server not available')
			}

			const traceId = c.req.header(this.config.traceHeaderField)
			c.set('traceId', traceId)
			await next()
			if (traceId) {
				c.header(this.config.traceHeaderField, traceId)
			}
		})

		if (this.config.openApi?.enabled) {
			this.app.get(posix.join(this.config.apiMountPath, 'openapi.json'), async c => c.json(this.openApi.getSpec()))

			this.app.get(posix.join(this.config.apiMountPath, 'openapi.yaml'), async c =>
				c.text(this.openApi.getSpecAsYaml()),
			)
		}

		this.app.notFound(async c => {
			const con = propagation.extract(context.active(), c.req.raw.headers)

			return await this.startActiveSpan('notFoundHandler', { kind: SpanKind.SERVER }, con, async span => {
				span.setAttribute(ATTR_HTTP_ROUTE, c.req.path)
				span.setAttribute(ATTR_HTTP_REQUEST_METHOD, c.req.method.toUpperCase())
				span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, StatusCode.NotFound)

				const err = new HandledError(StatusCode.NotFound, 'Route not found', {
					method: c.req.method,
					route: c.req.url,
				})
				span.recordException(err as Error)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: (err as Error).message,
				})

				this.logger.debug(createHttpLogFields({ path: c.req.path }, span.spanContext(), c.get('traceId')), 'not found')
				return this.sendProblemResponse(c, err, StatusCode.NotFound)
			})
		})

		this.app.onError(async (err, c) => {
			const con = propagation.extract(context.active(), c.req.raw.headers)

			return await this.startActiveSpan('errorHandler', { kind: SpanKind.SERVER }, con, async span => {
				span.setAttribute(ATTR_HTTP_ROUTE, c.req.path)
				span.setAttribute(ATTR_HTTP_REQUEST_METHOD, c.req.method.toUpperCase())
				span.recordException(err)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})

				if (err instanceof HandledError) {
					span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, err.errorCode)
					return this.sendProblemResponse(c, err, err.errorCode as ContentfulStatusCode)
				}

				this.logger.error(createHttpLogFields({ err }, span.spanContext(), c.get('traceId')), 'General error handler')

				if (err instanceof HTTPException) {
					span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, err.status)
					return this.sendProblemResponse(c, HandledError.fromError(err, err.status as StatusCode), err.status)
				}

				span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, StatusCode.InternalServerError)
				return this.sendProblemResponse(c, new UnhandledError(), StatusCode.InternalServerError)
			})
		})

		if (this.config.autoRegisterServicesFromConfig) {
			this.registerService(...this.config.services)
		}

		await this.setServiceAvailable()

		return super.start()
	}

	/**
	 * Registers service instances and adds their HTTP-exposed commands and streams.
	 *
	 * Must be called before `start()`. Commands and streams are distinct PURISTA
	 * primitives; this method maps both to HTTP only when their definition
	 * metadata declares HTTP exposure.
	 *
	 * @param services - PURISTA service instances to expose.
	 */
	registerService(...services: AnyService[]) {
		if (this.isStarted) {
			throw new UnhandledError(
				StatusCode.BadRequest,
				'registerService must be called before start (or use addEndpoint for explicit runtime registration)',
			)
		}

		for (const service of services) {
			for (const command of service.commandDefinitionList) {
				this.addEndpoint(command.metadata, { ...service.serviceInfo, serviceTarget: command.commandName })
			}
			for (const stream of service.streamDefinitionList) {
				this.addEndpoint(stream.metadata as unknown as CommandDefinitionMetadataBase, {
					...service.serviceInfo,
					serviceTarget: stream.streamName,
				})
			}
		}

		return this
	}

	/**
	 * Adds a single command or stream endpoint to the Hono router.
	 *
	 * Synchronous command endpoints return command payloads, async command
	 * endpoints return queue job metadata, and stream endpoints either aggregate
	 * the final payload or deliver Server-Sent Events based on metadata.
	 *
	 * @param metadata - Command or stream metadata produced by a builder.
	 * @param service - Address of the service hosting the command or stream.
	 */
	public addEndpoint(metadata: CommandDefinitionMetadataBase, service: EBMessageAddress) {
		if (!isHttpExposedServiceMeta(metadata)) {
			return
		}

		if (this.knownServices.has(`${service.serviceName}-${service.serviceVersion}-${service.serviceTarget}`)) {
			return
		}
		const serviceRegistrationKey = `${service.serviceName}-${service.serviceVersion}-${service.serviceTarget}`

		const httpMetadata = metadata as HttpExposedServiceMeta
		const expose = httpMetadata.expose
		const httpMode = (expose.http as { mode?: 'sync' | 'async' }).mode ?? 'sync'

		const method = expose.http.method.toLowerCase() as 'put' | 'post' | 'patch' | 'get' | 'delete'
		const path = posix.join(this.config.apiMountPath, `v${service.serviceVersion}`, expose.http.path)
		const endpointKey = `${method}:${path}`

		const requestContentType = expose.contentTypeRequest ?? 'application/json'
		const requestEncodingType = expose.contentEncodingRequest ?? 'utf-8'

		const responseContentType = expose.contentTypeResponse ?? 'application/json'
		const responseEncodingType = expose.contentEncodingResponse ?? 'utf-8'
		const exposeAsStream = expose as typeof expose & {
			chunkPayload?: unknown
			finalPayload?: unknown
		}
		const isDeclaredStreamDefinition = 'chunkPayload' in exposeAsStream || 'finalPayload' in exposeAsStream
		const streamMode = resolveHttpStreamingMode({
			explicitMode: expose.http.stream?.mode,
			isDeclaredStreamDefinition,
			responseContentType,
		})

		addPathToOpenApi(this.openApi, metadata as unknown as HttpExposedServiceMeta, path, this.config, service)

		const isStreamEndpoint = isDeclaredStreamDefinition || responseContentType.toLowerCase() === 'text/event-stream'

		const endpointOwner = this.knownEndpoints.get(endpointKey)
		if (endpointOwner && endpointOwner !== serviceRegistrationKey) {
			throw new UnhandledError(
				StatusCode.Conflict,
				`HTTP endpoint already registered for ${endpointKey}. Configure a unique http path/method combination.`,
			)
		}

		const handler: Handler = async c => {
			const parentContext = propagation.extract(context.active(), c.req.raw.headers)

			return this.startActiveSpan('handler', { kind: SpanKind.SERVER }, parentContext, async span => {
				try {
					span.setAttribute(ATTR_HTTP_ROUTE, path)
					span.setAttribute(ATTR_HTTP_REQUEST_METHOD, method.toUpperCase())

					let payload: unknown

					const parameter = {
						...c.req.query(),
						...c.req.param(),
						...c.get('additionalParameter'),
					}

					if (method !== 'get' && method !== 'delete') {
						const contentType = c.req.header('content-type')?.toLowerCase()

						if (!contentType?.includes(requestContentType)) {
							throw new HandledError(
								StatusCode.BadRequest,
								`Request must be content type ${requestContentType} ${requestEncodingType}`,
							)
						}

						try {
							if (contentType?.includes('application/json')) {
								payload = await c.req.json()
							} else if (
								contentType?.includes('multipart/form-data') ||
								contentType?.includes('application/x-www-form-urlencoded')
							) {
								payload = await c.req.parseBody()
							} else {
								payload = await c.req.text()
							}
						} catch (error) {
							const err = HandledError.fromError(error, StatusCode.BadRequest)
							this.logger.error({ err, contentType, path: c.req.path, method }, 'Failed to decode body')
							return this.sendProblemResponse(c, err, err.errorCode as ContentfulStatusCode)
						}
					}

					const traceId = c.get('traceId') || c.req.header(this.config.traceHeaderField)

					if (isStreamEndpoint) {
						const handle = await this.openStream(
							{
								traceId,
								receiver: service,
								payload: {
									payload,
									parameter,
								},
								principalId: c.get('principalId'),
								tenantId: c.get('tenantId'),
								contentType: expose.contentTypeRequest ?? 'application/json',
								contentEncoding: expose.contentEncodingRequest ?? 'utf-8',
							},
							`${method}:${path}`,
							this.config.streamRequestTimeoutMs,
						)

						if (streamMode === 'aggregate') {
							const aggregateResult = await collectAggregateStreamResult(handle)
							span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, aggregateResult.statusCode)
							if (aggregateResult.status === 'error') {
								span.setStatus({ code: SpanStatusCode.ERROR })
								return this.sendProblemResponse(
									c,
									aggregateResult.payload,
									aggregateResult.statusCode as ContentfulStatusCode,
								)
							}

							span.setStatus({ code: SpanStatusCode.OK })
							c.header('content-type', `${responseContentType}; charset=${responseEncodingType}`)
							return c.json(aggregateResult.payload, aggregateResult.statusCode)
						}

						const encoder = new TextEncoder()
						const stream = new ReadableStream<Uint8Array>({
							start: controller => {
								const run = async (activeHandle: StreamHandle) => {
									try {
										let protocolPassthrough = false
										for await (const frame of activeHandle) {
											const payload = frame.payload as StreamTransportFramePayload
											if (isTransportControlFrame(payload.frameType)) {
												continue
											}

											if (payload.frameType === 'chunk' && isProtocolSseEvent(payload.chunk)) {
												protocolPassthrough = true
												controller.enqueue(encodeProtocolSseEvent(encoder, payload.chunk))
												continue
											}

											if (protocolPassthrough) {
												if (payload.frameType === 'error') {
													controller.enqueue(
														encoder.encode(
															`event: error\ndata: ${JSON.stringify(payload.error ?? { message: 'stream error' })}\n\n`,
														),
													)
												}
												continue
											}

											controller.enqueue(
												encoder.encode(`event: ${frame.payload.frameType}\ndata: ${JSON.stringify(frame.payload)}\n\n`),
											)
										}
										controller.close()
									} catch (error) {
										controller.error(error)
									}
								}
								void run(handle)
							},
							cancel: async reason => {
								await handle.cancel(typeof reason === 'string' ? reason : 'client disconnected')
							},
						})

						return new Response(stream, {
							status: StatusCode.OK,
							headers: {
								'content-type': `${responseContentType}; charset=${responseEncodingType}`,
								'cache-control': 'no-cache, no-transform',
								connection: 'keep-alive',
							},
						})
					}

					const result = await this.invoke(
						{
							traceId,
							receiver: service,
							payload: {
								payload,
								parameter,
							},
							principalId: c.get('principalId'),
							tenantId: c.get('tenantId'),
							contentType: expose.contentTypeRequest ?? 'application/json',
							contentEncoding: expose.contentEncodingRequest ?? 'utf-8',
						},
						`${method}:${path}`,
					)

					c.header('content-type', `${responseContentType}; charset=${responseEncodingType}`)

					let statusCode: StatusCode = StatusCode.OK
					let responsePayload: unknown = result

					if (httpMode === 'async') {
						const job = assertAsyncHttpResult(result)
						const jobRunId = (job as unknown as { runId?: unknown }).runId
						responsePayload = {
							jobId: job.jobId,
							...(typeof jobRunId === 'string' ? { runId: jobRunId } : {}),
							status: 'queued',
							queue: job.queueName,
							queueName: job.queueName,
							scheduledAt: job.scheduledAt,
						}
						statusCode = StatusCode.Accepted
					} else if (result === undefined || result === null || result === '') {
						statusCode = StatusCode.NoContent
					}

					span.setStatus({
						code: SpanStatusCode.OK,
					})
					span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, statusCode)

					if (statusCode === StatusCode.NoContent) {
						return c.body(null, StatusCode.NoContent)
					}

					if (responseContentType.toLowerCase() !== 'application/json') {
						return c.text(String(responsePayload ?? ''), statusCode as ContentfulStatusCode)
					}

					return c.json(responsePayload, statusCode as ContentfulStatusCode)
				} catch (err) {
					span.recordException(err as Error)
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: (err as Error).message,
					})

					if (err instanceof HandledError) {
						this.logger.debug(createHttpLogFields({ err }, span.spanContext(), c.get('traceId')), err.message)

						span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, err.errorCode)
						return this.sendProblemResponse(c, err, err.errorCode as ContentfulStatusCode)
					}

					const unhandledError = new UnhandledError()
					unhandledError.errorCode = StatusCode.InternalServerError
					span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, unhandledError.errorCode)

					this.logger.error(createHttpLogFields({ err }, span.spanContext(), c.get('traceId')), 'unhandled error')
					return this.sendProblemResponse(c, unhandledError, unhandledError.errorCode)
				}
			})
		}

		if (method === 'get' || method === 'delete') {
			if (expose.http.openApi?.isSecure && this.config.protectHandler) {
				const protectHandler = safeBind(this.config.protectHandler, this)
				this.app[method](path, protectHandler, handler)
			} else {
				this.app[method](path, handler)
			}
		} else {
			const limitRequestBody = bodyLimit({
				maxSize: this.config.maxRequestBodyBytes,
				onError: c =>
					this.sendProblemResponse(
						c,
						new HandledError(StatusCode.PayloadTooLarge, 'Request body exceeds the configured size limit'),
						StatusCode.PayloadTooLarge,
					),
			})

			if (expose.http.openApi?.isSecure && this.config.protectHandler) {
				const protectHandler = safeBind(this.config.protectHandler, this)
				this.app[method](path, protectHandler, limitRequestBody, handler)
			} else {
				this.app[method](path, limitRequestBody, handler)
			}
		}
		this.knownServices.add(serviceRegistrationKey)
		this.knownEndpoints.set(endpointKey, serviceRegistrationKey)
	}

	/** Invokes a PURISTA command through the event bridge on behalf of an HTTP endpoint. */
	async invoke<T>(
		input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'sender'>,
		endpoint: string,
	): Promise<T> {
		return this.eventBridge.invoke<T>({
			sender: {
				serviceName: this.serviceInfo.serviceName,
				serviceVersion: this.serviceInfo.serviceVersion,
				serviceTarget: `$$endpoint:${endpoint}`,
				instanceId: this.eventBridge.instanceId,
			},
			...input,
		})
	}

	/** Opens a PURISTA stream through the event bridge on behalf of an HTTP endpoint. */
	async openStream(
		input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'sender'>,
		endpoint: string,
		timeoutMs = this.config.streamRequestTimeoutMs,
	) {
		if (!this.eventBridge.openStream) {
			throw new UnhandledError(StatusCode.NotImplemented, 'Event bridge does not support streams')
		}
		return this.eventBridge.openStream(
			{
				sender: {
					serviceName: this.serviceInfo.serviceName,
					serviceVersion: this.serviceInfo.serviceVersion,
					serviceTarget: `$$endpoint:${endpoint}`,
					instanceId: this.eventBridge.instanceId,
				},
				...input,
				payload: {
					frameType: 'open',
					payload: input.payload.payload,
					parameter: input.payload.parameter,
				},
			},
			timeoutMs,
		)
	}

	/**
	 * Set the service unavailable
	 * The webserver will return 503 Service Unavailable
	 */
	async setServiceUnavailable() {
		this.isAvailable = false
	}

	/**
	 * Set the service available
	 * Request will be processed.
	 */
	async setServiceAvailable() {
		this.isAvailable = true
	}

	/**
	 * Helper function to be used in gracefulShutdown.
	 * It prevents to handle new requests during shut down.
	 * Incoming requests are rejected with 503 Service Unavailable.
	 *
	 * @example
	 * ```typescript
	 * gracefulShutdown(logger, [
	 * honoService.prepareDestroy(),
	 * eventbridge,
	 * ...services,
	 * honoService
	 * ])
	 * ```
	 * @returns
	 */
	prepareDestroy() {
		return {
			name: `${this.serviceInfo.serviceName} ${this.serviceInfo.serviceVersion} prepare shutdown`,
			destroy: this.setServiceUnavailable.bind(this),
		}
	}

	async destroy() {
		await this.setServiceUnavailable()
		return super.destroy()
	}
}
