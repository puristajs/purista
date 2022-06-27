import type { EBMessage } from '../EBMessage'
import type { EBMessageType } from '../EBMessageType.enum'
import type { Logger } from '../Logger'
import type { SubscriptionId } from './SubscriptionId'

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
