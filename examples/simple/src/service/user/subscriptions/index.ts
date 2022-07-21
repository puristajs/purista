import { SubscriptionDefinitionList } from '@purista/core'

import { UserService } from '../UserService'
import sendWelcomeMail from './sendWelcomeMail'

export const userServiceSubscriptions: SubscriptionDefinitionList<UserService> = [sendWelcomeMail.getDefinition()]
