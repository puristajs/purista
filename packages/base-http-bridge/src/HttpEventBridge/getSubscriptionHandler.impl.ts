// file deepcode ignore ServerLeak: <please specify a reason of ignoring this>

import { context, propagation, SpanKind } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import type { CustomMessage, EBMessage, Subscription } from '@purista/core'
import {
  getTimeoutPromise,
  HandledError,
  PuristaSpanName,
  serializeOtp,
  StatusCode,
  throwIfNotValidMessage,
  UnhandledError,
} from '@purista/core'
import { HTTP } from 'cloudevents'

import type { HttpEventBridge } from './HttpEventBridge.impl.js'
import type { HttpEventBridgeConfig, RouterFunction } from './types/index.js'

export const getSubscriptionHandler = function (
  this: HttpEventBridge<HttpEventBridgeConfig>,
  subscription: Subscription,
  cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
  wrappedInCloudEvent = false,
): RouterFunction {
  const handler: RouterFunction = async (c) => {
    const parentContext = propagation.extract(context.active(), c.req.headers)

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

          const headers = [...c.req.headers.entries()].reduce((prev: Record<string, string>, val) => {
            return { ...prev, [val[0]]: val[1] }
          }, {})

          let message: EBMessage

          if (wrappedInCloudEvent) {
            const body = await c.req.text()

            const event = HTTP.toEvent<EBMessage>({ headers, body })
            if (Array.isArray(event)) {
              throw new UnhandledError(
                StatusCode.NotImplemented,
                'Support of multiple events per subscription call is not supported',
              )
            }
            message = event.data as EBMessage
          } else {
            try {
              message = await c.req.json()
            } catch (error) {
              throw new HandledError(StatusCode.BadRequest, 'payload must be a parsable json')
            }
          }

          throwIfNotValidMessage(message)

          message.otp = serializeOtp()

          span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, StatusCode.NoContent)

          const msg = await getTimeoutPromise(cb(message), this.config.defaultCommandTimeout)

          if (msg) {
            await this.emitMessage(msg)
          }

          return c.json(undefined, StatusCode.NoContent)
        } catch (error) {
          const err = error instanceof UnhandledError ? error : UnhandledError.fromError(error)
          span.recordException(err)
          this.logger.error({ err }, err.message)
          return c.json(err.getErrorResponse(), err.errorCode as number)
        }
      },
    )
  }

  return handler
}
