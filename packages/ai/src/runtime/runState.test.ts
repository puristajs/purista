import { type HandledError, StatusCode } from '@purista/core'
import { describe, expect, it } from 'vitest'

import {
	buildTaskArtifactId,
	PURISTA_AI_PLAN_ARTIFACT_ID,
	PURISTA_AI_PLAN_STATUS_ARTIFACT_ID,
} from '../protocol/taskArtifacts.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { createAgentRunStateHelpers } from './runState.js'

const manifest: AgentManifest = {
	agentName: 'plannerAgent',
	serviceVersion: '1',
	eventBridge: 'default',
	allowedTools: [],
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
			scope: { projectId: 'voyage' },
		})

		await run.plan([
			{ id: 'analyze', title: 'Analyze workspace' },
			{ id: 'write', title: 'Write architecture files' },
		])
		await run.startTask('analyze')
		await run.completeTask('analyze', 'Workspace captured')

		const second = createRunState(shared.api)
		const persisted = await second.helper.get({ scope: { projectId: 'voyage' } })
		expect(persisted?.title).toBe('Architecture Draft')
		expect(persisted?.tasks[0]).toMatchObject({ id: 'analyze', status: 'completed', detail: 'Workspace captured' })
		expect(second.artifacts).toHaveLength(0)
	})

	it('emits run-state artifacts for lifecycle changes', async () => {
		const { helper, artifacts } = createRunState(createInMemoryStates().api)
		const run = await helper.start({
			title: 'Simulation Review',
			scope: { projectId: 'voyage' },
		})
		await run.plan([{ id: 'review', title: 'Review architecture' }])
		await run.startTask('review')
		await run.finishSuccess('Simulation ready for planning')

		expect(artifacts.some(item => item.artifactId === 'run-state')).toBe(true)
		const runStateArtifact = artifacts.filter(item => item.artifactId === 'run-state').at(-1)
		expect(runStateArtifact).toMatchObject({ artifactId: 'run-state', final: true })
		expect(runStateArtifact?.content).toMatchObject({ status: 'completed', summary: 'Simulation ready for planning' })
	})

	it('emits reserved plan and task artifacts for consumer-facing progress', async () => {
		const { helper, artifacts } = createRunState(createInMemoryStates().api)
		const run = await helper.start({
			title: 'Simulation Review',
			scope: { projectId: 'voyage' },
		})
		await run.plan([{ id: 'review', title: 'Review architecture' }])
		await run.startTask('review', 'Reading current state')
		await run.completeTask('review', 'Review complete')
		await run.finishSuccess('Simulation ready for planning')

		expect(artifacts.some(item => item.artifactId === PURISTA_AI_PLAN_ARTIFACT_ID)).toBe(true)
		expect(artifacts.some(item => item.artifactId === PURISTA_AI_PLAN_STATUS_ARTIFACT_ID)).toBe(true)
		expect(artifacts.some(item => item.artifactId === buildTaskArtifactId('review'))).toBe(true)
		expect(artifacts.find(item => item.artifactId === PURISTA_AI_PLAN_ARTIFACT_ID)?.content).toMatchObject({
			type: 'purista-ai-plan',
			tasks: [{ id: 'review', title: 'Review architecture' }],
		})
		expect(artifacts.filter(item => item.artifactId === buildTaskArtifactId('review')).at(-1)?.content).toMatchObject({
			type: 'purista-ai-task',
			taskId: 'review',
			status: 'completed',
		})
	})

	it('prevents duplicate lock acquisition until expiry', async () => {
		const shared = createInMemoryStates()
		const first = createRunState(shared.api)
		const second = createRunState(shared.api)

		const lock = await first.helper.lock({ scope: { projectId: 'voyage' }, key: 'validation', ttlMs: 50 })
		await expect(
			second.helper.lock({ scope: { projectId: 'voyage' }, key: 'validation', ttlMs: 50 }),
		).rejects.toMatchObject({ errorCode: StatusCode.Conflict } satisfies Partial<HandledError>)

		await lock.release()
		await expect(
			second.helper.lock({ scope: { projectId: 'voyage' }, key: 'validation', ttlMs: 50 }),
		).resolves.toBeDefined()
	})

	it('can recover an expired lock', async () => {
		const shared = createInMemoryStates()
		const first = createRunState(shared.api)
		const second = createRunState(shared.api)
		await first.helper.lock({ scope: { projectId: 'voyage' }, key: 'architecture', ttlMs: 1 })
		await new Promise(resolve => setTimeout(resolve, 5))
		await expect(
			second.helper.lock({ scope: { projectId: 'voyage' }, key: 'architecture', ttlMs: 50 }),
		).resolves.toBeDefined()
	})

	it('clears completed timestamps when a task is restarted', async () => {
		const { helper } = createRunState(createInMemoryStates().api)
		const run = await helper.start({
			title: 'Architecture Draft',
			scope: { projectId: 'voyage' },
		})

		await run.plan([{ id: 'write', title: 'Write artifacts' }])
		await run.startTask('write', 'Initial write')
		await run.completeTask('write', 'Primary write done')
		const completed = run.state.tasks[0]
		expect(completed.status).toBe('completed')
		expect(completed.completedAt).toBeDefined()

		await run.startTask('write', 'Retrying write')
		const restarted = run.state.tasks[0]
		expect(restarted.status).toBe('running')
		expect(restarted.detail).toBe('Retrying write')
		expect(restarted.completedAt).toBeUndefined()
	})

	it('derives implicit run scope keys from execution policy payload config', async () => {
		const shared = createInMemoryStates()
		const helper = createAgentRunStateHelpers({
			states: shared.api,
			protocol: {
				emitArtifact() {},
			},
			manifest: {
				...manifest,
				executionPolicy: {
					scopeFromPayload: ['projectId'],
				},
			},
			payload: { sessionId: 'session-1', projectId: 'voyage' },
			message: {
				id: 'message-1',
				principalId: 'principal-1',
				tenantId: 'tenant-1',
			},
		})
		const run = await helper.start({
			title: 'Architecture Draft',
		})

		await helper.update({
			phase: 'running',
			status: 'running',
		})

		expect(run.state.scope.extra).toEqual({ projectId: 'voyage' })
		const persisted = await helper.get()
		expect(persisted?.scope.extra).toEqual({ projectId: 'voyage' })
	})
})
