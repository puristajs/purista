import type { EBMessage } from './EBMessage'
import type { EBMessageAddress } from './EBMessageAddress'
import type { Subscription } from './subscription'

/**
 * Event bridge interface
 * The event bridge must implement this interface.
 */
export interface EventBridge {
  readonly defaultTtl: number
  emit(message: EBMessage): Promise<void>
  subscribe(subscription: Subscription): Promise<string>
  unsubscribe(subscriptionId: string): Promise<void>

  unsubscribeService(service: EBMessageAddress): Promise<void>
}
