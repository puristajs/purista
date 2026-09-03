import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { supportQuestionSessionId } from '../../requireSupportQuestion.js'
import { answerTransactionQuestionCommandBuilder } from './answerTransactionQuestionCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('answerTransactionQuestion command', () => {
	it('invokes the mounted agent through its declared PURISTA address', async () => {
		const payload = {
			questionId: 'question-1',
			accountId: 'account-operating',
			transactionId: 'tx-100',
			question: 'What is the status?',
		}
		const { context, stubs } = createCommandContextMock(answerTransactionQuestionCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportQuestionPolicy: { canAsk: sandbox.stub().resolves(true) } },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		const run = (stubs.agent as any).Support['1'].answer_transaction_question.run
		run.resolves({
			status: 'completed',
			runId: 'run-1',
			output: { answer: 'It is pending.', transactionIds: ['tx-100'] },
		})

		await expect(
			answerTransactionQuestionCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual({ answer: 'It is pending.', transactionIds: ['tx-100'] })
		expect(
			run.calledOnceWith(payload, { sessionId: supportQuestionSessionId(context.message, payload.questionId) }),
		).toBe(true)
	})
})
