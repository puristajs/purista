import { bankingV1ServiceBuilder } from '../../bankingV1ServiceBuilder.js'
import {
	bankingV1ListTransactionsInputParameterSchema,
	bankingV1ListTransactionsInputPayloadSchema,
	bankingV1ListTransactionsOutputPayloadSchema,
} from './schema.js'

export const listTransactionsCommandBuilder = bankingV1ServiceBuilder
	.getCommandBuilder('listTransactions', 'Read one account transaction history')
	.addPayloadSchema(bankingV1ListTransactionsInputPayloadSchema)
	.addParameterSchema(bankingV1ListTransactionsInputParameterSchema)
	.addOutputSchema(bankingV1ListTransactionsOutputPayloadSchema)
	.exposeAsHttpEndpoint('GET', 'accounts/:accountId/transactions')
	.setCommandFunction(async function (context, _payload, parameter) {
		return {
			accountId: parameter.accountId,
			transactions: context.resources.transactions.list(parameter.accountId),
		}
	})
