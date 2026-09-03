import { createCommandContextMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { classifySupportMessageCommandBuilder } from './classifySupportMessageCommandBuilder.js'

const sandbox = createSandbox()

afterEach(() => sandbox.restore())

describe('classifySupportMessageCommandBuilder', () => {
	it('invokes the mounted agent through its declared address', async () => {
		const payload = {
			messageId: 'MSG-123',
			text: 'I cannot sign in and payroll closes in one hour.',
		}
		const { context, stubs } = createCommandContextMock(classifySupportMessageCommandBuilder, {
			payload,
			parameter: {},
			sandbox,
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
				sessionId: 'support-message:MSG-123',
			}),
		).toBe(true)
	})

	it('does not turn an interrupted outcome into a successful command result', async () => {
		const payload = { messageId: 'MSG-124', text: 'Please check my card.' }
		const { context, stubs } = createCommandContextMock(classifySupportMessageCommandBuilder, {
			payload,
			parameter: {},
			sandbox,
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
