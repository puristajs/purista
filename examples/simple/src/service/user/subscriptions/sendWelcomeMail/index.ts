import { SubscriptionDefinitionBuilder } from '@purista/core'

import { EventName } from '../../../../types'
import { UserService } from '../../UserService'

export default new SubscriptionDefinitionBuilder<UserService>(
  'sendWelcomeEmail',
  'send a welcome email to new costumers',
)
  .subscribeToEvent(EventName.NewUserSignedUp)
  .setFunction(async function ({ logger }, _payload) {
    logger.info('Hello from sendWelcomeEmail')
  })
