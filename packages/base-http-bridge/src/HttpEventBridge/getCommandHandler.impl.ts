// file deepcode ignore ServerLeak: <please specify a reason of ignoring this>

import { context, propagation, SpanKind } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import {
  Command,
  CommandErrorResponse,
  CommandSuccessResponse,
  DefinitionEventBridgeConfig,
  EBMessageAddress,
  getTimeoutPromise,
  HandledError,
  HttpExposedServiceMeta,
  PuristaSpanName,
  serializeOtp,
  StatusCode,
  throwIfNotValidMessage,
  UnhandledError,
} from '@purista/core'
import { HTTP } from 'cloudevents'

import { HttpEventBridge } from './HttpEventBridge.impl'
import { HttpEventBridgeConfig, RouterFunction } from './types'

export const getCommandHandler = function (
  this: HttpEventBridge<HttpEventBridgeConfig>,
  address: EBMessageAddress,
  cb: (
    message: Command,
  ) => Promise<
    Readonly<Omit<CommandSuccessResponse, 'instanceId'>> | Readonly<Omit<CommandErrorResponse, 'instanceId'>>
  >,
  _metadata: HttpExposedServiceMeta,
  _eventBridgeConfig: DefinitionEventBridgeConfig,
  wrappedInCloudEvent = false,
): RouterFunction {
  const handler: RouterFunction = async (c) => {
    const parentContext = propagation.extract(context.active(), c.req.headers)

    this.logger.info({ headers: c.req.headers }, 'command handler headers')

    return await this.startActiveSpan(
      PuristaSpanName.EventBridgeCommandReceived,
      { kind: SpanKind.CONSUMER },
      parentContext,
      async (span) => {
        const hostname = process.env.HOSTNAME || 'unknown'
        span.setAttribute(SemanticAttributes.HTTP_URL, c.req.url || '')
        span.setAttribute(SemanticAttributes.HTTP_METHOD, c.req.method || '')
        span.setAttribute(SemanticAttributes.HTTP_HOST, hostname)

        try {
          if (c.req.method !== 'POST') {
            throw new UnhandledError(StatusCode.MethodNotAllowed, 'Unsupported method ' + c.req.method)
          }

          let message: Command

          if (wrappedInCloudEvent) {
            const body = await c.req.text()
            const headers = [...c.req.headers.entries()].reduce((prev: Record<string, string>, val) => {
              return { ...prev, [val[0]]: val[1] }
            }, {})

            const event = HTTP.toEvent<Command>({ headers, body })
            if (Array.isArray(event)) {
              throw new UnhandledError(
                StatusCode.NotImplemented,
                'Support of multiple events per command call is not supported',
              )
            }
            message = event.data as Command
          } else {
            try {
              message = await c.req.json()
            } catch (error) {
              throw new HandledError(StatusCode.BadRequest, 'payload must be a parsable json')
            }
          }

          throwIfNotValidMessage(message)

          message.otp = serializeOtp()

          const msg = await getTimeoutPromise(cb(message), this.config.defaultCommandTimeout)

          if (msg.eventName) {
            await this.emitMessage(msg)
          }

          // empty response
          if (msg.payload === undefined || msg.payload === '') {
            const status = StatusCode.NoContent

            span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, status)

            c.status(status)
            return c.body(null)
          }

          const payload = typeof msg.payload === 'string' ? msg.payload : JSON.stringify(msg)

          const status = StatusCode.OK
          return c.json(payload, status as any)
        } catch (error) {
          const err = error instanceof UnhandledError ? error : UnhandledError.fromError(error)
          span.recordException(err)
          this.logger.error({ err }, err.message)

          return c.json(err.getErrorResponse(), err.errorCode as any)
        }
      },
    )
  }

  return handler
}
