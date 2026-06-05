import { createSandbox } from 'sinon'

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

	it('fails startup when a durable workspace agent has no runtime or workspace adapter', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['runtime.workspace_checkpoint', 'workspace.durable'],
			},
		})

		await expect(initializeAttachedAgentRuntimes(scope, [definition], { models: {} })).rejects.toThrow(
			'Attached agent "triage" requires durable ai.runtime and ai.workspace in service.getInstance(...) options',
		)
	})

	it('fails startup when durable workspace capabilities are missing', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['runtime.workspace_checkpoint', 'workspace.durable', 'workspace.resume'],
			},
		})

		await expect(
			initializeAttachedAgentRuntimes(scope, [definition], {
				models: {},
				runtime: { capabilities: ['runtime.checkpoint'] } as never,
				workspace: { info: { capabilities: ['workspace.durable'] } },
			}),
		).rejects.toThrow(
			'Attached agent "triage" requires unavailable durable workspace capabilities: runtime.workspace_checkpoint, workspace.resume',
		)
	})

	it('allows explicit fresh ephemeral fallback when durable workspace adapters are absent', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			workspacePolicy: {
				mode: 'durable',
				required: false,
				capabilities: ['runtime.workspace_checkpoint', 'workspace.durable'],
			},
		})

		await expect(initializeAttachedAgentRuntimes(scope, [definition], { models: {} })).resolves.toEqual({
			shutdown: expect.any(Function),
		})
	})

	it('accepts durable workspace agents when runtime and workspace capabilities match', async () => {
		const scope = createAgentRuntimeScope()
		const definition = createAttachedAgentDefinition({
			workspacePolicy: {
				mode: 'durable',
				capabilities: ['runtime.workspace_checkpoint', 'workspace.durable', 'workspace.resume'],
			},
		})

		await expect(
			initializeAttachedAgentRuntimes(scope, [definition], {
				models: {},
				runtime: { capabilities: ['runtime.workspace_checkpoint'] } as never,
				workspace: { info: { capabilities: ['workspace.durable', 'workspace.resume'] } },
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
