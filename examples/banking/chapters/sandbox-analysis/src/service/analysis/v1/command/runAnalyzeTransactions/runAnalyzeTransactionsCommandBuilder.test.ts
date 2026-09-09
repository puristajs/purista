import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { analyzeTransactionsAgent } from '../../harness/agent/analyzeTransactions/analyzeTransactionsAgent.js'
import { transactionAnalysisSessionId } from '../../requireTransactionAnalysis.js'
import { runAnalyzeTransactionsCommandBuilder } from './runAnalyzeTransactionsCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('runAnalyzeTransactionsCommandBuilder', () => {
	it('authorizes the analysis and invokes the declared agent address', async () => {
		const payload = {
			analysisId: 'analysis-1',
			transactions: [{ id: 'tx-1', amount: 1_250, country: 'DE' }],
		}
		const policy = { canRun: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(runAnalyzeTransactionsCommandBuilder, {
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
		const agentRun = stubs.agent.Analysis['1'][analyzeTransactionsAgent.contract.id].run
		agentRun.resolves({
			sessionId: 'analysis-session',
			outcome: { status: 'completed', runId: 'run-1', output },
		})

		await expect(
			runAnalyzeTransactionsCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(output)
		expect(
			policy.canRun.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-analyst',
				analysisId: 'analysis-1',
			}),
		).toBe(true)
		expect(
			agentRun.calledOnceWith(payload, {
				sessionId: transactionAnalysisSessionId(
					{ tenantId: 'tenant-example', principalId: 'principal-analyst' },
					payload.analysisId,
				),
			}),
		).toBe(true)
	})

	it('keeps delimiter-like identity values distinct', () => {
		expect(transactionAnalysisSessionId({ tenantId: 'tenant:a', principalId: 'principal' }, 'case')).not.toEqual(
			transactionAnalysisSessionId({ tenantId: 'tenant', principalId: 'a:principal' }, 'case'),
		)
	})

	it('denies in the wrapper guard before invoking the agent', async () => {
		const payload = {
			analysisId: 'analysis-denied',
			transactions: [{ id: 'tx-1', amount: 1_250, country: 'DE' }],
		}
		const policy = { canRun: sandbox.stub().resolves(false) }
		const { context, stubs } = createCommandContextMock(runAnalyzeTransactionsCommandBuilder, {
			payload,
			parameter: {},
			resources: { analysisPolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-denied',
			payload: { payload, parameter: {} },
		})

		await expect(
			runAnalyzeTransactionsCommandBuilder.getBeforeGuardHook('analysisAccess').call({} as never, context, payload, {}),
		).rejects.toMatchObject({ errorCode: 403 })
		expect(policy.canRun.calledOnce).toBe(true)
		expect(stubs.agent.Analysis['1'][analyzeTransactionsAgent.contract.id].run.called).toBe(false)
	})
})
