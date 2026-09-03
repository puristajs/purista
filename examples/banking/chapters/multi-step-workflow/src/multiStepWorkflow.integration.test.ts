import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { InMemoryHarnessStorage, ModelError } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

describe('durable multi-step workflow over PURISTA', () => {
	it('retries a failed step and replays the earlier checkpoint on the next invocation', async () => {
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
		const storage = new InMemoryHarnessStorage()
		const policy = { canResolve: vi.fn(async () => true) }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: { supportCasePolicy: policy },
			ai: {
				storage,
				models: {
					classification_model: { provider: classificationProvider, model: 'classification-fake' },
					resolution_model: { provider: resolutionProvider, model: 'resolution-fake' },
				},
			},
		})
		await service.start()
		const message = () =>
			getCommandMessageMock({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'resolveSupportCase' },
				payload: {
					payload: { caseId: 'case-1', message: 'My card was stolen and is being used.' },
					parameter: {},
				},
			})

		try {
			await expect(eventBridge.invoke(message())).rejects.toBeDefined()
			expect(classificationProvider.requests).toHaveLength(1)
			expect(resolutionObject).toHaveBeenCalledTimes(2)

			resolutionProvider.enqueueObject({
				object: { summary: 'Verify identity and freeze the affected card.', nextAction: 'freeze_card' },
				usage,
				finishReason: 'stop',
			})
			await expect(eventBridge.invoke(message())).resolves.toEqual({
				caseId: 'case-1',
				classification: { category: 'card', urgency: 'urgent' },
				plan: { summary: 'Verify identity and freeze the affected card.', nextAction: 'freeze_card' },
			})
			expect(classificationProvider.requests).toHaveLength(1)
			expect(resolutionObject).toHaveBeenCalledTimes(3)
			classificationProvider.assertExhausted()
			resolutionProvider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('does not retry a permanent model-output validation failure', async () => {
		const classificationProvider = new FakeModelProvider({ strict: true })
		const resolutionProvider = new FakeModelProvider({ strict: true })
		classificationProvider.enqueueObject({
			object: { category: 'card', urgency: 'normal' },
			usage,
			finishReason: 'stop',
		})
		resolutionProvider.enqueueObject({
			object: { summary: '', nextAction: 'unknown' },
			usage,
			finishReason: 'stop',
		})
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			resources: { supportCasePolicy: { canResolve: vi.fn(async () => true) } },
			ai: {
				storage: new InMemoryHarnessStorage(),
				models: {
					classification_model: { provider: classificationProvider, model: 'classification-fake' },
					resolution_model: { provider: resolutionProvider, model: 'resolution-fake' },
				},
			},
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-alex',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'resolveSupportCase' },
						payload: {
							payload: { caseId: 'case-permanent', message: 'My card is damaged.' },
							parameter: {},
						},
					}),
				),
			).rejects.toBeDefined()
			expect(resolutionProvider.requests).toHaveLength(1)
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('rejects changed input for an existing durable run without another model call', async () => {
		const classificationProvider = new FakeModelProvider({ strict: true })
		const resolutionProvider = new FakeModelProvider({ strict: true })
		classificationProvider.enqueueObject({
			object: { category: 'transfer', urgency: 'normal' },
			usage,
			finishReason: 'stop',
		})
		resolutionProvider.enqueueObject({
			object: { summary: 'Check the transfer status.', nextAction: 'reply' },
			usage,
			finishReason: 'stop',
		})
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			resources: { supportCasePolicy: { canResolve: vi.fn(async () => true) } },
			ai: {
				storage: new InMemoryHarnessStorage(),
				models: {
					classification_model: { provider: classificationProvider, model: 'classification-fake' },
					resolution_model: { provider: resolutionProvider, model: 'resolution-fake' },
				},
			},
		})
		await service.start()

		const invoke = (message: string) =>
			eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'resolveSupportCase' },
					payload: {
						payload: { caseId: 'case-stable', message },
						parameter: {},
					},
				}),
			)

		try {
			await expect(invoke('Where is transfer tx-1?')).resolves.toMatchObject({ caseId: 'case-stable' })
			await expect(invoke('Use different input for the same case.')).rejects.toBeDefined()
			expect(classificationProvider.requests).toHaveLength(1)
			expect(resolutionProvider.requests).toHaveLength(1)
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('rejects a direct workflow invocation before any model call when business access is denied', async () => {
		const classificationProvider = new FakeModelProvider({ strict: true })
		const resolutionProvider = new FakeModelProvider({ strict: true })
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			resources: { supportCasePolicy: { canResolve: vi.fn(async () => false) } },
			ai: {
				storage: new InMemoryHarnessStorage(),
				models: {
					classification_model: { provider: classificationProvider, model: 'classification-fake' },
					resolution_model: { provider: resolutionProvider, model: 'resolution-fake' },
				},
			},
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-denied',
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'resolve_support_case' },
						payload: {
							payload: { caseId: 'case-denied', message: 'Help with this case.' },
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(classificationProvider.requests).toHaveLength(0)
			expect(resolutionProvider.requests).toHaveLength(0)
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})
})
