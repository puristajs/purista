import { posix } from 'node:path'

import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import type { Command, CommandDefinitionMetadataBase, EBMessageAddress, ServiceConstructorInput } from '@purista/core'
import { HandledError, isHttpExposedServiceMeta, safeBind, Service, StatusCode, UnhandledError } from '@purista/core'
import type { Handler } from 'hono'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { PatternRouter } from 'hono/router/pattern-router'
import { OpenApiBuilder } from 'openapi3-ts/oas31'

import { addPathToOpenApi } from '../../../helper/index.js'
import type { BindingsBase, EndpointProtectMiddleware, HealthFunction, VariablesBase } from '../../../types/index.js'
import type { HonoServiceV1Config } from './honoServiceConfig.js'

/**
 * A service which creates a Hono server, adds the command endpoints of given services.
 * The webserver needs to be started programmatically, after the `.start` method.
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
 * const pingService = pingV1Service.getInstance(eventBridge)
 * await pingService.start()
 *
 * const honoService = honoV1Service.getInstance(eventBridge, {
 *   serviceConfig: {
 *     services: [pingService]
 *   }
 * })
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
> extends Service<HonoServiceV1Config> {
  /**
   * The Hono instance
   */
  public app

  /**
   * The OpenApiBuilder instance
   */
  public openApi: OpenApiBuilder

  private knownServices: Set<string> = new Set()

  private isAvailable = false

  constructor(config: ServiceConstructorInput<HonoServiceV1Config>) {
    super(config)
    this.openApi = new OpenApiBuilder(this.config.openApi)

    if (this.config.enableDynamicRoutes) {
      this.app = new Hono<{ Bindings: Bindings; Variables: Variables }>({ router: new PatternRouter() })
    } else {
      this.app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
      this.subscriptionDefinitionList = []
    }
  }

  /**
   * Set the Hono types for Variables and Bindings.
   * @returns The service instance with propper types
   */
  setHonoTypes<
    E extends { Bindings?: Record<string, unknown>; Variables?: Record<string, unknown> } = {
      Bindings: {}
      Variables: {}
    },
  >() {
    return this as unknown as HonoServiceClass<Bindings & E['Bindings'], Variables & E['Variables']>
  }

  /**
   * Set a custom health function
   * @param fn
   */
  setHealthFunction(fn: HealthFunction<typeof this>) {
    this.config.healthFunction = fn
    return this
  }

  /**
   * Set the middleware which will be executed on all endpoints which are marked as secured/protected.
   * It can also be used to enhance input information.
   *
   * @example
   * ```typescript
   * honoService.setProtectHandler(async function (c, next) {
   * const auth = basicAuth({ username: 'user', password: 'password' })
   * c.set('additionalParameter', { userId: '123' })
   * return auth(c, next)
   * })
   * ```
   *
   * @param fn
   */
  setProtectMiddleware(fn: EndpointProtectMiddleware<typeof this, Bindings, Variables>) {
    this.config.protectHandler = fn
    return this
  }

  async start() {
    if (this.config.enableHealth) {
      this.openApi.addPath(this.config.healthPath, {
        get: {
          summary: 'server health check',
          description:
            'Returns a 200 response as long as given health function does not throw and the server is connected to the event bridge',
          responses: {
            '200': {
              'application/json': {},
            },
          },
        },
      })

      const fn = this.config.healthFunction

      const healthFn = safeBind(fn, this)

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

      this.app.get(this.config.healthPath, async (c) => {
        const con = propagation.extract(context.active(), c.req.raw.headers)
        return await this.startActiveSpan('healthHandler', { kind: SpanKind.SERVER }, con, async (span) => {
          span.setAttribute(SemanticAttributes.HTTP_ROUTE, this.config.healthPath)
          span.setAttribute(SemanticAttributes.HTTP_METHOD, 'GET')
          const isEventBridgeReady = await this.eventBridge.isHealthy()

          const traceId = c.req.header(this.config.traceHeaderField)
          c.header(this.config.traceHeaderField, traceId)

          if (!isEventBridgeReady) {
            const err = new HandledError(StatusCode.InternalServerError, 'event bridge not ready')
            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, err.errorCode)
            return c.json(err.getErrorResponse(), StatusCode.InternalServerError)
          }

          if (!this.isAvailable) {
            const err = new HandledError(StatusCode.ServiceUnavailable, 'server not available')
            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, err.errorCode)
            return c.json(err.getErrorResponse(), StatusCode.ServiceUnavailable)
          }

          try {
            await healthFn()
            span.setStatus({
              code: SpanStatusCode.OK,
              message: 'OK',
            })
            const okErr = new HandledError(StatusCode.OK)
            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, okErr.errorCode)
            return c.json(okErr.getErrorResponse(), okErr.errorCode)
          } catch (err) {
            span.recordException(err as Error)
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: (err as Error).message,
            })
            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.InternalServerError)
            return c.json(HandledError.fromError(err).getErrorResponse(), StatusCode.InternalServerError)
          }
        })
      })
    }

    if (this.config.openApi?.enabled) {
      this.app.get(posix.join(this.config.apiMountPath, 'openapi.json'), async (c) => c.json(this.openApi.getSpec()))

      this.app.get(posix.join(this.config.apiMountPath, 'openapi.yaml'), async (c) =>
        c.text(this.openApi.getSpecAsYaml()),
      )
    }

    this.app.notFound(async (c) => {
      const con = propagation.extract(context.active(), c.req.raw.headers)

      return await this.startActiveSpan('notFoundHandler', { kind: SpanKind.SERVER }, con, async (span) => {
        span.setAttribute(SemanticAttributes.HTTP_ROUTE, c.req.path)
        span.setAttribute(SemanticAttributes.HTTP_METHOD, c.req.method.toUpperCase())
        span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.NotFound)

        const err = new HandledError(StatusCode.NotFound, 'Route not found', {
          method: c.req.method,
          route: c.req.url,
        })
        span.recordException(err as Error)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (err as Error).message,
        })

        this.logger.debug({ path: c.req.path, ...span.spanContext(), customTraceId: c.get('traceId') }, 'not found')
        return c.json(err.getErrorResponse(), StatusCode.NotFound)
      })
    })

    this.app.onError(async (err, c) => {
      const con = propagation.extract(context.active(), c.req.raw.headers)

      return await this.startActiveSpan('errorHandler', { kind: SpanKind.SERVER }, con, async (span) => {
        span.setAttribute(SemanticAttributes.HTTP_ROUTE, c.req.path)
        span.setAttribute(SemanticAttributes.HTTP_METHOD, c.req.method.toUpperCase())
        span.recordException(err)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        })

        if (err instanceof HandledError) {
          span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, err.errorCode)
          return c.json(err.getErrorResponse(), err.errorCode)
        }

        this.logger.error({ err, ...span.spanContext(), customTraceId: c.get('traceId') }, 'General error handler')

        if (err instanceof HTTPException) {
          span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, err.status)
          return c.json(HandledError.fromError(err, err.status).getErrorResponse(), err.status)
        }

        span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.InternalServerError)
        return c.json(new UnhandledError().getErrorResponse(), StatusCode.InternalServerError)
      })
    })

    this.registerService(...this.config.services)

    await this.setServiceAvailable()

    return super.start()
  }

  /**
   * Register a service instance.
   * Must be called before `.start`.
   * Adds the endpoints of the service commands to the Hono router
   * @param services
   */
  registerService(...services: Service[]) {
    services.forEach((service) => {
      service.commandDefinitionList.forEach((command) => {
        this.addEndpoint(command.metadata, { ...service.serviceInfo, serviceTarget: command.commandName })
      })
    })

    return this
  }

  /**
   * Adds a single service command endpoint to the Hono router
   * @param metadata
   * @param commandName
   * @param service
   * @returns
   */
  public addEndpoint(metadata: CommandDefinitionMetadataBase, service: EBMessageAddress) {
    if (!isHttpExposedServiceMeta(metadata)) {
      return
    }

    if (this.knownServices.has(`${service.serviceName}-${service.serviceVersion}-${service.serviceTarget}`)) {
      return
    }

    const expose = metadata.expose

    const method = expose.http.method.toLowerCase() as 'put' | 'post' | 'patch' | 'get' | 'delete'
    const path = posix.join(this.config.apiMountPath, `v${service.serviceVersion}`, expose.http.path)

    const requestContentType = expose.contentTypeResponse || 'application/json'
    const requestEncodingType = expose.contentEncodingResponse || 'utf-8'

    const responseContentType = expose.contentTypeResponse || 'application/json'
    const responseEncodingType = expose.contentEncodingResponse || 'utf-8'

    const protectHandler = safeBind(this.config.protectHandler, this)

    addPathToOpenApi(this.openApi, metadata, path, this.config)

    const handler: Handler = async (c) => {
      const parentContext = propagation.extract(context.active(), c.req.raw.headers)

      return this.startActiveSpan('handler', { kind: SpanKind.SERVER }, parentContext, async (span) => {
        try {
          span.setAttribute(SemanticAttributes.HTTP_ROUTE, path)
          span.setAttribute(SemanticAttributes.HTTP_METHOD, method.toUpperCase())

          let payload: unknown

          const parameter = {
            ...c.req.query(),
            ...c.req.param(),
            ...c.get('purista'),
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
              return c.json(err.getErrorResponse(), err.errorCode)
            }
          }

          const traceId = c.req.header(this.config.traceHeaderField)

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
              contentType: expose.contentTypeRequest || 'application/json',
              contentEncoding: expose.contentEncodingRequest || 'utf-8',
            },
            `${method}:${path}`,
          )

          c.header('content-type', `${responseContentType}; charset=${responseEncodingType}`)

          span.setStatus({
            code: SpanStatusCode.OK,
          })

          if (result === undefined || result === null || result === '') {
            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.NoContent)
            if (responseContentType.toLowerCase() !== 'application/json') {
              return c.text('', StatusCode.NoContent)
            }
            return c.json(undefined, StatusCode.NoContent)
          }

          span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.OK)

          if (responseContentType.toLowerCase() !== 'application/json') {
            return c.text(result.toString(), StatusCode.OK)
          }

          return c.json(result, StatusCode.OK)
        } catch (err) {
          span.recordException(err as Error)
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: (err as Error).message,
          })

          if (err instanceof HandledError) {
            this.logger.debug({ err, ...span.spanContext(), customTraceId: c.get('traceId') }, err.message)

            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, err.errorCode)
            return c.json(err.getErrorResponse(), err.errorCode)
          }

          const unhandledError = UnhandledError.fromError(err)
          unhandledError.errorCode = StatusCode.InternalServerError
          span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, unhandledError.errorCode)

          this.logger.error({ err, ...span.spanContext(), customTraceId: c.get('traceId') }, 'unhandled error')
          return c.json(unhandledError.getErrorResponse(), unhandledError.errorCode)
        }
      })
    }

    if (expose.http.openApi?.isSecure) {
      this.app[method](path, protectHandler, handler)
    } else {
      this.app[method](path, handler)
    }
    this.knownServices.add(`${service.serviceName}-${service.serviceVersion}-${service.serviceTarget}`)
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

  async destroy() {
    await this.setServiceUnavailable()
    return super.destroy()
  }
}
