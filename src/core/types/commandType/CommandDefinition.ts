import { CommandFunction } from './CommandFunction'

/**
 * The definition for a command provided by some service.
 */
export type CommandDefinition<MetadataType = Record<string, unknown>, CommandFunctionType = CommandFunction> = {
  commandName: string
  commandDescription: string
  metadata: MetadataType
  call: CommandFunctionType
}
