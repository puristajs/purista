import type { CorrelationId } from './CorrelationId'
import type { EBMessageId } from './EBMessageId'
import { InstanceId } from './InstanceId'
import type { PrincipalId } from './PrincipalId'
import type { TraceId } from './TraceId'

/**
 * Default fields which are part of any purista message
 */
export type EBMessageBase = {
  id: EBMessageId
  instanceId: InstanceId
  timestamp: number
  traceId?: TraceId
  correlationId?: CorrelationId
  principalId?: PrincipalId
  eventName?: string
  otp?: string
}
