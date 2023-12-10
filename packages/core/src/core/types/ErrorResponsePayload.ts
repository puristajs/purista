import type { StatusCode } from './StatusCode.enum.js'
import type { TraceId } from './TraceId.js'

/**
 * Error message payload
 */
export type ErrorResponsePayload = {
  /** the error status code */
  status: StatusCode
  /** a human readable error message */
  message: string
  /** the trace if of the request */
  traceId?: TraceId
  /** addition data */
  data?: unknown
}
