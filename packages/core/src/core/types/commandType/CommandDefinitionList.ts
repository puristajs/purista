import type { ServiceClass } from '../ServiceClass'
import type { CommandDefinition } from './CommandDefinition'

/**
 * Helper type for creating list of service commands to be passed as input to service class
 *
 * ```typescript
 * export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
 * ```
 */
export type CommandDefinitionList<ServiceClassType extends ServiceClass> = CommandDefinition<
  ServiceClassType,
  Record<string, unknown>,
  any,
  any,
  any
>[]
