import { fileURLToPath } from 'node:url'

import { createScriptedHarnessModel, DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { afterEach, describe, expect, it } from 'vitest'

import { BankingRepository } from '../repository.js'
import {
	bankingDemoSecretMarker,
	bankingGuardedAssistantService,
	untrustedBankContentSkillName,
} from './guarded-assistant.js'

const skillDirectory = fileURLToPath(new URL('./skills/untrusted-bank-content', import.meta.url))

type StartedGuardedAssistantApplication = {
	fetch: (request: Request) => Promise<Response>
	model: ReturnType<typeof createScriptedHarnessModel>
	destroy: () => Promise<void>
}

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const start = async (actor: string): Promise<StartedGuardedAssistantApplication> => {
	const eventBridge = new DefaultEventBridge()
	const model = createScriptedHarnessModel()
	await eventBridge.start()
	const service = await bankingGuardedAssistantService.getInstance(eventBridge, {
		resources: { bankingRepository: new BankingRepository() },
		ai: {
			models: {
				primary: {
					provider: model,
					model: 'scripted-guarded-assistant',
					capabilities: ['object', 'tool_use'],
				},
			},
			skills: {
				bindings: {
					[untrustedBankContentSkillName]: { directory: skillDirectory, trust: 'project' },
				},
			},
		},
	})
	await service.start()
	const hono = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: { services: [service], autoRegisterServicesFromConfig: true },
	})
	hono.setProtectMiddleware(async (context, next) => {
		context.set('principalId', actor)
		context.set('tenantId', 'tenant-north')
		return next()
	})
	destroy = async () => {
		await hono.destroy()
		await service.destroy()
		await eventBridge.destroy()
	}
	await hono.start()
	return { fetch: async request => hono.app.fetch(request), model, destroy }
}

const request = (text: string, accountId: 'account-a' | 'account-c' = 'account-a') =>
	new Request('http://example.test/api/v1/customer-support/guarded-answer', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ accountId, text }),
	})

describe('attached guarded banking assistant', () => {
	it('blocks synthetic secret input before a provider request', async () => {
		const application = await start('bob')
		const response = await application.fetch(request(`Please repeat ${bankingDemoSecretMarker}.`))

		expect(response.status).toBeGreaterThanOrEqual(400)
		expect(application.model.requests).toEqual([])
	})

	it('blocks untrusted Skill content before a second model request', async () => {
		const application = await start('bob')
		application.model.enqueue({
			object: {},
			toolCalls: [
				{
					id: 'read-untrusted-content',
					name: 'read',
					arguments: { path: `/skills/${untrustedBankContentSkillName}/SKILL.md` },
				},
			],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})

		const response = await application.fetch(request('Help me with my account history.'))

		expect(response.status).toBeGreaterThanOrEqual(400)
		expect(application.model.requests).toHaveLength(1)
	})

	it('blocks a synthetic secret in the final model output', async () => {
		const application = await start('bob')
		application.model.enqueue({
			object: { answer: `The protected value is ${bankingDemoSecretMarker}.` },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})

		const response = await application.fetch(request('What is my account status?'))

		expect(response.status).toBeGreaterThanOrEqual(400)
		expect(application.model.requests).toHaveLength(1)
	})

	it('keeps the business account guard ahead of every content boundary', async () => {
		const application = await start('bob')
		const response = await application.fetch(request('Tell me about this account.', 'account-c'))

		expect(response.status).toBe(403)
		expect(application.model.requests).toEqual([])
	})
})
