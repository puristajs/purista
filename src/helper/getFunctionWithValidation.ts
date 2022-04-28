import { z, ZodError } from 'zod'

import { CommandFunction, ErrorCode, HandledError, Service } from '../core'

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
    payload,
    params,
    messsage,
  ): Promise<ResultType> {
    let safePayload: PayloadType = payload
    if (inputPayloadSchema) {
      try {
        safePayload = inputPayloadSchema.parse(payload)
      } catch (err) {
        this.log.warn('input validation for payload failed', err)
        if (err instanceof ZodError) {
          throw new HandledError(ErrorCode.BadRequest, undefined, err.issues)
        }
        throw new HandledError(ErrorCode.InternalServerError)
      }
    }

    let safeParams: ParamsType = params
    if (inputParameterSchema) {
      try {
        safeParams = inputParameterSchema.parse(params)
      } catch (err) {
        this.log.warn('input validation for params failed', err)
        if (err instanceof ZodError) {
          throw new HandledError(ErrorCode.BadRequest, undefined, err.issues)
        }
        throw new HandledError(ErrorCode.BadRequest)
      }
    }

    const call = fn.bind(this, safePayload, safeParams, messsage)

    const output = await call()

    let safeOutput: ResultType = output
    if (outputPayloadSchema) {
      try {
        safeOutput = outputPayloadSchema.parse(output)
      } catch (err) {
        this.log.error('output validation failed', err)
        throw new HandledError(ErrorCode.InternalServerError)
      }
    }

    return safeOutput
  }
  return wrapped
}
