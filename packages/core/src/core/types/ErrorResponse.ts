import { StatusCode } from './StatusCode.enum'
import { TraceId } from './TraceId'

export type ErrorResponse = {
  status: StatusCode
  message: string
  traceId?: TraceId
  data?: unknown
}
