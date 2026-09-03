import { requireAccountAction } from '../../accountAccessGuards.js'
import { parseLegacyTransaction } from '../../legacyTransaction.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import {
	legacyTransactionTextSchema,
	transactionV1ImportLegacyTransactionInputParameterSchema,
	transactionV1ImportLegacyTransactionInputPayloadSchema,
	transactionV1ImportLegacyTransactionOutputPayloadSchema,
} from './schema.js'

export const importLegacyTransactionCommandBuilder = transactionV1ServiceBuilder
	.getCommandBuilder('importLegacyTransaction', 'Import one legacy text transaction')
	.addPayloadSchema(transactionV1ImportLegacyTransactionInputPayloadSchema)
	.addParameterSchema(transactionV1ImportLegacyTransactionInputParameterSchema)
	.addOutputSchema(transactionV1ImportLegacyTransactionOutputPayloadSchema)
	.setTransformInput(
		legacyTransactionTextSchema,
		transactionV1ImportLegacyTransactionInputParameterSchema,
		async function (_context, record, parameter) {
			return { payload: parseLegacyTransaction(record), parameter }
		},
		'text/plain',
		'utf-8',
	)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'accounts/:accountId/transactions/import')
	.setBeforeGuardHooks({
		accountMayRecord: async function (context, _payload, parameter) {
			requireAccountAction(context.resources.accountAccessPolicy, {
				accountId: parameter.accountId,
				action: 'record',
				principalId: context.message.principalId,
				tenantId: context.message.tenantId,
			})
		},
	})
	.setCommandFunction(async function (context, payload, parameter) {
		return context.resources.transactionRepository.save({
			...payload,
			accountId: parameter.accountId,
			tenantId: context.message.tenantId!,
		})
	})
