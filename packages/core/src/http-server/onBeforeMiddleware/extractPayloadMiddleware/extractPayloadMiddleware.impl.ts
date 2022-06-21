import formidable from 'formidable'
import { IncomingMessage } from 'http'

import { Middleware } from '../../types'

export type ExtractPayloadMiddlewareOptions = {
  uploadDir?: string
}

/**
 * It returns an object with default values for the ExtractPayloadMiddlewareOptions.
 * @returns An object with the default configuration for the extract payload middleware.
 */
export const getDefaultExtractPayloadMiddlewareOptions = (): ExtractPayloadMiddlewareOptions => {
  const defaultConfig: ExtractPayloadMiddlewareOptions = {
    uploadDir: undefined,
  }
  return defaultConfig
}

/**
 * It takes in an object with options and returns a middleware function
 * @param options - An object with the following keys:
 * @returns A middleware function that will extract the payload from the request.
 */
export const createExtractPayloadMiddleware = (options = getDefaultExtractPayloadMiddlewareOptions()): Middleware => {
  const config = { ...getDefaultExtractPayloadMiddlewareOptions(), ...options }

  const extractPayloadMiddleware: Middleware = async function (log, request, _response, context) {
    const method = request.method
    // if it is some
    if (!['POST', 'PATCH', 'PUT'].includes(method)) {
      return context
    }

    if (request.headers['content-type']?.includes('multipart/form-data')) {
      const form = formidable({ multiples: true, uploadDir: config.uploadDir })
      return new Promise((resolve, reject) => {
        form.parse(request as unknown as IncomingMessage, (err, fields, files) => {
          if (err) {
            log.error(err)
            reject(err)
            return
          }

          context.parameter.files = files
          context.payload = fields

          resolve(context)
        })
      })
    }

    const prom = new Promise<string>((resolve, reject) => {
      let data = ''
      request.on('data', (incoming) => {
        data += incoming
      })

      request.on('aborted', (hadError, code) => {
        if (hadError) {
          log.error('aborted', { hadError, code })
        }
      })

      request.on('end', () => {
        resolve(data)
      })

      request.on('error', (err) => {
        log.error('error getting payload', err)
        reject(err)
      })
    })

    const payload = await prom
    context.payload = payload.trim()
    return context
  }

  return extractPayloadMiddleware
}
