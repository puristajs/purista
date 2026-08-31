import { bankingV1ServiceBuilder } from '../../bankingV1ServiceBuilder.js'
import {
	bankingV1RecordTransactionInputParameterSchema,
	bankingV1RecordTransactionInputPayloadSchema,
	bankingV1RecordTransactionOutputPayloadSchema,
} from './schema.js'

export const recordTransactionCommandBuilder = bankingV1ServiceBuilder
	.getCommandBuilder('recordTransaction', 'Record an already-posted synthetic transaction')
	.addPayloadSchema(bankingV1RecordTransactionInputPayloadSchema)
	.addParameterSchema(bankingV1RecordTransactionInputParameterSchema)
	.addOutputSchema(bankingV1RecordTransactionOutputPayloadSchema)
	.exposeAsHttpEndpoint('POST', 'transactions')
	.setCommandFunction(async function (context, payload) {
		return context.resources.transactions.record(payload)
	})
