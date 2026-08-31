import { fileURLToPath } from 'node:url'

import { createScriptedHarnessModel, DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { afterEach, describe, expect, it } from 'vitest'

import { BankingRepository } from '../repository.js'
import { bankingSupportPlaybookService, bankingSupportPlaybookSkillName } from './support-playbook.js'

const skillDirectory = fileURLToPath(new URL('./skills/banking-support-playbook', import.meta.url))

type StartedPlaybookApplication = {
	fetch: (request: Request) => Promise<Response>
	model: ReturnType<typeof createScriptedHarnessModel>
	destroy: () => Promise<void>
}

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const start = async (actor: string, bindSkill = true): Promise<StartedPlaybookApplication> => {
	const eventBridge = new DefaultEventBridge()
	const model = createScriptedHarnessModel()
	await eventBridge.start()
	const service = await bankingSupportPlaybookService.getInstance(eventBridge, {
		resources: { bankingRepository: new BankingRepository() },
		ai: {
			models: {
				primary: {
					provider: model,
					model: 'scripted-support-playbook',
					capabilities: ['object', 'tool_use'],
				},
			},
			...(bindSkill
				? {
						skills: {
							bindings: {
								[bankingSupportPlaybookSkillName]: { directory: skillDirectory, trust: 'project' },
							},
						},
					}
				: {}),
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

describe('attached banking support playbook agent', () => {
	it('loads the named reviewed Skill through the built-in read tool', async () => {
		const application = await start('bob')
		application.model.enqueue({
			object: {},
			toolCalls: [
				{
					id: 'read-support-playbook',
					name: 'read',
					arguments: { path: `/skills/${bankingSupportPlaybookSkillName}/SKILL.md` },
				},
			],
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'tool_calls',
		})
		application.model.enqueue({
			object: { status: 'guided', answer: 'Open your account history to review the recorded transactions.' },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})

		const response = await application.fetch(
			new Request('http://example.test/api/v1/customer-support/playbook', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ accountId: 'account-a', text: 'Where can I see my transactions?' }),
			}),
		)

		expect(response.status).toBe(200)
		expect(await response.json()).toEqual({
			status: 'guided',
			answer: 'Open your account history to review the recorded transactions.',
		})
		const firstRequest = application.model.requests[0] as { messages?: Array<{ content?: string }> }
		expect(firstRequest.messages?.[0]?.content).toContain('Available skills')
		expect(firstRequest.messages?.[0]?.content).toContain(bankingSupportPlaybookSkillName)
		expect(firstRequest.messages?.[0]?.content).not.toContain('Do not ask for passwords')
	})

	it('rejects another account before the model can load or use a Skill', async () => {
		const application = await start('bob')
		const response = await application.fetch(
			new Request('http://example.test/api/v1/customer-support/playbook', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ accountId: 'account-c', text: 'Tell me about this account.' }),
			}),
		)

		expect(response.status).toBe(403)
		expect(application.model.requests).toEqual([])
	})

	it('fails service startup clearly when the declared reviewed Skill is not bound', async () => {
		await expect(start('bob', false)).rejects.toThrow(bankingSupportPlaybookSkillName)
	})
})
