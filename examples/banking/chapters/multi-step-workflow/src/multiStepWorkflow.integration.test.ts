import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { BaseModelProvider, ModelError, sqliteHarnessStorage } from '@purista/harness'
import { FakeModelProvider, objectReply } from '@purista/harness/testing'
import { describe, expect, it, vi } from 'vitest'
import { supportV1Service } from './service/support/v1/supportV1Service.js'

const usage = { inputTokens: 8, outputTokens: 5, totalTokens: 13 }

class TransientResolutionProvider extends BaseModelProvider {
	public declare readonly object: NonNullable<BaseModelProvider['object']>
	public declare readonly objectStream: NonNullable<BaseModelProvider['objectStream']>
	private readonly fake = new FakeModelProvider({ strict: true })
	public attempts = 0

	public constructor() {
		super({ id: 'fake-retry', genAiSystem: 'fake' })
	}

	public enqueueObject(response: import('@purista/harness').ObjectResponse): void {
		this.fake.enqueueObject(response)
	}

	public assertExhausted(): void {
		this.fake.assertExhausted()
	}

	public get requests(): readonly import('@purista/harness').ObjectRequest[] {
		return this.fake.requests.filter(
			(request): request is import('@purista/harness').ObjectRequest => 'schema' in request,
		)
	}

	protected override async doObject<
		T extends import('@purista/harness').JsonValue = import('@purista/harness').JsonValue,
	>(request: import('@purista/harness').ObjectRequest<T>): Promise<import('@purista/harness').ObjectResponse<T>> {
		this.attempts += 1
		if (this.attempts === 1) {
			throw new ModelError('Temporary planning outage.', {
				provider: 'fake',
				model: 'resolution-fake',
				method: 'object',
				status: 503,
			})
		}
		return this.fake.object(request)
	}

	protected override doObjectStream<
		T extends import('@purista/harness').JsonValue = import('@purista/harness').JsonValue,
	>(
		request: import('@purista/harness').ObjectRequest<T>,
	): AsyncIterable<import('@purista/harness').ObjectStreamChunk<T>> {
		return this.fake.objectStream(request)
	}
}

describe('durable multi-step workflow over PURISTA', () => {
	it('runs the durable workflow through the command and replays it on the next invocation', async () => {
		const classificationProvider = new FakeModelProvider({ strict: true })
		const resolutionProvider = new TransientResolutionProvider()
		classificationProvider.enqueueObject(
			objectReply({ category: 'card', urgency: 'urgent' }, { usage, finishReason: 'stop' }),
		)
		resolutionProvider.enqueueObject(
			objectReply(
				{ summary: 'Verify identity and freeze the affected card.', nextAction: 'freeze_card' },
				{ usage, finishReason: 'stop' },
			),
		)
		const storage = sqliteHarnessStorage({ file: ':memory:' })
		const policy = { canResolve: vi.fn(async () => true) }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: { supportCasePolicy: policy },
			ai: {
				storage,
				models: {
					classification: { provider: classificationProvider, model: 'classification-fake' },
					planning: {
						provider: resolutionProvider,
						model: 'resolution-fake',
						retry: {
							maxAttempts: 2,
							minDelayMs: 1,
							maxDelayMs: 10,
							maxActiveDelayMs: 100,
							maxActiveElapsedMs: 1_000,
							retryOn: { serverError: true },
						},
					},
				},
			},
		})
		await service.start()
		const message = () =>
			getCommandMessageMock({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'runResolveSupportCase' },
				payload: { payload: { caseId: 'case-1', message: 'My card was stolen and is being used.' }, parameter: {} },
			})
		try {
			const output = {
				caseId: 'case-1',
				classification: { category: 'card', urgency: 'urgent' },
				plan: { summary: 'Verify identity and freeze the affected card.', nextAction: 'freeze_card' },
			}
			await expect(eventBridge.invoke(message())).resolves.toEqual(output)
			await expect(eventBridge.invoke(message())).resolves.toEqual(output)
			expect(classificationProvider.requests).toHaveLength(1)
			expect(resolutionProvider.attempts).toBe(2)
			expect(resolutionProvider.requests).toHaveLength(1)
			classificationProvider.assertExhausted()
			resolutionProvider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})

	it('does not retry a permanent model-output validation failure', async () => {
		const classificationProvider = new FakeModelProvider({ strict: true })
		const resolutionProvider = new FakeModelProvider({ strict: true })
		classificationProvider.enqueueObject(
			objectReply({ category: 'card', urgency: 'normal' }, { usage, finishReason: 'stop' }),
		)
		resolutionProvider.enqueueObject(
			objectReply({ summary: '', nextAction: 'unknown' }, { usage, finishReason: 'stop' }),
		)
		const storage = sqliteHarnessStorage({ file: ':memory:' })
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			resources: { supportCasePolicy: { canResolve: vi.fn(async () => true) } },
			ai: {
				storage,
				models: {
					classification: { provider: classificationProvider, model: 'classification-fake' },
					planning: { provider: resolutionProvider, model: 'resolution-fake' },
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
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'runResolveSupportCase' },
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
			await storage.close()
		}
	})

	it('rejects changed input for an existing durable run without another model call', async () => {
		const classificationProvider = new FakeModelProvider({ strict: true })
		const resolutionProvider = new FakeModelProvider({ strict: true })
		classificationProvider.enqueueObject(
			objectReply({ category: 'transfer', urgency: 'normal' }, { usage, finishReason: 'stop' }),
		)
		resolutionProvider.enqueueObject(
			objectReply({ summary: 'Check the transfer status.', nextAction: 'reply' }, { usage, finishReason: 'stop' }),
		)
		const storage = sqliteHarnessStorage({ file: ':memory:' })
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			resources: { supportCasePolicy: { canResolve: vi.fn(async () => true) } },
			ai: {
				storage,
				models: {
					classification: { provider: classificationProvider, model: 'classification-fake' },
					planning: { provider: resolutionProvider, model: 'resolution-fake' },
				},
			},
		})
		await service.start()

		const invoke = (message: string) =>
			eventBridge.invoke(
				getCommandMessageMock({
					tenantId: 'tenant-example',
					principalId: 'principal-alex',
					receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'runResolveSupportCase' },
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
			await storage.close()
		}
	})

	it('rejects a direct workflow invocation before any model call when business access is denied', async () => {
		const classificationProvider = new FakeModelProvider({ strict: true })
		const resolutionProvider = new FakeModelProvider({ strict: true })
		const storage = sqliteHarnessStorage({ file: ':memory:' })
		const policy = { canResolve: vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false) }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await supportV1Service.getInstance(eventBridge, {
			resources: { supportCasePolicy: policy },
			ai: {
				storage,
				models: {
					classification: { provider: classificationProvider, model: 'classification-fake' },
					planning: { provider: resolutionProvider, model: 'resolution-fake' },
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
						receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'runResolveSupportCase' },
						payload: {
							payload: { caseId: 'case-denied', message: 'Help with this case.' },
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(policy.canResolve).toHaveBeenCalledTimes(2)
			expect(classificationProvider.requests).toHaveLength(0)
			expect(resolutionProvider.requests).toHaveLength(0)
		} finally {
			await service.destroy()
			await eventBridge.destroy()
			await storage.close()
		}
	})
})
