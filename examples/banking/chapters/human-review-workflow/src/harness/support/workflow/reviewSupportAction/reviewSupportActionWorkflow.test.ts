import { InMemoryHarnessStorage } from '@purista/harness'
import { describe, expect, it } from 'vitest'
import { supportHarness } from '../../supportHarness.js'

describe('reviewSupportActionWorkflow', () => {
	it('returns an external wait and resumes the same durable run', async () => {
		const storage = new InMemoryHarnessStorage()
		const runtime = await supportHarness.getInstance({ models: {}, storage })
		const input = {
			waitId: 'wait-1',
			deadline: new Date(Date.now() + 60_000).toISOString(),
			actionDigest: 'a'.repeat(64),
			definitionVersion: 'support-card-freeze-v1' as const,
		}

		try {
			const session = await runtime.getSession('review-session')
			const waiting = await session.workflows.review_support_action.run(input, {
				durable: { runId: 'review-run' },
			})
			expect(waiting).toMatchObject({
				status: 'interrupted',
				interrupt: { type: 'external-wait', id: 'wait-1' },
			})
			await storage.signalWait({ waitId: 'wait-1', eventId: 'decision-1', outcome: 'approved' })
			const resumed = await session.workflows.review_support_action.run(input, {
				durable: { runId: 'review-run' },
			})
			expect(resumed).toMatchObject({ status: 'completed', output: { status: 'approved' } })
		} finally {
			await runtime.shutdown()
		}
	})
})
