import { requireReadableAccount, requireStatementScope } from '../../../../../accountGuards.js'
import { requireIdentity } from '../../../../../identity.js'
import { bankingV1ServiceBuilder } from '../../bankingV1ServiceBuilder.js'
import {
	bankingV1ListTransactionsInputParameterSchema,
	bankingV1ListTransactionsInputPayloadSchema,
	bankingV1ListTransactionsOutputPayloadSchema,
} from './schema.js'

export const listTransactionsCommandBuilder = bankingV1ServiceBuilder
	.getCommandBuilder('listTransactions', 'Read permitted account history')
	.addPayloadSchema(bankingV1ListTransactionsInputPayloadSchema)
	.addParameterSchema(bankingV1ListTransactionsInputParameterSchema)
	.addOutputSchema(bankingV1ListTransactionsOutputPayloadSchema)
	.exposeAsHttpEndpoint('GET', 'accounts/:accountId/transactions')
	.setBeforeGuardHooks({ accountRead: requireReadableAccount })
	.setAfterGuardHooks({ statementScope: requireStatementScope })
	.setCommandFunction(async function (context, _payload, parameter) {
		const identity = requireIdentity(context.message)
		return {
			tenantId: identity.tenantId,
			accountId: parameter.accountId,
			transactions: context.resources.transactions.list(identity, parameter.accountId),
		}
	})
