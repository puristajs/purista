import { getUniqueId } from '../../core'
import { Context, SuccessStatusCode } from '../types'

/**
 * It creates a new context object with a traceId and a parameter object
 * @param {Logger} log - The logger instance.
 * @param {string | string[] | undefined} traceId - The traceId is a unique identifier for the request.
 * It is used to identify the request in the logs and in the logs of the downstream services.
 * @param parameter - The parameter object that will be passed to the handler.
 * @returns A context object.
 */
export const getNewContext = (traceId: string | string[] | undefined, parameter = {}): Context => {
  const tId = Array.isArray(traceId) ? traceId[0] : traceId
  return {
    isResponseSend: false,
    traceId: tId || getUniqueId(),
    parameter,
    payload: undefined,
    statusCode: SuccessStatusCode.OK,
    headers: {},
  }
}
