import type { EBMessageType } from './EBMessageType.enum.js'
import type { InstanceId } from './InstanceId.js'
import type { PrincipalId } from './PrincipalId.js'
import type { TenantId } from './TenantId.js'

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
