import { ErrorCode, ErrorResponse, getErrorMessageForCode } from '../../../core'
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

  const notFound404Handler: Handler = async function (request, response, context) {
    const payload: ErrorResponse =
      request.method === 'GET'
        ? {
            status: ErrorCode.NotFound,
            message: getErrorMessageForCode(ErrorCode.NotFound),
          }
        : {
            status: ErrorCode.MethodNotAllowed,
            message: getErrorMessageForCode(ErrorCode.MethodNotAllowed),
          }

    response.statusCode = payload.status
    response.setHeader('content-type', 'application/json; charset=utf-8')
    response.end(JSON.stringify(payload))
    context.payload = payload
    context.isResponseSend = true
    return context
  }

  return notFound404Handler
}
