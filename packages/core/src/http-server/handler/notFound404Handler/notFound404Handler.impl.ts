import { ErrorResponse, getErrorMessageForCode, StatusCode } from '../../../core'
import { Handler } from '../../types'

export type NotFound404HandlerOptions = {}

/**
 * It returns the default not found handler options.
 * """
 * @returns A configuration object.
 */
export const getDefaultNotFound404HandlerOptions = (): NotFound404HandlerOptions => {
  const defaultConfig = {}
  return defaultConfig
}

/**
 * Creates a handler that returns a 404 Not Found response
 * @param options - An object that contains the following properties:
 * @returns A function that returns a function.
 */
export const createNotFound404Handler = (options = getDefaultNotFound404HandlerOptions()): Handler => {
  const _config = { ...getDefaultNotFound404HandlerOptions(), ...options }

  const notFound404Handler: Handler = async function (_log, request, response, context) {
    const payload: ErrorResponse =
      request.method === 'GET'
        ? {
            status: StatusCode.NotFound,
            message: getErrorMessageForCode(StatusCode.NotFound),
            traceId: context.traceId,
          }
        : {
            status: StatusCode.MethodNotAllowed,
            message: getErrorMessageForCode(StatusCode.MethodNotAllowed),
            traceId: context.traceId,
          }

    response.statusCode = payload.status
    response.setHeader('content-type', 'application/json; charset=utf-8')
    response.setHeader('x-trace-id', context.traceId as string)
    response.end(JSON.stringify(payload))
    context.payload = payload
    context.isResponseSend = true
    return context
  }

  return notFound404Handler
}
