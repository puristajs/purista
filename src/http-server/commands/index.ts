import { CommandDefinition } from '../../core'
import builder from './getRoutes'

export const COMMANDS: CommandDefinition<any, any>[] = [builder.getDefinition()]
