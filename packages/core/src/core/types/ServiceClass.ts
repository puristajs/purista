import { ServiceBaseClass } from '../Service/ServiceBaseClass'
import type { CommandDefinition } from './commandType'
import type { EBMessage } from './EBMessage'
import type { InfoMessageType, ServiceInfoType } from './infoType'

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
export abstract class ServiceClass<ConfigType = unknown | undefined> extends ServiceBaseClass {
  public abstract config: ConfigType

  abstract start(): Promise<void>

  /**
   * Register a new command (function) for this service
   *
   * @param command
   */
  protected abstract registerCommand(command: CommandDefinition): void
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
