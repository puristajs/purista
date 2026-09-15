import { HandledError, StatusCode } from '@purista/core'
import { transactionV1GetTransactionInputParameterSchema, transactionV1GetTransactionInputPayloadSchema, transactionV1GetTransactionOutputPayloadSchema } from '../../../../transaction/v1/command/getTransaction/schema.js'
import { canGenerateStatement } from '../../reportAccess.js'
import { reportingV1ServiceBuilder } from '../../reportingV1ServiceBuilder.js'
import { reportingV1GenerateStatementQueuePayloadSchema } from '../../queue/generateStatement/schema.js'

export const generateStatementWorkerQueueWorkerBuilder = reportingV1ServiceBuilder
	.getQueueWorkerBuilder('generateStatement', 'Build one transaction statement')
	.setMode('continuous')
	.setMaxParallelHandlers(1)
	.canInvoke(
		'Transaction', '1', 'getTransaction',
		transactionV1GetTransactionOutputPayloadSchema,
		transactionV1GetTransactionInputPayloadSchema,
		transactionV1GetTransactionInputParameterSchema,
	)
	.setBeforeGuardHooks({
		accountStillReadable: async function (_context, message) {
			const payload = reportingV1GenerateStatementQueuePayloadSchema.parse(message.payload)
			const allowed = canGenerateStatement({
				tenantId: message.headers['purista.tenantId'] ?? '',
				principalId: message.headers['purista.principalId'] ?? '',
				accountId: payload.accountId,
			})
			if (!allowed) throw new HandledError(StatusCode.Forbidden, 'Statement access changed before processing')
		},
	})
	.setHandler(async function (context, message) {
		const payload = reportingV1GenerateStatementQueuePayloadSchema.parse(message.payload)
		try {
			const transaction = await context.service.Transaction['1'].getTransaction(
				undefined, { transactionId: payload.transactionId },
			)
			return {
				status: 'success' as const,
				output: {
					accountId: payload.accountId,
					transactionId: transaction.transactionId,
					amountCents: transaction.amountCents,
					direction: transaction.direction,
					counterparty: transaction.counterparty,
					generatedAt: new Date().toISOString(),
				},
			}
		} catch (error) {
			if (error instanceof HandledError && error.errorCode === StatusCode.NotFound) {
				return { status: 'fail' as const, reason: 'transaction_not_found', fatal: true }
			}
			return { status: 'retry' as const, reason: 'transaction_lookup_failed', delayMs: 250 }
		}
	})
