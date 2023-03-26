import type { StatusCode } from './StatusCode.enum'
import type { TraceId } from './TraceId'

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
