import { HandledError, StatusCode } from '@purista/core'
import { analysisV1ServiceBuilder } from '../../analysisV1ServiceBuilder.js'
import {
	analysisV1SummarizeTransactionsChunkPayloadSchema,
	analysisV1SummarizeTransactionsFinalPayloadSchema,
	analysisV1SummarizeTransactionsInputParameterSchema,
	analysisV1SummarizeTransactionsInputPayloadSchema,
} from './schema.js'

export const summarizeTransactionsStreamBuilder = analysisV1ServiceBuilder
	.getStreamBuilder('summarizeTransactions', 'Stream progress while summarizing recent transactions')
	.addPayloadSchema(analysisV1SummarizeTransactionsInputPayloadSchema)
	.addParameterSchema(analysisV1SummarizeTransactionsInputParameterSchema)
	.addChunkSchema(analysisV1SummarizeTransactionsChunkPayloadSchema)
	.addFinalSchema(analysisV1SummarizeTransactionsFinalPayloadSchema)
	.exposeAsHttpStreamEndpoint('GET', 'analysis/accounts/:accountId/transactions')
	.setHttpStreamProtocol('purista-stream-v1')
	.setOpenApiSummary('Stream a recent transaction summary')
	.addOpenApiTags('analysis')
	.setBeforeGuardHooks({
		accountAccess: async function (context, _payload, parameter) {
			const allowed = await context.resources.transactionAnalysisReader.canReadAccount({
				tenantId: context.message.tenantId ?? '',
				principalId: context.message.principalId ?? '',
				accountId: parameter.accountId,
			})
			if (!allowed) {
				throw new HandledError(StatusCode.Forbidden, 'This account is not available for analysis')
			}
		},
	})
	.setStreamFunction(async function (context, _payload, parameter, writer) {
		const scope = {
			tenantId: context.message.tenantId ?? '',
			principalId: context.message.principalId ?? '',
			accountId: parameter.accountId,
		}
		const cancellation = new AbortController()
		writer.onCancel(() => cancellation.abort())
		await writer.write({ stage: 'loading', completed: 0, total: 0 })

		let rows
		try {
			rows = await context.resources.transactionAnalysisReader.listRecent(scope, 5, cancellation.signal)
		} catch (error) {
			if (writer.cancelled || cancellation.signal.aborted) return
			throw error
		}
		if (writer.cancelled) return

		let creditCents = 0
		let debitCents = 0
		for (const [index, row] of rows.entries()) {
			if (row.direction === 'credit') creditCents += row.amountCents
			else debitCents += row.amountCents
			await writer.write({ stage: 'summarizing', completed: index + 1, total: rows.length })
			if (writer.cancelled) return
		}
		const summary = {
			accountId: parameter.accountId,
			transactionCount: rows.length,
			creditCents,
			debitCents,
			netCents: creditCents - debitCents,
		}
		await writer.write({
			stage: 'complete', completed: rows.length, total: rows.length, summary,
		})
		if (writer.cancelled) return
		await writer.close(summary)
	})
