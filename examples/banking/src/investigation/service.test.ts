import { createScriptedHarnessModel, DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { afterEach, describe, expect, it } from 'vitest'

import { BankingRepository } from '../repository.js'
import { bankingCaseInvestigationService, investigateCaseAgentBuilder } from './service.js'

type StartedInvestigationApplication = {
	fetch: (request: Request) => Promise<Response>
	model: ReturnType<typeof createScriptedHarnessModel>
}

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const start = async (actor: string): Promise<StartedInvestigationApplication> => {
	const eventBridge = new DefaultEventBridge()
	const model = createScriptedHarnessModel()
	const bankingRepository = new BankingRepository()
	await eventBridge.start()
	const service = await bankingCaseInvestigationService.getInstance(eventBridge, {
		resources: { bankingRepository },
		ai: {
			models: {
				primary: { provider: model, model: 'scripted-case-investigator', capabilities: ['object'] },
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
	await hono.start()
	destroy = async () => {
		await hono.destroy()
		await service.destroy()
		await eventBridge.destroy()
	}
	return { fetch: async request => hono.app.fetch(request), model }
}

const requestCase = (caseId: 'case-account-a' | 'case-account-a-missing-support' | 'case-account-c') =>
	new Request('http://example.test/api/v1/case-investigations', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ caseId }),
	})

describe('parallel banking case investigation workflow', () => {
	it('declares exactly three local specialists and a bounded PURISTA workflow', async () => {
		const definition = await investigateCaseAgentBuilder.getDefinition()

		expect(definition.execution.kind).toBe('harnessWorkflow')
		expect(definition.manifest.allowedAgents).toEqual([])
		if (definition.execution.kind !== 'harnessWorkflow') throw new Error('Expected a Harness workflow definition')
		expect(Object.keys(definition.execution.agents ?? {})).toEqual([
			'transactionSpecialist',
			'policySpecialist',
			'supportSpecialist',
		])
	})

	it('runs the three assigned case branches and keeps the evidence in branch order', async () => {
		const application = await start('erin')

		const response = await application.fetch(requestCase('case-account-a'))

		expect(response.status).toBe(200)
		expect(await response.json()).toMatchObject({
			caseId: 'case-account-a',
			accountId: 'account-a',
			status: 'complete',
			findings: [{ branch: 'transactions' }, { branch: 'policy' }, { branch: 'support' }],
		})
		// This first workflow checkpoint uses deterministic specialists so it runs
		// locally. Later chapters replace selected branches with model-backed agents.
		expect(application.model.requests).toEqual([])
	})

	it('returns an explicit partial brief when one specialist fails', async () => {
		const application = await start('erin')

		const response = await application.fetch(requestCase('case-account-a-missing-support'))

		expect(response.status).toBe(200)
		expect(await response.json()).toMatchObject({
			status: 'partial',
			findings: expect.arrayContaining([
				{ branch: 'support', status: 'unavailable', reason: 'specialist-failed', evidence: [] },
			]),
		})
	})

	it('denies an unassigned case before starting a workflow or sending evidence to a model', async () => {
		const application = await start('erin')

		const response = await application.fetch(requestCase('case-account-c'))

		expect(response.status).toBe(403)
		expect(application.model.requests).toEqual([])
	})
})
