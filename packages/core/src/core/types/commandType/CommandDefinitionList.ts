import { Service } from '../../Service'
import { CommandDefinition } from './CommandDefinition'

/**
 * Helper type for creating list of service commands to be passed as input to service class
 *
 * ```typescript
 * export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
 * ```
 */
export type CommandDefinitionList<ServiceType = Service> = CommandDefinition<
  Record<string, unknown>,
  ServiceType,
  any,
  any,
  any
>[]
