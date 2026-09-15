import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { classifySupportMessageAgent } from '../../harness/agent/classifySupportMessage/classifySupportMessageAgent.js'
import { supportClassificationSessionId } from '../../requireSupportClassification.js'
import { runClassifySupportMessageCommandBuilder } from './runClassifySupportMessageCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('runClassifySupportMessageCommandBuilder', () => {
	it('uses the declared agent contract and stable session address', async () => {
		const payload = { messageId: 'message-1', text: 'My card is missing.' }
		const supportClassificationPolicy = { canClassify: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(runClassifySupportMessageCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportClassificationPolicy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		const output = { category: 'card' as const, urgency: 'urgent' as const, reason: 'The card is missing.' }
		stubs.agent.Support['1'][classifySupportMessageAgent.contract.id].run.resolves({
			sessionId: 'support-session',
			outcome: { status: 'completed', runId: 'run-1', output },
		})

		await expect(
			runClassifySupportMessageCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(output)
		expect(
			stubs.agent.Support['1'][classifySupportMessageAgent.contract.id].run.calledOnceWith(payload, {
				sessionId: supportClassificationSessionId(context.message, payload.messageId),
			}),
		).toBe(true)
	})
})
