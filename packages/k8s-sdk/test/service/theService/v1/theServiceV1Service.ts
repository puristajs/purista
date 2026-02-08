import { deleteCommandBuilder } from './command/delete/deleteCommandBuilder.js'
import { errorCommandBuilder } from './command/error/errorCommandBuilder.js'
import { patchCommandBuilder } from './command/patch/patchCommandBuilder.js'
import { pingCommandBuilder } from './command/ping/pingCommandBuilder.js'
import { postCommandBuilder } from './command/post/postCommandBuilder.js'
import { putCommandBuilder } from './command/put/putCommandBuilder.js'
import { theServiceServiceBuilder } from './theServiceServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./theServiceServiceBuilder.ts file

type CommandDefinition = Parameters<typeof theServiceServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof theServiceServiceBuilder.addSubscriptionDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	pingCommandBuilder.getDefinition(),
	postCommandBuilder.getDefinition(),
	putCommandBuilder.getDefinition(),
	patchCommandBuilder.getDefinition(),
	deleteCommandBuilder.getDefinition(),
	errorCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinition[] = []

export const theServiceV1Service = theServiceServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
