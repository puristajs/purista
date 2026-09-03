import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { localDurableExecution, ModelError } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { supportResolutionHarness } from './supportResolutionWorkflow.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

describe('supportResolutionHarness', () => {
	it('replays a completed step from SQLite after a runtime restart', async () => {
		const classificationProvider = new FakeModelProvider({ strict: true })
		const resolutionProvider = new FakeModelProvider({ strict: true })
		const resolutionObject = vi.spyOn(resolutionProvider, 'object')
		resolutionObject
			.mockRejectedValueOnce(
				new ModelError('The planning provider is temporarily unavailable.', {
					provider: 'fake',
					model: 'resolution-fake',
					method: 'object',
					reason: 'provider_unavailable',
				}),
			)
			.mockRejectedValueOnce(
				new ModelError('The planning provider is temporarily unavailable.', {
					provider: 'fake',
					model: 'resolution-fake',
					method: 'object',
					reason: 'provider_unavailable',
				}),
			)
		classificationProvider.enqueueObject({
			object: { category: 'card', urgency: 'urgent' },
			usage,
			finishReason: 'stop',
		})
		const directory = await mkdtemp(join(tmpdir(), 'purista-multi-step-'))
		const firstLocal = localDurableExecution({ root: directory })
		const firstRuntime = await supportResolutionHarness.getInstance({
			storage: firstLocal.storage,
			sandbox: firstLocal.sandbox,
			workspace: firstLocal.workspace,
			models: {
				classification_model: { provider: classificationProvider, model: 'classification-fake' },
				resolution_model: { provider: resolutionProvider, model: 'resolution-fake' },
			},
		})
		const input = { caseId: 'case-1', message: 'My card was stolen.' }

		try {
			const firstSession = await firstRuntime.getSession('tenant-example:principal-alex:case-1')
			await expect(
				firstSession.workflows.resolve_support_case.run(input, { durable: { runId: 'support-run-1' } }),
			).rejects.toBeDefined()
			expect(classificationProvider.requests).toHaveLength(1)
			expect(resolutionObject).toHaveBeenCalledTimes(2)
			await firstRuntime.shutdown()

			resolutionProvider.enqueueObject({
				object: { summary: 'Verify the caller and secure the card.', nextAction: 'freeze_card' },
				usage,
				finishReason: 'stop',
			})
			const secondLocal = localDurableExecution({ root: directory })
			const secondRuntime = await supportResolutionHarness.getInstance({
				storage: secondLocal.storage,
				sandbox: secondLocal.sandbox,
				workspace: secondLocal.workspace,
				models: {
					classification_model: { provider: classificationProvider, model: 'classification-fake' },
					resolution_model: { provider: resolutionProvider, model: 'resolution-fake' },
				},
			})
			try {
				const secondSession = await secondRuntime.getSession('tenant-example:principal-alex:case-1')
				await expect(
					secondSession.workflows.resolve_support_case.run(input, { durable: { runId: 'support-run-1' } }),
				).resolves.toMatchObject({
					status: 'completed',
					output: { caseId: 'case-1', classification: { category: 'card', urgency: 'urgent' } },
				})
				expect(classificationProvider.requests).toHaveLength(1)
				expect(resolutionObject).toHaveBeenCalledTimes(3)
				classificationProvider.assertExhausted()
				resolutionProvider.assertExhausted()
			} finally {
				await secondRuntime.shutdown()
			}
		} finally {
			await rm(directory, { recursive: true, force: true })
		}
	})
})
