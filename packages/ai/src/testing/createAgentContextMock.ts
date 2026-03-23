import { HandledError, type Schema, StatusCode } from '@purista/core'

import { type ConversationStore, InMemoryConversationStore } from '../memory/conversationStore.js'
import { createMessageFrame, createProtocolEnvelope } from '../protocol/helpers.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import { type AgentHandlerContext, createAgentHandlerContext, createProtocolBuffer } from '../runtime/context.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { createDefaultMessage, createResolvedAsyncSpy, createTestSpy, envelopesToAsyncIterator } from './shared.js'

export type AgentContextMockSpy<Args extends unknown[] = unknown[], Return = unknown> = ((...args: Args) => Return) & {
	calls: Args[]
	setImplementation(implementation: (...args: Args) => Return): AgentContextMockSpy<Args, Return>
	reset(): AgentContextMockSpy<Args, Return>
}

export type CreateAgentContextMockMessage = {
	id: string
	correlationId: string
	principalId?: string
	tenantId?: string
	sender: {
		serviceName: string
		serviceVersion: string
		serviceTarget: string
		instanceId: string
	}
}

export type CommandImplementation = (payload: unknown, parameter?: unknown) => Promise<unknown> | unknown
export type CommandMap = Record<string, Record<string, Record<string, CommandImplementation>>>

export type AgentBindingConfig = {
	call?: (payload: unknown, parameter?: unknown) => Promise<AgentProtocolEnvelope[]> | AgentProtocolEnvelope[]
	text?: string | ((payload: unknown, parameter?: unknown) => string | Promise<string>)
	object?: unknown | ((payload: unknown, parameter?: unknown) => unknown | Promise<unknown>)
	envelopes?:
		| AgentProtocolEnvelope[]
		| ((payload: unknown, parameter?: unknown) => AgentProtocolEnvelope[] | Promise<AgentProtocolEnvelope[]>)
	payloadSchema?: Schema
	parameterSchema?: Schema
}

export type AgentMap = Record<string, Record<string, AgentBindingConfig>>

export type CreateAgentContextMockInput<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
> = {
	payload: Payload
	parameter?: Parameter
	manifest?: Partial<AgentManifest> & Pick<AgentManifest, 'agentName' | 'agentVersion'>
	commands?: CommandMap
	agents?: AgentMap
	resources?: Partial<Resources>
	models?: Models
	conversationStore?: ConversationStore
	message?: Partial<CreateAgentContextMockMessage>
	onEnvelope?: (envelope: AgentProtocolEnvelope) => void | Promise<void>
	secrets?: Record<string, unknown>
	configs?: Record<string, unknown>
	initialStates?: Record<string, unknown>
}

export type NestedSpyMap = Record<
	string,
	Record<string, Record<string, AgentContextMockSpy<[unknown, unknown?], Promise<unknown>>>>
>
export type NestedAgentSpyMap = Record<
	string,
	Record<string, AgentContextMockSpy<[unknown, unknown?], Promise<AgentProtocolEnvelope[]>>>
>
export type TestSpan = {
	setAttribute: AgentContextMockSpy<[string, unknown], void>
	setAttributes: AgentContextMockSpy<[Record<string, unknown>], void>
	addEvent: AgentContextMockSpy<[string, Record<string, unknown>?], void>
	setStatus: AgentContextMockSpy<[unknown], void>
	recordException: AgentContextMockSpy<[unknown], void>
	end: AgentContextMockSpy<[], void>
	spanContext(): { traceId: string; spanId: string; traceFlags: number }
}

export type AgentContextMockResult<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
> = {
	context: AgentHandlerContext<Payload, Parameter, Resources, Models>
	protocol: ReturnType<typeof createProtocolBuffer>
	stubs: {
		logger: Record<
			'error' | 'warn' | 'info' | 'debug' | 'trace' | 'fatal',
			AgentContextMockSpy<[unknown, ...unknown[]], void>
		>
		emit: AgentContextMockSpy<[string, unknown], Promise<void>>
		startActiveSpan: AgentContextMockSpy<
			[string, unknown, unknown, (span: TestSpan) => unknown | Promise<unknown>],
			Promise<unknown>
		>
		commands: NestedSpyMap
		agents: NestedAgentSpyMap
		secrets: {
			getSecret: AgentContextMockSpy<[string], Promise<unknown>>
			setSecret: AgentContextMockSpy<[string, unknown], Promise<void>>
			removeSecret: AgentContextMockSpy<[string], Promise<void>>
		}
		configs: {
			getConfig: AgentContextMockSpy<[string], Promise<unknown>>
			setConfig: AgentContextMockSpy<[string, unknown], Promise<void>>
			removeConfig: AgentContextMockSpy<[string], Promise<void>>
		}
		states: {
			getState: AgentContextMockSpy<[...string[]], Promise<Record<string, unknown>>>
			setState: AgentContextMockSpy<[string, unknown], Promise<void>>
			removeState: AgentContextMockSpy<[string], Promise<void>>
		}
	}
	frames(): ReturnType<ReturnType<typeof createProtocolBuffer>['frames']>
	envelopes(): AgentProtocolEnvelope[]
	flush(): Promise<void>
}

export const createAgentContextMock = <
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
>(
	input: CreateAgentContextMockInput<Payload, Parameter, Resources, Models>,
): AgentContextMockResult<Payload, Parameter, Resources, Models> => {
	const commands = input.commands ?? {}
	const agents = input.agents ?? {}
	const defaultAllowedTools = Object.entries(commands).flatMap(([serviceName, versions]) =>
		Object.entries(versions).flatMap(([serviceVersion, commandMap]) =>
			Object.keys(commandMap).map(commandName => ({
				serviceName,
				serviceVersion,
				commandName,
			})),
		),
	)
	const defaultAllowedAgents = Object.entries(agents).flatMap(([agentName, versions]) =>
		Object.entries(versions).map(([agentVersion, binding]) => ({
			agentName,
			agentVersion,
			payloadSchema: binding.payloadSchema,
			parameterSchema: binding.parameterSchema,
		})),
	)

	const manifest: AgentManifest = {
		agentName: input.manifest?.agentName ?? 'testAgent',
		agentVersion: input.manifest?.agentVersion ?? '1',
		eventBridge: input.manifest?.eventBridge ?? 'default',
		allowedTools: input.manifest?.allowedTools ?? defaultAllowedTools,
		allowedAgents: input.manifest?.allowedAgents ?? defaultAllowedAgents,
		...(input.manifest ?? {}),
	}

	const message = createDefaultMessage(input.message)
	const stateValues = new Map(Object.entries(input.initialStates ?? {}))
	const secrets = new Map(Object.entries(input.secrets ?? {}))
	const configs = new Map(Object.entries(input.configs ?? {}))

	const logger = {
		error: createTestSpy((..._args: [unknown, ...unknown[]]) => {}),
		warn: createTestSpy((..._args: [unknown, ...unknown[]]) => {}),
		info: createTestSpy((..._args: [unknown, ...unknown[]]) => {}),
		debug: createTestSpy((..._args: [unknown, ...unknown[]]) => {}),
		trace: createTestSpy((..._args: [unknown, ...unknown[]]) => {}),
		fatal: createTestSpy((..._args: [unknown, ...unknown[]]) => {}),
	}

	const commandSpies: NestedSpyMap = {}
	const serviceApi: Record<string, Record<string, Record<string, CommandImplementation>>> = {}
	for (const [serviceName, versions] of Object.entries(commands)) {
		commandSpies[serviceName] = {}
		serviceApi[serviceName] = {}
		for (const [serviceVersion, commandMap] of Object.entries(versions)) {
			commandSpies[serviceName][serviceVersion] = {}
			serviceApi[serviceName][serviceVersion] = {}
			for (const [commandName, implementation] of Object.entries(commandMap)) {
				const spy = createTestSpy(
					async (payload: unknown, parameter?: unknown) => await implementation(payload, parameter),
				)
				commandSpies[serviceName][serviceVersion][commandName] = spy
				serviceApi[serviceName][serviceVersion][commandName] = spy
			}
		}
	}

	const agentSpies: NestedAgentSpyMap = {}
	const invokeAgentApi: Record<
		string,
		Record<
			string,
			{
				call: (
					payload: unknown,
					parameter?: unknown,
				) => {
					final(): Promise<AgentProtocolEnvelope[]>
					[Symbol.asyncIterator](): AsyncIterator<AgentProtocolEnvelope>
				}
				payloadSchema?: Schema
				parameterSchema?: Schema
			}
		>
	> = {}
	for (const [agentName, versions] of Object.entries(agents)) {
		agentSpies[agentName] = {}
		invokeAgentApi[agentName] = {}
		for (const [agentVersion, binding] of Object.entries(versions)) {
			const spy = createTestSpy(
				async (payload: unknown, parameter?: unknown) =>
					await resolveAgentBinding(agentName, agentVersion, binding, payload, parameter),
			)
			agentSpies[agentName][agentVersion] = spy
			invokeAgentApi[agentName][agentVersion] = {
				call: (payload: unknown, parameter?: unknown) => ({
					final: () => spy(payload, parameter),
					[Symbol.asyncIterator]: () => envelopesToAsyncIteratorFromPromise(spy(payload, parameter)),
				}),
				payloadSchema: binding.payloadSchema,
				parameterSchema: binding.parameterSchema,
			}
		}
	}

	const emit = createResolvedAsyncSpy<[string, unknown], void>(undefined)
	const startActiveSpan: AgentContextMockSpy<
		[string, unknown, unknown, (span: TestSpan) => unknown | Promise<unknown>],
		Promise<unknown>
	> = createTestSpy(
		async (_name: string, _options: unknown, _context: unknown, fn: (span: TestSpan) => unknown | Promise<unknown>) =>
			await fn({
				setAttribute: createTestSpy((_key: string, _value: unknown) => {}),
				setAttributes: createTestSpy((_value: Record<string, unknown>) => {}),
				addEvent: createTestSpy((_name: string, _attrs?: Record<string, unknown>) => {}),
				setStatus: createTestSpy((_value: unknown) => {}),
				recordException: createTestSpy((_value: unknown) => {}),
				end: createTestSpy(() => {}),
				spanContext: () => ({ traceId: 'trace-id', spanId: 'span-id', traceFlags: 1 }),
			}),
	)

	const getSecret = createTestSpy(async (name: string) => {
		if (!secrets.has(name)) {
			throw new Error(`Secret ${name} is not stubbed`)
		}
		return secrets.get(name)
	})
	const setSecret = createTestSpy(async (name: string, value: unknown) => {
		secrets.set(name, value)
	})
	const removeSecret = createTestSpy(async (name: string) => {
		secrets.delete(name)
	})
	const getConfig = createTestSpy(async (name: string) => {
		if (!configs.has(name)) {
			throw new Error(`Config ${name} is not stubbed`)
		}
		return configs.get(name)
	})
	const setConfig = createTestSpy(async (name: string, value: unknown) => {
		configs.set(name, value)
	})
	const removeConfig = createTestSpy(async (name: string) => {
		configs.delete(name)
	})
	const getState = createTestSpy(async (...names: string[]) =>
		Object.fromEntries(names.filter(name => stateValues.has(name)).map(name => [name, stateValues.get(name)])),
	)
	const setState = createTestSpy(async (name: string, value: unknown) => {
		stateValues.set(name, value)
	})
	const removeState = createTestSpy(async (name: string) => {
		stateValues.delete(name)
	})

	const serviceContext = {
		logger: {
			...logger,
			getChildLogger: () => serviceContext.logger,
		},
		message,
		startActiveSpan,
		service: serviceApi,
		emit,
		invokeAgent: invokeAgentApi,
		secrets: {
			getSecret,
			setSecret,
			removeSecret,
		},
		configs: {
			getConfig,
			setConfig,
			removeConfig,
		},
		states: {
			getState,
			setState,
			removeState,
		},
	} as const

	const protocolBuffer = createProtocolBuffer(serviceContext as never, { onEnvelope: input.onEnvelope })
	const resources = new Proxy((input.resources ?? {}) as Resources, {
		get(target, name) {
			if (typeof name !== 'string') {
				return undefined
			}
			if (!(name in target)) {
				throw new Error(`Resource ${name} is not stubbed`)
			}
			return target[name as keyof Resources]
		},
	})
	const context = createAgentHandlerContext({
		serviceContext: serviceContext as never,
		eventBridge: {
			instanceId: 'test-event-bridge',
			invoke: createTestSpy(
				async (message: unknown, _timeoutMs?: number) => await resolveEventBridgeInvocation(message, invokeAgentApi),
			),
			openStream: createTestSpy(async (..._args: [unknown, number?]) => {
				throw new Error('eventBridge does not support streams')
			}),
		} as never,
		payload: input.payload,
		parameter: (input.parameter ?? ({} as Parameter)) as Parameter,
		conversationStore: input.conversationStore ?? new InMemoryConversationStore(),
		protocol: protocolBuffer.protocol,
		resources,
		models: (input.models ?? ({} as Models)) as Models,
		embeddings: {},
		rerankers: {},
		manifest,
	})

	return {
		context: context as AgentHandlerContext<Payload, Parameter, Resources, Models>,
		protocol: protocolBuffer,
		stubs: {
			logger,
			emit,
			startActiveSpan,
			commands: commandSpies,
			agents: agentSpies,
			secrets: { getSecret, setSecret, removeSecret },
			configs: { getConfig, setConfig, removeConfig },
			states: { getState, setState, removeState },
		},
		frames: () => protocolBuffer.frames(),
		envelopes: () => protocolBuffer.toEnvelopes(),
		flush: () => protocolBuffer.flush(),
	}
}

const resolveAgentBinding = async (
	agentName: string,
	agentVersion: string,
	binding: AgentBindingConfig,
	payload: unknown,
	parameter?: unknown,
) => {
	if (binding.call) {
		return await binding.call(payload, parameter)
	}
	if (binding.envelopes) {
		return typeof binding.envelopes === 'function' ? await binding.envelopes(payload, parameter) : binding.envelopes
	}
	if (binding.object !== undefined) {
		const data = typeof binding.object === 'function' ? await binding.object(payload, parameter) : binding.object
		return [
			createProtocolEnvelope({
				conversationId: `${agentName}.${agentVersion}`,
				actor: { service: agentName, version: agentVersion, agent: agentName, instanceId: 'test-agent-instance' },
				frame: createMessageFrame({
					role: 'assistant',
					content: JSON.stringify(data),
					final: true,
				}),
			}),
		]
	}
	if (binding.text !== undefined) {
		const content = typeof binding.text === 'function' ? await binding.text(payload, parameter) : binding.text
		return [
			createProtocolEnvelope({
				conversationId: `${agentName}.${agentVersion}`,
				actor: { service: agentName, version: agentVersion, agent: agentName, instanceId: 'test-agent-instance' },
				frame: createMessageFrame({
					role: 'assistant',
					content,
					final: true,
				}),
			}),
		]
	}
	throw new HandledError(
		StatusCode.BadRequest,
		`Agent ${agentName}.${agentVersion} is declared but no mock response is configured`,
	)
}

const resolveEventBridgeInvocation = async (
	message: unknown,
	invokeAgentApi: Record<
		string,
		Record<
			string,
			{
				call: (
					payload: unknown,
					parameter?: unknown,
				) => {
					final(): Promise<AgentProtocolEnvelope[]>
				}
			}
		>
	>,
) => {
	const typedMessage = message as {
		receiver?: { serviceName?: string; serviceVersion?: string }
		payload?: { payload?: unknown; parameter?: unknown }
	}
	const serviceName = typedMessage.receiver?.serviceName
	const serviceVersion = typedMessage.receiver?.serviceVersion

	if (!serviceName || !serviceVersion) {
		throw new Error('eventBridge.invoke is not stubbed')
	}

	const agent = invokeAgentApi[serviceName]?.[serviceVersion]
	if (!agent) {
		throw new Error(`eventBridge.invoke is not stubbed for ${serviceName}.${serviceVersion}`)
	}

	return agent.call(typedMessage.payload?.payload, typedMessage.payload?.parameter).final()
}

const envelopesToAsyncIteratorFromPromise = async function* (promise: Promise<AgentProtocolEnvelope[]>) {
	yield* envelopesToAsyncIterator(await promise)
}
