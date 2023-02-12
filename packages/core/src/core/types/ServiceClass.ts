import type { CommandDefinition } from './commandType'
import type { EBMessage } from './EBMessage'
import type { InfoMessageType, ServiceInfoType } from './infoType'

export interface ServiceClass<ConfigType = unknown | undefined> {
  config: ConfigType
  destroy(): Promise<void>

  start(): Promise<void>

  get serviceInfo(): ServiceInfoType
  sendServiceInfo(
    infoType: InfoMessageType,
    target?: string,
    data?: Record<string, unknown>,
  ): Promise<Readonly<EBMessage>>

  registerCommand(command: CommandDefinition): void
}
