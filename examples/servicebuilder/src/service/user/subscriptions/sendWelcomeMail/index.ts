import { EventName } from '../../../../types'
import { UserServiceBuilder } from '../../UserServiceBuilder'

export const sendWelcomeMailBuilder = UserServiceBuilder.getSubscriptionBuilder(
  'sendWelcomeEmail',
  'send a welcome email to new costumers',
)
  .subscribeToEvent(EventName.NewUserSignedUp)
  .setFunction(async function ({ logger }, _payload) {
    logger.info('Hello from sendWelcomeEmail')
  })
