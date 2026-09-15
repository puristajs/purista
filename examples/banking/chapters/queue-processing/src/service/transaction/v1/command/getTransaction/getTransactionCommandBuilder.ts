import { HandledError, StatusCode } from '@purista/core'
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
	.exposeAsHttpEndpoint('GET', 'transactions/:transactionId')
	.setCommandFunction(async function (context, _payload, parameter) {
		const transaction = await context.resources.transactionRepository.findById(parameter.transactionId)
		if (!transaction) {
			throw new HandledError(StatusCode.NotFound, 'Transaction not found', {
				transactionId: parameter.transactionId,
			})
		}
		return transaction
	})
