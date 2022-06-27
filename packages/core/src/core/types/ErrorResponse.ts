import type { StatusCode } from './StatusCode.enum'
import type { TraceId } from './TraceId'

export type ErrorResponse = {
  status: StatusCode
  message: string
  traceId?: TraceId
  data?: unknown
}
