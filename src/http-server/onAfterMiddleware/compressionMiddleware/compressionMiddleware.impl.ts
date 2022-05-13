import { getCompressionMethod, getCompressionStream } from '../../../helper'
import { Middleware } from '../../types/Middleware'

export type CompressionMiddlewareOptions = {}

/**
 * It returns an object with default values for the compression middleware options.
 * @returns A CompressionMiddlewareOptions object.
 */
export const getDefaultCompressionMiddlewareOptions = (): CompressionMiddlewareOptions => {
  const defaultConfig: CompressionMiddlewareOptions = {}
  return defaultConfig
}

/**
 * If the request method is HEAD, then the response is ended. Otherwise, the compression method is
 * determined and the compression stream is created. If the compression method is not null, then the
 * content-encoding header is set and the compression stream is piped to the response. Otherwise, the
 * response is returned
 * @param options - An object that contains the following properties:
 * @returns A middleware function.
 */
export const createCompressionMiddleware = (options = getDefaultCompressionMiddlewareOptions()): Middleware => {
  const _config = { ...getDefaultCompressionMiddlewareOptions(), ...options }

  const compressionMiddleware: Middleware = async (log, request, response, context) => {
    if (request.method === 'HEAD') {
      response.end()
      context.isResponseSend = true
    }

    if (context.isResponseSend) {
      return context
    }

    if (context.payload === undefined || context.payload === null) {
      context.payload = ''
    }

    const content = typeof context.payload === 'string' ? context.payload : JSON.stringify(context.payload)

    response.statusCode = context.statusCode

    const compressionMethod = getCompressionMethod(request.headers, content.length)

    const compressStream = getCompressionStream(compressionMethod)

    const stream = compressStream || response

    if (compressionMethod && compressStream) {
      context.headers['content-encoding'] = compressionMethod
      compressStream.pipe(response)
    }

    for (const key in context.headers) {
      response.setHeader(key, context.headers[key])
    }

    stream.end(content)

    context.isResponseSend = true

    return context
  }
  return compressionMiddleware
}
