import { z, ZodError } from 'zod'

import { BeforeGuardHook, CommandFunction, HandledError, ServiceClass, StatusCode, UnhandledError } from '../core'

export const getFunctionWithValidation = function <
  ServiceClassType = ServiceClass,
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
  beforeGuards: BeforeGuardHook<
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
  > = async function ({ logger, message, emit }, payload, params): Promise<MessageResultType> {
    let safePayload = payload as unknown as FunctionPayloadType
    if (inputPayloadSchema) {
      try {
        safePayload = inputPayloadSchema.parse(payload)
      } catch (err) {
        const error = err as ZodError
        logger.warn('input validation for payload failed:', error.message)
        throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
      }
    }

    let safeParams = params as unknown as FunctionParamsType
    if (inputParameterSchema) {
      try {
        safeParams = inputParameterSchema.parse(params)
      } catch (err) {
        const error = err as ZodError
        logger.warn('input validation for params failed:', error.message)
        throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
      }
    }

    if (beforeGuards.length) {
      const guards = beforeGuards.map((hook) => {
        const beforeGuard = hook.bind(this, { logger, message })
        return beforeGuard(safePayload, safeParams)
      })
      await Promise.all(guards)
    }

    const call = fn.bind(this, { logger, message, emit }, safePayload, safeParams)

    const output = await call()

    if (!outputPayloadSchema) {
      return output as unknown as MessageResultType
    }

    try {
      return outputPayloadSchema.parse(output)
    } catch (err) {
      const error = err as ZodError
      logger.error('output validation failed:', error.message)
      throw new UnhandledError(StatusCode.InternalServerError)
    }
  }
  return wrapped
}
