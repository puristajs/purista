import type { EBMessageType } from './EBMessageType.enum'
import type { InstanceId } from './InstanceId'
import type { PrincipalId } from './PrincipalId'
import type { TenantId } from './TenantId'

export type BrokerHeaderCustomMsg = {
  messageType: EBMessageType
  senderServiceName: string
  senderServiceVersion: string
  senderServiceTarget: string
  senderInstanceId: InstanceId
  eventName?: string
  principalId?: PrincipalId
  tenantId?: TenantId
}
