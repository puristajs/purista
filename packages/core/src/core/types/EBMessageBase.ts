import type { ContentType } from './ContentType.js'
import type { CorrelationId } from './CorrelationId.js'
import type { EBMessageId } from './EBMessageId.js'
import type { EBMessageSenderAddress } from './EBMessageSenderAddress.js'
import type { PrincipalId } from './PrincipalId.js'
import type { TenantId } from './TenantId.js'
import type { TraceId } from './TraceId.js'

/**
 * Default fields which are part of any purista message
 */
export type EBMessageBase = {
  /** global unique id of message */
  id: EBMessageId
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
  /** principal id */
  tenantId?: TenantId
  /** event name for this message */
  eventName?: string
  /** stringified Opentelemetry parent trace id */
  otp?: string
  sender: EBMessageSenderAddress
}
