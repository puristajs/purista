import { createAgentTestHarness, createScriptedHarnessModel } from '@purista/core'
import { InMemoryHarnessStorage } from '@purista/harness'
import { describe, expect, it } from 'vitest'

import { IncidentRepository } from '../../../../../resource/incidentRepository.js'
import {
	InMemoryRollbackReviewRepository,
	rollbackActionDigest,
} from '../../../../../resource/rollbackReviewRepository.js'
import { reviewRollbackAgentBuilder } from './reviewRollbackAgentBuilder.js'

const action = {
	reviewId: 'review-42',
	incidentId: 'INC-2026-042',
	changeId: 'CHG-8821',
	targetRevision: 1,
	requestedBy: 'incident-commander',
	expiresAt: '2030-01-01T00:00:00.000Z',
} as const

describe('reviewRollbackAgentBuilder', () => {
	it('suspends, accepts one idempotent application decision, and resumes the same durable run', async () => {
		const storage = new InMemoryHarnessStorage()
		const reviews = new InMemoryRollbackReviewRepository()
		await reviews.getOrCreate(action)
		const definition = await reviewRollbackAgentBuilder.getDefinition()
		const harness = await createAgentTestHarness(definition, {
			models: {
				primary: { provider: createScriptedHarnessModel(), model: 'unused', capabilities: ['object'] },
			},
			storage,
			onSuspended: async notice => {
				const review = await reviews.get(notice.wait.waitId.replace(/^rollback-review:/, ''))
				if (!review) throw new Error('application_review_record_not_found')
				return { status: 'waiting' as const, reviewId: review.action.reviewId }
			},
		})

		try {
			await expect(harness.run({ payload: action, message: { id: 'request-1' } })).resolves.toEqual({
				status: 'waiting',
				reviewId: action.reviewId,
			})
			await reviews.decide({
				reviewId: action.reviewId,
				decisionId: 'decision-1',
				reviewerId: 'operator-7',
				decision: 'approved',
			})
			await expect(storage.signalWait({
				waitId: `rollback-review:${action.reviewId}`,
				eventId: 'decision-1',
				outcome: 'approved',
			})).resolves.toMatchObject({ kind: 'applied' })
			await expect(storage.signalWait({
				waitId: `rollback-review:${action.reviewId}`,
				eventId: 'decision-1',
				outcome: 'approved',
			})).resolves.toMatchObject({ kind: 'duplicate' })
			await expect(harness.run({ payload: action, message: { id: 'resume-1' } })).resolves.toEqual({
				status: 'approved',
				reviewId: action.reviewId,
			})
		} finally {
			await harness.shutdown()
		}
	})

	it('claims one immutable action and reuses the side-effect receipt', async () => {
		const reviews = new InMemoryRollbackReviewRepository()
		const incidents = new IncidentRepository()
		const record = await reviews.getOrCreate(action)
		await reviews.decide({
			reviewId: action.reviewId,
			decisionId: 'decision-1',
			reviewerId: 'operator-7',
			decision: 'approved',
		})
		const claim = await reviews.claimExecution({
			reviewId: action.reviewId,
			actionDigest: rollbackActionDigest(action),
			targetRevision: action.targetRevision,
		})
		expect(record.actionDigest).toBe(rollbackActionDigest(action))
		expect(await incidents.getDeploymentRevision(action.changeId)).toBe(action.targetRevision)

		const first = await incidents.executeRollback({
			changeId: action.changeId,
			expectedRevision: action.targetRevision,
			executionId: claim.executionId,
		})
		const second = await incidents.executeRollback({
			changeId: action.changeId,
			expectedRevision: action.targetRevision,
			executionId: claim.executionId,
		})
		expect(second).toEqual(first)
		await expect(reviews.recordReceipt(claim.executionId, first.receiptId)).resolves.toMatchObject({
			receiptId: first.receiptId,
		})
		await expect(reviews.claimExecution({
			reviewId: action.reviewId,
			actionDigest: '0'.repeat(64),
			targetRevision: action.targetRevision,
		})).rejects.toThrow('stale_action')
	})
})

