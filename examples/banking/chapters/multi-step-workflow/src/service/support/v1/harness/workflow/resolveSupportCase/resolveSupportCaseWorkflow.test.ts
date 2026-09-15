import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { localDurableExecution } from '@purista/harness'
import { FakeModelProvider, objectReply } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { supportHarness } from '../../supportHarness.js'
import { selectHandlingLane } from './resolveSupportCaseWorkflow.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

describe('resolveSupportCaseWorkflow', () => {
	it('selects a typed handling lane before planning', () => {
		expect(selectHandlingLane({ urgency: 'urgent' })).toBe('priority')
		expect(selectHandlingLane({ urgency: 'normal' })).toBe('standard')
	})

	it('replays a completed durable run after a runtime and storage restart', async () => {
		const classificationProvider = new FakeModelProvider({ strict: true })
		const resolutionProvider = new FakeModelProvider({ strict: true })
		classificationProvider.enqueueObject(
			objectReply({ category: 'card', urgency: 'urgent' }, { usage, finishReason: 'stop' }),
		)
		resolutionProvider.enqueueObject(
			objectReply(
				{ summary: 'Verify the caller and secure the card.', nextAction: 'freeze_card' },
				{ usage, finishReason: 'stop' },
			),
		)
		const directory = await mkdtemp(join(tmpdir(), 'purista-multi-step-'))
		const input = { caseId: 'case-1', message: 'My card was stolen.' }
		try {
			const firstLocal = localDurableExecution({ root: directory })
			const firstRuntime = await supportHarness.getInstance({
				storage: firstLocal.storage,
				models: {
					classification: { provider: classificationProvider, model: 'classification-fake' },
					planning: { provider: resolutionProvider, model: 'resolution-fake' },
				},
			})
			const firstSession = await firstRuntime.getSession('tenant-example:principal-alex:case-1')
			await expect(
				firstSession.workflows.resolveSupportCase.run(input, { durable: { runId: 'support-run-1' } }),
			).resolves.toMatchObject({ status: 'completed' })
			expect(classificationProvider.requests).toHaveLength(1)
			expect(resolutionProvider.requests).toHaveLength(1)
			await firstSession.release()
			await firstRuntime.close()

			const secondLocal = localDurableExecution({ root: directory })
			const secondRuntime = await supportHarness.getInstance({
				storage: secondLocal.storage,
				models: {
					classification: { provider: classificationProvider, model: 'classification-fake' },
					planning: { provider: resolutionProvider, model: 'resolution-fake' },
				},
			})
			const secondSession = await secondRuntime.getSession('tenant-example:principal-alex:case-1')
			await expect(
				secondSession.workflows.resolveSupportCase.run(input, { durable: { runId: 'support-run-1' } }),
			).resolves.toMatchObject({
				status: 'completed',
				output: { caseId: 'case-1', classification: { category: 'card', urgency: 'urgent' } },
			})
			expect(classificationProvider.requests).toHaveLength(1)
			expect(resolutionProvider.requests).toHaveLength(1)
			classificationProvider.assertExhausted()
			resolutionProvider.assertExhausted()
			await secondSession.release()
			await secondRuntime.close()
		} finally {
			await rm(directory, { recursive: true, force: true })
		}
	})
})
