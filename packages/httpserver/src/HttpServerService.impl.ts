import compress from '@fastify/compress'
import helmet from '@fastify/helmet'
import fastifyStatic from '@fastify/static'
import {
  EBMessageAddress,
  EventBridge,
  HandledError,
  HttpExposedServiceMeta,
  Logger,
  Service,
  StatusCode,
  TraceId,
  UnhandledError,
} from '@purista/core'
import fastify, { FastifyInstance } from 'fastify'
import { posix } from 'path'
import qs from 'qs'
import * as swaggerUi from 'swagger-ui-dist'
import merge from 'ts-deepmerge'

import { COMMANDS } from './commands'
import { getDefaultConfig, ServiceInfo } from './config'
import { OPEN_API_ROUTE_FUNCTIONS } from './routes'
import { SUBSCRIPTIONS } from './subscriptions'
import { HttpServerConfig } from './types'

export class HttpServerService extends Service {
  server?: FastifyInstance

  config: HttpServerConfig

  routeDefinitions: HttpExposedServiceMeta[] = []

  /**
   * Create a new instance of the HttpServer class
   * @param {Logger} baseLogger - The logger that the server will use.
   * @param {EventBridge} eventBridge - EventBridge
   * @param {HttpServerConfig} conf - HttpServerConfig
   */
  constructor(baseLogger: Logger, eventBridge: EventBridge, config: HttpServerConfig = getDefaultConfig()) {
    super(baseLogger, ServiceInfo, eventBridge, COMMANDS, SUBSCRIPTIONS)

    this.config = merge(getDefaultConfig(), config)

    this.server = fastify({
      querystringParser: (str) => qs.parse(str),
      ...this.config.fastify,
    })
      .register(compress)
      .register(helmet)
      .setErrorHandler((error, _request, reply) => {
        if (error instanceof HandledError) {
          reply.status(error.errorCode)
          return reply.send(error.getErrorResponse())
        }
        this.serviceLogger.error('General error handler', error)
        reply.status(StatusCode.InternalServerError)
        reply.send(new UnhandledError().getErrorResponse())
      })
      .setNotFoundHandler((_request, reply) => {
        reply.status(StatusCode.NotFound)
        reply.send(new HandledError(StatusCode.NotFound))
      })
  }

  async start(): Promise<void> {
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
    this.serviceLogger.info(`http server listen on ${this.config.domain} ${this.config.port}`)
  }

  async invoke<T>(
    input: { receiver: EBMessageAddress; payload: { payload: unknown; parameter: unknown }; traceId: TraceId },
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
