import { SubscriptionDefinitionBuilder } from '@purista/core'

import { EventName } from '../../../../types'
import { UserService } from '../../UserService'

export default new SubscriptionDefinitionBuilder<UserService>(
  'sendWelcomeEmail',
  'send a email to new costumers',
  async function ({ logger }, _payload) {
    logger.info('Hello from sendWelcomeEmail')
  },
).subscribeToEvent(EventName.NewUserSignedUp)
