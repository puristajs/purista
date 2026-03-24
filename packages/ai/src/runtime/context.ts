import type {
	AgentInvokeList,
	CommandFunctionContext,
	EmitCustomMessageFunction,
	EmptyObject,
	EventBridge,
	InferIn,
	InvokeList,
	Logger,
	QueueInvokeList,
	Schema,
	StreamFunctionContext,
	StreamInvokeList,
} from '@purista/core'
import { HandledError, PuristaSpanTag, StatusCode, validate } from '@purista/core'

import { createExposeHelpers, type ExposeHelpers } from '../bridge/externalRuntime.js'
import type {
	ConversationStore,
	ConversationStoreRecord,
	ConversationStoreRecordData,
	ConversationStoreScope,
} from '../memory/conversationStore.js'
import {
	agentProtocolEnvelopeSchema,
	createArtifactFrame,
	createEnvelopeFromContext,
	createErrorFrame,
	createMessageFrame,
	createTelemetryFrame,
	createToolEventFrame,
} from '../protocol/index.js'
import type { AgentProtocolEnvelope, AgentProtocolFrame } from '../protocol/types.js'
import type {
	ModelProvider,
	ProviderEmbedManyRequest,
	ProviderEmbedManyResponse,
	ProviderEmbedRequest,
	ProviderEmbedResponse,
	ProviderRerankRequest,
	ProviderRerankResponse,
} from '../providers/runtime/ModelProvider.js'
import type {
	SkillDocument,
	SkillMetadata,
	SkillReferenceDocument,
	SkillResource,
	SkillSearchInput,
} from '../skills/fileSystem.js'
import type { AgentManifest, AgentSkillConfig, AllowedToolDefinition } from '../types/AgentManifest.js'
import { type AgentApprovalHelpers, createAgentApprovalHelpers } from './approvals.js'
import { type ConversationHelpers, createConversationHelpers } from './conversation.js'
import type { AgentExecutionBudget } from './executionBudget.js'
import { invokeAgent } from './invokeAgent.js'
import { type AgentPolicyHelpers, createAgentPolicyHelpers } from './policy.js'
import { type AgentReflectionHelpers, createAgentReflectionHelpers } from './reflection.js'
import { type AgentRunStateHelpers, createAgentRunStateHelpers } from './runState.js'
import { createScopedSessionId, resolveBaseSessionId } from './sessionIdentity.js'
import { withSessionIdInPayload } from './sessionPayload.js'

type ProtocolFrameEntry = {
	frame: AgentProtocolFrame
	envelope: AgentProtocolEnvelope
}

const withAiInvocationSpan = async <T>(
	serviceContext: ProtocolContext<any, any, Record<string, unknown>, any, any>,
	name: string,
	attributes: Record<string, string | number | boolean | undefined>,
	run: () => Promise<T>,
) =>
	await serviceContext.startActiveSpan(name, {}, undefined, async span => {
		for (const [key, value] of Object.entries({
			...attributes,
			[PuristaSpanTag.PrincipalId]: serviceContext.message.principalId,
			[PuristaSpanTag.TenantId]: serviceContext.message.tenantId,
		})) {
			if (value !== undefined) {
				span.setAttribute(key, value)
			}
		}
		return await run()
	})

export type ProtocolEmitter = {
	emitMessage(
		content: string | { content: string; summary?: string; partial?: boolean; final?: boolean },
		options?: { summary?: string; partial?: boolean; final?: boolean },
	): void
	emitArtifact(input: {
		artifactId: string
		content: string | Record<string, unknown>
		mimeType?: string
		sequence?: number
		total?: number
		final?: boolean
	}): void
	emitTelemetry(metrics: {
		durationMs?: number
		waitTimeMs?: number
		poolId?: string
		maxConcurrencyPerInstance?: number
		activeWorkers?: number
		waitingWorkers?: number
		replicaCountHint?: number
		effectiveMaxConcurrencyHint?: number
		provider?: string
		usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number; costUsd?: number }
	}): void
	emitToolEvent(event: {
		toolName: string
		status: 'invoked' | 'success' | 'error'
		input?: unknown
		output?: unknown
		message?: string
		errorCode?: string
	}): void
	emitError(error: unknown, overrides?: { code?: string; handled?: boolean }): void
	has(kind: AgentProtocolFrame['kind']): boolean
}

export type AgentProtocolBuffer = {
	protocol: ProtocolEmitter
	toEnvelopes(): AgentProtocolEnvelope[]
	frames(): AgentProtocolFrame[]
	flush(): Promise<void>
}

export type AgentStreamEmitter = {
	sendChunk(content: string): void
	sendFinal(content: string, options?: { summary?: string }): void
	sendReasoning(content: string, options?: { artifactId?: string }): void
	sendArtifact(input: {
		artifactId: string
		content: string | Record<string, unknown>
		mimeType?: string
		sequence?: number
		total?: number
		final?: boolean
	}): void
	sendError(error: unknown, overrides?: { code?: string; handled?: boolean }): void
}

const createStreamEmitter = (protocol: ProtocolEmitter): AgentStreamEmitter => ({
	sendChunk(content) {
		if (content.length === 0) {
			return
		}
		protocol.emitMessage({ content, partial: true, final: false })
	},
	sendFinal(content, options) {
		if (content.length === 0) {
			return
		}
		protocol.emitMessage({ content, summary: options?.summary, partial: false, final: true })
	},
	sendReasoning(content, options) {
		protocol.emitArtifact({
			artifactId: options?.artifactId ?? 'reasoning',
			content,
			mimeType: 'text/markdown',
			final: false,
		})
	},
	sendArtifact(input) {
		protocol.emitArtifact(input)
	},
	sendError(error, overrides) {
		protocol.emitError(error, overrides)
	},
})

const stringifyResult = (result: unknown): string => {
	if (typeof result === 'string') {
		return result
	}
	if (typeof result === 'number' || typeof result === 'boolean') {
		return String(result)
	}
	if (result === undefined || result === null) {
		return ''
	}
	try {
		return JSON.stringify(result)
	} catch {
		return String(result)
	}
}

export type ProtocolBufferOptions = {
	onEnvelope?: (envelope: AgentProtocolEnvelope) => void | Promise<void>
}

export type ProtocolContext<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitList extends Record<string, Schema> = Record<string, Schema>,
> =
	| CommandFunctionContext<
			Payload,
			Parameter,
			Resources,
			InvokeList,
			StreamInvokeList,
			EmitList,
			QueueInvokeList,
			AgentInvokes
	  >
	| StreamFunctionContext<
			Payload,
			Parameter,
			Resources,
			InvokeList,
			StreamInvokeList,
			EmitList,
			QueueInvokeList,
			AgentInvokes
	  >

export const createProtocolBuffer = (
	context: ProtocolContext<any, any, Record<string, unknown>, any, any>,
	config: ProtocolBufferOptions = {},
): AgentProtocolBuffer => {
	const frames: ProtocolFrameEntry[] = []
	let flushPromise = Promise.resolve()
	const pushFrame = (frame: AgentProtocolFrame) => {
		const envelope = createEnvelopeFromContext(context, frame)
		frames.push({ frame, envelope })
		if (config.onEnvelope) {
			flushPromise = flushPromise.then(async () => {
				await config.onEnvelope?.(envelope)
			})
		}
	}

	const protocol: ProtocolEmitter = {
		emitMessage(content, messageOptions) {
			const message =
				typeof content === 'object' && content !== null && 'content' in content
					? {
							content: stringifyResult(content.content),
							summary: content.summary ?? messageOptions?.summary,
							partial: content.partial ?? messageOptions?.partial,
							final: content.final ?? messageOptions?.final,
						}
					: {
							content: stringifyResult(content),
							summary: messageOptions?.summary,
							partial: messageOptions?.partial,
							final: messageOptions?.final,
						}
			const frame = createMessageFrame({
				role: 'assistant',
				content: message.content,
				summary: message.summary,
				partial: message.partial,
				final: message.final,
			})
			if (frame.content.length === 0) {
				return
			}
			pushFrame(frame)
		},
		emitArtifact(input) {
			const frame = createArtifactFrame({
				artifactId: input.artifactId,
				phase: input.final ? 'final' : 'chunk',
				sequence: input.sequence,
				total: input.total,
				content: input.content,
				mimeType: input.mimeType,
				lastChunk: input.final,
			})
			pushFrame(frame)
		},
		emitTelemetry(metrics) {
			const frame = createTelemetryFrame({
				durationMs: metrics.durationMs,
				waitTimeMs: metrics.waitTimeMs,
				poolId: metrics.poolId,
				maxConcurrencyPerInstance: metrics.maxConcurrencyPerInstance,
				activeWorkers: metrics.activeWorkers,
				waitingWorkers: metrics.waitingWorkers,
				replicaCountHint: metrics.replicaCountHint,
				effectiveMaxConcurrencyHint: metrics.effectiveMaxConcurrencyHint,
				provider: metrics.provider,
				usage: metrics.usage
					? {
							promptTokens: metrics.usage.promptTokens,
							completionTokens: metrics.usage.completionTokens,
							totalTokens: metrics.usage.totalTokens,
							costUsd: metrics.usage.costUsd,
						}
					: undefined,
			})
			pushFrame(frame)
		},
		emitToolEvent(event) {
			const frame = createToolEventFrame({
				toolName: event.toolName,
				status: event.status,
				args: event.input,
				result: event.output,
				message: event.message,
				errorCode: event.errorCode,
			})
			pushFrame(frame)
		},
		emitError(error, overrides) {
			const err =
				error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Agent error', { cause: error })
			const frame = createErrorFrame({
				code: overrides?.code ?? 'AgentError',
				message: err.message,
				handled: overrides?.handled ?? error instanceof HandledError,
				details: {
					stack: err.stack,
					cause: err.cause,
				},
			})
			pushFrame(frame)
		},
		has(kind) {
			return frames.some(entry => entry.frame.kind === kind)
		},
	}

	return {
		protocol,
		toEnvelopes() {
			return frames.map(entry => entry.envelope)
		},
		frames() {
			return frames.map(entry => entry.frame)
		},
		async flush() {
			await flushPromise
		},
	}
}

export type ToolInvoker = {
	list(): AllowedToolDefinition[]
	invoke: Record<string, Record<string, Record<string, (payload: unknown, parameter?: unknown) => Promise<unknown>>>>
}

const createToolInvoker = (
	serviceContext: ProtocolContext<any, any, Record<string, unknown>, any, any>,
	tools: AllowedToolDefinition[],
	protocol: ProtocolEmitter,
	executionBudget?: AgentExecutionBudget,
): ToolInvoker => {
	type ServiceInvokeMap = Record<
		string,
		Record<string, Record<string, (payload: unknown, parameter: unknown) => Promise<unknown>>>
	>
	const services = serviceContext.service as ServiceInvokeMap
	const map = new Map<string, AllowedToolDefinition>()
	for (const tool of tools) {
		const key = `${tool.serviceName}.${tool.serviceVersion}.${tool.commandName}`
		map.set(key, tool)
	}

	const emitStatus = (
		tool: AllowedToolDefinition,
		status: 'invoked' | 'success' | 'error',
		input?: unknown,
		output?: unknown,
		errorCode?: string,
	) => {
		protocol.emitToolEvent({
			toolName: `${tool.serviceName}.${tool.serviceVersion}.${tool.commandName}`,
			status,
			input,
			output,
			errorCode,
		})
	}

	const invoke = async (tool: AllowedToolDefinition, payload: unknown, parameter?: unknown) => {
		const serviceApi = services[tool.serviceName]
		if (!serviceApi) {
			throw new HandledError(StatusCode.BadRequest, `Service ${tool.serviceName} not available for tool invocation`)
		}
		const versionApi = serviceApi[tool.serviceVersion]
		if (!versionApi) {
			throw new HandledError(
				StatusCode.BadRequest,
				`Version ${tool.serviceVersion} for service ${tool.serviceName} not registered`,
			)
		}
		const commandFn = versionApi[tool.commandName]
		if (!commandFn) {
			throw new HandledError(
				StatusCode.BadRequest,
				`Command ${tool.commandName} not available on service ${tool.serviceName} v${tool.serviceVersion}`,
			)
		}
		return await withAiInvocationSpan(
			serviceContext,
			`ai.tool_call:${tool.serviceName}/${tool.commandName}`,
			{
				'purista.ai.tool_name': `${tool.serviceName}.${tool.serviceVersion}.${tool.commandName}`,
				'purista.ai.tool_kind': 'command',
			},
			async () => {
				try {
					executionBudget?.consumeToolCall({
						toolName: `${tool.serviceName}.${tool.serviceVersion}.${tool.commandName}`,
						kind: 'tool',
					})
					emitStatus(tool, 'invoked', payload)
					const result = await commandFn(payload, parameter ?? {})
					emitStatus(tool, 'success', payload, result)
					return result
				} catch (error) {
					const handled = error instanceof HandledError
					emitStatus(tool, 'error', payload, undefined, handled ? String(error.errorCode) : 'UnhandledError')
					throw error
				}
			},
		)
	}

	const getAllowedTool = (serviceName: string, serviceVersion: string, commandName: string) => {
		const key = `${serviceName}.${serviceVersion}.${commandName}`
		return map.get(key)
	}

	const invokeProxy = new Proxy(
		{},
		{
			get: (_target, serviceProp) => {
				if (typeof serviceProp !== 'string') {
					return undefined
				}
				return new Proxy(
					{},
					{
						get: (_targetVersion, versionProp) => {
							if (typeof versionProp !== 'string') {
								return undefined
							}
							return new Proxy(
								{},
								{
									get: (_targetCommand, commandProp) => {
										if (typeof commandProp !== 'string') {
											return undefined
										}
										return async (payload: unknown, parameter?: unknown) => {
											const tool = getAllowedTool(serviceProp, versionProp, commandProp)
											if (!tool) {
												throw new HandledError(
													StatusCode.BadRequest,
													`Tool ${serviceProp}.${versionProp}.${commandProp} not allowlisted`,
												)
											}
											return await invoke(tool, payload, parameter)
										}
									},
								},
							)
						},
					},
				)
			},
		},
	) as ToolInvoker['invoke']

	return {
		list: () => [...tools],
		invoke: invokeProxy,
	}
}

export type SessionHelpers = {
	/**
	 * Load the session record. If no id is provided, the default scoped id is used.
	 */
	load(sessionId?: string): Promise<ConversationStoreRecord | undefined>
	/**
	 * Save session data. If `sessionId` is omitted, the default scoped id is used.
	 */
	save(
		record:
			| ConversationStoreRecord
			| { conversationId?: string; data: ConversationStoreRecordData; updatedAt?: number },
	): Promise<void>
	/**
	 * Delete a session. If no id is provided, the default scoped id is used.
	 */
	delete(sessionId?: string): Promise<void>
	/**
	 * Returns the effective scoped session id for explicit or implicit usage.
	 */
	resolveSessionId(sessionId?: string): string
	/**
	 * Identity metadata used to build scoped session ids.
	 */
	identity: {
		agentName: string
		agentVersion: string
		tenantId?: string
		principalId?: string
		baseSessionId: string
	}
}

type SessionIdentityInput = {
	context: ProtocolContext<any, any, Record<string, unknown>, any, any>
	manifest: AgentManifest
	payload: unknown
}

const createSessionHelpers = (store: ConversationStore, input: SessionIdentityInput): SessionHelpers => {
	const baseSessionId = resolveBaseSessionId(input.context, input.payload)
	const identity = {
		agentName: input.manifest.agentName,
		agentVersion: input.manifest.agentVersion,
		tenantId: input.context.message.tenantId,
		principalId: input.context.message.principalId,
		baseSessionId,
	}

	const storeScope: ConversationStoreScope = {
		agentName: identity.agentName,
		agentVersion: identity.agentVersion,
		tenantId: identity.tenantId,
		principalId: identity.principalId,
	}

	const resolveId = (sessionId?: string) =>
		createScopedSessionId({
			agentName: identity.agentName,
			agentVersion: identity.agentVersion,
			baseSessionId: sessionId ?? identity.baseSessionId,
			tenantId: identity.tenantId,
			principalId: identity.principalId,
		})

	return {
		load: sessionId => store.load(sessionId ?? identity.baseSessionId, storeScope),
		save: record =>
			store.save(
				{
					conversationId: record.conversationId || identity.baseSessionId,
					data: record.data,
					updatedAt: record.updatedAt ?? Date.now(),
				},
				storeScope,
			),
		delete: sessionId => store.delete(sessionId ?? identity.baseSessionId, storeScope),
		resolveSessionId: resolveId,
		identity,
	}
}

export type AgentHandlerContext<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = EmptyObject,
> = {
	logger: Logger
	input: {
		payload: Payload
		parameter: Parameter
		message: ProtocolContext<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>>['message']
	}
	output: {
		emit: EmitCustomMessageFunction<EmitPayloads>
	}
	memory: {
		conversation: ConversationHelpers
		session: SessionHelpers
		run: AgentRunStateHelpers
	}
	invoke: {
		tools: ToolInvoker
		expose: ExposeHelpers
		agents: {
			/**
			 * Invokes another agent via EventBridge and returns its emitted envelopes.
			 * Supports both direct options-based calls and typed chained access:
			 * `context.invoke.agents.invoke({ agentName, agentVersion, payload })`
			 * and `context.invoke.agents.invoke.someAgent['1'].call(payload, parameter)`.
			 */
			invoke: AgentInvokes & ((options: AgentInvocationOptions) => Promise<AgentProtocolEnvelope[]>)
			/**
			 * Invokes another agent and extracts a best-effort assistant text output from message frames.
			 */
			runText(options: AgentInvocationOptions): Promise<string>
			/**
			 * Invokes another agent and forwards its live output into the current stream.
			 * Defaults to forwarding assistant text, reasoning, artifacts, and errors while suppressing
			 * synthetic outer `agent.run` tool telemetry.
			 */
			forward(options: AgentForwardInvocationOptions): Promise<AgentProtocolEnvelope[]>
			/**
			 * Invokes another agent and parses the final assistant message as JSON.
			 */
			runObject<T = unknown>(options: AgentInvocationOptions): Promise<T>
		}
	}
	ai: {
		models: Models
		embeddings: {
			[Alias in keyof Models as Models[Alias] extends { embed: (...args: any[]) => any } ? Alias : never]: {
				name: string
				embed(request: ProviderEmbedRequest): Promise<ProviderEmbedResponse>
				embedMany?(request: ProviderEmbedManyRequest): Promise<ProviderEmbedManyResponse>
			}
		}
		rerankers: {
			[Alias in keyof Models as Models[Alias] extends { rerank: (...args: any[]) => any } ? Alias : never]: {
				name: string
				rerank<Document = string | Record<string, unknown>>(
					request: ProviderRerankRequest<Document>,
				): Promise<ProviderRerankResponse<Document>>
			}
		}
		skills: {
			available: boolean
			names: string[]
			config?: AgentSkillConfig
			list(): Promise<SkillMetadata[]>
			loadAvailable(): Promise<SkillDocument[]>
			load(skillName: string): Promise<SkillDocument>
			loadMany(skillNames: string[]): Promise<SkillDocument[]>
			loadReferences(skillName: string): Promise<SkillReferenceDocument[]>
			search(input?: SkillSearchInput): Promise<SkillDocument[]>
		}
		policy: AgentPolicyHelpers
		reflect: AgentReflectionHelpers
	}
	io: {
		stream: AgentStreamEmitter
		protocol: ProtocolEmitter
	}
	app: {
		resources: Resources
		manifest: AgentManifest
	}
	runtime: {
		service: ProtocolContext<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>>
		stores: {
			secrets: ProtocolContext<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>>['secrets']
			configs: ProtocolContext<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>>['configs']
			states: ProtocolContext<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>>['states']
		}
		approvals: AgentApprovalHelpers
	}
}

export type CreateAgentHandlerContextInput<
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
> = {
	serviceContext: ProtocolContext<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>>
	eventBridge: EventBridge
	payload: Payload
	parameter: Parameter
	conversationStore: ConversationStore
	protocol: ProtocolEmitter
	resources: Resources
	models: Models
	embeddings: Record<string, { name: string; embed: (request: ProviderEmbedRequest) => Promise<ProviderEmbedResponse> }>
	rerankers: Record<
		string,
		{
			name: string
			rerank: <Document = string | Record<string, unknown>>(
				request: ProviderRerankRequest<Document>,
			) => Promise<ProviderRerankResponse<Document>>
		}
	>
	manifest: AgentManifest
	executionBudget?: AgentExecutionBudget
}

export type AgentInvocationOptions = {
	agentName: string
	agentVersion: string
	payload: unknown
	parameter?: unknown
	timeoutMs?: number
	correlationId?: string
	sessionId?: string
	forwardToCurrentStream?:
		| boolean
		| {
				assistant?: boolean
				reasoning?: boolean
				artifacts?: boolean
				errors?: boolean
				toolEvents?: boolean
		  }
	emitInvocationToolEvents?: boolean
	/**
	 * Controls whether protocol `error` envelopes from the invoked sub-agent throw immediately.
	 * Defaults to `true`.
	 */
	failOnErrorFrame?: boolean
	stream?: import('../types/AgentDefinition.js').AgentStreamResponder
}

export type AgentForwardingOptions =
	| true
	| {
			assistant?: boolean
			reasoning?: boolean
			artifacts?: boolean
			errors?: boolean
			toolEvents?: boolean
	  }

export type AgentForwardInvocationOptions = Omit<AgentInvocationOptions, 'forwardToCurrentStream'> & {
	forward?: AgentForwardingOptions
}

type DeclaredAgentBinding = {
	call?: (
		payload: unknown,
		parameter?: unknown,
	) => {
		final(): Promise<unknown>
		[Symbol.asyncIterator](): AsyncIterator<unknown>
	}
	payloadSchema?: Schema
	parameterSchema?: Schema
}

type ResolvedAgentBinding = {
	call: (
		payload: unknown,
		parameter?: unknown,
	) => {
		final(): Promise<unknown>
		[Symbol.asyncIterator](): AsyncIterator<unknown>
	}
	payloadSchema?: Schema
	parameterSchema?: Schema
}

const hasErrorEnvelope = (envelopes: AgentProtocolEnvelope[]): boolean =>
	envelopes.some(envelope => envelope.frame.kind === 'error')

const createAgentInvocationHelpers = <
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitList extends Record<string, Schema> = Record<string, Schema>,
>(input: {
	eventBridge: EventBridge
	protocol: ProtocolEmitter
	serviceContext: ProtocolContext<Payload, Parameter, Resources, AgentInvokes, EmitList>
	session: SessionHelpers
	manifest: AgentManifest
	executionBudget?: AgentExecutionBudget
}) => {
	const createDirectBindingInvocation = (
		agentName: string,
		agentVersion: string,
		payload: unknown,
		parameter: unknown,
	) => {
		let resolveNext: ((result: IteratorResult<AgentProtocolEnvelope>) => void) | undefined
		let rejectNext: ((error: unknown) => void) | undefined
		const bufferedValues: AgentProtocolEnvelope[] = []
		let iteratorDone = false
		let iteratorError: unknown

		const emitValue = (value: AgentProtocolEnvelope) => {
			if (iteratorDone) {
				return
			}
			if (resolveNext) {
				const resolve = resolveNext
				resolveNext = undefined
				rejectNext = undefined
				resolve({
					value,
					done: false,
				})
				return
			}
			bufferedValues.push(value)
		}

		const emitDone = () => {
			if (iteratorDone) {
				return
			}
			iteratorDone = true
			if (resolveNext) {
				const resolve = resolveNext
				resolveNext = undefined
				rejectNext = undefined
				resolve({
					value: undefined,
					done: true,
				})
			}
		}

		const emitError = (error: unknown) => {
			iteratorError = error
			if (rejectNext) {
				const reject = rejectNext
				resolveNext = undefined
				rejectNext = undefined
				reject(error)
			}
		}

		const finalPromise = invokeAgent({
			eventBridge: input.eventBridge,
			agentName,
			agentVersion,
			payload,
			parameter,
			traceId: input.serviceContext.message.traceId,
			correlationId: input.serviceContext.message.correlationId,
			principalId: input.serviceContext.message.principalId,
			tenantId: input.serviceContext.message.tenantId,
			sessionId: input.session.identity.baseSessionId,
			failOnErrorFrame: true,
			stream: {
				onFrame: async envelope => {
					emitValue(envelope)
				},
				onComplete: () => {
					emitDone()
				},
				onError: error => {
					emitError(error)
				},
			},
		})
			.then(result => {
				emitDone()
				return result
			})
			.catch(error => {
				emitError(error)
				throw error
			})

		return {
			final: async () => await finalPromise,
			[Symbol.asyncIterator]: async function* () {
				while (true) {
					if (bufferedValues.length > 0) {
						yield bufferedValues.shift() as AgentProtocolEnvelope
						continue
					}
					if (iteratorError) {
						throw iteratorError
					}
					if (iteratorDone) {
						return
					}
					const next = await new Promise<IteratorResult<AgentProtocolEnvelope>>((resolve, reject) => {
						resolveNext = resolve
						rejectNext = reject
					})
					if (next.done) {
						return
					}
					yield next.value
				}
			},
		}
	}

	const resolveDeclaredBinding = (agentName: string, agentVersion: string): ResolvedAgentBinding => {
		const allowed = input.manifest.allowedAgents?.find(
			agent => agent.agentName === agentName && agent.agentVersion === agentVersion,
		)
		if (!allowed) {
			throw new HandledError(
				StatusCode.BadRequest,
				`Agent ${agentName}.${agentVersion} is not declared via canInvokeAgent(...)`,
			)
		}

		const invokeAgentApi = (input.serviceContext.invokeAgent ?? ({} as EmptyObject)) as AgentInvokes &
			Record<string, Record<string, DeclaredAgentBinding> | undefined>
		const versionApi = invokeAgentApi[agentName]
		const binding = versionApi?.[agentVersion]
		return {
			call:
				binding?.call ??
				((payload: unknown, parameter?: unknown) =>
					createDirectBindingInvocation(agentName, agentVersion, payload, parameter ?? {})),
			payloadSchema: binding?.payloadSchema ?? allowed.payloadSchema,
			parameterSchema: binding?.parameterSchema ?? allowed.parameterSchema,
		}
	}

	const emitStatus = (
		options: Pick<AgentInvocationOptions, 'agentName' | 'agentVersion' | 'payload'>,
		status: 'invoked' | 'success' | 'error',
		output?: unknown,
		errorCode?: string,
	) => {
		input.protocol.emitToolEvent({
			toolName: `${options.agentName}.${options.agentVersion}.run`,
			status,
			input: options.payload,
			output,
			errorCode,
		})
	}

	const shouldForward = (
		options: AgentForwardingOptions,
		key: 'assistant' | 'reasoning' | 'artifacts' | 'errors' | 'toolEvents',
	) => {
		if (options === true) {
			return key !== 'toolEvents'
		}
		return options[key] ?? key !== 'toolEvents'
	}

	const createForwardingResponder = (
		options: AgentForwardingOptions,
	): import('../types/AgentDefinition.js').AgentStreamResponder => ({
		onFrame: async envelope => {
			const frame = envelope.frame
			if (
				frame.kind === 'message' &&
				frame.role === 'assistant' &&
				typeof frame.content === 'string' &&
				frame.content.length > 0 &&
				shouldForward(options, 'assistant')
			) {
				input.protocol.emitMessage({
					content: frame.content,
					partial: frame.final !== true,
					final: frame.final === true,
				})
				return
			}

			if (frame.kind === 'artifact') {
				const isReasoning = frame.artifactId === 'reasoning'
				if (isReasoning && shouldForward(options, 'reasoning')) {
					input.protocol.emitArtifact({
						artifactId: frame.artifactId,
						content: frame.content,
						mimeType: frame.mimeType,
						sequence: frame.sequence,
						total: frame.total,
						final: frame.phase === 'final',
					})
					return
				}
				if (!isReasoning && shouldForward(options, 'artifacts')) {
					input.protocol.emitArtifact({
						artifactId: frame.artifactId,
						content: frame.content,
						mimeType: frame.mimeType,
						sequence: frame.sequence,
						total: frame.total,
						final: frame.phase === 'final',
					})
					return
				}
			}

			if (frame.kind === 'tool' && shouldForward(options, 'toolEvents')) {
				input.protocol.emitToolEvent({
					toolName: frame.toolName,
					status: frame.status,
					input: frame.input,
					output: frame.output,
					message: frame.message,
					errorCode: frame.errorCode,
				})
				return
			}

			if (frame.kind === 'error' && shouldForward(options, 'errors')) {
				input.protocol.emitError(new Error(frame.message), {
					code: frame.code,
					handled: frame.handled,
				})
			}
		},
		onComplete: () => {},
		onError: () => {},
	})

	const mergeStreamResponders = (
		forwarder: import('../types/AgentDefinition.js').AgentStreamResponder | undefined,
		custom: import('../types/AgentDefinition.js').AgentStreamResponder | undefined,
	): import('../types/AgentDefinition.js').AgentStreamResponder | undefined => {
		if (!forwarder) {
			return custom
		}
		if (!custom) {
			return forwarder
		}
		return {
			onFrame: async envelope => {
				await forwarder.onFrame?.(envelope)
				await custom.onFrame?.(envelope)
			},
			onComplete: () => {
				forwarder.onComplete?.()
				custom.onComplete?.()
			},
			onError: error => {
				forwarder.onError?.(error)
				custom.onError?.(error)
			},
		}
	}

	const validateInvocationInput = async (binding: DeclaredAgentBinding, payload: unknown, parameter: unknown) => {
		if (binding.payloadSchema) {
			const result = await validate(binding.payloadSchema, payload)
			if (!result.success) {
				throw new HandledError(StatusCode.BadRequest, 'Agent invoke payload schema validation failed', {
					issues: result.issues,
				})
			}
		}
		if (binding.parameterSchema) {
			const result = await validate(binding.parameterSchema, parameter)
			if (!result.success) {
				throw new HandledError(StatusCode.BadRequest, 'Agent invoke parameter schema validation failed', {
					issues: result.issues,
				})
			}
		}
	}

	const instrumentInvocation = (
		options: Pick<AgentInvocationOptions, 'agentName' | 'agentVersion' | 'payload' | 'emitInvocationToolEvents'>,
		invocation: {
			final(): Promise<unknown>
			[Symbol.asyncIterator](): AsyncIterator<unknown>
		},
	) => {
		if (options.emitInvocationToolEvents !== false) {
			emitStatus(options, 'invoked')
		}
		const finalPromise = withAiInvocationSpan(
			input.serviceContext,
			`ai.agent_invoke:${options.agentName}/${options.agentVersion}`,
			{
				'purista.ai.agent_name': options.agentName,
				'purista.ai.agent_version': options.agentVersion,
				'purista.ai.invocation_type': 'binding',
			},
			async () => await invocation.final(),
		)
			.then(result => {
				const envelopes = Array.isArray(result) ? agentProtocolEnvelopeSchema.array().safeParse(result) : undefined
				if (envelopes?.success && hasErrorEnvelope(envelopes.data)) {
					if (options.emitInvocationToolEvents !== false) {
						emitStatus(options, 'error', envelopes.data, 'AgentErrorEnvelope')
					}
				} else {
					if (options.emitInvocationToolEvents !== false) {
						emitStatus(options, 'success', result)
					}
				}
				return result
			})
			.catch(error => {
				if (options.emitInvocationToolEvents !== false) {
					emitStatus(
						options,
						'error',
						undefined,
						error instanceof HandledError ? String(error.errorCode) : 'UnhandledError',
					)
				}
				throw error
			})

		return {
			final: async () => await finalPromise,
			[Symbol.asyncIterator]: async function* () {
				const iterator = invocation[Symbol.asyncIterator]()
				while (true) {
					const next = await iterator.next()
					if (next.done) {
						return
					}
					yield next.value
				}
			},
		}
	}

	const invoke = async (options: AgentInvocationOptions) => {
		const binding = resolveDeclaredBinding(options.agentName, options.agentVersion)
		const payload = withSessionIdInPayload(options.payload, options.sessionId ?? input.session.identity.baseSessionId)
		const parameter = options.parameter ?? {}
		await validateInvocationInput(binding, payload, parameter)
		input.executionBudget?.consumeToolCall({
			toolName: `${options.agentName}.${options.agentVersion}.run`,
			kind: 'agent',
		})
		if (options.emitInvocationToolEvents !== false) {
			emitStatus(options, 'invoked')
		}
		return await withAiInvocationSpan(
			input.serviceContext,
			`ai.agent_invoke:${options.agentName}/${options.agentVersion}`,
			{
				'purista.ai.agent_name': options.agentName,
				'purista.ai.agent_version': options.agentVersion,
				'purista.ai.invocation_type': 'direct',
			},
			async () => {
				try {
					const forwardingResponder = options.forwardToCurrentStream
						? createForwardingResponder(options.forwardToCurrentStream)
						: undefined
					const envelopes = await invokeAgent({
						eventBridge: input.eventBridge,
						agentName: options.agentName,
						agentVersion: options.agentVersion,
						payload,
						parameter,
						timeoutMs: options.timeoutMs,
						stream: mergeStreamResponders(forwardingResponder, options.stream),
						traceId: input.serviceContext.message.traceId,
						correlationId: options.correlationId ?? input.serviceContext.message.correlationId,
						principalId: input.serviceContext.message.principalId,
						tenantId: input.serviceContext.message.tenantId,
						sessionId: options.sessionId ?? input.session.identity.baseSessionId,
						failOnErrorFrame: options.failOnErrorFrame ?? true,
					})
					if (hasErrorEnvelope(envelopes)) {
						if (options.emitInvocationToolEvents !== false) {
							emitStatus(options, 'error', envelopes, 'AgentErrorEnvelope')
						}
					} else {
						if (options.emitInvocationToolEvents !== false) {
							emitStatus(options, 'success', envelopes)
						}
					}
					return envelopes
				} catch (error) {
					if (options.emitInvocationToolEvents !== false) {
						emitStatus(
							options,
							'error',
							undefined,
							error instanceof HandledError ? String(error.errorCode) : 'UnhandledError',
						)
					}
					throw error
				}
			},
		)
	}

	const runText = async (options: Parameters<typeof invoke>[0]) => {
		const envelopes = await invoke(options)
		const assistantMessageFrames = envelopes
			.map(envelope => envelope.frame)
			.filter(
				(frame): frame is Extract<(typeof envelopes)[number]['frame'], { kind: 'message' }> =>
					frame.kind === 'message' && frame.role === 'assistant',
			)
		let finalMessage: string | undefined
		for (let index = assistantMessageFrames.length - 1; index >= 0; index -= 1) {
			const frame = assistantMessageFrames[index]
			if (frame?.final === true) {
				finalMessage = frame.content
				break
			}
		}
		if (typeof finalMessage === 'string' && finalMessage.trim().length > 0) {
			return finalMessage
		}
		return assistantMessageFrames
			.map(frame => frame.content)
			.filter((content): content is string => typeof content === 'string' && content.length > 0)
			.join('')
	}

	const runObject = async <T = unknown>(options: Parameters<typeof invoke>[0]): Promise<T> => {
		const text = await runText(options)
		try {
			return JSON.parse(text) as T
		} catch (error) {
			throw new HandledError(StatusCode.BadGateway, 'Invoked agent did not return valid JSON in final message', {
				text,
				error: error instanceof Error ? error.message : String(error),
			})
		}
	}

	const forward = async (options: AgentForwardInvocationOptions) =>
		await invoke({
			...options,
			forwardToCurrentStream: options.forward ?? true,
			emitInvocationToolEvents: options.emitInvocationToolEvents ?? false,
		})

	const invokeProxy = new Proxy(invoke, {
		apply(target, thisArg, argArray) {
			return Reflect.apply(target, thisArg, argArray)
		},
		get(_target, prop) {
			if (prop === 'then' || prop === 'catch' || prop === 'finally') {
				return undefined
			}
			if (typeof prop !== 'string') {
				return undefined
			}
			return new Proxy(
				{},
				{
					get(_versionTarget, versionProp) {
						if (typeof versionProp !== 'string') {
							return undefined
						}
						const binding = resolveDeclaredBinding(prop, versionProp)
						const call = binding.call
						return {
							call: (payload: InferIn<Schema>, parameter?: InferIn<Schema>) =>
								instrumentInvocation(
									{
										agentName: prop,
										agentVersion: versionProp,
										payload,
									},
									(() => {
										input.executionBudget?.consumeToolCall({
											toolName: `${prop}.${versionProp}.run`,
											kind: 'agent',
										})
										return call(withSessionIdInPayload(payload, input.session.identity.baseSessionId), parameter ?? {})
									})(),
								),
							payloadSchema: binding.payloadSchema,
							parameterSchema: binding.parameterSchema,
						}
					},
				},
			)
		},
	}) as AgentHandlerContext<
		unknown,
		unknown,
		Record<string, unknown>,
		Record<string, ModelProvider>,
		AgentInvokes
	>['invoke']['agents']['invoke']

	return {
		invoke: invokeProxy,
		runText,
		forward,
		runObject,
	}
}

const getOptionalSkillResource = (resources: Record<string, unknown>): SkillResource | undefined => {
	try {
		return Reflect.get(resources, 'skills') as SkillResource | undefined
	} catch {
		return undefined
	}
}

const uniqueSkillStrings = (values: string[] | undefined): string[] => [
	...new Set((values ?? []).map(entry => entry.trim()).filter(Boolean)),
]

const createSkillHelpers = (resources: Record<string, unknown>, manifest: AgentManifest) => {
	const declaredNames = uniqueSkillStrings(manifest.skills?.names)
	const ensureSkillResource = () => {
		const skillResource = getOptionalSkillResource(resources)

		if (!skillResource || declaredNames.length === 0) {
			throw new HandledError(
				StatusCode.InternalServerError,
				'No declared skills are configured. Use builder.useSkills([...]) and provide skills at getInstance(...).',
			)
		}
		return skillResource
	}

	const ensureDeclared = (skillNames: string[]) => {
		for (const skillName of skillNames) {
			if (!declaredNames.includes(skillName)) {
				throw new HandledError(
					StatusCode.BadRequest,
					`Skill ${skillName} is not declared for this agent. Use builder.useSkills([...]) to expose it.`,
				)
			}
		}
	}

	const loadAvailable = async () => await ensureSkillResource().loadMany(declaredNames)

	return {
		available: getOptionalSkillResource(resources) !== undefined && declaredNames.length > 0,
		names: declaredNames,
		config: manifest.skills,
		list: async () => (await loadAvailable()).map(({ content: _content, ...metadata }) => metadata),
		loadAvailable,
		load: async (skillName: string) => {
			ensureDeclared([skillName.trim()])
			return await ensureSkillResource().load(skillName)
		},
		loadMany: async (skillNames: string[]) => {
			const normalized = uniqueSkillStrings(skillNames)
			ensureDeclared(normalized)
			return await ensureSkillResource().loadMany(normalized)
		},
		loadReferences: async (skillName: string) => {
			ensureDeclared([skillName.trim()])
			return await ensureSkillResource().loadReferences(skillName)
		},
		search: async (input: SkillSearchInput = {}) => {
			const requestedNames = uniqueSkillStrings(input.skillNames)
			if (requestedNames.length > 0) {
				ensureDeclared(requestedNames)
			}
			return await ensureSkillResource().search({
				...input,
				skillNames: requestedNames.length > 0 ? requestedNames : declaredNames,
			})
		},
	}
}

export const createAgentHandlerContext = <
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = EmptyObject,
>(
	input: CreateAgentHandlerContextInput<Payload, Parameter, Resources, Models, AgentInvokes>,
): AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads> => {
	const sessionHelpers = createSessionHelpers(input.conversationStore, {
		context: input.serviceContext,
		manifest: input.manifest,
		payload: input.payload,
	})
	const tools = createToolInvoker(
		input.serviceContext,
		input.manifest.allowedTools ?? [],
		input.protocol,
		input.executionBudget,
	)
	const runState = createAgentRunStateHelpers({
		states: input.serviceContext.states,
		protocol: input.protocol,
		manifest: input.manifest,
		payload: input.payload,
		message: input.serviceContext.message,
	})
	const agents = createAgentInvocationHelpers({
		eventBridge: input.eventBridge,
		protocol: input.protocol,
		serviceContext: input.serviceContext,
		session: sessionHelpers,
		manifest: input.manifest,
		executionBudget: input.executionBudget,
	})
	const policy = createAgentPolicyHelpers(input.manifest.agentPolicy, input.manifest.reflection)
	const skills = createSkillHelpers(input.resources, input.manifest)
	const stream = createStreamEmitter(input.protocol)
	const expose = createExposeHelpers({
		app: {
			manifest: input.manifest,
		},
		invoke: {
			tools,
			agents,
		},
		io: {
			protocol: input.protocol,
		},
	})
	const reflect = createAgentReflectionHelpers({
		protocol: input.protocol,
		runState,
		policy,
		reflectionPolicy: input.manifest.reflection,
		serviceContext: input.serviceContext,
	})
	const approvals = createAgentApprovalHelpers({
		states: input.serviceContext.states,
		runState,
		protocol: input.protocol,
		approvalPolicy: input.manifest.agentPolicy?.approvals,
		agentName: input.manifest.agentName,
		agentVersion: input.manifest.agentVersion,
		serviceContext: input.serviceContext,
	})

	return {
		logger: input.serviceContext.logger,
		input: {
			payload: input.payload,
			parameter: input.parameter,
			message: input.serviceContext.message,
		},
		output: {
			emit: input.serviceContext.emit.bind(input.serviceContext) as EmitCustomMessageFunction<EmitPayloads>,
		},
		memory: {
			session: sessionHelpers,
			conversation: createConversationHelpers(sessionHelpers, input.manifest),
			run: runState,
		},
		invoke: {
			tools,
			expose,
			agents,
		},
		ai: {
			models: input.models,
			embeddings: input.embeddings as AgentHandlerContext<
				Payload,
				Parameter,
				Resources,
				Models,
				AgentInvokes,
				EmitPayloads
			>['ai']['embeddings'],
			rerankers: input.rerankers as AgentHandlerContext<
				Payload,
				Parameter,
				Resources,
				Models,
				AgentInvokes,
				EmitPayloads
			>['ai']['rerankers'],
			skills,
			policy,
			reflect,
		},
		io: {
			stream,
			protocol: input.protocol,
		},
		app: {
			resources: input.resources,
			manifest: input.manifest,
		},
		runtime: {
			service: input.serviceContext,
			stores: {
				secrets: input.serviceContext.secrets,
				configs: input.serviceContext.configs,
				states: input.serviceContext.states,
			},
			approvals,
		},
	}
}
