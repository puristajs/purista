import { pingCommandBuilder } from './command/ping/pingCommandBuilder.js'
import { pongCommandBuilder } from './command/pong/pongCommandBuilder.js'
import { pingPongV1ServiceBuilder } from './pingPongV1ServiceBuilder.js'

const commandDefinitions: Parameters<(typeof pingPongV1ServiceBuilder)['addCommandDefinition']>[0][] = [
	pingCommandBuilder.getDefinition(),
	pongCommandBuilder.getDefinition(),
]

const subscriptionDefinitions: Parameters<(typeof pingPongV1ServiceBuilder)['addSubscriptionDefinition']>[0][] = []
export const pingPongV1Service = pingPongV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
