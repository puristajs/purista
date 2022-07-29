import { userSignUpBuilder } from './commands/signUp'
import { UserServiceBuilder } from './UserServiceBuilder'

export const UserService = UserServiceBuilder.addFunctionDefinition(userSignUpBuilder.getDefinition())
