import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { answerProcedureQuestionAgent } from '../../harness/agent/answerProcedureQuestion/answerProcedureQuestionAgent.js'
import { supportProcedureSessionId } from '../../requireSupportProcedureAccess.js'
import { runAnswerProcedureQuestionCommandBuilder } from './runAnswerProcedureQuestionCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('runAnswerProcedureQuestionCommandBuilder', () => {
	it('addresses the mounted agent with a collision-safe session id', async () => {
		const payload = { caseId: 'case-104', question: 'How long can a transfer stay pending?' }
		const policy = { canAnswer: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(runAnswerProcedureQuestionCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportProcedurePolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		const sessionId = supportProcedureSessionId(context.message, payload.caseId)
		stubs.agent.Support['1'][answerProcedureQuestionAgent.contract.id].run.resolves({
			sessionId,
			outcome: {
				status: 'completed',
				runId: 'run-1',
				output: { answer: 'Up to two business days.', method: 'pending_transfer' },
			},
		})

		await expect(
			runAnswerProcedureQuestionCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual({
			answer: 'Up to two business days.',
			method: 'pending_transfer',
		})
		expect(
			stubs.agent.Support['1'][answerProcedureQuestionAgent.contract.id].run.calledOnceWith(payload, {
				sessionId,
			}),
		).toBe(true)
		expect(policy.canAnswer.calledOnce).toBe(true)
	})

	it('keeps delimiter-bearing trusted identity components distinct', () => {
		expect(supportProcedureSessionId({ tenantId: 'tenant:a', principalId: 'principal' }, 'case')).not.toBe(
			supportProcedureSessionId({ tenantId: 'tenant', principalId: 'a:principal' }, 'case'),
		)
	})
})
