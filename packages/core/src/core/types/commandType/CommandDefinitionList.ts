import type { ServiceClass } from '../ServiceClass.js'
import type { CommandDefinition } from './CommandDefinition.js'
import type { CommandDefinitionMetadataBase } from './CommandDefinitionMetadataBase.js'

/**
 * Helper type for creating list of service commands to be passed as input to service class
 *
 * ```typescript
 * export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
 * ```
 */
export type CommandDefinitionList<ServiceClassType extends ServiceClass> = Promise<
  CommandDefinition<ServiceClassType, CommandDefinitionMetadataBase, any, any, any, any, any, any, any, any>
>[]

export type CommandDefinitionListResolved<ServiceClassType extends ServiceClass> = CommandDefinition<
  ServiceClassType,
  CommandDefinitionMetadataBase,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>[]
