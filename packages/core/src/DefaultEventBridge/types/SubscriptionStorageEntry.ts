import type { CustomMessage } from '../../core/types/CustomMessage.js'
import type { EBMessage } from '../../core/types/EBMessage.js'
import type { EBMessageType } from '../../core/types/EBMessageType.enum.js'
import type { InstanceId } from '../../core/types/InstanceId.js'
import type { PrincipalId } from '../../core/types/PrincipalId.js'

import type { TenantId } from '../../core/types/TenantId.js'

export type SubscriptionStorageEntry = {
	isMatchingMessageType(input: EBMessageType): boolean
	isMatchingSenderServiceName(input?: string): boolean
	isMatchingSenderServiceVersion(input?: string): boolean
	isMatchingSenderServiceTarget(input?: string): boolean
	isMatchingSenderInstanceId(input?: InstanceId): boolean
	isMatchingReceiverServiceName(input?: string): boolean
	isMatchingReceiverServiceVersion(input?: string): boolean
	isMatchingReceiverServiceTarget(input?: string): boolean
	isMatchingReceiverInstanceId(input?: InstanceId): boolean
	isMatchingEventName(input?: string): boolean
	isMatchingPrincipalId(input?: PrincipalId): boolean
	isMatchingTenantId(input?: TenantId): boolean
	emitEventName?: string
	cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>
}
