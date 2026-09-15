import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { supportCaseAnalysisOutputSchema } from '../../harness/supportCaseSchemas.js'
import { analyzeSupportCaseWorkflow } from '../../harness/workflow/analyzeSupportCase/analyzeSupportCaseWorkflow.js'
import { supportCaseSessionId } from '../../requireSupportCaseAnalysis.js'
import { runAnalyzeSupportCaseCommandBuilder } from './runAnalyzeSupportCaseCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('runAnalyzeSupportCaseCommandBuilder', () => {
	it('invokes the declared workflow address and returns its completed output', async () => {
		const payload = { caseId: 'case-1', message: 'My card is missing.' }
		const policy = { canAnalyze: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(runAnalyzeSupportCaseCommandBuilder, {
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
		const output = supportCaseAnalysisOutputSchema.parse({
			caseId: 'case-1',
			risk: { level: 'high', evidence: ['The customer reports a missing card.'] },
			response: { customerReply: 'We can help.', nextAction: 'freeze_card' },
		})
		stubs.workflow.Support['1'][analyzeSupportCaseWorkflow.contract.id].run.resolves({
			sessionId: 'support-session',
			outcome: { status: 'completed', runId: 'run-1', output },
		})

		await expect(
			runAnalyzeSupportCaseCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(output)
		expect(
			stubs.workflow.Support['1'][analyzeSupportCaseWorkflow.contract.id].run.calledOnceWith(payload, {
				sessionId: supportCaseSessionId(context.message, payload.caseId),
			}),
		).toBe(true)
	})

	it('propagates workflow failures without changing them', async () => {
		const payload = { caseId: 'case-2', message: 'Please inspect this case.' }
		const { context, stubs } = createCommandContextMock(runAnalyzeSupportCaseCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportCasePolicy: { canAnalyze: sandbox.stub().resolves(true) } },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		stubs.workflow.Support['1'][analyzeSupportCaseWorkflow.contract.id].run.rejects(
			new Error('The risk provider is unavailable.'),
		)

		await expect(
			runAnalyzeSupportCaseCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).rejects.toThrow('The risk provider is unavailable.')
	})
})
