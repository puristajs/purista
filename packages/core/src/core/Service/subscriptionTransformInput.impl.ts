import { SpanStatusCode } from '@opentelemetry/api'
import { ZodError } from 'zod'

import { HandledError, UnhandledError } from '../Error'
import { EBMessage, EBMessageType, Logger, StatusCode, SubscriptionDefinition } from '../types'
import type { Service } from './Service.impl'

export const subscriptionTransformInput = async (
  serviceInstance: Service,
  logger: Logger,
  subscription: SubscriptionDefinition,
  message: Readonly<EBMessage>,
) => {
  let msgPayload: { payload: unknown; parameter: unknown } | undefined

  if (message.messageType === EBMessageType.Command) {
    msgPayload = message.payload as { payload: unknown; parameter: unknown }
  } else {
    msgPayload = { payload: message.payload, parameter: undefined }
  }

  if (!subscription.hooks.transformInput) {
    return msgPayload
  }

  const transformInput = subscription.hooks.transformInput
  return await serviceInstance.startActiveSpan(
    subscription.subscriptionName + '.inputTransformation',
    {},
    undefined,
    async (_) => {
      const transform = transformInput.transformFunction.bind(serviceInstance, { logger, message })
      const parameterInput = await serviceInstance.wrapInSpan(
        subscription.subscriptionName + '.validateParameter',
        {},
        async (subSpan) => {
          try {
            return transformInput.transformParameterSchema.parse(msgPayload?.parameter)
          } catch (err) {
            const error = err as ZodError
            subSpan.recordException(error)
            logger.warn({ ...subSpan.spanContext() }, 'transform input validation for parameter failed:', error.message)

            subSpan.setStatus({
              code: SpanStatusCode.ERROR,
              message: 'transform input validation for parameters failed',
            })
            throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
          }
        },
      )

      const payloadInput = await serviceInstance.wrapInSpan(
        subscription.subscriptionName + '.validatePayload',
        {},
        async (subSpan) => {
          try {
            return transformInput.transformInputSchema.parse(msgPayload?.payload)
          } catch (err) {
            const error = err as ZodError
            subSpan.recordException(error)
            logger.warn({ ...subSpan.spanContext() }, 'transform input validation for payload failed:', error.message)
            subSpan.setStatus({
              code: SpanStatusCode.ERROR,
              message: 'transform input validation for payload failed',
            })
            throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
          }
        },
      )

      return await serviceInstance.wrapInSpan(
        subscription.subscriptionName + '.transformFunction',
        {},
        async (subSpan) => {
          try {
            return await transform(payloadInput, parameterInput)
          } catch (error) {
            const err = error as Error
            subSpan.recordException(err)
            subSpan.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message || 'Unable to transform input',
            })

            if (error instanceof HandledError) {
              throw error
            }
            logger.error({ err, ...subSpan.spanContext() }, 'Unable to transform input:')

            throw new UnhandledError(StatusCode.InternalServerError, 'Unable to transform input')
          }
        },
      )
    },
  )
}
