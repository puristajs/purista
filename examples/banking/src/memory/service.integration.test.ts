import { DefaultEventBridge, inMemoryMemoryEngine } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { afterEach, describe, expect, it } from 'vitest'

import { BankingRepository } from '../repository.js'
import { bankingSupportMemoryService } from './service.js'

type StartedMemoryApplication = {
	fetch: (request: Request) => Promise<Response>
	destroy: () => Promise<void>
}

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const start = async (
	actor: string,
	tenantId = 'tenant-north',
	memory = inMemoryMemoryEngine(),
): Promise<StartedMemoryApplication> => {
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()
	const service = await bankingSupportMemoryService.getInstance(eventBridge, {
		resources: { bankingRepository: new BankingRepository() },
		ai: {
			models: {
				'memory-runtime': {
					provider: { id: 'banking-no-model', genAiSystem: 'tutorial' },
					model: 'not-invoked',
					capabilities: ['object'],
				},
			},
			memory,
		},
	})
	await service.start()
	const hono = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: { services: [service], autoRegisterServicesFromConfig: true },
	})
	hono.setProtectMiddleware(async (context, next) => {
		context.set('principalId', actor)
		context.set('tenantId', tenantId)
		return next()
	})
	await hono.start()
	destroy = async () => {
		await hono.destroy()
		await service.destroy()
		await eventBridge.destroy()
	}
	return { fetch: async request => hono.app.fetch(request), destroy }
}

const preferenceRequest = (path: string, input: Record<string, unknown>) =>
	new Request(`http://example.test/api/v1/${path}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(input),
	})

describe('banking support memory', () => {
	it('stores and removes a preference only in the caller-owned Harness memory scope', async () => {
		const application = await start('alice')
		const input = { accountId: 'account-a', conversationId: '11111111-1111-4111-8111-111111111111' }

		const saved = await application.fetch(preferenceRequest('support/preferences', { ...input, language: 'de' }))
		expect(saved.status).toBe(200)
		expect(await saved.json()).toEqual({ ...input, language: 'de', retention: '24-hours' })

		const recalled = await application.fetch(preferenceRequest('support/preferences/read', input))
		expect(recalled.status).toBe(200)
		expect(await recalled.json()).toEqual({ ...input, language: 'de', retention: '24-hours' })

		const forgotten = await application.fetch(preferenceRequest('support/preferences/forget', input))
		expect(forgotten.status).toBe(200)
		expect(await forgotten.json()).toEqual({ ...input, language: null, retention: '24-hours' })

		const absent = await application.fetch(preferenceRequest('support/preferences/read', input))
		expect(await absent.json()).toEqual({ ...input, language: null, retention: '24-hours' })
	})

	it('does not let another customer recover a copied conversation id and blocks out-of-scope accounts first', async () => {
		const conversationId = '22222222-2222-4222-8222-222222222222'
		const memory = inMemoryMemoryEngine()
		const alice = await start('alice', 'tenant-north', memory)
		const aliceInput = { accountId: 'account-a', conversationId }
		await alice.fetch(preferenceRequest('support/preferences', { ...aliceInput, language: 'de' }))
		await alice.destroy()
		destroy = undefined

		const bob = await start('bob', 'tenant-north', memory)
		const copiedId = await bob.fetch(preferenceRequest('support/preferences/read', aliceInput))
		expect(copiedId.status).toBe(200)
		expect(await copiedId.json()).toEqual({ ...aliceInput, language: null, retention: '24-hours' })

		const denied = await bob.fetch(
			preferenceRequest('support/preferences', {
				accountId: 'account-c',
				conversationId,
				language: 'en',
			}),
		)
		expect(denied.status).toBe(403)
	})
})
