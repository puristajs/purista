import { SpanStatusCode } from '@opentelemetry/api'
import { z, ZodError } from 'zod'

import {
  CommandBeforeGuardHook,
  CommandFunction,
  HandledError,
  ServiceClass,
  StatusCode,
  UnhandledError,
} from '../core'

export const getCommandFunctionWithValidation = function <
  ServiceClassType extends ServiceClass,
  MessagePayloadType = unknown,
  MessageParamsType = unknown,
  MessageResultType = unknown,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = MessageResultType,
>(
  fn: CommandFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType
  >,
  inputPayloadSchema: z.ZodType<FunctionPayloadType, z.ZodTypeDef, MessagePayloadType> | undefined,
  inputParameterSchema: z.ZodType<FunctionParamsType, z.ZodTypeDef, MessageParamsType> | undefined,
  outputPayloadSchema: z.ZodType<MessageResultType, z.ZodTypeDef, FunctionResultType> | undefined,
  beforeGuards: CommandBeforeGuardHook<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    FunctionPayloadType,
    FunctionParamsType
  >[] = [],
): CommandFunction<
  ServiceClassType,
  MessagePayloadType,
  MessageParamsType,
  MessagePayloadType,
  MessageParamsType,
  MessageResultType
> {
  const wrapped: CommandFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType
  > = async function (context, payload, parameter): Promise<MessageResultType> {
    const { logger, startActiveSpan, wrapInSpan } = context
    let safePayload = payload as unknown as FunctionPayloadType
    if (inputPayloadSchema) {
      safePayload = await startActiveSpan('validatePayload', {}, undefined, async (span) => {
        try {
          return inputPayloadSchema.parse(payload)
        } catch (err) {
          const error = err as ZodError
          span.recordException(error)
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          })
          logger.warn({ ...span.spanContext() }, 'input validation for payload failed:', error.message)
          throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
        }
      })
    }

    let safeParams = parameter as unknown as FunctionParamsType
    if (inputParameterSchema) {
      safeParams = await startActiveSpan('validateParameter', {}, undefined, async (span) => {
        try {
          return inputParameterSchema.parse(parameter)
        } catch (err) {
          const error = err as ZodError
          span.recordException(error)
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          })
          logger.warn({ ...span.spanContext() }, 'input validation for parameter failed:', error.message)
          throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
        }
      })
    }

    if (beforeGuards.length) {
      await startActiveSpan('beforeGuardHooks', {}, undefined, async () => {
        const guards = beforeGuards.map((hook, index) =>
          wrapInSpan('beforeGuardHook.' + index, {}, async (_subSpan) => {
            return hook.bind(this, context)
          }),
        )
        await Promise.all(guards)
      })
    }

    const output = await startActiveSpan('functionExecution', {}, undefined, async () => {
      const call = fn.bind(this, context, safePayload, safeParams)
      return call()
    })

    if (!outputPayloadSchema) {
      return output as unknown as MessageResultType
    }

    return await startActiveSpan('outputValidation', {}, undefined, async (span) => {
      try {
        return outputPayloadSchema.parse(output)
      } catch (error) {
        const err = error as ZodError
        span.recordException(err)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        })
        logger.error({ err, ...span.spanContext() }, 'output validation failed')
        throw new UnhandledError(StatusCode.InternalServerError)
      }
    })
  }
  return wrapped
}
