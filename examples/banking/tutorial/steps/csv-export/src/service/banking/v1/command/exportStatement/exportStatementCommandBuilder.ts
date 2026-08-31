import { requireReadableAccount, requireStatementScope } from '../../../../../accountGuards.js'
import { requireIdentity } from '../../../../../identity.js'
import { statementCsvSchema, toStatementCsv } from '../../../../../statementCsv.js'
import { bankingV1ServiceBuilder } from '../../bankingV1ServiceBuilder.js'
import {
	bankingV1ExportStatementInputParameterSchema,
	bankingV1ExportStatementInputPayloadSchema,
	bankingV1ExportStatementOutputPayloadSchema,
} from './schema.js'

export const exportStatementCommandBuilder = bankingV1ServiceBuilder
	.getCommandBuilder('exportStatement', 'Export authorized account history as CSV')
	.addPayloadSchema(bankingV1ExportStatementInputPayloadSchema)
	.addParameterSchema(bankingV1ExportStatementInputParameterSchema)
	.addOutputSchema(bankingV1ExportStatementOutputPayloadSchema)
	.setBeforeGuardHooks({ accountRead: requireReadableAccount })
	.setAfterGuardHooks({ statementScope: requireStatementScope })
	.setTransformOutput(
		statementCsvSchema,
		async function (_context, statement) {
			return toStatementCsv(statement)
		},
		'text/csv',
		'utf-8',
	)
	.exposeAsHttpEndpoint('GET', 'accounts/:accountId/statement.csv')
	.setCommandFunction(async function (context, _payload, parameter) {
		const identity = requireIdentity(context.message)
		return {
			tenantId: identity.tenantId,
			accountId: parameter.accountId,
			transactions: context.resources.transactions.list(identity, parameter.accountId),
		}
	})
