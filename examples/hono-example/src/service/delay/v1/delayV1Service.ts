import type { CommandDefinitionList, SubscriptionDefinitionList } from '@purista/core'

import { fooBarCommandBuilder } from './command/fooBar/fooBarCommandBuilder.js'
import { delayV1ServiceBuilder } from './delayV1ServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./delayServiceBuilder.ts file

const commandDefinitions: CommandDefinitionList<any> = [fooBarCommandBuilder.getDefinition()]

const subscriptionDefinitions: SubscriptionDefinitionList<any> = []

export const delayV1Service = delayV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
