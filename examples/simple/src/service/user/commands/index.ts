import { CommandDefinitionList } from '@purista/core'

import { UserService } from '../UserService'
import signUp from './signUp'
import testFunction from './testFunction'

export const userServiceCommands: CommandDefinitionList<UserService> = [
  signUp.getDefinition(),
  testFunction.getDefinition(),
]
