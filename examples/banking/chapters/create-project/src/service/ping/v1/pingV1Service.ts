import { pingV1ServiceBuilder } from './pingV1ServiceBuilder.js'
import { pingCommandBuilder } from "./command/ping/pingCommandBuilder.js";

const commandDefinitions: Parameters<typeof pingV1ServiceBuilder['addCommandDefinition']>[0][] = [pingCommandBuilder.getDefinition()]

const subscriptionDefinitions: Parameters<typeof pingV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

const streamDefinitions: Parameters<typeof pingV1ServiceBuilder['addStreamDefinition']>[0][] = []
export const pingV1Service = pingV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
	.addStreamDefinition(...streamDefinitions)
