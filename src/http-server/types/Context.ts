import { StatusCode, TraceId } from '../../core'

export type Context<PayloadType = unknown, ParameterType = Record<string, unknown>> = {
  isResponseSend: boolean
  traceId?: TraceId
  parameter: ParameterType
  payload: PayloadType
  statusCode: StatusCode
  headers: Record<string, string | string[]>
}
