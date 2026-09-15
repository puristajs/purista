import { HandledError, StatusCode } from '@purista/core'
import { canGenerateStatement } from '../../reportAccess.js'
import { reportingV1GenerateStatementQueueParameterSchema, reportingV1GenerateStatementQueuePayloadSchema } from '../../queue/generateStatement/schema.js'
import { reportingV1ServiceBuilder } from '../../reportingV1ServiceBuilder.js'
import {
	reportingV1RequestStatementInputParameterSchema,
	reportingV1RequestStatementInputPayloadSchema,
	reportingV1RequestStatementOutputPayloadSchema,
} from './schema.js'

export const requestStatementCommandBuilder = reportingV1ServiceBuilder
	.getCommandBuilder('requestStatement', 'Accept statement generation')
	.addPayloadSchema(reportingV1RequestStatementInputPayloadSchema)
	.addParameterSchema(reportingV1RequestStatementInputParameterSchema)
	.addOutputSchema(reportingV1RequestStatementOutputPayloadSchema)
	.canEnqueue(
		'generateStatement',
		reportingV1GenerateStatementQueuePayloadSchema,
		reportingV1GenerateStatementQueueParameterSchema,
	)
	.exposeAsHttpEndpoint(
		'POST', 'reports/statements', 'application/json', 'utf-8',
		'application/json', 'utf-8', { mode: 'async' },
	)
	.setBeforeGuardHooks({
		accountMayGenerateStatement: async function (context, payload) {
			const allowed = canGenerateStatement({
				tenantId: context.message.tenantId ?? '',
				principalId: context.message.principalId ?? '',
				accountId: payload.accountId,
			})
			if (!allowed) throw new HandledError(StatusCode.Forbidden, 'Statements are not allowed for this account')
		},
	})
	.setCommandFunction(async function (context, payload) {
		return context.queue.enqueue.generateStatement(payload, {}, {
			idempotencyKey: `${context.message.tenantId}:${payload.transactionId}`,
			headers: {
				'purista.tenantId': context.message.tenantId ?? '',
				'purista.principalId': context.message.principalId ?? '',
			},
		})
	})
