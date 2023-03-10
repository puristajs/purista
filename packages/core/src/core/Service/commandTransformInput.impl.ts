import { SpanStatusCode } from '@opentelemetry/api'
import { ZodError } from 'zod'

import { HandledError, UnhandledError } from '../Error'
import { Command, CommandDefinition, Logger, StatusCode } from '../types'
import type { Service } from './Service.impl'

export const commandTransformInput = async <PayloadType = unknown, ParameterType = unknown>(
  serviceInstance: Service,
  logger: Logger,
  command: CommandDefinition,
  message: Readonly<Command<PayloadType, ParameterType>>,
): Promise<{ payload: Readonly<unknown>; parameter: Readonly<unknown> }> => {
  if (!command.hooks.transformInput) {
    return message.payload as { payload: Readonly<unknown>; parameter: Readonly<unknown> }
  }

  const transformInput = command.hooks.transformInput
  return await serviceInstance.startActiveSpan(
    command.commandName + '.inputTransformation',
    {},
    undefined,
    async (_) => {
      const transform = transformInput.transformFunction.bind(serviceInstance, {
        logger,
        message,
        startActiveSpan: serviceInstance.startActiveSpan.bind(serviceInstance),
        wrapInSpan: serviceInstance.wrapInSpan.bind(serviceInstance),
        getSecret: serviceInstance.secretStore.getSecret,
        setSecret: serviceInstance.secretStore.setSecret,
      })
      const parameterInput = await serviceInstance.wrapInSpan(
        command.commandName + '.validateParameter',
        {},
        async (subSpan) => {
          try {
            return transformInput.transformParameterSchema.parse(message.payload.parameter)
          } catch (error) {
            const err = error as ZodError
            subSpan.recordException(err)
            logger.warn(
              { ...subSpan.spanContext(), err },
              'transform input validation for parameter failed:',
              err.message,
            )

            subSpan.setStatus({
              code: SpanStatusCode.ERROR,
              message: 'transform input validation for parameters failed',
            })
            throw new HandledError(StatusCode.BadRequest, undefined, err.issues)
          }
        },
      )

      const payloadInput = await serviceInstance.wrapInSpan(
        command.commandName + '.validatePayload',
        {},
        async (subSpan) => {
          try {
            return transformInput.transformInputSchema.parse(message.payload.payload)
          } catch (error) {
            const err = error as ZodError
            subSpan.recordException(err)
            logger.warn(
              { ...subSpan.spanContext(), err },
              'transform input validation for payload failed:',
              err.message,
            )
            subSpan.setStatus({
              code: SpanStatusCode.ERROR,
              message: 'transform input validation for payload failed',
            })
            throw new HandledError(StatusCode.BadRequest, undefined, err.issues)
          }
        },
      )

      return await serviceInstance.wrapInSpan(command.commandName + '.transformFunction', {}, async (subSpan) => {
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
      })
    },
  )
}
