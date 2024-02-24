import { SpanStatusCode } from '@opentelemetry/api'
import { validate } from '@typeschema/main'

import { HandledError, UnhandledError } from '../Error/index.js'
import type { Command, CommandDefinition, Logger } from '../types/index.js'
import { StatusCode } from '../types/index.js'
import type { Service } from './Service.impl.js'

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
        message,
        ...serviceInstance.getContextFunctions(logger),
      })
      const parameterInput = await serviceInstance.wrapInSpan(
        command.commandName + '.validateParameter',
        {},
        async (subSpan) => {
          const validationResult = await validate(transformInput.transformParameterSchema, message.payload.parameter)
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
        command.commandName + '.validatePayload',
        {},
        async (subSpan) => {
          const validationResult = await validate(transformInput.transformInputSchema, message.payload.payload)
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
