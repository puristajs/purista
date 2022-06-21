import { StatusCode, TraceId } from '../types'
import { UnhandledError } from '../UnhandledError.impl'

export const getTimeoutPromise = (ttl: number, traceId: TraceId): Promise<never> =>
  // eslint-disable-next-line promise/param-names
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new UnhandledError(StatusCode.GatewayTimeout, 'invocation timed out', undefined, traceId))
    }, ttl)
  })
