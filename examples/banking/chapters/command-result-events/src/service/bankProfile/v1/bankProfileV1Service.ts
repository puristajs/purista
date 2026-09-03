import { bankProfileV1ServiceBuilder } from './bankProfileV1ServiceBuilder.js'
import { getProfileCommandBuilder } from "./command/getProfile/getProfileCommandBuilder.js";

const commandDefinitions: Parameters<typeof bankProfileV1ServiceBuilder['addCommandDefinition']>[0][] = [getProfileCommandBuilder.getDefinition()]

const subscriptionDefinitions: Parameters<typeof bankProfileV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

const streamDefinitions: Parameters<typeof bankProfileV1ServiceBuilder['addStreamDefinition']>[0][] = []
export const bankProfileV1Service = bankProfileV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
	.addStreamDefinition(...streamDefinitions)
