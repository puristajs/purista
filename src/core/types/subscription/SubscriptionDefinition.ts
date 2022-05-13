import { EBMessage } from '../EBMessage'
import { EBMessageType } from '../EBMessageType.enum'
import { Logger } from '../Logger'
import { SubscriptionId } from './SubscriptionId'

export type SubscriptionDefinition<MessageType = EBMessage> = {
  subscriptionName: string
  subscriptionDescription: string
  call(log: Logger, id: SubscriptionId, message: MessageType): Promise<void>
  sender?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }
  receiver?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }
  messageTypes?: EBMessageType[]
}
