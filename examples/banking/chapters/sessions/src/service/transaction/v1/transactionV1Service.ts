import { transactionV1ServiceBuilder } from './transactionV1ServiceBuilder.js'
import { recordTransactionCommandBuilder } from "./command/recordTransaction/recordTransactionCommandBuilder.js";
import { getTransactionCommandBuilder } from "./command/getTransaction/getTransactionCommandBuilder.js";

const commandDefinitions: Parameters<typeof transactionV1ServiceBuilder['addCommandDefinition']>[0][] = [recordTransactionCommandBuilder.getDefinition(), getTransactionCommandBuilder.getDefinition()]

const subscriptionDefinitions: Parameters<typeof transactionV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

const streamDefinitions: Parameters<typeof transactionV1ServiceBuilder['addStreamDefinition']>[0][] = []
export const transactionV1Service = transactionV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
	.addStreamDefinition(...streamDefinitions)
