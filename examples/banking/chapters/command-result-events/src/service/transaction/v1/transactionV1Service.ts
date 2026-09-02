import { transactionV1ServiceBuilder } from './transactionV1ServiceBuilder.js'
import { recordTransactionCommandBuilder } from "./command/recordTransaction/recordTransactionCommandBuilder.js";
import { getTransactionCommandBuilder } from "./command/getTransaction/getTransactionCommandBuilder.js";
import { importLegacyTransactionCommandBuilder } from "./command/importLegacyTransaction/importLegacyTransactionCommandBuilder.js";
import { exportTransactionCommandBuilder } from "./command/exportTransaction/exportTransactionCommandBuilder.js";
import { importProviderTransactionCommandBuilder } from "./command/importProviderTransaction/importProviderTransactionCommandBuilder.js";

const commandDefinitions: Parameters<typeof transactionV1ServiceBuilder['addCommandDefinition']>[0][] = [recordTransactionCommandBuilder.getDefinition(), getTransactionCommandBuilder.getDefinition(), importLegacyTransactionCommandBuilder.getDefinition(), exportTransactionCommandBuilder.getDefinition(), importProviderTransactionCommandBuilder.getDefinition()]

const subscriptionDefinitions: Parameters<typeof transactionV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

const streamDefinitions: Parameters<typeof transactionV1ServiceBuilder['addStreamDefinition']>[0][] = []
export const transactionV1Service = transactionV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
	.addStreamDefinition(...streamDefinitions)
