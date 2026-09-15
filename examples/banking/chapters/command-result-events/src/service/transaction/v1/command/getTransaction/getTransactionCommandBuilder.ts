import { HandledError, StatusCode } from '@purista/core'
import { requireAccountAction } from '../../accountAccessGuards.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import {
	transactionV1GetTransactionInputParameterSchema,
	transactionV1GetTransactionInputPayloadSchema,
	transactionV1GetTransactionOutputPayloadSchema,
} from './schema.js'

export const getTransactionCommandBuilder = transactionV1ServiceBuilder
	.getCommandBuilder('getTransaction', 'Get a transaction by ID')
	.addPayloadSchema(transactionV1GetTransactionInputPayloadSchema)
	.addParameterSchema(transactionV1GetTransactionInputParameterSchema)
	.addOutputSchema(transactionV1GetTransactionOutputPayloadSchema)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('GET', 'accounts/:accountId/transactions/:transactionId')
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
