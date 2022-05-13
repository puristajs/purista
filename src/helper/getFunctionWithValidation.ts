import { z, ZodError } from 'zod'

import { CommandFunction, HandledError, Service, StatusCode, UnhandledError } from '../core'

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
) {
  const wrapped: CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType> = async function (
    log,
    payload,
    params,
    messsage,
  ): Promise<ResultType> {
    let safePayload: PayloadType = payload
    if (inputPayloadSchema) {
      try {
        safePayload = inputPayloadSchema.parse(payload)
      } catch (err) {
        log.warn('input validation for payload failed', err)
        throw new HandledError(StatusCode.BadRequest, undefined, (err as ZodError).issues)
      }
    }

    let safeParams: ParamsType = params
    if (inputParameterSchema) {
      try {
        safeParams = inputParameterSchema.parse(params)
      } catch (err) {
        log.warn('input validation for params failed', err)
        throw new HandledError(StatusCode.BadRequest, undefined, (err as ZodError).issues)
      }
    }

    const call = fn.bind(this, log, safePayload, safeParams, messsage)

    const output = await call()

    let safeOutput: ResultType = output
    if (outputPayloadSchema) {
      try {
        safeOutput = outputPayloadSchema.parse(output)
      } catch (err) {
        log.error('output validation failed', err)
        throw new UnhandledError(StatusCode.InternalServerError)
      }
    }

    return safeOutput
  }
  return wrapped
}
