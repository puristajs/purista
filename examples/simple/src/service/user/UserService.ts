import { userSignUpBuilder } from './commands/signUp'
import { sendWelcomeMail } from './subscriptions/sendWelcomeMail'
import { UserServiceBuilder } from './UserServiceBuilder'

export const UserService = UserServiceBuilder.addFunctionDefinition(
  userSignUpBuilder.getDefinition(),
).addSubscriptionDefinition(sendWelcomeMail.getDefinition())
