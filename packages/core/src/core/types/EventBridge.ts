import { Command } from './commandType'
import type { EBMessage } from './EBMessage'
import type { EBMessageAddress } from './EBMessageAddress'
import type { Subscription } from './subscription'

/**
 * Event bridge interface
 * The event bridge must implement this interface.
 */
export interface EventBridge {
  readonly defaultTtl: number
  emit(message: Omit<EBMessage, 'id' | 'timestamp' | 'instanceId' | 'correlationId'>): Promise<Readonly<EBMessage>>

  invoke<T>(
    input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'instanceId'>,
    ttl?: number,
  ): Promise<T>

  registerServiceFunction(address: EBMessageAddress, cb: (message: Command) => void): Promise<string>
  unregisterServiceFunction(address: EBMessageAddress): Promise<void>

  registerSubscription(subscription: Subscription, cb: (message: EBMessage) => Promise<void>): Promise<string>
  unregisterSubscription(address: EBMessageAddress): Promise<void>
}
