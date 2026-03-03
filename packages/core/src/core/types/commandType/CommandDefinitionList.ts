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
export type CommandDefinitionList<S extends ServiceClass> = Promise<
	CommandDefinition<S, any, any, any, any, any, any, any, any, any, any, any, any, any, CommandDefinitionMetadataBase>
>[]

export type CommandDefinitionListResolved<S extends ServiceClass> = CommandDefinition<
	S,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	CommandDefinitionMetadataBase
>[]
