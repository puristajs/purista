import { Handler, Middleware } from '../../types'

export type ResponseToJsonMiddlewareOptions = {}

/**
 * It returns a default configuration for the ResponseToJsonMiddlewareOptions.
 * @returns A middleware function.
 */
export const getDefaultResponseToJsonMiddlewareOptions = (): ResponseToJsonMiddlewareOptions => {
  const defaultConfig: ResponseToJsonMiddlewareOptions = {}
  return defaultConfig
}

/**
 * If the response is not a JSON string, then convert it to a JSON string
 * @param options - An object that contains the following properties:
 * @returns A middleware function.
 */
export const createResponseToJsonMiddleware = (options = getDefaultResponseToJsonMiddlewareOptions()): Middleware => {
  const _config = { ...getDefaultResponseToJsonMiddlewareOptions(), ...options }

  const responseToJsonMiddleware: Handler = async (_log, _request, _response, context) => {
    if (!context.payload || context.payload === '') {
      if (context.statusCode === 200) {
        // set correct http status code if we have an empty body
        context.statusCode = 204
      }
      return context
    }

    if (context.headers['content-type']?.startsWith('application/json')) {
      if (typeof context.payload !== 'string') {
        context.payload = JSON.stringify(context.payload)
      }
    }

    return context
  }
  return responseToJsonMiddleware
}
