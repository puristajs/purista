import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { supportClassificationSessionId } from '../../requireSupportClassification.js'
import { classifySupportMessageCommandBuilder } from './classifySupportMessageCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('classifySupportMessageCommandBuilder', () => {
	it('authorizes the message and invokes the evaluated agent address', async () => {
		const payload = { messageId: 'message-1', text: 'My card is missing.' }
		const policy = { canClassify: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(classifySupportMessageCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportClassificationPolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		const output = { category: 'card' as const, urgency: 'urgent' as const, reason: 'The card is missing.' }
		;(stubs.agent as any).Support['1'].classify_support_message.run.resolves({
			status: 'completed',
			runId: 'run-1',
			output,
		})

		await expect(
			classifySupportMessageCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(output)
		expect(
			policy.canClassify.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				messageId: 'message-1',
			}),
		).toBe(true)
		expect(
			(stubs.agent as any).Support['1'].classify_support_message.run.calledOnceWith(payload, {
				sessionId: supportClassificationSessionId(context.message, payload.messageId),
			}),
		).toBe(true)
	})
})
