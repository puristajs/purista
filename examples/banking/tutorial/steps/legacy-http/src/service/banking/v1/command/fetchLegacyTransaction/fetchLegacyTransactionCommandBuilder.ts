import { requireIdentity } from '../../../../../identity.js'
import { legacyTransactionSchema } from '../../../../../legacyTransaction.js'
import { bankingV1ServiceBuilder } from '../../bankingV1ServiceBuilder.js'
import {
	bankingV1ImportLegacyTransactionInputParameterSchema,
	bankingV1ImportLegacyTransactionOutputPayloadSchema,
} from '../importLegacyTransaction/schema.js'
import {
	bankingV1FetchLegacyTransactionInputParameterSchema,
	bankingV1FetchLegacyTransactionInputPayloadSchema,
	bankingV1FetchLegacyTransactionOutputPayloadSchema,
} from './schema.js'

export const fetchLegacyTransactionCommandBuilder = bankingV1ServiceBuilder
	.getCommandBuilder(
		'fetchLegacyTransaction',
		'Fetch an authorized legacy record and import it through the transform command',
	)
	.addPayloadSchema(bankingV1FetchLegacyTransactionInputPayloadSchema)
	.addParameterSchema(bankingV1FetchLegacyTransactionInputParameterSchema)
	.addOutputSchema(bankingV1FetchLegacyTransactionOutputPayloadSchema)
	.exposeAsHttpEndpoint('POST', 'accounts/:accountId/legacy-imports/:sourceId')
	.setBeforeGuardHooks({
		sourceAccess: async function (context, _payload, parameter) {
			context.resources.accountAccess.assertAllowed(requireIdentity(context.message), parameter.accountId, 'record')
		},
	})
	.canInvoke(
		'Banking',
		'1',
		'importLegacyTransaction',
		bankingV1ImportLegacyTransactionOutputPayloadSchema,
		legacyTransactionSchema,
		bankingV1ImportLegacyTransactionInputParameterSchema,
	)
	.setCommandFunction(async function (context, _payload, parameter) {
		const legacy = await context.resources.legacyBank.getBookedTransaction(
			requireIdentity(context.message),
			parameter.accountId,
			parameter.sourceId,
		)
		return context.service.Banking['1'].importLegacyTransaction(legacy, {})
	})
