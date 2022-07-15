import type { CorrelationId } from './CorrelationId'
import type { EBMessageId } from './EBMessageId'
import { InstanceId } from './InstanceId'
import type { PrincipalId } from './PrincipalId'
import type { TraceId } from './TraceId'

export type EBMessageBase = {
  id: EBMessageId
  instanceId: InstanceId
  traceId?: TraceId
  timestamp: number
  correlationId?: CorrelationId
  principalId?: PrincipalId
  eventName?: string
}
