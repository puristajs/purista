import { EmailServiceBuilder } from './EmailServiceBuilder'
import { sendWelcomeMail } from './subscriptions/sendWelcomeMail'

export const EmailService = EmailServiceBuilder.addSubscriptionDefinition(sendWelcomeMail.getDefinition())
