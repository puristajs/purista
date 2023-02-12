import compress from '@fastify/compress'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastifyStatic from '@fastify/static'
import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import * as api from '@opentelemetry/api'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import {
  EBMessageAddress,
  EventBridge,
  HandledError,
  HttpExposedServiceMeta,
  initLogger,
  Logger,
  PrincipalId,
  Service,
  StatusCode,
  TraceId,
  UnhandledError,
} from '@purista/core'
import fastify, { FastifyInstance, HTTPMethods } from 'fastify'
import { posix } from 'path'
import qs from 'qs'
import * as swaggerUi from 'swagger-ui-dist'
import Trouter, { Methods } from 'trouter'
import merge from 'ts-deepmerge'

import { COMMANDS } from './commands'
import { getDefaultConfig, ServiceInfo } from './config'
import { addHeaders } from './helper'
import { addSpanTags } from './helper/addSpanTags'
import { OPEN_API_ROUTE_FUNCTIONS } from './routes'
import { SUBSCRIPTIONS } from './subscriptions'
import { BeforeResponseHook, HttpServerConfig } from './types'

/**
 * A simple http server based on fastify.
 *
 */
export class HttpServerService extends Service<HttpServerConfig> {
  server?: FastifyInstance

  routeDefinitions: HttpExposedServiceMeta[] = []

  routes = new Trouter()

  beforeResponse = new Trouter<BeforeResponseHook>()

  /**
   * Create a new instance of the HttpServer class
   * @param {Logger} baseLogger - The logger that the server will use.
   * @param {EventBridge} eventBridge - EventBridge
   * @param {HttpServerConfig} conf - HttpServerConfig
   */
  constructor(
    eventBridge: EventBridge,
    config: HttpServerConfig = getDefaultConfig(),
    options?: {
      logger?: Logger
      spanProcessor?: SpanProcessor
    },
  ) {
    const logger = options?.logger || initLogger()
    super(logger, ServiceInfo, eventBridge, COMMANDS, SUBSCRIPTIONS, config, options?.spanProcessor)

    this.config = merge(getDefaultConfig(), config)

    this.server = fastify({
      querystringParser: (str) => qs.parse(str),
      ...this.config.fastify,
    })

    if (this.config.enableCors) {
      this.server.register(cors, this.config.corsOptions)
    }

    if (this.config.enableCompress) {
      this.server.register(compress, this.config.compressOptions)
    }

    this.server
      .decorateRequest('principalId', undefined)
      .setNotFoundHandler(async (request, reply) => {
        const parentContext = propagation.extract(context.active(), request.headers)
        await new Promise((resolve) => api.context.with(parentContext, async () => resolve(undefined)))

        await this.startActiveSpan('notFoundHandler', { kind: SpanKind.SERVER }, api.context.active(), async (span) => {
          addSpanTags(span, request)
          span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.NotFound)
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: 'notFoundHandler',
          })

          addHeaders(span, reply)
          const err = new HandledError(StatusCode.NotFound)

          this.serviceLogger.error({ err, ...span.spanContext() }, 'Not found handler')

          if (reply.sent) {
            reply.status(StatusCode.NotFound)
            reply.send(err.getErrorResponse())
          }
        })
      })
      .setErrorHandler(async (err, request, reply) => {
        const con = propagation.extract(context.active(), request.headers)
        await this.startActiveSpan('errorHandler', { kind: SpanKind.SERVER }, con, async (span) => {
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

            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, err.errorCode)
            return reply.send(err.getErrorResponse())
          }
          this.serviceLogger.error({ err, ...span.spanContext() }, 'General error handler')

          span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.InternalServerError)
          if (!reply.sent) {
            reply.status(StatusCode.InternalServerError)
            reply.send(new UnhandledError().getErrorResponse())
          }
        })
      })

    if (this.config.enableHelmet) {
      this.server.register(helmet, this.config.helmetOptions)
    }

    this.server.addHook('onError', async (request, reply, err) => {
      const parentContext = propagation.extract(context.active(), request.headers)
      await new Promise((resolve) => api.context.with(parentContext, async () => resolve(undefined)))

      await this.startActiveSpan('errorHook', { kind: SpanKind.SERVER }, api.context.active(), async (span) => {
        span.setAttribute(SemanticAttributes.HTTP_URL, request.url)
        span.setAttribute(SemanticAttributes.HTTP_METHOD, request.method)
        span.setAttribute(SemanticAttributes.HTTP_HOST, request.hostname)

        span.recordException(err)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        })

        this.serviceLogger.error({ err, ...span.spanContext() }, 'onError hook: General error handler')
      })

      if (!reply.sent) {
        reply.status(StatusCode.InternalServerError)
        reply.send(new UnhandledError().getErrorResponse())
      }
    })
  }

  addBeforeResponse(method: HTTPMethods, pattern: string, handler: BeforeResponseHook) {
    this.beforeResponse.add(method, pattern, handler)
  }

  async start(): Promise<void> {
    const apiBasePath = posix.join(this.config.apiMountPath || 'api', '/v*')

    this.server?.all(apiBasePath, async (request, reply) => {
      const parentContext = propagation.extract(context.active(), request.headers)
      await new Promise((resolve) => api.context.with(parentContext, async () => resolve(undefined)))

      await this.startActiveSpan(request.url, { kind: SpanKind.SERVER }, api.context.active(), async (span) => {
        addSpanTags(span, request)

        addHeaders(span, reply)

        const match = (request.params as Record<string, string>)['*']
        const path = posix.join(this.config.apiMountPath || 'api', `v${match}`)

        const route = this.routes.find(request.method as Methods, path)
        if (!route.handlers.length) {
          this.serviceLogger.debug({ method: request.method, url: request.url }, 'Route not found')
          const err = new HandledError(StatusCode.NotFound)
          span.recordException(err)
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message,
          })
          span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.NotFound)
          reply.code(StatusCode.NotFound)
          return err.getErrorResponse()
        }

        await route.handlers[0](request, reply, route.params)
      })
    })

    if (this.config.openApi?.enabled) {
      const apiUrl = this.config.openApi?.path ? this.config.openApi.path : this.config.apiMountPath
      if (!apiUrl) {
        throw new Error('Configuration error! When openApi is enabled you need to set openApi.path or apiMountPath')
      }
      const prefix = posix.join(apiUrl, '/assets')

      this.server?.register(fastifyStatic, {
        root: swaggerUi.absolutePath(),
        prefix,
        decorateReply: false, // the reply decorator has been added by the first plugin registration
      })

      OPEN_API_ROUTE_FUNCTIONS.forEach((route) => {
        const def = route.bind(this)()
        this.server?.route(def)
        this.serviceLogger.debug(`add route ${def.method} ${def.url}`)
      })
    }

    await super.start()
    this.server?.listen({
      port: this.config.port,
      host: this.config.host,
    })
    this.serviceLogger.info(
      { domain: this.config.domain, port: this.config.port },
      `http server listen on ${this.config.domain} ${this.config.port}`,
    )
  }

  async invoke<T>(
    input: {
      receiver: EBMessageAddress
      payload: { payload: unknown; parameter: unknown }
      traceId: TraceId
      principalId?: PrincipalId
    },
    endpoint: string,
  ): Promise<T> {
    return this.eventBridge.invoke<T>({
      sender: {
        serviceName: this.serviceInfo.serviceName,
        serviceVersion: this.serviceInfo.serviceVersion,
        serviceTarget: `$$endpoint:${endpoint}`,
      },
      ...input,
    })
  }
}
