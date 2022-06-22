import { CommandDefinition } from '@purista/core'

import { UserService } from '../UserService'
import signUp from './signUp'

export const userServiceCommands: CommandDefinition<Record<string, unknown>, UserService, any, any, any>[] = [
  signUp.getDefinition(),
]
