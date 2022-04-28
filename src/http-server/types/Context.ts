import { TraceId } from '../../core'
import { StatusCode } from './StatusCode'

export type Context<PayloadType = unknown, ParameterType = Record<string, unknown>> = {
  isResponseSend: boolean
  traceId?: TraceId
  parameter: ParameterType
  payload: PayloadType
  statusCode: StatusCode
  headers: Record<string, string>
}
