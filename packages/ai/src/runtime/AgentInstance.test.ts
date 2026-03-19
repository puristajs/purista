import { describe, expect, it, vi } from 'vitest'

import type { AgentHandler } from '../builder/AgentBuilder.js'
import { PoolManager } from '../pools/PoolManager.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { AgentInstance } from './AgentInstance.js'

const baseManifest: AgentManifest = {
	agentName: 'supportAgent',
	agentVersion: '1',
	eventBridge: 'default',
	allowedTools: [],
}

const baseDependencies = {
	info: {
		agentName: 'supportAgent',
		agentVersion: '1',
	},
	manifest: baseManifest,
	serviceBuilder: {
		info: {
			serviceName: 'supportAgent',
			serviceVersion: '1',
		},
		getInstance: vi.fn(),
	},
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
				new AgentInstance({ ...baseDependencies, manifest }, { instanceId: 'bridge-1' } as any, {
					models: {},
				}),
		).toThrow('Missing model provider for alias "openai:"')
	})

	it('fails fast when a declared object generation capability is missing', () => {
		const manifest: AgentManifest = {
			...baseManifest,
			models: [{ alias: 'openai:gpt-4o-mini', capabilities: ['json'] }],
		}

		expect(
			() =>
				new AgentInstance({ ...baseDependencies, manifest }, { instanceId: 'bridge-1' } as any, {
					models: {
						'openai:gpt-4o-mini': {
							name: 'test-provider',
							capabilities: { text: true },
							generate: vi.fn(),
						},
					},
				}),
		).toThrow('Model provider "openai:gpt-4o-mini" does not support required capability "json"')
	})

	it('requires a queue bridge for queued execution mode', async () => {
		const manifest: AgentManifest = {
			...baseManifest,
			executionMode: 'queued',
		}
		const eventBridge = { instanceId: 'bridge-1', invoke: vi.fn() } as any
		const instance = new AgentInstance(
			{
				...baseDependencies,
				manifest,
			},
			eventBridge,
			{ models: {} },
		)

		await expect(instance.start()).rejects.toThrow(
			'Agent "supportAgent" is configured for queued execution but no queueBridge was provided',
		)
	})

	it('notifies stream responders for successful invocations', async () => {
		const invoke = vi.fn().mockResolvedValue([{ frame: { kind: 'message', content: 'ok', role: 'assistant' } }])
		const eventBridge = { instanceId: 'bridge-1', invoke } as any
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
			},
			eventBridge,
			{ models: {} },
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
		const eventBridge = { instanceId: 'bridge-1', invoke } as any
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
			},
			eventBridge,
			{ models: {} },
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
		const instance = new AgentInstance({ ...baseDependencies }, { instanceId: 'bridge-1' } as any, {
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
			agentVersion: '1',
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
		const instance = new AgentInstance({ ...baseDependencies }, { instanceId: 'bridge-1' } as any, {
			models: {},
		})

		expect(instance.getExternalRuntimeMetadata()).toEqual({
			commands: [],
			agents: [],
		})
	})
})
