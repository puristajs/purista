import { DefaultQueueBridge, type EventBridge, StatusCode, UnhandledError } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { PoolManager } from '../pools/PoolManager.js'
import type { AgentHandler } from '../types/AgentHandler.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { AgentInstance, type AgentInstanceDependencies } from './AgentInstance.js'

const baseManifest: AgentManifest = {
	agentName: 'supportAgent',
	serviceVersion: '1',
	eventBridge: 'default',
	allowedTools: [],
}

const createEventBridge = (overrides: Partial<EventBridge> = {}): EventBridge => {
	return {
		instanceId: 'bridge-1',
		invoke: vi.fn(),
		openStream: vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable')),
		...overrides,
	} as unknown as EventBridge
}

const baseDependencies: AgentInstanceDependencies = {
	info: {
		agentName: 'supportAgent',
		serviceVersion: '1',
	},
	manifest: baseManifest,
	serviceBuilder: {
		info: {
			serviceName: 'supportAgent',
			serviceVersion: '1',
		},
		getInstance: vi.fn(),
	} as unknown as AgentInstanceDependencies['serviceBuilder'],
	handler: (async () => ({ message: 'ok' })) as AgentHandler,
}

describe('AgentInstance', () => {
	it('fails fast when a declared model alias is missing', () => {
		const manifest: AgentManifest = {
			...baseManifest,
			models: [{ alias: 'openai:', capabilities: ['text'] }],
		}

		expect(
			() =>
				new AgentInstance({ ...baseDependencies, manifest }, createEventBridge(), {
					models: {},
				}),
		).toThrow('Missing model provider for alias "openai:"')
	})

	it('assumes the full attached-agent model surface when capabilities are omitted', () => {
		const manifest: AgentManifest = {
			...baseManifest,
			models: [{ alias: 'openai:gpt-4o-mini' }],
		}

		expect(
			() =>
				new AgentInstance({ ...baseDependencies, manifest }, createEventBridge(), {
					models: {
						'openai:gpt-4o-mini': {
							name: 'test-provider',
							capabilities: { text: true, object: true },
							generateText: vi.fn(),
							generateObject: vi.fn(),
						},
					},
				}),
		).toThrow('Model provider "openai:gpt-4o-mini" does not support required capability "object-stream"')
	})

	it('fails fast when a declared object generation capability is missing', () => {
		const manifest: AgentManifest = {
			...baseManifest,
			models: [{ alias: 'openai:gpt-4o-mini', capabilities: ['object'] }],
		}

		expect(
			() =>
				new AgentInstance({ ...baseDependencies, manifest }, createEventBridge(), {
					models: {
						'openai:gpt-4o-mini': {
							name: 'test-provider',
							capabilities: { text: true },
							generateText: vi.fn(),
						},
					},
				}),
		).toThrow('Model provider "openai:gpt-4o-mini" does not support required capability "object"')
	})

	it('requires a queue bridge for queued execution mode', async () => {
		const eventBridge = createEventBridge({ openStream: undefined })
		const instance = new AgentInstance(baseDependencies, eventBridge, { models: {} })

		await expect(instance.start()).rejects.toThrow('Agent "supportAgent" requires a queueBridge for execution')
	})

	it('notifies stream responders for successful invocations', async () => {
		const invoke = vi.fn().mockResolvedValue([{ frame: { kind: 'message', content: 'ok', role: 'assistant' } }])
		const openStream = vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable'))
		const eventBridge = createEventBridge({ openStream, invoke })
		const service = {
			start: vi.fn().mockResolvedValue(undefined),
			destroy: vi.fn().mockResolvedValue(undefined),
		}
		const getInstance = vi.fn().mockResolvedValue(service)

		const instance = new AgentInstance(
			{
				...baseDependencies,
				serviceBuilder: {
					...baseDependencies.serviceBuilder,
					getInstance,
				},
			} as AgentInstanceDependencies,
			eventBridge,
			{ models: {}, queueBridge: new DefaultQueueBridge() },
		)

		const onFrame = vi.fn()
		const onComplete = vi.fn()
		const onError = vi.fn()

		const result = await instance.invoke({ payload: { prompt: 'hi' }, stream: { onFrame, onComplete, onError } })

		expect(result.envelopes).toHaveLength(1)
		expect(onFrame).toHaveBeenCalledTimes(1)
		expect(onComplete).toHaveBeenCalledTimes(1)
		expect(onError).not.toHaveBeenCalled()
	})

	it('injects sessionId into payload for runtime invokes', async () => {
		const invoke = vi.fn().mockResolvedValue([])
		const openStream = vi.fn().mockRejectedValue(new UnhandledError(StatusCode.NotImplemented, 'stream unavailable'))
		const eventBridge = createEventBridge({ openStream, invoke })
		const service = {
			start: vi.fn().mockResolvedValue(undefined),
			destroy: vi.fn().mockResolvedValue(undefined),
		}
		const getInstance = vi.fn().mockResolvedValue(service)

		const instance = new AgentInstance(
			{
				...baseDependencies,
				serviceBuilder: {
					...baseDependencies.serviceBuilder,
					getInstance,
				},
			} as AgentInstanceDependencies,
			eventBridge,
			{ models: {}, queueBridge: new DefaultQueueBridge() },
		)

		await instance.invoke({
			payload: { prompt: 'hello' },
			sessionId: 'chat-abc',
		})

		const message = invoke.mock.calls[0][0]
		expect(message.payload).toEqual({
			payload: { prompt: 'hello', sessionId: 'chat-abc' },
			parameter: {},
		})
	})

	it('exposes read-only runtime concurrency status', async () => {
		const poolManager = new PoolManager()
		const instance = new AgentInstance({ ...baseDependencies }, createEventBridge(), {
			models: {},
			poolManager,
			poolConfig: {
				poolId: 'support-pool',
				maxConcurrencyPerInstance: 2,
			},
			concurrencyHints: {
				replicaCountHint: 3,
			},
		})

		await poolManager.acquire('support-pool')
		const status = instance.getStatus()
		poolManager.release('support-pool')

		expect(status).toEqual({
			agentName: 'supportAgent',
			serviceVersion: '1',
			poolId: 'support-pool',
			maxConcurrencyPerInstance: 2,
			activeWorkers: 1,
			waitingWorkers: 0,
			concurrencyHints: {
				replicaCountHint: 3,
				effectiveMaxConcurrencyHint: 6,
			},
		})
	})

	it('exposes external runtime metadata', () => {
		const instance = new AgentInstance({ ...baseDependencies }, createEventBridge(), {
			models: {},
		})

		expect(instance.getExternalRuntimeMetadata()).toEqual({
			commands: [],
			agents: [],
		})
	})

	it('converts inline typed skills into a runtime skill resource at getInstance()', async () => {
		const service = {
			start: vi.fn().mockResolvedValue(undefined),
			destroy: vi.fn().mockResolvedValue(undefined),
		}
		const getInstance = vi.fn().mockResolvedValue(service)

		const instance = new AgentInstance(
			{
				...baseDependencies,
				manifest: {
					...baseManifest,
					skills: {
						resourceName: 'skills',
						names: ['spec-elicitation'],
					},
				},
				serviceBuilder: {
					...baseDependencies.serviceBuilder,
					getInstance,
				},
			} as AgentInstanceDependencies,
			createEventBridge(),
			{
				models: {},
				queueBridge: new DefaultQueueBridge(),
				skills: {
					'spec-elicitation': {
						content: 'Ask for missing requirements first.',
					},
				},
			},
		)

		await instance.start()

		const call = getInstance.mock.calls[0]?.[1]
		const skillResource = call?.serviceConfig?.__agentRuntime?.resources?.skills
		await expect(skillResource.load('spec-elicitation')).resolves.toEqual(
			expect.objectContaining({
				name: 'spec-elicitation',
				content: 'Ask for missing requirements first.',
			}),
		)
	})
})
