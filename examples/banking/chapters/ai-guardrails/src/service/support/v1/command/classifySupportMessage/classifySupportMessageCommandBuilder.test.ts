import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { supportClassificationSessionId } from '../../requireSupportClassification.js'
import { classifySupportMessageCommandBuilder } from './classifySupportMessageCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('classifySupportMessage command', () => {
	it('invokes the guarded agent through its declared address', async () => {
		const payload = { messageId: 'MSG-300', text: 'My transfer is delayed.' }
		const supportClassificationPolicy = { canClassify: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(classifySupportMessageCommandBuilder, {
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
		const run = (stubs.agent as any).Support['1'].classify_support_message.run
		run.resolves({
			status: 'completed',
			runId: 'run-1',
			output: { category: 'transfer', urgency: 'normal', reason: 'The transfer is delayed.' },
		})

		await expect(
			classifySupportMessageCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual({ category: 'transfer', urgency: 'normal', reason: 'The transfer is delayed.' })
		expect(
			run.calledOnceWith(payload, { sessionId: supportClassificationSessionId(context.message, payload.messageId) }),
		).toBe(true)
		expect(
			supportClassificationPolicy.canClassify.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				messageId: 'MSG-300',
			}),
		).toBe(true)
	})
})
