import { HandledError, StatusCode } from '@purista/core'
import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import {
	transactionV1RecordTransactionInputParameterSchema,
	transactionV1RecordTransactionInputPayloadSchema,
	transactionV1RecordTransactionOutputPayloadSchema,
} from './schema.js'

export const recordTransactionCommandBuilder = transactionV1ServiceBuilder
	.getCommandBuilder('recordTransaction', 'Record one synthetic transaction')
	.addPayloadSchema(transactionV1RecordTransactionInputPayloadSchema)
	.addParameterSchema(transactionV1RecordTransactionInputParameterSchema)
	.addOutputSchema(transactionV1RecordTransactionOutputPayloadSchema)
	.setSuccessEventName(ServiceEvent.TransactionRecordedV1)
	.setCommandFunction(async function (context, payload, parameter) {
		if (!context.message.tenantId) {
			throw new HandledError(StatusCode.Unauthorized, 'Tenant metadata is required')
		}
		return context.resources.transactionRepository.save({
			...payload,
			accountId: parameter.accountId,
			tenantId: context.message.tenantId,
		})
	})
