import { EBMessageType } from './EBMessageType.enum'
import { InstanceId } from './InstanceId'
import { PrincipalId } from './PrincipalId'
import { TenantId } from './TenantId'

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
