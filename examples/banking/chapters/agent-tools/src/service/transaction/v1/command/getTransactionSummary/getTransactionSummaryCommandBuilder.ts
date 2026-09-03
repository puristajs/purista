import { HandledError, StatusCode } from '@purista/core'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import {
	getTransactionSummaryOutputSchema,
	getTransactionSummaryParameterSchema,
	getTransactionSummaryPayloadSchema,
} from './schema.js'

export const getTransactionSummaryCommandBuilder = transactionV1ServiceBuilder
	.getCommandBuilder('getTransactionSummary', 'Read an authorized transaction summary')
	.addPayloadSchema(getTransactionSummaryPayloadSchema)
	.addParameterSchema(getTransactionSummaryParameterSchema)
	.addOutputSchema(getTransactionSummaryOutputSchema)
	.setBeforeGuardHooks({
		accountMayRead: async function (context, payload) {
			const { tenantId, principalId } = context.message
			if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
			const allowed = await context.resources.accountReadPolicy.canRead({
				tenantId,
				principalId,
				accountId: payload.accountId,
			})
			if (!allowed) throw new HandledError(StatusCode.Forbidden, 'Transaction access is not allowed')
		},
	})
	.setAfterGuardHooks({
		returnedRecordScope: async function (context, result, payload) {
			if (result.tenantId !== context.message.tenantId || result.accountId !== payload.accountId) {
				throw new HandledError(StatusCode.Forbidden, 'Transaction access is not allowed')
			}
		},
	})
	.setCommandFunction(async function (context, payload) {
		const result = await context.resources.transactionSummaryReader.getById(payload.transactionId)
		if (!result) throw new HandledError(StatusCode.NotFound, 'Transaction not found')
		return result
	})
