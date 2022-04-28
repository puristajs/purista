import helmet from 'helmet'
import { IncomingMessage, ServerResponse } from 'http'

import { Context, Middleware } from '../../types'

export type HelmetMiddlewareOptions = {}

/**
 * It returns an object with the default values for the HelmetMiddlewareOptions
 * @returns A HelmetMiddlewareOptions object.
 */
export const getDefaultHelmetMiddlewareOptions = (): HelmetMiddlewareOptions => {
  const defaultConfig: HelmetMiddlewareOptions = {}
  return defaultConfig
}

/**
 * It creates a middleware function that runs the given middleware function.
 * @param options - The options passed to the middleware.
 * @returns A function that can be used to perform the action `apply`
 *          in the context of the library.
 */
export const createHelmetMiddleware = (options = getDefaultHelmetMiddlewareOptions()): Middleware => {
  const _config = { ...getDefaultHelmetMiddlewareOptions(), ...options }

  const runHelmet = helmet()

  const helmetMiddleware: Middleware = async function (request, response, context) {
    return new Promise<Context>((resolve, reject) => {
      runHelmet(request as unknown as IncomingMessage, response as unknown as ServerResponse, (err) => {
        if (err) {
          this.log.error(err)
          reject(err)
        } else {
          resolve(context)
        }
      })
    })
  }

  return helmetMiddleware
}
