import { Middleware } from '../../types'

export type RequestBodyToJsonMiddlewareOptions = {}

/**
 * It returns a default configuration for the RequestBodyToJsonMiddlewareOptions.
 * @returns A RequestBodyToJsonMiddlewareOptions object.
 */
export const getDefaultRequestBodyToJsonMiddlewareOptions = (): RequestBodyToJsonMiddlewareOptions => {
  const defaultConfig: RequestBodyToJsonMiddlewareOptions = {}
  return defaultConfig
}

/**
 * The function takes in a configuration object and returns a middleware
 * @param options - An object containing the following properties:
 * @returns The return value of the function is the return value of the function.
 */
export const createRequestBodyToJsonMiddleware = (
  options = getDefaultRequestBodyToJsonMiddlewareOptions(),
): Middleware => {
  const _config = { ...getDefaultRequestBodyToJsonMiddlewareOptions(), ...options }

  const requestBodyToJsonMiddleware: Middleware = async function (request, response, context) {
    const method = request.method
    // if it is some
    if (
      !['POST', 'PATCH', 'PUT'].includes(method) ||
      context.payload === undefined ||
      context.payload === null ||
      context.payload === ''
    ) {
      return context
    }

    try {
      context.payload = JSON.parse(context.payload as string)
    } catch (error) {
      this.log.warn('failed to convert to json', error)
      // TODO: add
      throw new Error('bad request')
    }
    return context
  }
  return requestBodyToJsonMiddleware
}
