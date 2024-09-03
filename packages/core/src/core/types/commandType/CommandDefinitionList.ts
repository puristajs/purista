import type { Service } from '../../Service/index.js'
import type { CommandDefinition } from './CommandDefinition.js'
import type { CommandDefinitionMetadataBase } from './CommandDefinitionMetadataBase.js'

/**
 * Helper type for creating list of service commands to be passed as input to service class
 *
 * ```typescript
 * export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
 * ```
 */
export type CommandDefinitionList<S extends Service> = Promise<
	CommandDefinition<S, any, any, any, any, any, any, any, any, any, any, any, any, CommandDefinitionMetadataBase>
>[]

export type CommandDefinitionListResolved<S extends Service> = CommandDefinition<
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
	CommandDefinitionMetadataBase
>[]
