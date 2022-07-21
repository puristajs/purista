import { EBMessage } from '../EBMessage'
import { EBMessageAddress } from '../EBMessageAddress'
import type { Logger } from '../Logger'
import { ServiceClass } from '../ServiceClass'

export type SubscriptionContext<MessageType = EBMessage> = {
  logger: Logger
  message: MessageType
  emit: <Service extends ServiceClass, Payload = unknown>(
    this: Service,
    eventName: string,
    payload?: Payload,
  ) => Promise<void>
  invoke: <Service extends ServiceClass>(
    this: Service,
    address: EBMessageAddress,
    payload: unknown,
    parameter: unknown,
  ) => Promise<unknown>
}
