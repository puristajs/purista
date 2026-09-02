import { HandledError, StatusCode } from '@purista/core'
import { canGenerateStatement } from '../../reportAccess.js'
import { reportingV1ServiceBuilder } from '../../reportingV1ServiceBuilder.js'
import {
	dailyStatementDueEventName,
	dailyStatementOccurrenceSchema,
} from '../../schedule/dailyStatementOccurrence.js'
import {
	reportingV1TriggerDailyStatementInputParameterSchema,
	reportingV1TriggerDailyStatementInputPayloadSchema,
	reportingV1TriggerDailyStatementOutputPayloadSchema,
} from './schema.js'

export const triggerDailyStatementCommandBuilder = reportingV1ServiceBuilder
	.getCommandBuilder('triggerDailyStatement', 'Emit one daily statement occurrence')
	.addPayloadSchema(reportingV1TriggerDailyStatementInputPayloadSchema)
	.addParameterSchema(reportingV1TriggerDailyStatementInputParameterSchema)
	.addOutputSchema(reportingV1TriggerDailyStatementOutputPayloadSchema)
	.canEmit(dailyStatementDueEventName, dailyStatementOccurrenceSchema)
	.enableHttpSecurity(true)
	.exposeAsHttpEndpoint('POST', 'reports/statements/daily-trigger')
	.setBeforeGuardHooks({
		accountMayRunDailyStatement: async function (context, payload) {
			const allowed = canGenerateStatement({
				tenantId: context.message.tenantId ?? '',
				principalId: context.message.principalId ?? '',
				accountId: payload.accountId,
			})
			if (!allowed) {
				throw new HandledError(StatusCode.Forbidden, 'Daily statements are not allowed for this account')
			}
		},
	})
	.setCommandFunction(async function (context, payload) {
		await context.emit(dailyStatementDueEventName, payload)
		return { occurrenceId: payload.id }
	})
