import { requirePostingAccess } from '../../../../../accountGuards.js'
import { fromLegacyTransaction, legacyTransactionSchema } from '../../../../../legacyTransaction.js'
import { bankingV1ServiceBuilder } from '../../bankingV1ServiceBuilder.js'
import {
	bankingV1RecordTransactionInputParameterSchema,
	bankingV1RecordTransactionInputPayloadSchema,
	bankingV1RecordTransactionOutputPayloadSchema,
} from '../recordTransaction/schema.js'
import {
	bankingV1ImportLegacyTransactionInputParameterSchema,
	bankingV1ImportLegacyTransactionInputPayloadSchema,
	bankingV1ImportLegacyTransactionOutputPayloadSchema,
} from './schema.js'

export const importLegacyTransactionCommandBuilder = bankingV1ServiceBuilder
	.getCommandBuilder('importLegacyTransaction', 'Import a supported legacy transaction through the posting command')
	.addPayloadSchema(bankingV1ImportLegacyTransactionInputPayloadSchema)
	.addParameterSchema(bankingV1ImportLegacyTransactionInputParameterSchema)
	.addOutputSchema(bankingV1ImportLegacyTransactionOutputPayloadSchema)
	.exposeAsHttpEndpoint('POST', 'legacy-transactions')
	.setTransformInput(
		legacyTransactionSchema,
		bankingV1ImportLegacyTransactionInputParameterSchema,
		async function (_context, payload, parameter) {
			return { payload: fromLegacyTransaction(payload), parameter }
		},
	)
	.setBeforeGuardHooks({ postingAccess: requirePostingAccess })
	.canInvoke(
		'Banking',
		'1',
		'recordTransaction',
		bankingV1RecordTransactionOutputPayloadSchema,
		bankingV1RecordTransactionInputPayloadSchema,
		bankingV1RecordTransactionInputParameterSchema,
	)
	.setCommandFunction(async function (context, payload, parameter) {
		return context.service.Banking['1'].recordTransaction(payload, parameter)
	})
