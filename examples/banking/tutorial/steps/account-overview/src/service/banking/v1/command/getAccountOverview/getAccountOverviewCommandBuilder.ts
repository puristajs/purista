import { requireReadableAccount } from '../../../../../accountGuards.js'
import { bankingV1ServiceBuilder } from '../../bankingV1ServiceBuilder.js'
import {
	bankingV1ListTransactionsInputParameterSchema,
	bankingV1ListTransactionsInputPayloadSchema,
	bankingV1ListTransactionsOutputPayloadSchema,
} from '../listTransactions/schema.js'
import {
	bankingV1GetAccountOverviewInputParameterSchema,
	bankingV1GetAccountOverviewInputPayloadSchema,
	bankingV1GetAccountOverviewOutputPayloadSchema,
} from './schema.js'

export const getAccountOverviewCommandBuilder = bankingV1ServiceBuilder
	.getCommandBuilder('getAccountOverview', 'Read an account summary through a guarded command')
	.addPayloadSchema(bankingV1GetAccountOverviewInputPayloadSchema)
	.addParameterSchema(bankingV1GetAccountOverviewInputParameterSchema)
	.addOutputSchema(bankingV1GetAccountOverviewOutputPayloadSchema)
	.exposeAsHttpEndpoint('GET', 'accounts/:accountId/overview')
	.canInvoke(
		'Banking',
		'1',
		'listTransactions',
		bankingV1ListTransactionsOutputPayloadSchema,
		bankingV1ListTransactionsInputPayloadSchema,
		bankingV1ListTransactionsInputParameterSchema,
	)
	.setBeforeGuardHooks({ accountRead: requireReadableAccount })
	.setCommandFunction(async function (context, _payload, parameter) {
		const statement = await context.service.Banking['1'].listTransactions(undefined, parameter)
		return {
			tenantId: statement.tenantId,
			accountId: statement.accountId,
			transactionCount: statement.transactions.length,
		}
	})
