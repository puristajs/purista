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
	.exposeAsHttpEndpoint('POST', 'transactions')
	.setCommandFunction(async function (context, payload) {
		return context.resources.transactionRepository.save(payload)
	})
