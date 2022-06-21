import { CommandDefinition } from '../../core'
// import type { HttpServerService } from '../HttpServerService.impl'
import builder from './getRoutes'

export const COMMANDS: CommandDefinition<Record<string, unknown>, any, any, Record<string, unknown>, unknown>[] = [
  builder.getDefinition(),
]
