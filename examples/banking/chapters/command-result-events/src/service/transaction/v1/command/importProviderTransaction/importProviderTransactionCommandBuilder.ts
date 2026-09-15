import { HandledError, StatusCode } from '@purista/core'
import { requireAccountAction } from '../../accountAccessGuards.js'
import { parseLegacyTransaction } from '../../legacyTransaction.js'
import { createTransactionSchema } from '../../transaction.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'
import {
	transactionV1ImportProviderTransactionInputParameterSchema,
	transactionV1ImportProviderTransactionInputPayloadSchema,
	transactionV1ImportProviderTransactionOutputPayloadSchema,
} from './schema.js'

export const importProviderTransactionCommandBuilder = transactionV1ServiceBuilder
	.getCommandBuilder('importProviderTransaction', 'Import one transaction from an external provider')
	.addPayloadSchema(transactionV1ImportProviderTransactionInputPayloadSchema)
	.addParameterSchema(transactionV1ImportProviderTransactionInputParameterSchema)
	.addOutputSchema(transactionV1ImportProviderTransactionOutputPayloadSchema)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'accounts/:accountId/transactions/provider/:sourceId/import')
	.setBeforeGuardHooks({
		accountMayImport: async function (context, _payload, parameter) {
			requireAccountAction(context.resources.accountAccessPolicy, {
				accountId: parameter.accountId,
				action: 'record',
				principalId: context.message.principalId,
				tenantId: context.message.tenantId,
			})
		},
	})
	.setCommandFunction(async function (context, _payload, parameter) {
		const { legacyProviderToken } = await context.secrets.getSecret('legacyProviderToken')
		if (!legacyProviderToken) {
			throw new HandledError(StatusCode.ServiceUnavailable, 'The transaction provider is not configured')
		}

		const record = await context.resources.legacyTransactionClient.fetchTransaction(
			parameter.sourceId,
			legacyProviderToken,
		)
		let parsed: unknown
		try {
			parsed = parseLegacyTransaction(record)
		} catch {
			throw new HandledError(StatusCode.BadGateway, 'The transaction provider returned invalid data')
		}
		const transaction = createTransactionSchema.safeParse(parsed)
		if (!transaction.success) {
			throw new HandledError(StatusCode.BadGateway, 'The transaction provider returned invalid data')
		}

		return context.resources.transactionRepository.save({
			...transaction.data,
			accountId: parameter.accountId,
			tenantId: context.message.tenantId!,
		})
	})
