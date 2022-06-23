import { CommandDefinitionList } from '@purista/core'

import { UserService } from '../UserService'
import signUp from './signUp'

export const userServiceCommands: CommandDefinitionList<UserService> = [signUp.getDefinition()]
