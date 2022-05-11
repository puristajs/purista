import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2'
import path from 'path'
import * as swaggerUi from 'swagger-ui-dist'
import Trouter, { Methods } from 'trouter'
import { URL } from 'url'

import { ErrorCode, EventBridge, HandledError, Logger, Service, UnhandledError } from '../core'
import { COMMANDS } from './commands'
import { getDefaultConfig, OPENAPI_DEFAULT_MOUNT_PATH, ServiceInfo } from './config'
import {
  createInternalError500Handler,
  createNotFound404Handler,
  createStaticFileHandler,
  openApiDocuIndex,
  openApiDocuJsInit,
  openApiHandler,
} from './handler'
import { createHttpServer, getNewContext } from './helper'
import { createCompressionMiddleware, createResponseToJsonMiddleware } from './onAfterMiddleware'
import { SUBSCRIPTIONS } from './subscriptions'
import { Handler, HttpExposedServiceMeta, HttpServerConfig } from './types'
import { Middleware } from './types/Middleware'

export class HttpServerService extends Service {
  private server: Http2SecureServer | null = null

  private router = new Trouter<Handler>()
  private notFoundHandlers: Handler[] = []
  private internalServerErrorHandler: Handler

  private conf: HttpServerConfig

  private onBeforeMiddleware: Middleware[] = []
  private onAfterMiddleware: Middleware[] = []

  public routeDefinitions: HttpExposedServiceMeta[] = []

  private compressionMiddleware = createCompressionMiddleware()
  private jsonResponseMiddleware = createResponseToJsonMiddleware()

  /**
   * Create a new instance of the HttpServer class
   * @param {Logger} baseLogger - The logger that the server will use.
   * @param {EventBridge} eventBridge - EventBridge
   * @param {HttpServerConfig} conf - HttpServerConfig
   */
  constructor(baseLogger: Logger, eventBridge: EventBridge, conf: HttpServerConfig = getDefaultConfig()) {
    super(baseLogger, ServiceInfo, eventBridge, COMMANDS, SUBSCRIPTIONS)

    this.conf = conf

    this.notFoundHandlers = [createNotFound404Handler()]
    this.internalServerErrorHandler = createInternalError500Handler()

    if (this.conf.openApi?.enabled) {
      const openApiPath = this.config.openApi?.path || OPENAPI_DEFAULT_MOUNT_PATH

      this.addRoute('GET', openApiPath, openApiDocuIndex.bind(this))

      this.addRoute('GET', path.posix.join(openApiPath, 'openapi.json'), openApiHandler.bind(this))

      this.addRoute('GET', path.posix.join(openApiPath, 'initializer.js'), openApiDocuJsInit.bind(this))

      const assetsPath = path.posix.join(openApiPath, '/assets')
      const serveUIAssets = createStaticFileHandler({ path: swaggerUi.absolutePath(), removeStartingPath: assetsPath })
      this.addRoute('GET', assetsPath + '/*', serveUIAssets.bind(this))
    }
  }

  /**
   * It creates an instance of the HttpServerService class
   * @param {Logger} baseLogger - The logger instance that the service will use.
   * @param {EventBridge} eventBridge - EventBridge
   * @param {HttpServerConfig} conf - HttpServerConfig
   * @returns A promise that resolves to an instance of the class.
   */
  static async createInstance(
    baseLogger: Logger,
    eventBridge: EventBridge,
    conf: HttpServerConfig = getDefaultConfig(),
  ): Promise<HttpServerService> {
    const instance = new HttpServerService(baseLogger, eventBridge, conf)
    return instance
  }

  /**
   * It returns the config object
   * @returns The value of the `conf` property.
   */
  get config() {
    return this.conf
  }

  /**
   * It connects to the event bridge and subscribes to the topics that are in the subscription list.
   * It creates an HTTP server, and then attaches the router to the server
   */
  async start() {
    await super.start()
    this.server = await createHttpServer(this.config, this.log)
    this.server.on('request', this.routerHandler.bind(this))
  }

  /**
   * Add a route that matches all HTTP methods
   * @param {string} pattern - The pattern to match against.
   * @param {Handler[]} handlers - An array of handlers to be called when the route is matched.
   */
  addAllRoute(pattern: string, ...handlers: Handler[]): HttpServerService {
    this.router.all(pattern, ...handlers)
    this.log.debug('route add all:', pattern)
    return this
  }

  /**
   * Add a route to the router
   * @param {Methods} method - HTTP method
   * @param {string} pattern - The pattern to match against.
   * @param {Handler[]} handlers - An array of functions that will be called when the route is matched.
   */
  addRoute(method: Methods, pattern: string, ...handlers: Handler[]): HttpServerService {
    this.router.add(method, pattern, ...handlers)
    this.log.debug('route add:', method, pattern)
    return this
  }

  /**
   * Add a middleware function to the list of middleware functions that will be called before the route
   * handler
   * @param {Middleware} middleware - Middleware
   */
  addOnBeforeMiddleware(middleware: Middleware): HttpServerService {
    this.onBeforeMiddleware.push(middleware)
    return this
  }

  /**
   * Add a middleware to the list of middlewares that will be called after the request is processed
   * @param {Middleware} middleware - Middleware
   */
  addOnAfterMiddleware(middleware: Middleware): HttpServerService {
    this.onAfterMiddleware.push(middleware)
    return this
  }

  /**
   * Set the not found handlers
   * @param {Handler[]} handlers - An array of handlers to be called when the request is not found.
   */
  setNotFoundHandlers(handlers: Handler[]): HttpServerService {
    this.notFoundHandlers = handlers.map((handler) => handler.bind(this))
    return this
  }

  /**
   * Set the error handler
   * @param {Handler} handler - A function that takes a `Request` and `Response` object and returns
   */
  setErrorHandler(handler: Handler): HttpServerService {
    this.internalServerErrorHandler = handler.bind(this)
    return this
  }

  /**
   * It takes a request, a response, and a context object. It then tries to find a matching route, and
   * if it finds one, it runs the middleware for that route. If it doesn't find a matching route, it
   * runs the middleware for the 404 handler
   * @param {Http2ServerRequest} request - The incoming request object.
   * @param {Http2ServerResponse} response - The response object.
   * @returns Nothing.
   */
  async routerHandler(request: Http2ServerRequest, response: Http2ServerResponse) {
    const url = new URL(request.url, 'https://example.com')
    const method = request.method as Methods
    const pathName = url.pathname.toLowerCase()
    const route = this.router.find(method, pathName)
    let context = getNewContext(request.headers['x-request-id'], route.params)
    const handlers: Handler[] = []

    url.searchParams.forEach((value, name) => {
      context.parameter[name] = value
    })

    if (route?.handlers.length) {
      handlers.push(
        ...this.onBeforeMiddleware,
        ...route.handlers,
        ...this.onAfterMiddleware,
        this.jsonResponseMiddleware,
        this.compressionMiddleware,
      )
    } else {
      handlers.push(...this.notFoundHandlers)
    }

    try {
      for (const handler of handlers) {
        const handlerFunction = handler.bind(this)
        context = await handlerFunction(request, response, context)
        if (context.isResponseSend) {
          break
        }
      }

      if (!context.isResponseSend) {
        this.log.error('all handlers done, but no response send - now throwing to jump into error handlers', url)
        throw new UnhandledError(ErrorCode.InternalServerError, 'No response send to client')
      }
    } catch (err) {
      if (context.isResponseSend) {
        return
      }

      if (err instanceof HandledError) {
        response.statusCode = err.errorCode
        response.setHeader('content-type', 'application/json; charset=utf-8')
        response.end(err.toString())
        return
      }

      if (err instanceof UnhandledError && err.errorCode >= 400 && err.errorCode < 500) {
        response.statusCode = err.errorCode
        response.setHeader('content-type', 'application/json; charset=utf-8')
        response.end(err.toString())
        return
      }

      this.log.error('route handler error', err)

      this.internalServerErrorHandler(request, response, context)
    }
  }
}
