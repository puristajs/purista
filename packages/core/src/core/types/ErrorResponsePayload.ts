import type { StatusCode } from './StatusCode.enum'
import type { TraceId } from './TraceId'

/**
 * Error message payload
 */
export type ErrorResponsePayload = {
  status: StatusCode
  message: string
  traceId?: TraceId
  data?: unknown
}
