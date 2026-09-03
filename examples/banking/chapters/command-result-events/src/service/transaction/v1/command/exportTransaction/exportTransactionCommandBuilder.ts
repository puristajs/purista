import { HandledError, StatusCode } from '@purista/core'
import { requireAccountAction } from '../../accountAccessGuards.js'
import { transactionToCsv } from '../../transactionCsv.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import {
	transactionCsvSchema,
	transactionV1ExportTransactionInputParameterSchema,
	transactionV1ExportTransactionInputPayloadSchema,
	transactionV1ExportTransactionOutputPayloadSchema,
} from './schema.js'

export const exportTransactionCommandBuilder = transactionV1ServiceBuilder
	.getCommandBuilder('exportTransaction', 'Export one transaction as CSV')
	.addPayloadSchema(transactionV1ExportTransactionInputPayloadSchema)
	.addParameterSchema(transactionV1ExportTransactionInputParameterSchema)
	.addOutputSchema(transactionV1ExportTransactionOutputPayloadSchema)
	.setTransformOutput(
		transactionCsvSchema,
		async function (_context, result) {
			return transactionToCsv(result)
		},
		'text/csv',
		'utf-8',
	)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('GET', 'accounts/:accountId/transactions/:transactionId/export')
	.setBeforeGuardHooks({
		accountMayRead: async function (context, _payload, parameter) {
			requireAccountAction(context.resources.accountAccessPolicy, {
				accountId: parameter.accountId,
				action: 'read',
				principalId: context.message.principalId,
				tenantId: context.message.tenantId,
			})
		},
	})
	.setAfterGuardHooks({
		returnedTransactionScope: async function (context, result, _payload, parameter) {
			if (result.accountId !== parameter.accountId || result.tenantId !== context.message.tenantId) {
				throw new HandledError(StatusCode.Forbidden, 'Account action is not allowed')
			}
			requireAccountAction(context.resources.accountAccessPolicy, {
				accountId: result.accountId,
				action: 'read',
				principalId: context.message.principalId,
				tenantId: context.message.tenantId,
			})
		},
	})
	.setCommandFunction(async function (context, _payload, parameter) {
		const transaction = await context.resources.transactionRepository.findById(parameter.transactionId)
		if (!transaction) {
			throw new HandledError(StatusCode.NotFound, 'Transaction not found', {
				transactionId: parameter.transactionId,
			})
		}
		return transaction
	})
