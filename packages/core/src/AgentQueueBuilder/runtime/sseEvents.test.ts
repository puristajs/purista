import { describe, expect, it } from 'vitest'

import { createProviderSseEvent } from './sseEvents.js'

const identity = {
	transportMessageId: 'message-1',
	serviceName: 'support',
	serviceVersion: '1',
	agentName: 'assistant',
	runtimeRevision: 'revision-1',
	runId: 'run-1',
	harnessSessionId: 'session-1',
}

describe('createProviderSseEvent', () => {
	it('projects safe tool chunks without arguments, results, or errors', () => {
		const started = createProviderSseEvent(
			{
				identity,
				event: {
					type: 'tool.started',
					runId: 'run-1',
					agentId: 'assistant',
					toolId: 'lookup_customer',
					callId: 'tool-1',
					input: { accountNumber: 'confidential' },
				},
			},
			1,
			'safe',
		)
		const finished = createProviderSseEvent(
			{
				identity,
				event: {
					type: 'tool.finished',
					runId: 'run-1',
					agentId: 'assistant',
					toolId: 'lookup_customer',
					callId: 'tool-1',
					output: { email: 'confidential@example.com' },
					error: { code: 'TOOL_ERROR', category: 'tool', retriable: false, message: 'confidential failure' },
				},
			},
			2,
			'safe',
		)

		expect(started).toMatchObject({
			data: { type: 'response.tool_call.started', tool_name: 'lookup_customer' },
		})
		expect(started?.data).not.toHaveProperty('input')
		expect(finished).toMatchObject({
			data: { type: 'response.tool_call.completed', tool_name: 'lookup_customer' },
		})
		expect(finished?.data).not.toHaveProperty('output')
		expect(finished?.data).not.toHaveProperty('error')
	})

	it('keeps complete tool chunks for a full trusted stream', () => {
		const chunk = createProviderSseEvent(
			{
				identity,
				event: {
					type: 'tool.started',
					runId: 'run-1',
					agentId: 'assistant',
					toolId: 'lookup_customer',
					callId: 'tool-1',
					input: { accountNumber: 'trusted' },
				},
			},
			1,
			'full',
		)

		expect(chunk).toMatchObject({
			data: {
				type: 'response.tool_call.started',
				tool_name: 'lookup_customer',
				input: { accountNumber: 'trusted' },
			},
		})
	})
})
