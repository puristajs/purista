import { requireAccountAction } from '../../accountAccessGuards.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import {
	transactionV1RecordTransactionInputParameterSchema,
	transactionV1RecordTransactionInputPayloadSchema,
	transactionV1RecordTransactionOutputPayloadSchema,
} from './schema.js'

export const recordTransactionCommandBuilder = transactionV1ServiceBuilder
	.getCommandBuilder('recordTransaction', 'Record a synthetic transaction')
	.addPayloadSchema(transactionV1RecordTransactionInputPayloadSchema)
	.addParameterSchema(transactionV1RecordTransactionInputParameterSchema)
	.addOutputSchema(transactionV1RecordTransactionOutputPayloadSchema)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'accounts/:accountId/transactions')
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
