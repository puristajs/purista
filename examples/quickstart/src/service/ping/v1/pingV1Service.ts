import { pingAsyncCommandBuilder } from './command/pingAsync/pingAsyncCommandBuilder.js'
import { pingCommandBuilder } from './command/ping/pingCommandBuilder.js'
import { pingV1ServiceBuilder } from './pingV1ServiceBuilder.js'
import { pingJobQueueBuilder } from './queue/pingJob/pingJobQueueBuilder.js'
import { pingJobWorkerQueueWorkerBuilder } from './queue-worker/pingJobWorker/pingJobWorkerQueueWorkerBuilder.js'
import { logSubscriptionBuilder } from './subscription/log/logSubscriptionBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./pingServiceBuilder.ts file

type CommandDefinition = Parameters<typeof pingV1ServiceBuilder.addCommandDefinition>[number]
type SubscriptionDefinition = Parameters<typeof pingV1ServiceBuilder.addSubscriptionDefinition>[number]
type QueueDefinition = Parameters<typeof pingV1ServiceBuilder.addQueueDefinition>[number]
type QueueWorkerDefinition = Parameters<typeof pingV1ServiceBuilder.addQueueWorkerDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	pingCommandBuilder.getDefinition(),
	pingAsyncCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: SubscriptionDefinition[] = [logSubscriptionBuilder.getDefinition()]
const queueDefinitions: QueueDefinition[] = [pingJobQueueBuilder.getDefinition()]
const queueWorkerDefinitions: QueueWorkerDefinition[] = [
	pingJobWorkerQueueWorkerBuilder.getDefinition(),
]

export const pingV1Service = pingV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
	.addQueueDefinition(...queueDefinitions)
	.addQueueWorkerDefinition(...queueWorkerDefinitions)
