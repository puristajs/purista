import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { transactionAnalysisSessionId } from '../../requireTransactionAnalysis.js'
import { analyzeTransactionsCommandBuilder } from './analyzeTransactionsCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('analyzeTransactionsCommandBuilder', () => {
	it('authorizes the analysis and invokes the declared agent address', async () => {
		const payload = {
			analysisId: 'analysis-1',
			transactions: [{ id: 'tx-1', amount: 1_250, country: 'DE' }],
		}
		const policy = { canRun: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(analyzeTransactionsCommandBuilder, {
			payload,
			parameter: {},
			resources: { analysisPolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-analyst',
			payload: { payload, parameter: {} },
		})
		const output = {
			analysisId: 'analysis-1',
			flaggedTransactionIds: ['tx-1'],
			summary: 'One high-value transaction was flagged for human review.',
		}
		;(stubs.agent as any).Analysis['1'].analyze_transactions.run.resolves({
			status: 'completed',
			runId: 'run-1',
			output,
		})

		await expect(
			analyzeTransactionsCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(output)
		expect(
			policy.canRun.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-analyst',
				analysisId: 'analysis-1',
			}),
		).toBe(true)
		expect(
			(stubs.agent as any).Analysis['1'].analyze_transactions.run.calledOnceWith(payload, {
				sessionId: transactionAnalysisSessionId(context.message, payload.analysisId),
			}),
		).toBe(true)
	})
})
