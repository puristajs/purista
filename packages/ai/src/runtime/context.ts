import type { CommandFunctionContext, Logger } from '@purista/core'
import { HandledError, StatusCode } from '@purista/core'

import type { KnowledgeAdapter, KnowledgeDocument } from '../knowledge/adapters/inMemoryAdapter.js'
import type { SessionRecord, SessionStore } from '../memory/sessionStore.js'
import {
	createArtifactFrame,
	createEnvelopeFromContext,
	createErrorFrame,
	createMessageFrame,
	createTelemetryFrame,
	createToolEventFrame,
} from '../protocol/index.js'
import type { AgentProtocolEnvelope, AgentProtocolFrame } from '../protocol/types.js'
import type { AgentManifest, AllowedToolDefinition } from '../types/AgentManifest.js'

type ProtocolFrameEntry = {
	frame: AgentProtocolFrame
}

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
}

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

export const createProtocolBuffer = (context: CommandFunctionContext): AgentProtocolBuffer => {
	const frames: ProtocolFrameEntry[] = []

	const protocol: ProtocolEmitter = {
		emitMessage(content, options) {
			const message =
				typeof content === 'object' && content !== null && 'content' in content
					? {
							content: stringifyResult(content.content),
							summary: content.summary ?? options?.summary,
							partial: content.partial ?? options?.partial,
							final: content.final ?? options?.final,
						}
					: {
							content: stringifyResult(content),
							summary: options?.summary,
							partial: options?.partial,
							final: options?.final,
						}
			frames.push({
				frame: createMessageFrame({
					role: 'assistant',
					content: message.content,
					summary: message.summary,
					partial: message.partial,
					final: message.final,
				}),
			})
		},
		emitArtifact(input) {
			frames.push({
				frame: createArtifactFrame({
					artifactId: input.artifactId,
					phase: input.final ? 'final' : 'chunk',
					sequence: input.sequence,
					total: input.total,
					content: input.content,
					mimeType: input.mimeType,
					lastChunk: input.final,
				}),
			})
		},
		emitTelemetry(metrics) {
			frames.push({
				frame: createTelemetryFrame({
					durationMs: metrics.durationMs,
					waitTimeMs: metrics.waitTimeMs,
					poolId: metrics.poolId,
					provider: metrics.provider,
					usage: metrics.usage
						? {
								promptTokens: metrics.usage.promptTokens,
								completionTokens: metrics.usage.completionTokens,
								totalTokens: metrics.usage.totalTokens,
								costUsd: metrics.usage.costUsd,
							}
						: undefined,
				}),
			})
		},
		emitToolEvent(event) {
			frames.push({
				frame: createToolEventFrame({
					toolName: event.toolName,
					status: event.status,
					args: event.input,
					result: event.output,
					message: event.message,
					errorCode: event.errorCode,
				}),
			})
		},
		emitError(error, overrides) {
			const err =
				error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Agent error', { cause: error })
			frames.push({
				frame: createErrorFrame({
					code: overrides?.code ?? 'AgentError',
					message: err.message,
					handled: overrides?.handled ?? error instanceof HandledError,
					details: {
						stack: err.stack,
						cause: err.cause,
					},
				}),
			})
		},
		has(kind) {
			return frames.some(entry => entry.frame.kind === kind)
		},
	}

	return {
		protocol,
		toEnvelopes() {
			return frames.map(entry => createEnvelopeFromContext(context, entry.frame))
		},
		frames() {
			return frames.map(entry => entry.frame)
		},
	}
}

type ToolInvoker = {
	list(): AllowedToolDefinition[]
	invoke(definition: AllowedToolDefinition | string, payload: unknown, parameter?: unknown): Promise<unknown>
}

const createToolInvoker = (
	serviceContext: CommandFunctionContext,
	tools: AllowedToolDefinition[],
	protocol: ProtocolEmitter,
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

	const resolve = (definition: AllowedToolDefinition | string) => {
		if (typeof definition !== 'string') {
			return definition
		}
		const found = map.get(definition)
		if (!found) {
			throw new HandledError(StatusCode.BadRequest, `Tool ${definition} not allowlisted`)
		}
		return found
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

	const invoke = async (definition: AllowedToolDefinition | string, payload: unknown, parameter?: unknown) => {
		const tool = resolve(definition)
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
		try {
			emitStatus(tool, 'invoked', payload)
			const result = await commandFn(payload, parameter ?? {})
			emitStatus(tool, 'success', payload, result)
			return result
		} catch (error) {
			const handled = error instanceof HandledError
			emitStatus(tool, 'error', payload, undefined, handled ? String(error.errorCode) : 'UnhandledError')
			throw error
		}
	}

	return {
		list: () => [...tools],
		invoke,
	}
}

export type SessionHelpers = {
	load(sessionId: string): Promise<SessionRecord | undefined>
	save(record: SessionRecord): Promise<void>
	delete(sessionId: string): Promise<void>
}

const createSessionHelpers = (store: SessionStore): SessionHelpers => ({
	load: sessionId => store.load(sessionId),
	save: record => store.save(record),
	delete: sessionId => store.delete(sessionId),
})

type KnowledgeHelpers = {
	query(adapterName: string, query: string, limit?: number): Promise<KnowledgeDocument[]>
}

const createKnowledgeHelpers = (adapters: Record<string, KnowledgeAdapter | undefined>): KnowledgeHelpers => ({
	async query(adapterName, query, limit) {
		const adapter = adapters[adapterName]
		if (!adapter) {
			throw new HandledError(StatusCode.NotFound, `Knowledge adapter ${adapterName} not registered`)
		}
		return adapter.query(query, limit)
	},
})

export type AgentHandlerContext<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
> = {
	logger: Logger
	payload: Payload
	parameter: Parameter
	message: CommandFunctionContext['message']
	session: SessionHelpers
	knowledge: KnowledgeHelpers
	protocol: ProtocolEmitter
	tools: ToolInvoker
	resources: Resources
	serviceContext: CommandFunctionContext
	manifest: AgentManifest
}

export type CreateAgentHandlerContextInput<Payload, Parameter, Resources extends Record<string, unknown>> = {
	serviceContext: CommandFunctionContext<Payload, Parameter>
	payload: Payload
	parameter: Parameter
	sessionStore: SessionStore
	knowledgeAdapters: Record<string, KnowledgeAdapter | undefined>
	protocol: ProtocolEmitter
	resources: Resources
	manifest: AgentManifest
}

export const createAgentHandlerContext = <Payload, Parameter, Resources extends Record<string, unknown>>(
	input: CreateAgentHandlerContextInput<Payload, Parameter, Resources>,
): AgentHandlerContext<Payload, Parameter, Resources> => {
	return {
		logger: input.serviceContext.logger,
		payload: input.payload,
		parameter: input.parameter,
		message: input.serviceContext.message,
		session: createSessionHelpers(input.sessionStore),
		knowledge: createKnowledgeHelpers(input.knowledgeAdapters),
		protocol: input.protocol,
		tools: createToolInvoker(input.serviceContext, input.manifest.allowedTools ?? [], input.protocol),
		resources: input.resources,
		serviceContext: input.serviceContext,
		manifest: input.manifest,
	}
}
