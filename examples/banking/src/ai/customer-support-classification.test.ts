import { createScriptedHarnessModel, DefaultEventBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { afterEach, describe, expect, it } from 'vitest'

import { BankingRepository } from '../repository.js'
import { LocalLegacyBankMock } from '../legacy-bank.js'
import { bankingService } from '../service.js'
import {
	bankingCustomerSupportService,
	classifyCustomerSupportAgentBuilder,
	customerSupportRoutingMap,
} from './customer-support-classification.js'

type StartedCustomerSupportApplication = {
	fetch: (request: Request) => Promise<Response>
	model: ReturnType<typeof createScriptedHarnessModel>
	destroy: () => Promise<void>
}

let destroy: (() => Promise<void>) | undefined

afterEach(async () => {
	await destroy?.()
	destroy = undefined
})

const start = async (actor: string): Promise<StartedCustomerSupportApplication> => {
	const eventBridge = new DefaultEventBridge()
	const model = createScriptedHarnessModel()
	await eventBridge.start()

	const bankingRepository = new BankingRepository()
	const banking = await bankingService.getInstance(eventBridge, {
		resources: { bankingRepository, legacyBankClient: new LocalLegacyBankMock() },
	})
	const service = await bankingCustomerSupportService.getInstance(eventBridge, {
		resources: { bankingRepository },
		ai: {
			models: {
				primary: {
					provider: model,
					model: 'scripted-customer-support-classifier',
					capabilities: ['object'],
				},
			},
		},
	})
	await banking.start()
	await service.start()

	const hono = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: { services: [banking, service], autoRegisterServicesFromConfig: true },
	})
	hono.setProtectMiddleware(async (context, next) => {
		context.set('principalId', actor)
		context.set('tenantId', 'tenant-north')
		return next()
	})

	destroy = async () => {
		await hono.destroy()
		await service.destroy()
		await banking.destroy()
		await eventBridge.destroy()
	}
	await hono.start()
	return { fetch: async request => hono.app.fetch(request), model, destroy }
}

describe('attached customer support classification agent', () => {
	it('is a service-owned PURISTA agent with one declared read-only command tool', async () => {
		const definitions = await bankingCustomerSupportService.resolveDefinitions()
		const definition = await classifyCustomerSupportAgentBuilder.getDefinition()

		expect(definitions.queues.map(queue => queue.queueName)).toContain(
			'agent:bankingCustomerSupport:1:classifyCustomerSupport',
		)
		expect(definitions.commands.map(command => command.commandName)).toContain('classifyCustomerSupport')
		expect(definition.manifest.allowedCommands).toMatchObject([
			{ serviceName: 'banking', serviceVersion: '1', commandName: 'listTransactions' },
		])
		expect(definition.manifest.allowedAgents).toEqual([])
		expect(customerSupportRoutingMap).toEqual({
			'account-access': 'account-access-team',
			'card-payment': 'card-payment-team',
		})
	})

	it('uses the declared account tool with the trusted account scope after an eligible classification', async () => {
		const application = await start('bob')
		application.model.enqueueObject({
			object: {
				category: 'account-access',
				reason: 'The caller asks about their account history.',
				confidence: 0.95,
				needsReview: false,
			},
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
			finishReason: 'stop',
		})

		const response = await application.fetch(
			new Request('http://example.test/api/v1/customer-support/classifications', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					accountId: 'account-a',
					requestId: 'support-summary-100',
					text: 'How many transactions do I have?',
				}),
			}),
		)

		expect(response.status).toBe(200)
		expect(await response.json()).toMatchObject({
			routing: { status: 'eligible-for-application-routing', destination: 'account-access-team' },
			accountSummary: { accountId: 'account-a', transactionCount: 1 },
		})
	})

	it('uses only account-scoped request text and returns no action for low confidence', async () => {
		const application = await start('bob')
		application.model.enqueueObject({
			object: {
				category: 'card-payment',
				reason: 'The card payment is declined.',
				confidence: 0.4,
				needsReview: false,
			},
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
			finishReason: 'stop',
		})

		const response = await application.fetch(
			new Request('http://example.test/api/v1/customer-support/classifications', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					accountId: 'account-a',
					requestId: 'support-100',
					text: 'My card payment was declined at the supermarket.',
				}),
			}),
		)

		expect(response.status).toBe(200)
		expect(await response.json()).toMatchObject({
			category: 'card-payment',
			routing: { status: 'no-action', reason: 'low-confidence' },
		})
		expect(application.model.requests).toHaveLength(1)
		const request = application.model.requests[0] as { messages: Array<{ content: string }> }
		expect(request.messages[0]?.content).toContain('Authorized account: account-a')
		expect(request.messages[0]?.content).toContain('My card payment was declined at the supermarket.')
	})

	it('rejects an out-of-scope account before any customer text reaches the model', async () => {
		const application = await start('bob')

		const response = await application.fetch(
			new Request('http://example.test/api/v1/customer-support/classifications', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					accountId: 'account-c',
					requestId: 'support-secret',
					text: 'Confidential account-c complaint that must never reach a model.',
				}),
			}),
		)

		expect(response.status).toBe(403)
		expect(application.model.requests).toEqual([])
	})
})
