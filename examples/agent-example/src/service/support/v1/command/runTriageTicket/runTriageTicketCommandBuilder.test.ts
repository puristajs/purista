import { createCommandContextMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'

import { runTriageTicketCommandBuilder } from './runTriageTicketCommandBuilder.js'

const sandbox = createSandbox()

afterEach(() => sandbox.restore())

describe('runTriageTicketCommandBuilder', () => {
	it('invokes the mounted agent through its declared address', async () => {
		const payload = { ticketId: 'SUP-123', text: 'Payroll closes and I cannot sign in.' }
		const { context, stubs } = createCommandContextMock(runTriageTicketCommandBuilder, {
			payload,
			parameter: {},
			sandbox,
		})
		const expected = { priority: 'high' as const, reason: 'Time-sensitive account access failure.' }
		stubs.agent.Support['1'].triageTicket.run.resolves({
			sessionId: 'ticket:SUP-123',
			outcome: {
				status: 'completed',
				runId: 'run-1',
				output: expected,
			},
		})

		await expect(
			runTriageTicketCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(expected)
		expect(stubs.agent.Support['1'].triageTicket.run.calledOnceWith(payload, { sessionId: 'ticket:SUP-123' })).toBe(
			true,
		)
	})
})
