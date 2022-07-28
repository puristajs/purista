import { Command, CommandErrorResponse, CommandSuccessResponse } from './commandType'
import type { EBMessage } from './EBMessage'
import type { EBMessageAddress } from './EBMessageAddress'
import { EventBridgeEvents } from './EventBridgeEvents'
import { GenericEventEmitter } from './GenericEventEmitter'
import type { Subscription } from './subscription'

/**
 * Event bridge interface
 * The event bridge must implement this interface.
 */
export abstract class EventBridge extends GenericEventEmitter<EventBridgeEvents> {
  abstract readonly defaultCommandTimeout: number

  abstract start(): Promise<void>
  abstract emitMessage(
    message: Omit<EBMessage, 'id' | 'timestamp' | 'instanceId' | 'correlationId'>,
  ): Promise<Readonly<EBMessage>>

  abstract invoke<T>(
    input: Omit<Command, 'id' | 'messageType' | 'timestamp' | 'correlationId' | 'instanceId'>,
    contentType?: string,
    contentEncoding?: string,
    ttl?: number,
  ): Promise<T>

  abstract registerServiceFunction(
    address: EBMessageAddress,
    cb: (
      message: Command,
    ) => Promise<
      Readonly<Omit<CommandSuccessResponse, 'instanceId'>> | Readonly<Omit<CommandErrorResponse, 'instanceId'>>
    >,
  ): Promise<string>

  abstract unregisterServiceFunction(address: EBMessageAddress): Promise<void>

  abstract registerSubscription(subscription: Subscription, cb: (message: EBMessage) => Promise<void>): Promise<string>
  abstract unregisterSubscription(address: EBMessageAddress): Promise<void>
}
