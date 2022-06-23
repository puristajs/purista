import { z, ZodError } from 'zod'

import { BeforeGuardHook, CommandFunction, HandledError, Service, StatusCode, UnhandledError } from '../core'

export const getFunctionWithValidation = function <
  ServiceClassType extends Service,
  PayloadType = unknown,
  ParamsType = unknown,
  ResultType = unknown,
>(
  fn: CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType>,
  inputPayloadSchema: z.ZodType<PayloadType> | undefined,
  inputParameterSchema: z.ZodType<ParamsType> | undefined,
  outputPayloadSchema: z.ZodType<ResultType> | undefined,
  beforeGuards: BeforeGuardHook<ServiceClassType, PayloadType, ParamsType>[] = [],
) {
  const wrapped: CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType> = async function (
    log,
    payload,
    params,
    message,
  ): Promise<ResultType> {
    let safePayload: PayloadType = payload
    if (inputPayloadSchema) {
      try {
        safePayload = inputPayloadSchema.parse(payload)
      } catch (err) {
        const error = err as ZodError
        log.warn('input validation for payload failed:', error.message)
        throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
      }
    }

    let safeParams: ParamsType = params
    if (inputParameterSchema) {
      try {
        safeParams = inputParameterSchema.parse(params)
      } catch (err) {
        const error = err as ZodError
        log.warn('input validation for params failed:', error.message)
        throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
      }
    }

    for (const hook of beforeGuards) {
      const beforeGuard = hook.bind(this, log)
      await beforeGuard(safePayload, safeParams, message)
    }

    const call = fn.bind(this, log, safePayload, safeParams, message)

    const output = await call()

    let safeOutput: ResultType = output
    if (outputPayloadSchema) {
      try {
        safeOutput = outputPayloadSchema.parse(output)
      } catch (err) {
        const error = err as ZodError
        log.error('output validation failed:', error.message)
        throw new UnhandledError(StatusCode.InternalServerError)
      }
    }

    return safeOutput
  }
  return wrapped
}
