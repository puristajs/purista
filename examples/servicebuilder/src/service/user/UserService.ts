import { userSignUpBuilder } from './commands/signUp'
import { testFunction } from './commands/testFunction'
import { sendWelcomeMail } from './subscriptions/sendWelcomeMail'
import { UserServiceBuilder } from './UserServiceBuilder'

export const UserService = UserServiceBuilder.addFunctionDefinition(userSignUpBuilder.getDefinition())
  .addFunctionDefinition(testFunction.getDefinition())
  .addSubscriptionDefinition(sendWelcomeMail.getDefinition())
