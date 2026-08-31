import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createSandbox } from 'sinon'
import { z } from 'zod'

import type { LogFnParamType, Logger, LoggerOptions } from '../../core/types/Logger.js'
import { getEventBridgeMock } from '../../mocks/index.js'
import { ServiceBuilder } from '../../ServiceBuilder/ServiceBuilder.impl.js'
import type { AgentRuntimeOptions, AttachedAgentDefinition } from '../types.js'
import { createAgentRuntimeScope, getScopedAgentRuntime, initializeAttachedAgentRuntimes } from './scopedRuntime.js'

describe('attached agent scoped runtime', () => {
	const sandbox = createSandbox()

	afterEach(() => {
		sandbox.restore()
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

	it('requires every declared model alias to receive a concrete runtime model', async () => {
		const definition = await new ServiceBuilder({
			serviceName: 'support',
			serviceVersion: '1',
			serviceDescription: 'Support service',
		})
			.getAgentQueueBuilder('triage', 'Classify support tickets')
			.addModel('primary', { capabilities: ['object'] as const })
			.setRunFunction(async () => 'ok')
			.getDefinition()

		await expect(
			initializeAttachedAgentRuntimes(createAgentRuntimeScope(), [definition], {
				models: {
					primary: { provider: { id: 'test', genAiSystem: 'test' } } as never,
				},
			}),
		).rejects.toThrow(
			'Missing concrete runtime model for agent model alias "primary". Set ai.models["primary"].model in service.getInstance(...) options',
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

	it('constructs one shared Harness per service and shuts shared model providers down once', async () => {
		const close = vi.fn(async () => undefined)
		const provider = { id: 'shared-provider', genAiSystem: 'test', close }
		const service = new ServiceBuilder({
			serviceName: 'support',
			serviceVersion: '1',
			serviceDescription: 'Support service',
		})
		const first = await service
			.getAgentQueueBuilder('firstAgent', 'First attached agent')
			.addModel('primary', { capabilities: ['text'] as const, defaults: { temperature: 0.1 } })
			.setHarnessAgent({
				model: 'primary',
				instructions: 'Return the first result.',
				handler: async context => {
					expect(context.models.primary).toBeDefined()
					return 'first'
				},
			})
			.getDefinition()
		const second = await service
			.getAgentQueueBuilder('secondAgent', 'Second attached agent')
			.addModel('primary', { capabilities: ['text'] as const, defaults: { temperature: 0.8 } })
			.setHarnessAgent({
				model: 'primary',
				instructions: 'Return the second result.',
				handler: async context => {
					expect(context.models.primary).toBeDefined()
					return 'second'
				},
			})
			.getDefinition()
		const scope = createAgentRuntimeScope()
		const lifecycle = await initializeAttachedAgentRuntimes(scope, [first, second], {
			models: { primary: { provider, model: 'test-model', capabilities: ['text'] } },
		})

		await expect(
			getScopedAgentRuntime(scope, first).executeAggregate({
				appContext: createCommandContext('first-delivery'),
				message: { id: 'first-delivery' },
				payload: 'input',
				parameter: {},
			}),
		).resolves.toBe('first')
		await expect(
			getScopedAgentRuntime(scope, second).executeAggregate({
				appContext: createCommandContext('second-delivery'),
				message: { id: 'second-delivery' },
				payload: 'input',
				parameter: {},
			}),
		).resolves.toBe('second')

		await lifecycle.shutdown()
		await lifecycle.shutdown()
		expect(close).toHaveBeenCalledTimes(1)
	})

	it('isolates same-named workflow-local agents and model aliases in the shared Harness', async () => {
		const provider = { id: 'shared-provider', genAiSystem: 'test' }
		const service = new ServiceBuilder({
			serviceName: 'support',
			serviceVersion: '1',
			serviceDescription: 'Support service',
		})
		const createWorkflow = async (
			name: 'firstWorkflow' | 'secondWorkflow',
			prefix: 'first' | 'second',
			temperature: number,
		) => {
			const helper = {
				model: 'primary',
				input: z.string(),
				output: z.string(),
				instructions: `Return the ${prefix} result.`,
				handler: async (context: { input: string; models: Record<string, unknown> }) => {
					expect(context.models.primary).toBeDefined()
					return `${prefix}:${context.input}`
				},
			} as const
			return service
				.getAgentQueueBuilder(name, `${prefix} workflow`)
				.addPayloadSchema(z.string())
				.addOutputSchema(z.string())
				.addModel('primary', { capabilities: ['text'] as const, defaults: { temperature } })
				.setHarnessWorkflow<{ helper: typeof helper }>(
					{
						input: z.string(),
						output: z.string(),
						handler: async context => context.agents.helper(context.input),
					},
					{ agents: { helper } },
				)
				.getDefinition()
		}
		const first = await createWorkflow('firstWorkflow', 'first', 0.1)
		const second = await createWorkflow('secondWorkflow', 'second', 0.8)
		const scope = createAgentRuntimeScope()
		const lifecycle = await initializeAttachedAgentRuntimes(scope, [first, second], {
			models: { primary: { provider, model: 'test-model', capabilities: ['text'] } },
		})

		try {
			await expect(
				getScopedAgentRuntime(scope, first).executeAggregate({
					appContext: createCommandContext('first-workflow-delivery'),
					message: { id: 'first-workflow-delivery' },
					payload: 'input',
					parameter: {},
				}),
			).resolves.toBe('first:input')
			await expect(
				getScopedAgentRuntime(scope, second).executeAggregate({
					appContext: createCommandContext('second-workflow-delivery'),
					message: { id: 'second-workflow-delivery' },
					payload: 'input',
					parameter: {},
				}),
			).resolves.toBe('second:input')
		} finally {
			await lifecycle.shutdown()
		}
	})

	it.each([true, false])(
		'maps handler failures at the attached-agent boundary (invocation failed: %s)',
		async invocationFails => {
			const invocationError = new Error('Invocation failed')
			const logs: string[] = []
			const logger = new MemoryLogger(logs)
			const service = new ServiceBuilder({ serviceName: 'support', serviceVersion: '1', serviceDescription: 'Support' })
			const definition = await service
				.getAgentQueueBuilder('releaseFailure', 'Check invocation cleanup')
				.addModel('primary', { capabilities: ['object'] as const })
				.setRunFunction(async () => {
					if (invocationFails) throw invocationError
					return 'ok'
				})
				.getDefinition()
			const scope = createAgentRuntimeScope()
			const lifecycle = await initializeAttachedAgentRuntimes(scope, [definition], {
				models: {
					primary: { provider: { id: 'unused', genAiSystem: 'test' }, model: 'unused', capabilities: ['object'] },
				},
				logger,
			})
			try {
				const invocation = getScopedAgentRuntime(scope, definition).executeAggregate({
					appContext: createCommandContext('attached-agent-boundary'),
					message: { id: 'attached-agent-boundary' },
					payload: {},
					parameter: {},
				})
				if (invocationFails) {
					await expect(invocation).rejects.toMatchObject({ message: 'Attached agent execution failed.' })
				} else {
					await expect(invocation).resolves.toBe('ok')
				}
				expect(logs).toEqual([])
			} finally {
				await lifecycle.shutdown()
			}
		},
	)

	it('fails startup when a durable workspace agent has no storage or workspace', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			durability: { mode: 'required', runIdPath: ['runId'] },
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['storage.workspace_checkpoint', 'workspace.durable'],
			},
		})

		await expect(initializeAttachedAgentRuntimes(scope, [definition], { models: {} })).rejects.toThrow(
			'Attached agent "triage" requires persistent ai.storage in service.getInstance(...) options',
		)
	})

	it('fails startup when durable workspace capabilities are missing', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			durability: { mode: 'required', runIdPath: ['runId'] },
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['storage.workspace_checkpoint', 'workspace.durable', 'workspace.resume'],
			},
		})

		await expect(
			initializeAttachedAgentRuntimes(scope, [definition], {
				models: {},
				storage: { capabilities: ['storage.persistent'] } as never,
				workspace: { info: { capabilities: ['workspace.durable'] }, capabilities: ['workspace.durable'] } as never,
			}),
		).rejects.toThrow(
			'Attached agent "triage" requires unavailable durable workspace capabilities: storage.workspace_checkpoint, workspace.resume',
		)
	})

	it('does not allow a durable workspace to silently downgrade', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			durability: { mode: 'required', runIdPath: ['runId'] },
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['storage.workspace_checkpoint', 'workspace.durable'],
			},
		})

		await expect(initializeAttachedAgentRuntimes(scope, [definition], { models: {} })).rejects.toThrow(
			/persistent ai\.storage/,
		)
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

	it('exposes Harness telemetry to run-function handlers', async () => {
		const spans: string[] = []
		const definition = createAttachedAgentDefinition()
		definition.execution = {
			kind: 'runFunction',
			handler: async context => {
				await context.telemetry.span('purista.agent.handler', {}, async () => {
					spans.push('handler')
					return undefined
				})
				return 'ok'
			},
		}
		const scope = createAgentRuntimeScope()
		await initializeAttachedAgentRuntimes(scope, [definition], { models: {} })
		const runtime = getScopedAgentRuntime(scope, definition)

		await expect(
			runtime.executeAggregate({
				appContext: createCommandContext('telemetry-message'),
				message: { id: 'telemetry-message' },
				payload: {},
				parameter: {},
			}),
		).resolves.toBe('ok')
		expect(spans).toEqual(['handler'])
	})

	it('accepts durable workspace agents when runtime and workspace capabilities match', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			durability: { mode: 'required', runIdPath: ['runId'] },
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['storage.workspace_checkpoint', 'workspace.durable', 'workspace.resume'],
			},
		})

		await expect(
			initializeAttachedAgentRuntimes(scope, [definition], {
				models: {},
				storage: { capabilities: ['storage.persistent', 'storage.workspace_checkpoint'] } as never,
				workspace: {
					info: { capabilities: ['workspace.durable', 'workspace.resume'] },
					capabilities: ['workspace.durable', 'workspace.resume'],
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
	warn(..._args: LogFnParamType): void {}
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
