import { describe, expect, it, vi } from 'vitest'

import type { AgentHandler } from '../builder/AgentBuilder.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { AgentInstance } from './AgentInstance.js'

const baseManifest: AgentManifest = {
	agentName: 'supportAgent',
	agentVersion: '1',
	eventBridge: 'default',
	allowedTools: [],
	concurrency: { poolId: 'support', maxWorkers: 1 },
}

const baseDependencies = {
	info: {
		agentName: 'supportAgent',
		agentVersion: '1',
	},
	manifest: baseManifest,
	serviceBuilder: {
		info: {
			serviceName: 'agent.supportAgent',
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
			models: ['openai:gpt-4o-mini'],
		}

		expect(
			() =>
				new AgentInstance(
					{ ...baseDependencies, manifest },
					{
						eventBridge: { instanceId: 'bridge-1' } as any,
						models: {},
					},
				),
		).toThrow('Missing model provider for alias "openai:gpt-4o-mini"')
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
			{ eventBridge, models: {} },
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
})
