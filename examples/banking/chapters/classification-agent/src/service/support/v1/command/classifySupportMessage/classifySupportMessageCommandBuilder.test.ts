import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { supportClassificationSessionId } from '../../requireSupportClassification.js'
import { classifySupportMessageCommandBuilder } from './classifySupportMessageCommandBuilder.js'

const sandbox = createSandbox()

afterEach(() => sandbox.restore())

describe('classifySupportMessageCommandBuilder', () => {
	it('invokes the mounted agent through its declared address', async () => {
		const payload = {
			messageId: 'MSG-123',
			text: 'I cannot sign in and payroll closes in one hour.',
		}
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
		const expected = {
			category: 'account_access' as const,
			urgency: 'urgent' as const,
			reason: 'The customer is locked out before payroll closes.',
		}
		;(stubs.agent as any).Support['1'].classify_support_message.run.resolves({
			status: 'completed',
			runId: 'run-1',
			output: expected,
		})

		await expect(
			classifySupportMessageCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(expected)
		expect(
			(stubs.agent as any).Support['1'].classify_support_message.run.calledOnceWith(payload, {
				sessionId: supportClassificationSessionId(context.message, payload.messageId),
			}),
		).toBe(true)
		expect(
			supportClassificationPolicy.canClassify.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				messageId: 'MSG-123',
			}),
		).toBe(true)
	})

	it('does not turn an interrupted outcome into a successful command result', async () => {
		const payload = { messageId: 'MSG-124', text: 'Please check my card.' }
		const { context, stubs } = createCommandContextMock(classifySupportMessageCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportClassificationPolicy: { canClassify: sandbox.stub().resolves(true) } },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		;(stubs.agent as any).Support['1'].classify_support_message.run.resolves({
			status: 'interrupted',
			runId: 'run-2',
			interrupt: { kind: 'external_wait', waitId: 'review-1' },
		})

		await expect(
			classifySupportMessageCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).rejects.toThrow('Message classification was interrupted unexpectedly.')
	})
})
