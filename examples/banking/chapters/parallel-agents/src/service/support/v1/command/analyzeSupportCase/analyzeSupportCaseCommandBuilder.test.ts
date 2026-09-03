import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { analyzeSupportCaseCommandBuilder } from './analyzeSupportCaseCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('analyzeSupportCaseCommandBuilder', () => {
	it('authorizes the case and invokes the declared workflow address', async () => {
		const payload = { caseId: 'case-1', message: 'My card is missing.' }
		const policy = { canAnalyze: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(analyzeSupportCaseCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportCasePolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		const output = {
			caseId: 'case-1',
			risk: { level: 'high' as const, evidence: ['The customer reports a missing card.'] },
			response: { customerReply: 'We can help.', nextAction: 'freeze_card' as const },
		}
		;(stubs.workflow as any).Support['1'].analyze_support_case.run.resolves({
			status: 'completed',
			runId: 'run-1',
			output,
		})

		await expect(
			analyzeSupportCaseCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(output)
		expect(
			policy.canAnalyze.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				caseId: 'case-1',
			}),
		).toBe(true)
		expect(
			(stubs.workflow as any).Support['1'].analyze_support_case.run.calledOnceWith(payload, {
				sessionId: 'support-case:tenant-example:principal-alex:case-1',
			}),
		).toBe(true)
	})
})
