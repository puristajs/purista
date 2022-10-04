import compress from '@fastify/compress'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastifyStatic from '@fastify/static'
import {
  EBMessageAddress,
  EventBridge,
  HandledError,
  HttpExposedServiceMeta,
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
  constructor(baseLogger: Logger, eventBridge: EventBridge, config: HttpServerConfig = getDefaultConfig()) {
    super(baseLogger, ServiceInfo, eventBridge, COMMANDS, SUBSCRIPTIONS, config)

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
      .setErrorHandler((error, _request, reply) => {
        if (error instanceof HandledError) {
          reply.status(error.errorCode)
          return reply.send(error.getErrorResponse())
        }
        this.serviceLogger.error({ error }, 'General error handler')
        reply.status(StatusCode.InternalServerError)
        reply.send(new UnhandledError().getErrorResponse())
      })
      .setNotFoundHandler((_request, reply) => {
        reply.status(StatusCode.NotFound)
        reply.send(new HandledError(StatusCode.NotFound))
      })

    if (this.config.enableHelmet) {
      this.server.register(helmet, this.config.helmetOptions)
    }

    this.server.addHook('onError', async (_req, reply, error) => {
      this.serviceLogger.debug({ error }, 'General error handler')
      // Ensure to be async function or use callback function
      if (!reply.sent) {
        if (error instanceof HandledError) {
          reply.code(error.errorCode)
          reply.send(error.getErrorResponse())
          return
        }
        this.serviceLogger.error({ error }, 'onError hook: General error handler')
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
      const match = (request.params as Record<string, string>)['*']
      const path = posix.join(this.config.apiMountPath || 'api', `v${match}`)

      const route = this.routes.find(request.method as Methods, path)
      if (!route.handlers.length) {
        this.serviceLogger.debug({ method: request.method, url: request.url }, 'Route not found')
        reply.code(StatusCode.NotFound)
        return new HandledError(StatusCode.NotFound).getErrorResponse()
      }

      await route.handlers[0](request, reply, route.params)
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
