import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { InMemoryStateStore } from '@purista/harness'
import { createSandbox } from 'sinon'
import { z } from 'zod'

import type { LogFnParamType, Logger, LoggerOptions } from '../../core/types/Logger.js'
import { getEventBridgeMock } from '../../mocks/index.js'
import { ServiceBuilder } from '../../ServiceBuilder/ServiceBuilder.impl.js'
import type { AgentRuntimeOptions, AttachedAgentDefinition } from '../types.js'
import { resolveHarnessSessionId } from './identity.js'
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

	it('lets ai.stateStore override the service state-store adapter', async () => {
		const definition = createAttachedAgentDefinition({
			models: { primary: { model: 'scripted', capabilities: ['object'] } },
		})
		definition.execution = {
			kind: 'harnessAgent',
			definition: {
				model: 'primary',
				input: z.object({}),
				output: z.object({ status: z.literal('ok') }),
				instructions: 'Return a scripted result.',
			},
		}
		const agentStateStore = new InMemoryStateStore()
		let providerCalls = 0
		const serviceStateStore = {
			name: 'service-state',
			getState: async () => ({}),
			setState: async () => undefined,
			removeState: async () => undefined,
			destroy: async () => undefined,
		} as never
		const provider = {
			id: 'scripted',
			genAiSystem: 'scripted',
			object: async () => {
				providerCalls += 1
				return {
					object: { status: 'ok' },
					usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
					finishReason: 'stop' as const,
				}
			},
		}
		const scope = createAgentRuntimeScope()

		await initializeAttachedAgentRuntimes(
			scope,
			[definition],
			{
				models: { primary: { provider: provider as never } },
				stateStore: agentStateStore,
			},
			serviceStateStore,
		)

		const invocation = {
			appContext: createCommandContext('state-override'),
			message: { id: 'state-override' },
			payload: {},
			parameter: {},
		}
		await expect(getScopedAgentRuntime(scope, definition).executeAggregate(invocation)).resolves.toEqual({
			status: 'ok',
		})
		await expect(getScopedAgentRuntime(scope, definition).executeAggregate(invocation)).resolves.toEqual({
			status: 'ok',
		})

		const sessionId = 'agent:support:1:triage:message:state-override'
		expect(providerCalls).toBe(1)
		expect(await agentStateStore.getSession(sessionId)).toBeDefined()
		expect(await agentStateStore.listMessages(sessionId)).toHaveLength(2)
	})

	it('keeps complete-turn history retention when the attached agent also configures a run timeout', async () => {
		const definition = createAttachedAgentDefinition({
			models: { primary: { model: 'scripted', capabilities: ['object'] } },
		})
		definition.manifest.session = {
			mode: 'conversation',
			payloadPath: ['conversationId'],
			retention: { history: { maxTurns: 1 } },
		}
		definition.manifest.execution = { ...definition.manifest.execution, timeoutMs: 1_000 }
		definition.execution = {
			kind: 'harnessAgent',
			definition: {
				model: 'primary',
				input: z.object({ conversationId: z.string(), question: z.string() }),
				output: z.object({ status: z.literal('ok') }),
				instructions: 'Return a scripted result.',
			},
		}
		const agentStateStore = new InMemoryStateStore()
		const provider = {
			id: 'scripted',
			genAiSystem: 'scripted',
			object: async () => ({
				object: { status: 'ok' },
				usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
				finishReason: 'stop' as const,
			}),
		}
		const scope = createAgentRuntimeScope()

		await initializeAttachedAgentRuntimes(scope, [definition], {
			models: { primary: { provider: provider as never } },
			stateStore: agentStateStore,
		})

		for (const [id, question] of [
			['delivery-1', 'first'],
			['delivery-2', 'second'],
		] as const) {
			await expect(
				getScopedAgentRuntime(scope, definition).executeAggregate({
					appContext: createCommandContext(id),
					message: { id },
					payload: { conversationId: 'support-thread', question },
					parameter: {},
				}),
			).resolves.toEqual({ status: 'ok' })
		}

		const sessionId = resolveHarnessSessionId(definition.manifest, 'delivery-2', { conversationId: 'support-thread' })
		expect(await agentStateStore.listMessages(sessionId)).toHaveLength(2)
	})

	it('rejects service-owned idle retention with an explicit Harness-native state store', async () => {
		const definition = createAttachedAgentDefinition({
			models: { primary: { model: 'scripted', capabilities: ['object'] } },
		})
		definition.manifest.session = { mode: 'ephemeral', retention: { idleTtlMs: 60_000 } }
		const scope = createAgentRuntimeScope()

		await expect(
			initializeAttachedAgentRuntimes(scope, [definition], {
				models: { primary: { provider: {} as never } },
				stateStore: new InMemoryStateStore(),
			}),
		).rejects.toThrow('uses service-owned idle, run, or event retention, which requires the service StateStore')
	})

	it('replays a model-capable custom handler with the stable delivery identity', async () => {
		let calls = 0
		const definition = createAttachedAgentDefinition({
			models: { primary: { model: 'scripted', capabilities: ['object'] } },
		})
		definition.execution = {
			kind: 'runFunction',
			handler: async () => {
				calls += 1
				return { status: 'ok' }
			},
		}
		const scope = createAgentRuntimeScope()
		await initializeAttachedAgentRuntimes(scope, [definition], {
			models: { primary: { provider: {} as never } },
			stateStore: new InMemoryStateStore(),
		})
		const invocation = {
			appContext: createCommandContext('stable-custom-handler'),
			message: { id: 'stable-custom-handler' },
			payload: {},
			parameter: {},
		}

		await expect(getScopedAgentRuntime(scope, definition).executeAggregate(invocation)).resolves.toEqual({
			status: 'ok',
		})
		await expect(getScopedAgentRuntime(scope, definition).executeAggregate(invocation)).resolves.toEqual({
			status: 'ok',
		})

		expect(calls).toBe(1)
	})

	it('rejects a changed custom-handler input for an existing delivery identity', async () => {
		let calls = 0
		const definition = createAttachedAgentDefinition({
			models: { primary: { model: 'scripted', capabilities: ['object'] } },
		})
		definition.execution = {
			kind: 'runFunction',
			handler: async () => {
				calls += 1
				return { status: 'ok' }
			},
		}
		const scope = createAgentRuntimeScope()
		await initializeAttachedAgentRuntimes(scope, [definition], {
			models: { primary: { provider: {} as never } },
			stateStore: new InMemoryStateStore(),
		})
		const runtime = getScopedAgentRuntime(scope, definition)

		await expect(
			runtime.executeAggregate({
				appContext: createCommandContext('stable-input'),
				message: { id: 'stable-input' },
				payload: { request: 'first' },
				parameter: {},
			}),
		).resolves.toEqual({ status: 'ok' })
		await expect(
			runtime.executeAggregate({
				appContext: createCommandContext('stable-input'),
				message: { id: 'stable-input' },
				payload: { request: 'changed' },
				parameter: {},
			}),
		).rejects.toThrow('idempotencyKey is already bound to a different agent invocation')

		expect(calls).toBe(1)
	})

	it('keeps the active custom-handler invocation when a concurrent duplicate is rejected', async () => {
		const definition = createAttachedAgentDefinition({
			models: { primary: { model: 'scripted', capabilities: ['object'] } },
		})
		let handlerCalls = 0
		definition.execution = {
			kind: 'runFunction',
			handler: async () => {
				handlerCalls += 1
				return { status: 'ok' }
			},
		}
		const store = new BlockingCreateRunStateStore()
		const scope = createAgentRuntimeScope()
		await initializeAttachedAgentRuntimes(scope, [definition], {
			models: { primary: { provider: {} as never } },
			stateStore: store,
		})
		const runtime = getScopedAgentRuntime(scope, definition)
		const invocation = {
			appContext: createCommandContext('concurrent-custom-handler'),
			message: { id: 'concurrent-custom-handler' },
			payload: {},
			parameter: {},
		}

		const first = runtime.executeAggregate(invocation)
		await store.waitUntilBlocked()
		await expect(runtime.executeAggregate(invocation)).rejects.toThrow('Session is busy')
		store.release()
		await expect(first).resolves.toEqual({ status: 'ok' })
		expect(handlerCalls).toBe(1)
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

class BlockingCreateRunStateStore extends InMemoryStateStore {
	private resolveBlocked!: () => void
	private resolveGate!: () => void
	private readonly blocked = new Promise<void>(resolve => {
		this.resolveBlocked = resolve
	})
	private readonly gate = new Promise<void>(resolve => {
		this.resolveGate = resolve
	})
	private blockedOnce = false

	override async createRun(record: Parameters<InMemoryStateStore['createRun']>[0]): Promise<void> {
		if (!this.blockedOnce) {
			this.blockedOnce = true
			this.resolveBlocked()
			await this.gate
		}
		await super.createRun(record)
	}

	async waitUntilBlocked(): Promise<void> {
		await this.blocked
	}

	release(): void {
		this.resolveGate()
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
