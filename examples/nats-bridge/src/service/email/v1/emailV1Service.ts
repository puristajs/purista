import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { emailV1ServiceBuilder } from './emailV1ServiceBuilder'
import { sendWelcomeEmailSubscriptionBuilder } from './subscription/sendWelcomeEmail'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./emailServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = []

const subscriptionDefinitions: SubscriptionDefinitionList<any> = [sendWelcomeEmailSubscriptionBuilder.getDefinition()]

export const emailV1Service = emailV1ServiceBuilder
  .addCommandDefinition(...commandDefinitions)
  .addSubscriptionDefinition(...subscriptionDefinitions)
