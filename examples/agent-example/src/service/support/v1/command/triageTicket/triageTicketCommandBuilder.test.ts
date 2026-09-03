import { createCommandContextMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'

import { triageTicketCommandBuilder } from './triageTicketCommandBuilder.js'

const sandbox = createSandbox()

afterEach(() => sandbox.restore())

describe('triageTicketCommandBuilder', () => {
	it('invokes the mounted agent through its declared address', async () => {
		const payload = { ticketId: 'SUP-123', text: 'Payroll closes and I cannot sign in.' }
		const { context, stubs } = createCommandContextMock(triageTicketCommandBuilder, {
			payload,
			parameter: {},
			sandbox,
		})
		const expected = { priority: 'high' as const, reason: 'Time-sensitive account access failure.' }
		;(stubs.agent as any).Support['1'].triage_ticket.run.resolves({
			status: 'completed',
			runId: 'run-1',
			output: expected,
		})

		await expect(
			triageTicketCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(expected)
		expect((stubs.agent as any).Support['1'].triage_ticket.run.calledOnceWith(payload)).toBe(true)
	})
})
