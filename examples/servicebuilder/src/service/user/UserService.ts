import { userSignUpBuilder } from './commands/signUp'
import { testFunctionBuilder } from './commands/testFunction'
import { sendWelcomeMailBuilder } from './subscriptions/sendWelcomeMail'
import { UserServiceBuilder } from './UserServiceBuilder'

export const UserService = UserServiceBuilder.addFunctionDefinition(userSignUpBuilder.getDefinition())
  .addFunctionDefinition(testFunctionBuilder.getDefinition())
  .addSubscriptionDefinition(sendWelcomeMailBuilder.getDefinition())
