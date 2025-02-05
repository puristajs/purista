import { posix } from 'node:path'

import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastifyStatic from '@fastify/static'
import { SpanKind, SpanStatusCode, context, propagation } from '@opentelemetry/api'
import * as api from '@opentelemetry/api'
import { ATTR_SERVER_ADDRESS } from '@opentelemetry/semantic-conventions/incubating'

import {
	ATTR_HTTP_REQUEST_METHOD,
	ATTR_HTTP_RESPONSE_STATUS_CODE,
	ATTR_URL_FULL,
} from '@opentelemetry/semantic-conventions'

import type {
	Command,
	EmptyObject,
	HttpExposedServiceMeta,
	ServiceClassTypes,
	ServiceConstructorInput,
} from '@purista/core'
import { HandledError, Service, StatusCode, UnhandledError, safeBind } from '@purista/core'
import type { FastifyInstance, HTTPMethods } from 'fastify'
import fastify from 'fastify'
import * as swaggerUi from 'swagger-ui-dist'
import type { Methods } from 'trouter'
import { Trouter } from 'trouter'

import type { HttpServerServiceV1ConfigRaw } from './httpServerServiceConfig.js'
import { OPEN_API_ROUTE_FUNCTIONS } from './routes/index.js'
import { addSpanTags } from './subscription/serviceCommandsToRestApi/helper/addSpanTags.js'
import { addHeaders } from './subscription/serviceCommandsToRestApi/helper/index.js'
import type { BeforeResponseHook } from './types/index.js'

/**
 * A simple http server based on fastify.
 *
 */
export class HttpServerClass<ConfigType extends HttpServerServiceV1ConfigRaw> extends Service<
	ServiceClassTypes<ConfigType>
> {
	server?: FastifyInstance

	routeDefinitions: HttpExposedServiceMeta<Record<string, unknown>>[] = []

	routes = new Trouter()

	beforeResponse = new Trouter<BeforeResponseHook>()

	constructor(config: ServiceConstructorInput<ServiceClassTypes<ConfigType, EmptyObject>>) {
		super(config)

		this.server = fastify({
			...this.config.fastify,
		}) as unknown as FastifyInstance

		this.server
			.decorateRequest('principalId', undefined)
			.decorateRequest('tenantId', undefined)
			.setNotFoundHandler(async (request, reply) => {
				const parentContext = propagation.extract(context.active(), request.headers)
				await new Promise(resolve => api.context.with(parentContext, async () => resolve(undefined)))

				await this.startActiveSpan('notFoundHandler', { kind: SpanKind.SERVER }, api.context.active(), async span => {
					addSpanTags(span, request)
					span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, StatusCode.NotFound)
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: 'notFoundHandler',
					})

					addHeaders(span, reply)
					const err = new HandledError(StatusCode.NotFound, 'Route not found', {
						method: request.method,
						route: request.url,
					})

					this.logger.error({ err, ...span.spanContext() }, 'Not found handler')

					if (reply.sent) {
						reply.status(StatusCode.NotFound)
						reply.send(err.getErrorResponse())
					}
				})
			})
			.setErrorHandler(async (err, request, reply) => {
				const con = propagation.extract(context.active(), request.headers)
				await this.startActiveSpan('errorHandler', { kind: SpanKind.SERVER }, con, async span => {
					addSpanTags(span, request)
					span.recordException(err)
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: err.message,
					})

					addHeaders(span, reply)

					propagation.inject(context.active(), reply.headers)

					if (err instanceof HandledError) {
						reply.status(err.errorCode)

						span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, err.errorCode)
						return reply.send(err.getErrorResponse())
					}
					this.logger.error({ err, ...span.spanContext() }, 'General error handler')

					span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, StatusCode.InternalServerError)
					if (!reply.sent) {
						reply.status(StatusCode.InternalServerError)
						reply.send(new UnhandledError().getErrorResponse())
					}
				})
			})

		this.server.addHook('onError', async (request, reply, err) => {
			const parentContext = propagation.extract(context.active(), request.headers)
			await new Promise(resolve => api.context.with(parentContext, async () => resolve(undefined)))

			await this.startActiveSpan('errorHook', { kind: SpanKind.SERVER }, api.context.active(), async span => {
				span.setAttribute(ATTR_URL_FULL, request.url)
				span.setAttribute(ATTR_HTTP_REQUEST_METHOD, request.method)
				span.setAttribute(ATTR_SERVER_ADDRESS, request.hostname)

				span.recordException(err)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})

				this.logger.error({ err, ...span.spanContext() }, 'onError hook: General error handler')
			})

			if (!reply.sent) {
				reply.status(StatusCode.InternalServerError)
				reply.send(new UnhandledError().getErrorResponse())
			}
		})
	}

	addBeforeResponse(method: HTTPMethods, pattern: string, handler: BeforeResponseHook) {
		this.beforeResponse.add(method.toUpperCase() as Methods, pattern, handler)
	}

	async start(): Promise<void> {
		if (this.config.enableCompress) {
			await this.server?.register(import('@fastify/compress'), this.config.compressOptions)
		}

		if (this.config.enableCors) {
			await this.server?.register(cors, this.config.corsOptions)
		}

		if (this.config.enableHelmet) {
			await this.server?.register(helmet, this.config.helmetOptions ?? {})
		}

		if (this.config.enableHealthz) {
			if (this.config.healthzFunction) {
				this.server?.get('/healthz', this.config.healthzFunction)
			} else {
				this.server?.get('/healthz', async (_request, reply) => {
					const isEventBridgeReady = await this.eventBridge.isHealthy()

					reply.header('content-type', 'application/json; charset=utf-8')
					if (isEventBridgeReady) {
						reply.status(StatusCode.OK)
						reply.send(new HandledError(StatusCode.OK).getErrorResponse())
						return
					}
					reply.status(StatusCode.InternalServerError)
					reply.send(new HandledError(StatusCode.InternalServerError).getErrorResponse())
				})
			}
		}

		const apiBasePath = posix.join(this.config.apiMountPath ?? 'api', '/v*')

		this.server?.all(apiBasePath, async (request, reply) => {
			const parentContext = propagation.extract(context.active(), request.headers)
			await new Promise(resolve => api.context.with(parentContext, async () => resolve(undefined)))

			await this.startActiveSpan(request.url, { kind: SpanKind.SERVER }, api.context.active(), async span => {
				addSpanTags(span, request)

				addHeaders(span, reply)

				const match = (request.params as Record<string, string>)['*']
				const path = posix.join(this.config.apiMountPath ?? 'api', `v${match}`)

				const route = this.routes.find(request.method as Methods, path)
				const firstHandler = route.handlers[0]
				if (!firstHandler) {
					this.logger.debug({ method: request.method, url: request.url }, 'Route not found')
					const err = new HandledError(StatusCode.NotFound)
					span.recordException(err)
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: err.message,
					})
					span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, StatusCode.NotFound)
					reply.code(StatusCode.NotFound)
					return err.getErrorResponse()
				}

				await firstHandler(request, reply, route.params)
			})
		})

		if (this.config.openApi?.enabled) {
			const apiUrl = this.config.openApi?.path ? this.config.openApi.path : this.config.apiMountPath
			if (!apiUrl) {
				throw new Error('Configuration error! When openApi is enabled you need to set openApi.path or apiMountPath')
			}
			const prefix = posix.join(apiUrl, '/assets')

			await this.server?.register(fastifyStatic, {
				root: swaggerUi.absolutePath(),
				prefix,
				decorateReply: false, // the reply decorator has been added by the first plugin registration
			})

			for (const route of OPEN_API_ROUTE_FUNCTIONS) {
				const def = safeBind(route, this)()
				this.server?.route(def)
				this.logger.debug(`add route ${def.method} ${def.url}`)
			}
		}

		await super.start()
		this.server?.listen({
			port: this.config.port,
			host: this.config.host,
		})
		this.logger.info(
			{ domain: this.config.domain, port: this.config.port },
			`http server listen on ${this.config.domain} ${this.config.port}`,
		)
	}

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

	async destroy() {
		await this.server?.close()
		await super.destroy()
	}
}
