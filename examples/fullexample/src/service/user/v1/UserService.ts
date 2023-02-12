import { userSignUpBuilder } from './commands/signUp'
import { testFunctionBuilder } from './commands/testFunction'
import { UserServiceBuilder } from './UserServiceBuilder'

export const UserService = UserServiceBuilder.addFunctionDefinition(
  userSignUpBuilder.getDefinition(),
).addFunctionDefinition(testFunctionBuilder.getDefinition())
