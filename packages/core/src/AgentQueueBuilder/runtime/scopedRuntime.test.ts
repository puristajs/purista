import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createSandbox } from 'sinon'

import type { LogFnParamType, Logger, LoggerOptions } from '../../core/types/Logger.js'
import { getEventBridgeMock } from '../../mocks/index.js'
import { ServiceBuilder } from '../../ServiceBuilder/ServiceBuilder.impl.js'
import type { AgentRuntimeOptions, AttachedAgentDefinition } from '../types.js'
import {
	createAgentRuntimeScope,
	getScopedAgentRuntime,
	initializeAttachedAgentRuntimes,
	resolveAttachedAgentSandbox,
} from './scopedRuntime.js'

describe('attached agent scoped runtime', () => {
	const sandbox = createSandbox()

	afterEach(() => {
		sandbox.restore()
	})

	describe('resolveAttachedAgentSandbox', () => {
		const runtimeSandbox = { kind: 'shared-runtime-sandbox' } as never
		const policyAdapter = { kind: 'policy-adapter' } as never

		it('uses the shared runtime sandbox when no policy is declared', () => {
			expect(resolveAttachedAgentSandbox(undefined, runtimeSandbox)).toBe(runtimeSandbox)
		})

		it('opts out of sandboxing when the policy explicitly disables it', () => {
			expect(resolveAttachedAgentSandbox({ enabled: false }, runtimeSandbox)).toBeUndefined()
			expect(resolveAttachedAgentSandbox({ enabled: false, adapter: policyAdapter }, runtimeSandbox)).toBeUndefined()
		})

		it('prefers the policy adapter over the shared runtime sandbox', () => {
			expect(resolveAttachedAgentSandbox({ enabled: true, adapter: policyAdapter }, runtimeSandbox)).toBe(policyAdapter)
		})

		it('falls back to the shared runtime sandbox when the policy enables sandboxing without an adapter', () => {
			expect(resolveAttachedAgentSandbox({ enabled: true }, runtimeSandbox)).toBe(runtimeSandbox)
		})
	})

	it('does not require ai.models when no attached agents exist', async () => {
		const scope = createAgentRuntimeScope()

		await expect(initializeAttachedAgentRuntimes(scope, [], undefined)).resolves.toEqual({
			shutdown: expect.any(Function),
		})
	})

	it('requires ai.models when attached agents exist', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition()

		await expect(initializeAttachedAgentRuntimes(scope, [definition], undefined)).rejects.toThrow(
			'AI attached agents require runtime ai.models in service.getInstance(...) options',
		)
	})

	it('keeps executors scoped per service instance for shared definitions', async () => {
		const definition = createAttachedAgentDefinition()
		const firstScope = createAgentRuntimeScope()
		const secondScope = createAgentRuntimeScope()
		const ai: AgentRuntimeOptions<Record<string, never>> = { models: {} }

		await initializeAttachedAgentRuntimes(firstScope, [definition], ai)
		await initializeAttachedAgentRuntimes(secondScope, [definition], ai)

		const firstRuntime = getScopedAgentRuntime(firstScope, definition)
		const secondRuntime = getScopedAgentRuntime(secondScope, definition)

		expect(firstRuntime).not.toBe(secondRuntime)
	})

	it('fails startup when a durable workspace agent has no runtime or workspace store', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['runtime.workspace_checkpoint', 'workspace_store.durable'],
			},
		})

		await expect(initializeAttachedAgentRuntimes(scope, [definition], { models: {} })).rejects.toThrow(
			'Attached agent "triage" requires durable ai.runtime and ai.workspaceStore in service.getInstance(...) options',
		)
	})

	it('fails startup when durable workspace capabilities are missing', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['runtime.workspace_checkpoint', 'workspace_store.durable', 'workspace_store.resume'],
			},
		})

		await expect(
			initializeAttachedAgentRuntimes(scope, [definition], {
				models: {},
				runtime: { capabilities: ['runtime.checkpoint'] } as never,
				workspaceStore: { info: { capabilities: ['workspace_store.durable'] } } as never,
			}),
		).rejects.toThrow(
			'Attached agent "triage" requires unavailable durable workspace capabilities: runtime.workspace_checkpoint, workspace_store.resume',
		)
	})

	it('allows explicit non-durable restart when durable workspace stores are absent', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			workspacePolicy: {
				mode: 'durable',
				required: false,
				capabilities: ['runtime.workspace_checkpoint', 'workspace_store.durable'],
			},
		})

		await expect(initializeAttachedAgentRuntimes(scope, [definition], { models: {} })).resolves.toEqual({
			shutdown: expect.any(Function),
		})
	})

	it('fails startup when a declared skill has no runtime binding', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			usedSkills: [{ names: ['incident-skill'] }],
		})

		await expect(initializeAttachedAgentRuntimes(scope, [definition], { models: {} })).rejects.toThrow(
			'Attached agent "triage" requires skill "incident-skill" but no runtime binding was provided',
		)
	})

	it('discovers project skills only from trusted project roots', async () => {
		const projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'purista-agent-project-'))
		const skillDir = path.join(projectRoot, '.agents', 'skills', 'incident-skill')
		await fs.mkdir(skillDir, { recursive: true })
		await fs.writeFile(
			path.join(skillDir, 'SKILL.md'),
			`---
name: incident-skill
description: Use this skill when handling incidents.
---
SECRET_BODY`,
		)
		const definition = createAttachedAgentDefinition({
			usedSkills: [{ names: ['incident-skill'] }],
		})

		await expect(
			initializeAttachedAgentRuntimes(createAgentRuntimeScope(), [definition], {
				models: {},
				skills: { discovery: { projectRoot } },
			}),
		).rejects.toThrow('Attached agent "triage" requires skill "incident-skill" but no runtime binding was provided')

		await expect(
			initializeAttachedAgentRuntimes(createAgentRuntimeScope(), [definition], {
				models: {},
				skills: { discovery: { projectRoot, trustedProjectRoots: [projectRoot] } },
			}),
		).resolves.toEqual({ shutdown: expect.any(Function) })
	})

	it('exposes metadata-only skill helpers to run-function handlers', async () => {
		const skillDir = await makeSkill('incident-skill')
		const definition = createAttachedAgentDefinition({
			usedSkills: [{ names: ['incident-skill'], resourceName: 'ops' }],
		})
		definition.execution = {
			kind: 'runFunction',
			handler: async context => {
				expect(context.harness.skills.catalog).toEqual([
					expect.objectContaining({
						name: 'incident-skill',
						description: 'Use this skill when handling incidents.',
						location: '/skills/incident-skill/SKILL.md',
						mountPath: '/skills/incident-skill',
						resourceName: 'ops',
					}),
				])
				expect(context.harness.skills.resolve('incident-skill')?.description).toBe(
					'Use this skill when handling incidents.',
				)
				expect(context.harness.skills.resolve('missing')).toBeUndefined()
				expect(context.harness.skills.systemPromptFragment()).toContain('Location: /skills/incident-skill/SKILL.md')
				expect(context.harness.skills.systemPromptFragment()).not.toContain('SECRET_BODY')
				return 'ok'
			},
		}
		const scope = createAgentRuntimeScope()
		await initializeAttachedAgentRuntimes(scope, [definition], {
			models: {},
			skills: {
				namespaces: {
					ops: {
						'incident-skill': { directory: skillDir },
					},
				},
			},
		})

		const runtime = getScopedAgentRuntime(scope, definition)
		await expect(
			runtime.executeAggregate({
				appContext: createCommandContext('skill-message'),
				message: { id: 'skill-message' },
				payload: {},
				parameter: {},
			}),
		).resolves.toBe('ok')
	})

	it('forwards the service metric context into run-function handlers', async () => {
		const recorded: Array<{ value: number }> = []
		const definition = createAttachedAgentDefinition()
		definition.execution = {
			kind: 'runFunction',
			handler: async context => {
				;(context.metrics as Record<string, { add(value: number): void }>)['app.agent.escalations'].add(3)
				return 'ok'
			},
		}
		const scope = createAgentRuntimeScope()
		await initializeAttachedAgentRuntimes(scope, [definition], { models: {} })
		const runtime = getScopedAgentRuntime(scope, definition)

		await expect(
			runtime.executeAggregate({
				appContext: {
					...createCommandContext('metric-message'),
					metrics: { 'app.agent.escalations': { add: (value: number) => recorded.push({ value }) } },
				},
				message: { id: 'metric-message' },
				payload: {},
				parameter: {},
			}),
		).resolves.toBe('ok')
		expect(recorded).toEqual([{ value: 3 }])
	})

	it('accepts durable workspace agents when runtime and workspace capabilities match', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['runtime.workspace_checkpoint', 'workspace_store.durable', 'workspace_store.resume'],
			},
		})

		await expect(
			initializeAttachedAgentRuntimes(scope, [definition], {
				models: {},
				runtime: { capabilities: ['runtime.workspace_checkpoint'] } as never,
				workspaceStore: {
					info: { capabilities: ['workspace_store.durable', 'workspace_store.resume'] },
				} as never,
			}),
		).resolves.toEqual({ shutdown: expect.any(Function) })
	})

	it('routes generated agent handlers through service-instance scoped runtimes', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'support',
			serviceVersion: '1',
			serviceDescription: 'Support service',
		})
		const firstLogs: string[] = []
		const secondLogs: string[] = []
		const definition = await serviceBuilder
			.getAgentQueueBuilder('triage', 'Classify support tickets')
			.setRunFunction(async context => {
				context.logger.info('agent run')
				return context.identity.transportMessageId
			})
			.getDefinition()

		serviceBuilder.addAgentDefinition(definition)
		const firstService = await serviceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: new MemoryLogger(firstLogs),
			ai: { models: {} },
		})
		const secondService = await serviceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: new MemoryLogger(secondLogs),
			ai: { models: {} },
		})

		const command = definition.command as unknown as {
			call(this: object, context: Record<string, unknown>, payload: unknown, parameter: unknown): Promise<unknown>
		}
		await command.call.call(firstService, createCommandContext('first-message'), {}, {})
		await command.call.call(secondService, createCommandContext('second-message'), {}, {})

		expect(definition.runtime.current).toBeUndefined()
		expect(firstLogs).toEqual(['agent run'])
		expect(secondLogs).toEqual(['agent run'])
	})
})

function createAttachedAgentDefinition(
	overrides: Partial<AttachedAgentDefinition['manifest']> = {},
): AttachedAgentDefinition {
	return {
		manifest: {
			serviceName: 'support',
			serviceVersion: '1',
			agentName: 'triage',
			description: 'Classify support tickets',
			runtimeRevision: 'test',
			models: {},
			session: { mode: 'ephemeral' },
			execution: {
				maxAttempts: 1,
				maxParallelHandlers: 1,
			},
			streamingMode: 'aggregate',
			allowedCommands: [],
			allowedAgents: [],
			usedSkills: [],
			builtInTools: false,
			...overrides,
		},
		metricDefinitions: {},
		execution: {
			kind: 'runFunction',
			handler: async () => 'ok',
		},
		runtime: {},
		queue: { queueName: 'agent:support:1:triage' },
		worker: { name: 'triage:worker', queueName: 'agent:support:1:triage' },
		command: { commandName: 'triage' },
		stream: { streamName: 'triageStream' },
	}
}

function createCommandContext(messageId: string) {
	type TestSpan = {
		recordException: () => void
		setStatus: () => void
		spanContext: () => Record<string, never>
	}
	const span = {
		recordException: () => undefined,
		setStatus: () => undefined,
		spanContext: () => ({}),
	} satisfies TestSpan
	return {
		message: { id: messageId },
		emit: async () => undefined,
		service: {},
		stream: {},
		queue: {},
		resources: {},
		startActiveSpan: async (_name: string, _opts: unknown, _ctx: unknown, cb: (span: TestSpan) => Promise<unknown>) =>
			cb(span),
		wrapInSpan: async (_name: string, _opts: unknown, cb: (span: TestSpan) => Promise<unknown>) => cb(span),
	}
}

class MemoryLogger implements Logger {
	constructor(private readonly messages: string[]) {}

	info(...args: LogFnParamType): void {
		this.write(args)
	}

	fatal(): void {}
	error(): void {}
	warn(): void {}
	debug(): void {}
	trace(): void {}

	getChildLogger(_options: LoggerOptions): Logger {
		return this
	}

	private write(args: LogFnParamType): void {
		const message = typeof args[0] === 'string' ? args[0] : args[1]
		if (message) {
			this.messages.push(message)
		}
	}
}

async function makeSkill(name: string): Promise<string> {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'purista-skill-'))
	const dir = path.join(root, name)
	await fs.mkdir(dir, { recursive: true })
	await fs.writeFile(
		path.join(dir, 'SKILL.md'),
		`---
name: ${name}
description: Use this skill when handling incidents.
---
SECRET_BODY`,
	)
	return dir
}
