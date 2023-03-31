import { context, propagation, SpanKind } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import {
  Command,
  CommandErrorResponse,
  CommandSuccessResponse,
  convertToSnakeCase,
  CustomMessage,
  DefinitionEventBridgeConfig,
  EBMessage,
  EBMessageAddress,
  ensureHttpServerClose,
  EventBridge,
  EventBridgeBaseClass,
  EventBridgeConfig,
  getTimeoutPromise,
  HandledError,
  HttpExposedServiceMeta,
  PuristaSpanName,
  serializeOtp,
  StatusCode,
  Subscription,
  throwIfNotValidMessage,
  UnhandledError,
} from '@purista/core'
import { createServer, Server } from 'http'
import Trouter, { Methods } from 'trouter'
import { promisify } from 'util'

import { DaprClient } from '../DaprClient'
import { getDefaultConfig } from './getDefaultConfig.impl'
import { DaprEventBridgeConfig, RouterFunction } from './types'

export class DaprEventBridge extends EventBridgeBaseClass<DaprEventBridgeConfig> implements EventBridge {
  public server: Server
  public router = new Trouter<RouterFunction>()
  public isShuttingDown = false

  public isStarted = false

  public client: DaprClient

  constructor(config?: EventBridgeConfig<DaprEventBridgeConfig>) {
    const conf = {
      ...config,
      config: { ...getDefaultConfig(), ...config },
    }
    super('DaprEventBridge', conf)
    // deepcode ignore HttpToHttps: <we do not need https here as we are talking to the sidecar>
    this.server = createServer(async (request, response) => {
      if (this.isShuttingDown) {
        response.statusCode = 503
        response.setHeader('content-type', 'application/json; charset=utf-8')

        response.write(JSON.stringify({ message: 'shut down in progress', status: 503 }), (err) => {
          if (err) {
            this.logger.error({ err }, err.message)
          }
        })
        response.end()
      }

      const route = this.router.find(request.method as Methods, request.url as string)

      if (!route?.handlers.length) {
        const err = new HandledError(StatusCode.NotFound, 'route not found')
        this.logger.error({ err, url: request.url }, err.message)
        response.statusCode = err.errorCode
        response.setHeader('content-type', 'application/json; charset=utf-8')
        // deepcode ignore ServerLeak: <We have a handled error here - it on purpose to respond with error>
        response.write(JSON.stringify(err.getErrorResponse()), (err) => {
          if (err) {
            this.logger.error({ err }, err.message)
          }
        })
        response.end()
        return
      }

      try {
        await route.handlers[0](request, response, route.params)
      } catch (error) {
        const err = new HandledError(StatusCode.InternalServerError, (error as Error).message)
        this.logger.error({ err }, err.message)

        response.statusCode = err.errorCode
        response.setHeader('content-type', 'application/json; charset=utf-8')
        // deepcode ignore ServerLeak: <We have a handled error here - it on purpose to respond with error>
        response.write(JSON.stringify(err.getErrorResponse()), (err) => {
          if (err) {
            this.logger.error({ err }, err.message)
          }
        })
        response.end()
      }
    })

    ensureHttpServerClose(this.server)

    this.client = new DaprClient({
      daprApiToken: this.config.config.daprApiToken,
      daprHost: this.config.config.daprHost,
      daprPort: this.config.config.daprPort,
      isKeepAlive: this.config.config.isKeepAlive,
      logger: this.logger.getChildLogger({ name: 'DaprClient' }),
    })
  }

  async start() {
    await new Promise((resolve) => {
      this.router.add('GET', '/healthz')
      this.router.add('GET', '/dapr/subscribe')
      this.router.add('DELETE', '/actors/:actorTypeName/:actorId')
      this.router.add('PUT', '/actors/:actorTypeName/:actorId/method/:methodName')
      this.router.add('PUT', '/actors/:actorTypeName/:actorId/method/timer/:timerName')
      this.router.add('PUT', '/actors/:actorTypeName/:actorId/method/remind/:reminderName')

      this.router.add('GET', '/dapr/config')

      this.server = this.server.listen(
        { port: this.config.config.serverPort, hostname: this.config.config.serverHost },
        () => {
          this.isStarted = true
          resolve(undefined)
        },
      )
    })
  }

  async emitMessage(
    message: Omit<EBMessage, 'id' | 'timestamp' | 'instanceId' | 'correlationId'>,
  ): Promise<Readonly<EBMessage>> {
    return message as Readonly<EBMessage>
  }

  async invoke<T>(
    _input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'instanceId'>,
    _ttl?: number,
  ): Promise<T> {
    // throw new Error('Not implemented')
    return '' as T
  }

  async registerCommand(
    address: EBMessageAddress,
    cb: (
      message: Command,
    ) => Promise<
      Readonly<Omit<CommandSuccessResponse, 'instanceId'>> | Readonly<Omit<CommandErrorResponse, 'instanceId'>>
    >,
    _metadata: HttpExposedServiceMeta,
    _eventBridgeConfig: DefinitionEventBridgeConfig,
  ): Promise<string> {
    const handler: RouterFunction = async (request, response) => {
      const parentContext = propagation.extract(context.active(), request.headers)

      await this.startActiveSpan(
        PuristaSpanName.EventBridgeCommandReceived,
        { kind: SpanKind.CONSUMER },
        parentContext,
        async (span) => {
          const hostname = process.env.HOSTNAME || 'unknown'
          span.setAttribute(SemanticAttributes.HTTP_URL, request.url || '')
          span.setAttribute(SemanticAttributes.HTTP_METHOD, request.method || '')
          span.setAttribute(SemanticAttributes.HTTP_HOST, hostname)

          try {
            if (request.method !== 'POST') {
              throw new UnhandledError(StatusCode.MethodNotAllowed, 'Unsupported method ' + request.method)
            }
            const buffers = []
            for await (const chunk of request) {
              buffers.push(chunk)
            }
            let message: Command
            try {
              message = JSON.parse(Buffer.concat(buffers).toString()) as Command
            } catch (error) {
              throw new HandledError(StatusCode.BadRequest, 'payload must be a parsable json')
            }

            throwIfNotValidMessage(message)

            message.otp = serializeOtp()

            const msg = await getTimeoutPromise(cb(message), this.config.defaultCommandTimeout)

            // empty response
            if (msg.payload === undefined || msg.payload === '') {
              response.statusCode = StatusCode.NoContent
              span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.NoContent)

              response.end()
              span.end()
              return
            }

            let payload = ''
            if (typeof msg.payload === 'string') {
              payload = msg.payload
            } else {
              payload = JSON.stringify(msg.payload)
            }

            response.statusCode = StatusCode.OK
            response.setHeader('content-type', 'application/json; charset=utf-8')

            response.write(payload, (err) => {
              if (err) {
                this.logger.error({ err }, err.message)
              }
            })
            response.end()
          } catch (error) {
            const err = error instanceof UnhandledError ? error : UnhandledError.fromError(error)
            span.recordException(err)
            this.logger.error({ err }, err.message)
            response.statusCode = err.errorCode
            response.setHeader('content-type', 'application/json; charset=utf-8')
            // deepcode ignore ServerLeak: <We have a handled error here - it on purpose to respond with error>
            response.write(JSON.stringify(err.getErrorResponse()), (err) => {
              if (err) {
                this.logger.error({ err }, err.message)
              }
            })
            response.end()
          }
        },
      )
    }

    const path = convertToSnakeCase(address.serviceTarget)
    this.router.add('POST', path, handler)

    return path
  }

  async unregisterCommand(address: EBMessageAddress): Promise<void> {
    this.logger.debug({ address }, 'unregister command')
  }

  async registerSubscription(
    _subscription: Subscription,
    _cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined>,
  ): Promise<string> {
    return ''
  }

  async unregisterSubscription(address: EBMessageAddress): Promise<void> {
    this.logger.debug({ address }, 'unregister subscription')
  }

  async isReady(): Promise<boolean> {
    return this.isStarted && !this.isShuttingDown
  }

  async isHealthy(): Promise<boolean> {
    try {
      const result = await this.client.get(`/metadata`)
      return !!result
    } catch (e) {
      return false
    }
  }

  /**
   * Shut down event bridge as gracefully as possible
   */
  async destroy(): Promise<void> {
    await promisify(this.server.close)()
  }
}
