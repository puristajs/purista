import type { CommandDefinition } from './commandType'
import { EBMessage } from './EBMessage'
import type { EventBridge } from './EventBridge'
import { GenericEventEmitter } from './GenericEventEmitter'
import type { InfoMessageType, ServiceInfoType } from './infoType'
import type { ServiceEvents } from './ServiceEvents'

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
export abstract class ServiceClass<ConfigType = unknown | undefined> extends GenericEventEmitter<ServiceEvents> {
  /**
   * General service info
   * Service name, service version and some human readable description
   */
  protected abstract readonly info: ServiceInfoType

  public abstract config: ConfigType

  /**
   * The event bridge instance
   */
  protected abstract eventBridge: EventBridge

  abstract start(): Promise<void>

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
  sendServiceInfo(
    infoType: InfoMessageType,
    target?: string,
    data?: Record<string, unknown>,
  ): Promise<Readonly<EBMessage>>
}
