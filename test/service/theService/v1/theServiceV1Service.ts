import { fooCommandBuilder } from './command/foo/fooCommandBuilder.js'
import { invokeFooCommandBuilder } from './command/invokeFoo/invokeFooCommandBuilder.js'
import { invokeFooFailedCommandBuilder } from './command/invokeFooFailed/invokeFooFailedCommandBuilder.js'
import { pingCommandBuilder } from './command/ping/pingCommandBuilder.js'
import { theServiceServiceBuilder } from './theServiceServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./theServiceServiceBuilder.ts file

type CommandDefinition = Parameters<typeof theServiceServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof theServiceServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	pingCommandBuilder.getDefinition(),
	fooCommandBuilder.getDefinition(),
	invokeFooCommandBuilder.getDefinition(),
	invokeFooFailedCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinition[] = []

export const theServiceV1Service = theServiceServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
