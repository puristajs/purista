import { describe, expect, it } from 'vitest'

import { mapToWorkflow } from './workflow'

describe('mapToWorkflow', () => {
	it('maps top-level and nested tool output envelopes', () => {
		const steps = mapToWorkflow([
			{
				version: 'purista.ai/1.0',
				messageId: 'm1',
				timestamp: '2026-03-04T00:00:00.000Z',
				actor: { service: 'support', version: '1', agent: 'run' },
				frame: {
					kind: 'tool',
					status: 'success',
					toolName: 'triage.run',
					output: [
						{
							version: 'purista.ai/1.0',
							messageId: 'm2',
							timestamp: '2026-03-04T00:00:00.100Z',
							actor: { service: 'triage', version: '1', agent: 'run' },
							frame: { kind: 'message', content: 'nested' },
						},
					],
				},
			},
		])

		expect(steps).toHaveLength(2)
		expect(steps[0]?.depth).toBe(0)
		expect(steps[1]?.depth).toBe(1)
		expect(steps[1]?.label).toContain('nested')
		expect(steps[0]?.status).toBe('success')
		expect(steps[0]?.category).toBe('ai')
	})

	it('coalesces growing message chunks and tool status updates', () => {
		const steps = mapToWorkflow([
			{
				version: 'purista.ai/1.0',
				messageId: 'm1',
				timestamp: '2026-03-04T00:00:00.000Z',
				actor: { service: 'support', version: '1', agent: 'run' },
				frame: { kind: 'message', content: 'Generating', final: false },
			},
			{
				version: 'purista.ai/1.0',
				messageId: 'm2',
				timestamp: '2026-03-04T00:00:00.010Z',
				actor: { service: 'support', version: '1', agent: 'run' },
				frame: { kind: 'message', content: 'Generating final answer', final: false },
			},
			{
				version: 'purista.ai/1.0',
				messageId: 'm3',
				timestamp: '2026-03-04T00:00:00.020Z',
				actor: { service: 'support', version: '1', agent: 'run' },
				frame: { kind: 'tool', toolName: 'support.1.lookupFaq', status: 'invoked', input: { q: 'x' } },
			},
			{
				version: 'purista.ai/1.0',
				messageId: 'm4',
				timestamp: '2026-03-04T00:00:00.030Z',
				actor: { service: 'support', version: '1', agent: 'run' },
				frame: {
					kind: 'tool',
					toolName: 'support.1.lookupFaq',
					status: 'success',
					input: { q: 'x' },
					output: { answer: 'ok' },
				},
			},
		])

		expect(steps).toHaveLength(2)
		expect(steps[0]?.type).toBe('message')
		expect(steps[0]?.label).toBe('Generating final answer')
		expect(steps[1]?.type).toBe('tool')
		expect(steps[1]?.status).toBe('success')
	})

	it('keeps one active message node per actor and replaces it after tool events', () => {
		const steps = mapToWorkflow([
			{
				version: 'purista.ai/1.0',
				messageId: 'm1',
				timestamp: '2026-03-04T00:00:00.000Z',
				actor: { service: 'support', version: '1', agent: 'run' },
				frame: { kind: 'message', content: 'Checking knowledge base...', final: false },
			},
			{
				version: 'purista.ai/1.0',
				messageId: 'm2',
				timestamp: '2026-03-04T00:00:00.010Z',
				actor: { service: 'support', version: '1', agent: 'run' },
				frame: { kind: 'tool', toolName: 'support.1.lookupFaq', status: 'invoked', input: { q: 'x' } },
			},
			{
				version: 'purista.ai/1.0',
				messageId: 'm3',
				timestamp: '2026-03-04T00:00:00.020Z',
				actor: { service: 'support', version: '1', agent: 'run' },
				frame: { kind: 'message', content: 'Generating final answer...', final: false },
			},
		])

		expect(steps).toHaveLength(2)
		expect(steps[0]?.type).toBe('message')
		expect(steps[0]?.label).toBe('Generating final answer...')
		expect(steps[1]?.type).toBe('tool')
	})
})
