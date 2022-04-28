import { CorrelationId } from './CorrelationId'
import { EBMessageId } from './EBMessageId'
import { PrincipalId } from './PrincipalId'
import { TraceId } from './TraceId'

export type EBMessageBase = {
  id: EBMessageId
  traceId?: TraceId
  timestamp: number
  correlationId?: CorrelationId
  principalId?: PrincipalId
}
