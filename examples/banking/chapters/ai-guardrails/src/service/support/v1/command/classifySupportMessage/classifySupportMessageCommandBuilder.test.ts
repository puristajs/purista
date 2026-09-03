import { createCommandContextMock } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { classifySupportMessageCommandBuilder } from './classifySupportMessageCommandBuilder.js'

describe('classifySupportMessage command', () => {
	it('invokes the guarded agent through its declared address', async () => {
		const payload = { messageId: 'MSG-300', text: 'My transfer is delayed.' }
		const { context, stubs } = createCommandContextMock(classifySupportMessageCommandBuilder, {
			payload,
			parameter: {},
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
		expect(run.calledOnceWith(payload, { sessionId: 'support-message:MSG-300' })).toBe(true)
	})
})
