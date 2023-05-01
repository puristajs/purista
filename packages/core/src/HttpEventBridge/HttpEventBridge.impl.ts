// file deepcode ignore ServerLeak: <please specify a reason of ignoring this>
import { Server } from 'node:http'

import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { Hono } from 'hono'
import { compress } from 'hono/compress'

import {
  Command,
  CommandErrorResponse,
  CommandResponse,
  CommandSuccessResponse,
  Complete,
  CustomMessage,
  DefinitionEventBridgeConfig,
  deserializeOtp,
  EBMessage,
  EBMessageAddress,
  EBMessageType,
  EventBridge,
  EventBridgeBaseClass,
  EventBridgeConfig,
  EventBridgeEventNames,
  getErrorMessageForCode,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewTraceId,
  HandledError,
  HttpExposedServiceMeta,
  isCommandErrorResponse,
  isHttpExposedServiceMeta,
  isInfoMessage,
  PuristaSpanName,
  PuristaSpanTag,
  serializeOtp,
  StatusCode,
  Subscription,
  UnhandledError,
} from '../core'
import { HonoTRouter } from '../helper'
import { getCommandHandler } from './getCommandHandler'
import { getCommandHandlerRestApi } from './getCommandHandlerRestApi'
import { getDefaultConfig } from './getDefaultConfig'
import { getSubscriptionHandler } from './getSubscriptionHandler'
import { healthzRoute } from './healthzRoute.impl'
import { HttpEventBridgeClient, HttpEventBridgeConfig } from './types'

// EventBridgeConfig<Complete<CustomConfig>>

/**
 * The HTTP event bridge is a generic event bridge.
 * In environments like Dapr or Knative, the communication is done via sidecar containers and via HTTP.
 *
 * In these cases, it is expected, that the current instance is a HTTP server, which provides REST endpoints for commands and subscriptions.
 * The communication from the current instance to the sidecar is also done via REST endpoints.
 *
 * HTTP calls from the sidecar to the current instance might be done via CloudEvent schema, which wraps the payload into a defined structure.
 * The HttpEventBridge can be configured to respect this, and to extract the information from CloudEvents.
 *
 * To use the HttpEventBridge, you will need following peer-dependencies installed:
 *
 * - hono
 * - trouter
 */
export class HttpEventBridge<CustomConfig extends HttpEventBridgeConfig>
  extends EventBridgeBaseClass<CustomConfig>
  // eslint-disable-next-line prettier/prettier
  implements EventBridge {
  public server: Server | undefined
  public app: Hono
  public isShuttingDown = false
  public isStarted = false

  public client: HttpEventBridgeClient

  constructor(config: EventBridgeConfig<CustomConfig>, client: HttpEventBridgeClient) {
    const defaults = getDefaultConfig()
    const conf: Required<Pick<EventBridgeConfig<Complete<CustomConfig>>, 'config'>> &
      Omit<EventBridgeConfig<Complete<CustomConfig>>, 'config'> = {
      ...defaults,
      ...config,
      config: { ...defaults.config, ...config.config } as CustomConfig,
    }

    super(conf.config.name || 'HttpEventBridge', conf)

    this.client = client

    this.app = new Hono({ router: new HonoTRouter() })
  }

  async start() {
    this.app.notFound((c) => {
      const err = new HandledError(StatusCode.NotFound, getErrorMessageForCode(StatusCode.NotFound), {
        method: c.req.method,
        path: c.req.path,
        url: c.req.url,
      })

      this.logger.error({ err }, err.message)

      return c.json(err.getErrorResponse())
    })

    this.app.onError((err, c) => {
      this.logger.error({ err }, err.message)
      const responseError = UnhandledError.fromError(err)
      return c.json(responseError.getErrorResponse(), responseError.errorCode as any)
    })

    this.app.use('*', compress())

    this.app.use('*', async (c, next) => {
      if (this.isShuttingDown) {
        const err = { message: 'shut down in progress', status: StatusCode.ServiceUnavailable }
        return new Response(JSON.stringify(err), {
          status: err.status,
          statusText: getErrorMessageForCode(err.status),
          headers: {
            'content-type': 'application/json; charset=utf-8',
          },
        })
      }
      await next()
    })

    this.app.get('/healthz', healthzRoute)

    this.server = this.config.config.serve({
      fetch: this.app.fetch,
      port: this.config.config.serverPort,
      hostname: this.config.config.serverHost,
    })
  }

  async emitMessage<T extends EBMessage>(
    message: Omit<EBMessage, 'id' | 'timestamp' | 'instanceId' | 'correlationId'>,
  ): Promise<Readonly<EBMessage>> {
    const currentContext = await deserializeOtp(this.logger, message.otp)

    return this.startActiveSpan(
      PuristaSpanName.EventBridgeEmitMessage,
      { kind: SpanKind.PRODUCER },
      currentContext,
      async (span) => {
        const msg = Object.freeze({
          ...message,
          id: getNewEBMessageId(),
          timestamp: Date.now(),
          traceId: message.traceId || span.spanContext().traceId,
          instanceId: this.instanceId,
          otp: serializeOtp(),
        })

        if (isInfoMessage(msg as EBMessage)) {
          this.logger.debug('skipping info message')
          return msg as Readonly<T>
        }

        if (!msg.eventName) {
          const err = new UnhandledError(StatusCode.BadRequest, 'message must contain a event name')
          this.logger.error({ err }, err.message)
          span.recordException(err)

          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message,
          })
          throw err
        }

        span.setAttribute(PuristaSpanTag.SenderServiceName, msg.sender.serviceName)
        span.setAttribute(PuristaSpanTag.SenderServiceVersion, msg.sender.serviceVersion)
        span.setAttribute(PuristaSpanTag.SenderServiceTarget, msg.sender.serviceTarget)

        span.addEvent(msg.eventName)

        const headers: Record<string, string> = {}
        propagation.inject(context.active(), headers)

        try {
          await this.client.sendEvent(msg as EBMessage)
        } catch (err) {
          this.emit(EventBridgeEventNames.EventbridgeError, err)
          throw err
        }

        return msg as Readonly<T>
      },
    )
  }

  async invoke<T>(
    input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'instanceId'>,
    ttl?: number,
  ): Promise<T> {
    const currentContext = await deserializeOtp(this.logger, input.otp)
    return this.startActiveSpan(PuristaSpanName.EventBridgeInvokeCommand, {}, currentContext, async (span) => {
      const command: Command = Object.freeze({
        ...input,
        id: getNewEBMessageId(),
        instanceId: this.instanceId,
        correlationId: getNewCorrelationId(),
        timestamp: Date.now(),
        messageType: EBMessageType.Command,
        traceId: input.traceId || span.spanContext().traceId || getNewTraceId(),
        otp: serializeOtp(),
      })

      span.setAttribute(PuristaSpanTag.SenderServiceName, command.sender.serviceName)
      span.setAttribute(PuristaSpanTag.SenderServiceVersion, command.sender.serviceVersion)
      span.setAttribute(PuristaSpanTag.SenderServiceTarget, command.sender.serviceTarget)
      span.setAttribute(PuristaSpanTag.ReceiverServiceName, command.receiver.serviceName)
      span.setAttribute(PuristaSpanTag.ReceiverServiceVersion, command.receiver.serviceVersion)
      span.setAttribute(PuristaSpanTag.ReceiverServiceTarget, command.receiver.serviceTarget)

      const headers: Record<string, string> = {}
      propagation.inject(context.active(), headers)

      let message: CommandResponse
      try {
        message = await this.client.invoke(command, headers, ttl)
      } catch (error) {
        this.emit(EventBridgeEventNames.EventbridgeError, error)
        throw error
      }

      if (isCommandErrorResponse(message)) {
        const err = message.isHandledError ? HandledError.fromMessage(message) : UnhandledError.fromMessage(message)
        this.logger.error({ err }, 'invoke was returning an error')
        span.recordException(err)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        })

        throw err
      }

      return message.payload as T
    })
  }

  async registerCommand(
    address: EBMessageAddress,
    cb: (
      message: Command,
    ) => Promise<
      Readonly<Omit<CommandSuccessResponse, 'instanceId'>> | Readonly<Omit<CommandErrorResponse, 'instanceId'>>
    >,
    metadata: HttpExposedServiceMeta,
    eventBridgeConfig: DefinitionEventBridgeConfig,
  ): Promise<string> {
    const fn = getCommandHandler.bind(this)
    const handler = fn(address, cb, metadata, eventBridgeConfig, this.config.config.commandPayloadAsCloudEvent)

    const path = this.client.getInternalPathForCommand(address)

    this.app.post(path, handler)
    this.logger.debug({ path }, 'command added')

    if (isHttpExposedServiceMeta(metadata) && this.config.config.enableRestApiExpose) {
      const httpMeta = metadata.expose.http
      const apiPath = this.client.getApiPathForCommand(address, metadata)

      this.logger.debug({ apiPath })

      const fnRest = getCommandHandlerRestApi.bind(this)
      const handlerRest = fnRest(address, cb, metadata, eventBridgeConfig)

      switch (httpMeta.method) {
        case 'DELETE':
          this.app.delete(apiPath, handlerRest)
          break
        case 'GET':
          this.app.get(apiPath, handlerRest)
          break
        case 'PATCH':
          this.app.patch(apiPath, handlerRest)
          break
        case 'POST':
          this.app.post(apiPath, handlerRest)
          break
        case 'PUT':
          this.app.put(apiPath, handlerRest)
          break
      }

      this.logger.debug({ path, method: httpMeta.method }, 'command added')
    }
    return path
  }

  async unregisterCommand(address: EBMessageAddress): Promise<void> {
    this.logger.debug({ address }, 'unregister command')
  }

  async registerSubscription(
    subscription: Subscription,
    cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined>,
  ): Promise<string> {
    if (this.isStarted) {
      throw new UnhandledError(
        StatusCode.InternalServerError,
        'subscriptions must be registered before starting the Dapr event bridge',
      )
    }

    const fn = getSubscriptionHandler.bind(this)
    const handler = fn(subscription, cb, this.config.config.subscriptionPayloadAsCloudEvent)

    const path = this.client.getInternalPathForSubscription(subscription.subscriber)

    this.app.post(path, handler)
    this.logger.debug({ path }, 'subscription added')
    return path
  }

  async unregisterSubscription(address: EBMessageAddress): Promise<void> {
    this.logger.debug({ address }, 'unregister subscription')
  }

  async isReady(): Promise<boolean> {
    return this.isStarted && !this.isShuttingDown
  }

  async isHealthy(): Promise<boolean> {
    if (!this.isStarted) {
      return false
    }
    return this.client.isSidecarAvailable()
  }

  /**
   * Shut down event bridge as gracefully as possible
   */
  async destroy(): Promise<void> {
    if (!this.server) {
      return
    }
    this.server.closeIdleConnections()
    await this.server.close()
  }
}
