import type { Command, CommandDefinition, CommandResponse } from './commandType'
import type { EventBridge } from './EventBridge'
import { GenericEventEmitter } from './GenericEventEmitter'
import type { InfoMessageType, ServiceInfoType } from './infoType'
import type { ServiceEvents } from './ServiceEvents'
import type { SubscriptionDefinition, SubscriptionId } from './subscription'

/**
 * Abstract base service class which should be extended by the base service class.
 * The base class should provide basic functions to use the event bridge.
 *
 * Every service should extends the base class and only implement logic used in this service.
 *
 * ```typescript
 * class MyBaseService extends Service {
 *
 *   constructor() {
 *     super()
 *   }
 *   ...
 * }
 * ```
 */
export abstract class ServiceClass extends GenericEventEmitter<ServiceEvents> {
  /**
   * General service info
   * Service name, service version and some human readable description
   */
  protected abstract readonly info: ServiceInfoType

  /**
   * The event bridge instance
   */
  protected abstract eventBridge: EventBridge

  /**
   * Invoke a service over event bridge and expect some result from called service
   * Used for service(-function) to service(-function) communication
   * @param input
   * @param ttl timeout in ms
   * @returns Promise<CommandErrorResponse | CommandSuccessResponse>
   */
  protected abstract invoke(
    input: Omit<Command, 'id' | 'sender' | 'messageType'>,
    ttl: number,
  ): Promise<CommandResponse>

  /**
   * Send subscription request to event bridge
   * Creates a new subscription
   * @param subscription
   * @returns Promise SubscriptionId
   */
  protected abstract subscribe(subscription: SubscriptionDefinition): Promise<SubscriptionId>

  /**
   * Register a new command (function) for this service
   *
   * @param command
   */
  protected abstract registerCommand(command: CommandDefinition): void

  /**
   * Shut down the service
   */
  abstract destroy(): Promise<void>
}

export interface IServiceClass {
  destroy(): Promise<void>

  start(): Promise<void>

  get serviceInfo(): ServiceInfoType

  invoke<T>(
    input: Omit<Command, 'id' | 'sender' | 'messageType' | 'timestamp' | 'correlationId'>,
    ttl: number,
    originalCommand?: Partial<Command>,
  ): Promise<T>

  sendServiceInfo(infoType: InfoMessageType, target?: string, data?: Record<string, unknown>): Promise<void>
}
