import { SpanStatusCode } from '@opentelemetry/api'
import type { z, ZodError } from 'zod'

import type { CommandBeforeGuardHook, CommandFunction, ServiceClass } from '../core'
import { HandledError, StatusCode, UnhandledError } from '../core'

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
  beforeGuards: Record<
    string,
    CommandBeforeGuardHook<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      FunctionPayloadType,
      FunctionParamsType
    >
  > = {},
): CommandFunction<
  ServiceClassType,
  MessagePayloadType,
  MessageParamsType,
  FunctionPayloadType,
  FunctionParamsType,
  FunctionResultType
> {
  const wrapped: CommandFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType
  > = async function (context, payload, parameter): Promise<FunctionResultType> {
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

    if (Object.keys(beforeGuards).length) {
      await startActiveSpan('beforeGuardHooks', {}, undefined, async () => {
        const guards: Promise<void>[] = []

        for (const [name, hook] of Object.entries(beforeGuards)) {
          const guardPromise = wrapInSpan('beforeGuardHook.' + name, {}, async (_subSpan) => {
            return hook.bind(this, context, safePayload, safeParams)()
          })
          guards.push(guardPromise)
        }

        await Promise.all(guards)
      })
    }

    const output = await startActiveSpan('functionExecution', {}, undefined, async () => {
      const call = fn.bind(this, context, safePayload, safeParams)
      return call()
    })

    if (!outputPayloadSchema) {
      return output
    }

    return await startActiveSpan('outputValidation', {}, undefined, async (span) => {
      try {
        return outputPayloadSchema.parse(output) as any
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
