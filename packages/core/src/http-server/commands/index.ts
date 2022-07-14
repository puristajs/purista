import { CommandDefinitionList } from '../../core'
import type { HttpServerService } from '../HttpServerService.impl'
import builder from './getRoutes'

export const COMMANDS: CommandDefinitionList<HttpServerService> = [builder.getDefinition()]
