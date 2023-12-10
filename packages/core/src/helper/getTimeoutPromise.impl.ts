import { StatusCode, UnhandledError } from '../core/index.js'

/**
 *
 * @param fn the promise which should get a timeout
 * @param ttl the timeout in ms @default 30000
 * @returns
 */
export const getTimeoutPromise = <T>(fn: Promise<T>, ttl = 30000): Promise<T> => {
  let timeout: ReturnType<typeof setTimeout>
  const ttlPromise = new Promise<never>((_resolve, reject) => {
    timeout = setTimeout(() => {
      const err = new UnhandledError(StatusCode.GatewayTimeout, 'invocation timed out')
      clearTimeout(timeout)
      reject(err)
    }, ttl)
  })

  return Promise.race([fn, ttlPromise])
}
