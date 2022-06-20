import { CommandDefinition } from '../../core'
import type { HttpServerService } from '../HttpServerService.impl'
import builder from './getRoutes'

export const COMMANDS: CommandDefinition<unknown, HttpServerService, any, Record<string, unknown>, unknown>[] = [
  builder.getDefinition(),
]
