import { EventName } from '../../../../../types'
import { EmailServiceBuilder } from '../../EmailServiceBuilder'

export const sendWelcomeMail = EmailServiceBuilder.getSubscriptionBuilder(
  'sendWelcomeEmail',
  'send a welcome email to new costumers',
)
  .subscribeToEvent(EventName.NewUserSignedUp)
  .setFunction(async function ({ logger }, _payload) {
    logger.info('Hello from sendWelcomeEmail')
  })
