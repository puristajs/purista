import type { Logger as PuristaLogger } from '@purista/core'
import { FakeModelProvider } from '@purista/harness/testing'

import type {
	AgentHandlerContext,
	AgentModelBinding,
	AgentRunIdentity,
	AgentRuntimeModelBindings,
	AttachedAgentDefinition,
} from '../builder/types.js'
import { createAgentExecutor } from '../runtime/executor.js'

export type CreateAgentContextMockInput<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
> = {
	payload?: Payload
	parameter?: Parameter
	resources?: Resources
	models?: AgentHandlerContext<Payload, Parameter, Resources, Models>['harness']['models']
	identity?: Partial<AgentRunIdentity>
	logger?: PuristaLogger
}

export function createAgentContextMock<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
>(
	input: CreateAgentContextMockInput<Payload, Parameter, Resources, Models> = {},
): AgentHandlerContext<Payload, Parameter, Resources, Models> {
	const identity: AgentRunIdentity = {
		transportMessageId: 'test-message',
		serviceName: 'test',
		serviceVersion: '1',
		agentName: 'agent',
		runtimeRevision: 'test',
		runId: 'test-run',
		harnessSessionId: 'test-session',
		...input.identity,
	}

	return {
		payload: input.payload as Payload,
		parameter: input.parameter as Parameter,
		identity,
		app: {
			message: { id: identity.transportMessageId },
			resources: (input.resources ?? {}) as Resources,
			emit: async () => undefined,
			service: {},
			stream: {},
			queue: {},
		},
		harness: {
			session: createSessionMock(identity.harnessSessionId),
			models: (input.models ?? {}) as AgentHandlerContext<Payload, Parameter, Resources, Models>['harness']['models'],
			events: {
				emit: async () => undefined,
			},
		},
		invoke: {
			tools: {},
			agents: {},
		},
		logger: input.logger ?? createNoopPuristaLogger(),
		signal: new AbortController().signal,
	}
}

export function createScriptedHarnessModel() {
	return new FakeModelProvider()
}

export type CreateAgentTestHarnessOptions<Models extends Record<string, AgentModelBinding>> = {
	models: AgentRuntimeModelBindings<Models>
	logger?: PuristaLogger
}

export function createAgentTestHarness<Definition extends AttachedAgentDefinition<any>>(
	definition: Definition,
	options: CreateAgentTestHarnessOptions<Definition['manifest']['models']>,
) {
	const executor = createAgentExecutor({
		definition,
		manifest: definition.manifest,
		models: options.models,
		logger: options.logger,
	})
	definition.runtime.current = executor

	return {
		async run(input: { payload?: unknown; parameter?: unknown; message?: Record<string, unknown> }) {
			return executor.executeAggregate({
				appContext: createAppContext(options.logger),
				message: input.message ?? { id: 'test-message' },
				payload: input.payload,
				parameter: input.parameter,
			})
		},
		async stream(input: { payload?: unknown; parameter?: unknown; message?: Record<string, unknown> }) {
			const chunks: unknown[] = []
			let final: unknown
			await executor.executeStream({
				appContext: createAppContext(options.logger),
				message: input.message ?? { id: 'test-message' },
				payload: input.payload,
				parameter: input.parameter,
				writer: {
					write: async chunk => {
						chunks.push(chunk)
					},
					close: async value => {
						final = value
					},
					fail: async error => {
						throw error
					},
					onCancel: () => undefined,
				},
			})
			return { chunks, final }
		},
	}
}

function createSessionMock(id: string) {
	return {
		id,
		agents: {},
		workflows: {},
		memory: {
			read: async () => undefined,
			write: async () => undefined,
			delete: async () => undefined,
			list: async () => [],
		},
		history: {
			list: async () => [],
		},
		clearHistory: async () => undefined,
		replaceHistory: async () => undefined,
		close: async () => undefined,
	}
}

function createAppContext(logger?: PuristaLogger) {
	return {
		message: { id: 'test-message' },
		resources: {},
		emit: async () => undefined,
		service: {},
		stream: {},
		queue: {},
		logger: logger ?? createNoopPuristaLogger(),
	}
}

function createNoopPuristaLogger(): PuristaLogger {
	const write = () => undefined
	return {
		info: write,
		fatal: write,
		error: write,
		warn: write,
		debug: write,
		trace: write,
		getChildLogger: () => createNoopPuristaLogger(),
	} as PuristaLogger
}
