import { type HandledError, StatusCode } from '@purista/core'
import { describe, expect, it } from 'vitest'

import type { AgentManifest } from '../types/AgentManifest.js'
import { createAgentRunStateHelpers } from './runState.js'

const manifest: AgentManifest = {
	agentName: 'plannerAgent',
	agentVersion: '1',
	eventBridge: 'default',
}

const createInMemoryStates = () => {
	const store = new Map<string, unknown>()
	return {
		store,
		api: {
			async getState(...stateNames: string[]) {
				return Object.fromEntries(stateNames.map(stateName => [stateName, store.get(stateName)]))
			},
			async setState(stateName: string, value: unknown) {
				store.set(stateName, value)
			},
			async removeState(stateName: string) {
				store.delete(stateName)
			},
		},
	}
}

const createRunState = (states: ReturnType<typeof createInMemoryStates>['api']) => {
	const artifacts: Array<{ artifactId: string; content: unknown; final?: boolean }> = []
	return {
		helper: createAgentRunStateHelpers({
			states,
			protocol: {
				emitArtifact(input) {
					artifacts.push({ artifactId: input.artifactId, content: input.content, final: input.final })
				},
			},
			manifest,
			payload: { sessionId: 'session-1' },
			message: {
				id: 'message-1',
				principalId: 'principal-1',
				tenantId: 'tenant-1',
			},
		}),
		artifacts,
	}
}

describe('agent run state helpers', () => {
	it('persists and reloads durable run state across helper instances', async () => {
		const shared = createInMemoryStates()
		const first = createRunState(shared.api)
		const run = await first.helper.start({
			title: 'Architecture Draft',
			extraScope: { projectId: 'voyage' },
		})

		await run.plan([
			{ id: 'analyze', title: 'Analyze workspace' },
			{ id: 'write', title: 'Write architecture files' },
		])
		await run.startTask('analyze')
		await run.completeTask('analyze', 'Workspace captured')

		const second = createRunState(shared.api)
		const persisted = await second.helper.get({ extraScope: { projectId: 'voyage' } })
		expect(persisted?.title).toBe('Architecture Draft')
		expect(persisted?.tasks[0]).toMatchObject({ id: 'analyze', status: 'completed', detail: 'Workspace captured' })
		expect(second.artifacts).toHaveLength(0)
	})

	it('emits run-state artifacts for lifecycle changes', async () => {
		const { helper, artifacts } = createRunState(createInMemoryStates().api)
		const run = await helper.start({
			title: 'Simulation Review',
			extraScope: { projectId: 'voyage' },
		})
		await run.plan([{ id: 'review', title: 'Review architecture' }])
		await run.startTask('review')
		await run.finishSuccess('Simulation ready for planning')

		expect(artifacts.some(item => item.artifactId === 'run-state')).toBe(true)
		const last = artifacts.at(-1)
		expect(last).toMatchObject({ artifactId: 'run-state', final: true })
		expect(last?.content).toMatchObject({ status: 'completed', summary: 'Simulation ready for planning' })
	})

	it('prevents duplicate lock acquisition until expiry', async () => {
		const shared = createInMemoryStates()
		const first = createRunState(shared.api)
		const second = createRunState(shared.api)

		const lock = await first.helper.lock({ extraScope: { projectId: 'voyage' }, key: 'validation', ttlMs: 50 })
		await expect(
			second.helper.lock({ extraScope: { projectId: 'voyage' }, key: 'validation', ttlMs: 50 }),
		).rejects.toMatchObject<Partial<HandledError>>({ errorCode: StatusCode.Conflict })

		await lock.release()
		await expect(
			second.helper.lock({ extraScope: { projectId: 'voyage' }, key: 'validation', ttlMs: 50 }),
		).resolves.toBeDefined()
	})

	it('can recover an expired lock', async () => {
		const shared = createInMemoryStates()
		const first = createRunState(shared.api)
		const second = createRunState(shared.api)
		await first.helper.lock({ extraScope: { projectId: 'voyage' }, key: 'architecture', ttlMs: 1 })
		await new Promise(resolve => setTimeout(resolve, 5))
		await expect(
			second.helper.lock({ extraScope: { projectId: 'voyage' }, key: 'architecture', ttlMs: 50 }),
		).resolves.toBeDefined()
	})
})
