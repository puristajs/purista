import { ContentType } from './ContentType'
import type { CorrelationId } from './CorrelationId'
import type { EBMessageId } from './EBMessageId'
import { InstanceId } from './InstanceId'
import type { PrincipalId } from './PrincipalId'
import type { TraceId } from './TraceId'

/**
 * Default fields which are part of any purista message
 */
export type EBMessageBase = {
  /** global unique id of message */
  id: EBMessageId
  /** instance id of eventbridge which was creating the message */
  instanceId: InstanceId
  /** timestamp of message creation time */
  timestamp: number
  /** content type of message payload */
  contentType: ContentType
  /** content encoding of message payload */
  contentEncoding: string
  /** trace id of message */
  traceId?: TraceId
  /** correlation id to know which command response referrs to which command */
  correlationId?: CorrelationId
  /** principal id */
  principalId?: PrincipalId
  /** event name for this message */
  eventName?: string
  /** stringified Opentelemetry parent trace id */
  otp?: string
}
