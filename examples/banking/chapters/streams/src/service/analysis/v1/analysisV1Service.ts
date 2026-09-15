import { analysisV1ServiceBuilder } from './analysisV1ServiceBuilder.js'
import { summarizeTransactionsStreamBuilder } from "./stream/summarizeTransactions/summarizeTransactionsStreamBuilder.js";

const commandDefinitions: Parameters<typeof analysisV1ServiceBuilder['addCommandDefinition']>[0][] = []

const subscriptionDefinitions: Parameters<typeof analysisV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

const streamDefinitions: Parameters<typeof analysisV1ServiceBuilder['addStreamDefinition']>[0][] = [summarizeTransactionsStreamBuilder.getDefinition()]
export const analysisV1Service = analysisV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
	.addStreamDefinition(...streamDefinitions)
