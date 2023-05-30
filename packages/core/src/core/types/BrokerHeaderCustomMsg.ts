import { EBMessageType } from './EBMessageType.enum'
import { InstanceId } from './InstanceId'

export type BrokerHeaderCustomMsg = {
  messageType: EBMessageType
  senderServiceName: string
  senderServiceVersion: string
  senderServiceTarget: string
  senderInstanceId: InstanceId
  eventName?: string
  principalId?: string
}
