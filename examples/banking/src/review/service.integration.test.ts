import { DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { afterEach, describe, expect, it } from 'vitest'

import { BankingRepository } from '../repository.js'
import { FeeChangeReviewStore } from './repository.js'
import { bankingFeeChangeReviewService } from './service.js'

type StartedReviewApplication = {
	fetch: (request: Request) => Promise<Response>
	store: FeeChangeReviewStore
	destroy: () => Promise<void>
}

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const start = async (now: () => Date = () => new Date()): Promise<StartedReviewApplication> => {
	const eventBridge = new DefaultEventBridge()
	const store = new FeeChangeReviewStore(now)
	await eventBridge.start()
	const service = await bankingFeeChangeReviewService.getInstance(eventBridge, {
		resources: { bankingRepository: new BankingRepository(), feeChangeReviewStore: store },
	})
	await service.start()
	const hono = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: { services: [service], autoRegisterServicesFromConfig: true },
	})
	// Test transport only: production wiring supplies an authenticated session.
	hono.setProtectMiddleware(async (context, next) => {
		const actor = context.req.header('x-test-actor')
		if (!actor) return context.json({ title: 'Actor required for this test' }, 401)
		context.set('principalId', actor)
		context.set('tenantId', 'tenant-north')
		return next()
	})
	await hono.start()
	destroy = async () => {
		await hono.destroy()
		await service.destroy()
		await eventBridge.destroy()
	}
	return { fetch: async request => hono.app.fetch(request), store, destroy }
}

const asActor = (actor: string, path: string, method: 'POST' | 'PUT', body: unknown) =>
	new Request(`http://example.test/api/v1/${path}`, {
		method,
		headers: { 'content-type': 'application/json', 'x-test-actor': actor },
		body: JSON.stringify(body),
	})

const propose = async (application: StartedReviewApplication, expiresAt = '2026-02-01T00:00:00.000Z') => {
	const response = await application.fetch(
		asActor('dana', 'fee-changes', 'POST', {
			accountId: 'account-a',
			proposedFeeMinor: 55,
			reviewerId: 'erin',
			expiresAt,
		}),
	)
	expect(response.status).toBe(200)
	return (await response.json()) as { proposalId: string; version: number }
}

describe('Chapter 16 human fee-change review checkpoint', () => {
	it('applies a typed proposal only after its distinct assigned reviewer approves it', async () => {
		const application = await start(() => new Date('2026-01-01T00:00:00.000Z'))
		const proposed = await propose(application)
		const beforeReview = await application.fetch(
			asActor('dana', `fee-changes/${proposed.proposalId}/apply`, 'POST', {
				expectedVersion: proposed.version,
			}),
		)
		expect(beforeReview.status).toBe(409)
		expect(application.store.getCurrentFee('account-a')).toBe(35)

		const selfApproval = await application.fetch(
			asActor('dana', `fee-changes/${proposed.proposalId}/decisions`, 'POST', {
				expectedVersion: proposed.version,
				decision: 'approved',
			}),
		)
		expect(selfApproval.status).toBe(403)

		const notAssigned = await application.fetch(
			asActor('bob', `fee-changes/${proposed.proposalId}/decisions`, 'POST', {
				expectedVersion: proposed.version,
				decision: 'approved',
			}),
		)
		expect(notAssigned.status).toBe(403)

		const approved = await application.fetch(
			asActor('erin', `fee-changes/${proposed.proposalId}/decisions`, 'POST', {
				expectedVersion: proposed.version,
				decision: 'approved',
			}),
		)
		expect(approved.status).toBe(200)
		const duplicateDecision = await application.fetch(
			asActor('erin', `fee-changes/${proposed.proposalId}/decisions`, 'POST', {
				expectedVersion: proposed.version,
				decision: 'approved',
			}),
		)
		expect(duplicateDecision.status).toBe(409)
		expect(application.store.getCurrentFee('account-a')).toBe(35)

		const applied = await application.fetch(
			asActor('dana', `fee-changes/${proposed.proposalId}/apply`, 'POST', {
				expectedVersion: proposed.version,
			}),
		)
		expect(applied.status).toBe(200)
		expect(await applied.json()).toMatchObject({ status: 'applied', proposedFeeMinor: 55 })
		expect(application.store.getCurrentFee('account-a')).toBe(55)
	})

	it('does not apply a rejected change and leaves the current fee untouched', async () => {
		const application = await start(() => new Date('2026-01-01T00:00:00.000Z'))
		const proposed = await propose(application)
		const rejected = await application.fetch(
			asActor('erin', `fee-changes/${proposed.proposalId}/decisions`, 'POST', {
				expectedVersion: proposed.version,
				decision: 'rejected',
			}),
		)
		expect(rejected.status).toBe(200)

		const applied = await application.fetch(
			asActor('dana', `fee-changes/${proposed.proposalId}/apply`, 'POST', {
				expectedVersion: proposed.version,
			}),
		)
		expect(applied.status).toBe(409)
		expect(application.store.getCurrentFee('account-a')).toBe(35)
	})

	it('invalidates an approval when a proposal changes and rejects stale apply replays', async () => {
		const application = await start(() => new Date('2026-01-01T00:00:00.000Z'))
		const proposed = await propose(application)
		const approved = await application.fetch(
			asActor('erin', `fee-changes/${proposed.proposalId}/decisions`, 'POST', {
				expectedVersion: proposed.version,
				decision: 'approved',
			}),
		)
		expect(approved.status).toBe(200)

		const revised = await application.fetch(
			asActor('dana', `fee-changes/${proposed.proposalId}`, 'PUT', {
				proposedFeeMinor: 60,
				reviewerId: 'erin',
				expiresAt: '2026-02-02T00:00:00.000Z',
				expectedVersion: proposed.version,
			}),
		)
		expect(revised.status).toBe(200)
		expect(await revised.json()).toMatchObject({ status: 'pending', version: 2 })

		const staleApply = await application.fetch(
			asActor('dana', `fee-changes/${proposed.proposalId}/apply`, 'POST', {
				expectedVersion: proposed.version,
			}),
		)
		expect(staleApply.status).toBe(409)
		expect(application.store.getCurrentFee('account-a')).toBe(35)
	})

	it('does not apply an expired or already-applied proposal', async () => {
		let currentTime = new Date('2026-01-01T00:00:00.000Z')
		const application = await start(() => currentTime)
		const proposed = await propose(application, '2026-01-01T00:01:00.000Z')
		const approved = await application.fetch(
			asActor('erin', `fee-changes/${proposed.proposalId}/decisions`, 'POST', {
				expectedVersion: proposed.version,
				decision: 'approved',
			}),
		)
		expect(approved.status).toBe(200)
		currentTime = new Date('2026-01-01T00:01:00.000Z')

		const expired = await application.fetch(
			asActor('dana', `fee-changes/${proposed.proposalId}/apply`, 'POST', {
				expectedVersion: proposed.version,
			}),
		)
		expect(expired.status).toBe(410)
		expect(application.store.getCurrentFee('account-a')).toBe(35)

		currentTime = new Date('2026-01-02T00:00:00.000Z')
		const next = await propose(application, '2026-02-03T00:00:00.000Z')
		await application.fetch(
			asActor('erin', `fee-changes/${next.proposalId}/decisions`, 'POST', {
				expectedVersion: next.version,
				decision: 'approved',
			}),
		)
		const firstApply = await application.fetch(
			asActor('dana', `fee-changes/${next.proposalId}/apply`, 'POST', { expectedVersion: next.version }),
		)
		expect(firstApply.status).toBe(200)
		const replay = await application.fetch(
			asActor('dana', `fee-changes/${next.proposalId}/apply`, 'POST', { expectedVersion: next.version }),
		)
		expect(replay.status).toBe(409)
		expect(application.store.getCurrentFee('account-a')).toBe(55)
	})
})
