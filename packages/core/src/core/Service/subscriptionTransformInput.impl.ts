import { SpanStatusCode } from '@opentelemetry/api'
import { validate } from '@typeschema/main'

import { HandledError, UnhandledError } from '../Error/index.js'
import type { EBMessage, Logger, SubscriptionDefinition } from '../types/index.js'
import { isCommand, StatusCode } from '../types/index.js'
import type { Service } from './Service.impl.js'

export const subscriptionTransformInput = async (
  serviceInstance: Service,
  logger: Logger,
  subscription: SubscriptionDefinition,
  message: Readonly<EBMessage>,
) => {
  let msgPayload: { payload: unknown; parameter: unknown }

  if (isCommand(message)) {
    msgPayload = message.payload
  } else {
    msgPayload = { payload: message.payload, parameter: undefined }
  }

  if (!subscription.hooks.transformInput) {
    return msgPayload as Readonly<{ payload: Readonly<unknown>; parameter: Readonly<unknown> }>
  }

  const transformInput = subscription.hooks.transformInput
  return await serviceInstance.startActiveSpan(
    subscription.subscriptionName + '.inputTransformation',
    {},
    undefined,
    async (_) => {
      const transform = transformInput.transformFunction.bind(serviceInstance, {
        message,
        ...serviceInstance.getContextFunctions(logger),
      })
      const parameterInput = await serviceInstance.wrapInSpan(
        subscription.subscriptionName + '.validateParameter',
        {},
        async (subSpan) => {
          const validationResult = await validate(transformInput.transformParameterSchema, msgPayload?.parameter)
          if (validationResult.success) {
            return validationResult.data as Readonly<typeof validationResult.data>
          }
          const err = new HandledError(StatusCode.BadRequest, undefined, validationResult.issues)
          subSpan.recordException(err)
          logger.warn(
            { ...subSpan.spanContext(), err },
            'transform input validation for parameters failed:',
            err.message,
          )

          subSpan.setStatus({
            code: SpanStatusCode.ERROR,
            message: 'transform input validation for parameters failed',
          })
          throw err
        },
      )

      const payloadInput = await serviceInstance.wrapInSpan(
        subscription.subscriptionName + '.validatePayload',
        {},
        async (subSpan) => {
          const validationResult = await validate(transformInput.transformInputSchema, msgPayload?.payload)
          if (validationResult.success) {
            return validationResult.data as Readonly<typeof validationResult.data>
          }
          const err = new HandledError(StatusCode.BadRequest, undefined, validationResult.issues)
          subSpan.recordException(err)
          logger.warn({ ...subSpan.spanContext(), err }, 'transform input validation for payload failed:', err.message)

          subSpan.setStatus({
            code: SpanStatusCode.ERROR,
            message: 'transform input validation for payload failed',
          })
          throw err
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
