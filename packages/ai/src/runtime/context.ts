import type {
	AgentInvokeList,
	CommandFunctionContext,
	EmitCustomMessageFunction,
	EmptyObject,
	EventBridge,
	Infer,
	InferIn,
	InvokeList,
	Logger,
	Schema as PuristaSchema,
	QueueInvokeList,
	Schema,
	StreamFunctionContext,
	StreamInvokeList,
} from '@purista/core'
import { HandledError, PuristaSpanTag, StatusCode, toJSONSchema, validate } from '@purista/core'

import {
	createExposeHelpers,
	type ExposeHelpers,
	type ExternalBinding,
	type ExternalBindingSet,
} from '../bridge/externalRuntime.js'
import type {
	ConversationStore,
	ConversationStoreRecord,
	ConversationStoreRecordData,
	ConversationStoreScope,
} from '../memory/conversationStore.js'
import {
	agentProtocolEnvelopeSchema,
	buildTaskArtifactId,
	buildTaskChunkArtifactId,
	createArtifactFrame,
	createEnvelopeFromContext,
	createErrorFrame,
	createMessageFrame,
	createTelemetryFrame,
	createToolEventFrame,
	extractArtifactContent,
	extractFinalAssistantText,
	isPuristaAiWorkflowArtifactId,
	PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID,
	toTaskArtifactPayload,
	toTaskChunkArtifactPayload,
	toWorkflowStageArtifactPayload,
} from '../protocol/index.js'
import type { AgentProtocolEnvelope, AgentProtocolFrame, JsonValue } from '../protocol/types.js'
import type {
	ModelProvider,
	ProviderEmbedManyRequest,
	ProviderEmbedManyResponse,
	ProviderEmbedRequest,
	ProviderEmbedResponse,
	ProviderGenerateTextRequest,
	ProviderJsonOutputFromSchema,
	ProviderObjectStreamRequest,
	ProviderRerankRequest,
	ProviderRerankResponse,
} from '../providers/runtime/ModelProvider.js'
import type { AgentSandboxRuntimeConfig } from '../sandbox/provider.js'
import type {
	SkillDocument,
	SkillMetadata,
	SkillReferenceDocument,
	SkillResource,
	SkillSearchInput,
} from '../skills/fileSystem.js'
import type { AgentInvocationFinalResult } from '../types/AgentDefinition.js'
import type { AgentManifest, AgentSkillConfig, AllowedToolDefinition } from '../types/AgentManifest.js'
import { invokeAgentInternal } from './agentInvocationTransport.js'
import { type AgentApprovalHelpers, createAgentApprovalHelpers } from './approvals.js'
import { type ConversationHelpers, createConversationHelpers } from './conversation.js'
import { createProtocolSafeErrorDetails } from './errorDiagnostics.js'
import type { AgentExecutionBudget } from './executionBudget.js'
import {
	type AgentInvocationIdentity,
	createConversationStoreScope,
	createScopedSessionId,
	resolveAgentInvocationIdentity,
} from './invocationIdentity.js'
import {
	type AgentPlanExecutor,
	type AgentPlanExecutorKind,
	type AgentPlanHelpers,
	type AgentPlanTask,
	createAgentPlanHelpers,
} from './plan.js'
import { type AgentPolicyHelpers, createAgentPolicyHelpers } from './policy.js'
import { type AgentReflectionHelpers, createAgentReflectionHelpers } from './reflection.js'
import { type AgentRunHandle, type AgentRunStateHelpers, createAgentRunStateHelpers } from './runState.js'
import { type AgentSandboxHelpers, createAgentSandboxHelpers } from './sandbox.js'
import { withSessionIdInPayload } from './sessionPayload.js'
import { normalizeAgentInvocationFinalResult } from './terminalResult.js'

type ProtocolFrameEntry = {
	frame: AgentProtocolFrame
	envelope: AgentProtocolEnvelope
}

export type AgentReplyTextOptions = {
	type: 'text'
	content: string
	summary?: string
	chunked?: boolean
}

export type AgentReplyModelOptions<Alias extends string = string> = {
	type: 'model'
	model?: Alias
	prompt: string
	system?: string
	summary?: string
	stream?: boolean
}

export type AgentReplyStructuredOptions = {
	type: 'structured'
	data: Record<string, unknown>
	summary?: string
}

/**
 * Options for `context.ai.replyObject(...)`.
 *
 * This helper is intended for the common "finalize a structured answer in the
 * current conversation" flow.
 */
export type AgentReplyObjectOptions<Alias extends string = string, OutputSchema = unknown> = {
	/** Model alias declared via `builder.addModel(...)`. */
	model: Alias
	/** Prompt used for the structured reply generation call. */
	prompt: string
	/** Structured output schema used for generation and validation. */
	schema: OutputSchema
	/** Optional developer/system instruction prepended to the request. */
	system?: string | string[]
	/** Conversation session id used for history lookup and optional persistence. */
	sessionId?: string
	/** Include current conversation history in the prompt (default: `false`). */
	includeConversationHistory?: boolean
	/** Header inserted before serialized conversation history when included. */
	historyHeader?: string
	/** Optional provider metadata forwarded with the generation request. */
	metadata?: Record<string, unknown>
	/** Persist a final assistant-visible message back into conversation history. */
	persistAssistantMessage?: boolean
	/** Optional metadata stored alongside the persisted assistant message. */
	assistantMetadata?: Record<string, unknown>
	/** Select the assistant-visible message from the structured output. */
	selectMessage?: (data: ProviderJsonOutputFromSchema<OutputSchema, unknown>) => string
}

export type AgentReplyOptions<Alias extends string = string> =
	| AgentReplyTextOptions
	| AgentReplyModelOptions<Alias>
	| AgentReplyStructuredOptions

export type AgentStreamObjectPublishOptions = {
	/** Prefix for section artifact ids (default: `<sectionName>`). */
	artifactIdPrefix?: string
	/** Optional projection from section content to assistant text deltas. */
	renderSectionDelta?: (input: { section: string; content: unknown }) => string | undefined
	/** Emit provider status updates as reasoning artifacts (default: true). */
	statusAsReasoning?: boolean
	/** Emit section artifacts on the protocol lane (default: true). */
	emitSectionsAsArtifacts?: boolean
	/** Optional task id for automatic `purista-ai:task-chunk:<taskId>` publication. */
	taskId?: string
	/** Override task chunk kind used for emitted task-chunk artifacts. */
	taskChunkKind?: string
}

/**
 * Options for `context.ai.streamObject(...)`.
 *
 * Use `schema` for typed final object validation and optional stream publication
 * to the current protocol stream.
 *
 * @example
 * ```ts
 * const triage = await context.ai.streamObject({
 *   model: 'openai:gpt-4o-mini',
 *   prompt: payload.prompt,
 *   schema: supportAgentResponseSchema,
 *   publishToCurrentStream: { taskId: 'classify-urgency' },
 * })
 * ```
 */
export type AgentStreamObjectOptions<
	Alias extends string = string,
	T = unknown,
	OutputSchema = unknown,
> = ProviderObjectStreamRequest<T, OutputSchema> & {
	model: Alias
	publishToCurrentStream?: AgentStreamObjectPublishOptions
}

export type AgentStreamTextPublishOptions = {
	/** Optional task id for automatic `purista-ai:task-chunk:<taskId>` publication. */
	taskId?: string
	/** Override task chunk kind used for emitted text chunks. */
	taskChunkKind?: string
	/** Optional summary attached to the final message frame. */
	summary?: string
	/** Emit reasoning as artifacts while streaming text (default: true). */
	reasoningAsArtifacts?: boolean
}

/**
 * Options for `context.ai.streamText(...)`.
 *
 * @example
 * ```ts
 * const answer = await context.ai.streamText({
 *   model: 'openai:gpt-4o-mini',
 *   prompt: payload.prompt,
 *   publishToCurrentStream: { taskId: 'draft-answer' },
 * })
 * ```
 */
export type AgentStreamTextOptions<Alias extends string = string> = ProviderGenerateTextRequest & {
	model: Alias
	publishToCurrentStream?: AgentStreamTextPublishOptions
}

export type AgentExecutorBaseOptions = {
	/** Stable executor id used by planner task `delegate` references. */
	id: string
	/** Human-readable capability text shown to the planner model. */
	description: string
}

/**
 * Declarative model-executor options for planner worker/delegates.
 *
 * `id` and `description` are optional; runtime creates deterministic defaults.
 * Provide `schema` to enable structured-object execution automatically.
 * Without `schema`, execution defaults to streamed text.
 *
 * @example
 * ```ts
 * const worker = context.ai.createModelExecutor({
 *   model: 'openai:gpt-4o-mini',
 *   systemPrompt: 'You are a concise support assistant.',
 * })
 *
 * const triage = context.ai.createModelExecutor({
 *   id: 'triage',
 *   model: 'openai:gpt-4o-mini',
 *   schema: supportAgentResponseSchema,
 * })
 * ```
 */
export type AgentModelExecutorOptions<Alias extends string = string, OutputSchema = undefined> = {
	/** Optional stable id. Auto-generated if omitted. */
	id?: string
	/** Optional planner description. Auto-generated if omitted. */
	description?: string
	/** Model alias declared via `builder.addModel(...)`. */
	model: Alias
	/** Developer/system instruction prepended on each task call. */
	systemPrompt?: string | string[]
	/** Optional allowlisted tool/agent bindings for the model call. */
	tools?: ExternalBindingSet | ExternalBinding[]
	/** Optional inlined skill documents. */
	skills?: Array<Pick<SkillDocument, 'name' | 'content'>>
	/** Optional inlined skill reference documents. */
	references?: Array<Pick<SkillReferenceDocument, 'skillName' | 'relativePath' | 'content'>>
	/** Optional invocation metadata forwarded to the provider. */
	metadata?: Record<string, unknown>
	/**
	 * Structured output schema.
	 * When present, the executor runs in object mode and returns typed object output.
	 */
	schema?: OutputSchema
	/** Optional section streaming instructions for object mode. */
	sections?: ProviderObjectStreamRequest<unknown, OutputSchema>['sections']
	/** Optional publication settings for current stream/task lanes. */
	publishToCurrentStream?: Omit<AgentStreamObjectPublishOptions, 'taskId'>
}

type AgentModelExecutorResult<OutputSchema> = [OutputSchema] extends [undefined]
	? string
	: ProviderJsonOutputFromSchema<OutputSchema, unknown>

/**
 * Options for wrapping a typed tool invoke target as a planner delegate.
 *
 * @example
 * ```ts
 * const delegate = context.ai.createToolExecutorFromInvoke(
 *   context.invoke.tools.invoke.support['1'].lookupFaq,
 *   {
 *     id: 'lookup-faq',
 *     description: 'Fetch factual support guidance',
 *     buildPayload: ({ task }) => ({ question: task.instruction }),
 *   },
 * )
 * ```
 */
export type AgentToolExecutorFromInvokeOptions = AgentExecutorBaseOptions & {
	/** Optional task-to-payload projection. Defaults to `task.instruction`. */
	buildPayload?: (input: {
		task: AgentPlanTask
		request: string
		results: Record<string, unknown>
	}) => unknown | Promise<unknown>
	/** Optional task-to-parameter projection. */
	buildParameter?: (input: {
		task: AgentPlanTask
		request: string
		results: Record<string, unknown>
	}) => unknown | Promise<unknown>
}

/**
 * Advanced escape hatch for fully custom planner executor logic.
 *
 * Prefer `createModelExecutor(...)` as the default worker path.
 */
export type AgentToolExecutorLogicOptions<Context> = AgentExecutorBaseOptions & {
	/** Optional executor kind metadata. Defaults to `custom`. */
	kind?: AgentPlanExecutorKind
	/** Custom async execution logic. */
	call: (input: {
		context: Context
		task: AgentPlanTask
		request: string
		results: Record<string, unknown>
		run: AgentRunHandle
	}) => Promise<unknown>
}

export type AgentExecutorResultMode = 'text' | 'object' | 'protocol'

/**
 * Options for wrapping a child-agent invoke target as a planner delegate.
 *
 * @example
 * ```ts
 * const billingDelegate = context.ai.createAgentExecutorFromInvoke(
 *   context.invoke.agents.invoke.billingSpecialist['1'],
 *   { id: 'billing-specialist', description: 'Handles billing requests' },
 * )
 * ```
 */
export type AgentAgentExecutorFromInvokeOptions = AgentExecutorBaseOptions & {
	/** Final result projection mode from child invocation. */
	resultMode?: AgentExecutorResultMode
	/** Optional schema for validating projected object results. */
	outputSchema?: Schema
	/** Optional canonical child-envelope forwarding configuration. */
	forwardToCurrentStream?: AgentForwardingOptions
	/** Optional task-to-payload projection. Defaults to `task.instruction`. */
	buildPayload?: (input: {
		task: AgentPlanTask
		request: string
		results: Record<string, unknown>
	}) => unknown | Promise<unknown>
	/** Optional task-to-parameter projection. */
	buildParameter?: (input: {
		task: AgentPlanTask
		request: string
		results: Record<string, unknown>
	}) => unknown | Promise<unknown>
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
		content: JsonValue
		mimeType?: string
		sequence?: number
		total?: number
		final?: boolean
	}): void
	emitEnvelope(envelope: AgentProtocolEnvelope): void
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

/**
 * Mutable protocol buffer exposed via `context.io.protocol`.
 */
export type AgentProtocolBuffer = {
	protocol: ProtocolEmitter
	toEnvelopes(): AgentProtocolEnvelope[]
	frames(): AgentProtocolFrame[]
	flush(): Promise<void>
}

/**
 * Stream helper API exposed via `context.io.stream`.
 */
export type AgentStreamEmitter = {
	sendDelta(content: JsonValue): void
	sendFinal(content: JsonValue, options?: { summary?: string }): void
	sendReasoning(content: string): void
	sendError(error: Error, overrides?: { code?: string; handled?: boolean }): void
}

/**
 * Task-lane helper API exposed via `context.io.tasks`.
 */
export type AgentTaskEmitter = {
	sendChunk(
		taskId: string,
		content: JsonValue,
		options?: {
			kind?: string
			sequence?: number
			metadata?: Record<string, unknown>
			final?: boolean
			mimeType?: string
		},
	): void
	sendStatus(
		taskId: string,
		status: 'pending' | 'running' | 'completed' | 'failed',
		options?: { detail?: string; summary?: string },
	): void
}

export type AgentWorkflowEmitter = {
	emitStage(input: {
		name: string
		status: 'running' | 'completed' | 'failed'
		runId?: string
		summary?: string
		finalMessage?: string
		updatedAt?: string
		final?: boolean
	}): void
}

const splitParagraphForStreaming = (paragraph: string): string[] => {
	if (paragraph.includes('\n')) {
		return paragraph
			.split('\n')
			.filter(line => line.trim().length > 0)
			.map((line, index) => (index === 0 ? line : `\n${line}`))
	}

	const sentences =
		paragraph
			.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)
			?.map(entry => entry.trim())
			.filter(entry => entry.length > 0) ?? []
	if (sentences.length <= 1) {
		return [paragraph]
	}
	return sentences.map((sentence, index) => (index === 0 ? sentence : ` ${sentence}`))
}

const toSlug = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === 'object' && !Array.isArray(value)

const humanizeFieldName = (value: string) =>
	value
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[-_]+/g, ' ')
		.trim()

const getSectionDescription = (fieldName: string, schemaNode: unknown) => {
	if (isRecord(schemaNode)) {
		const description = schemaNode.description
		if (typeof description === 'string' && description.trim().length > 0) {
			return description.trim()
		}
		const title = schemaNode.title
		if (typeof title === 'string' && title.trim().length > 0) {
			return title.trim()
		}
	}
	return `Provide the ${humanizeFieldName(fieldName)} value.`
}

const inferSectionsFromSchema = async (
	schema: unknown,
): Promise<ProviderObjectStreamRequest<unknown, unknown>['sections'] | undefined> => {
	if (schema === undefined || schema === null) {
		return undefined
	}

	let jsonSchema: unknown = schema
	if (isRecord(schema) && '~standard' in schema) {
		try {
			jsonSchema = await toJSONSchema(schema as unknown as PuristaSchema)
		} catch {
			return undefined
		}
	}

	if (!isRecord(jsonSchema)) {
		return undefined
	}
	const properties = jsonSchema.properties
	if (!isRecord(properties)) {
		return undefined
	}

	const entries = Object.entries(properties)
	if (entries.length === 0) {
		return undefined
	}

	return Object.fromEntries(
		entries.map(([fieldName, fieldSchema]) => [
			fieldName,
			`Progressively stream "${fieldName}". ${getSectionDescription(fieldName, fieldSchema)}`,
		]),
	)
}

const inferRequestFromPayload = (payload: unknown): string | undefined => {
	if (typeof payload === 'string' && payload.trim().length > 0) {
		return payload
	}
	if (!payload || typeof payload !== 'object') {
		return undefined
	}
	const request = payload as Record<string, unknown>
	for (const key of ['prompt', 'request', 'message', 'input']) {
		const value = request[key]
		if (typeof value === 'string' && value.trim().length > 0) {
			return value
		}
	}
	return undefined
}

const streamReplyText = (input: { text: string; streamText: (delta: string) => void }) => {
	const paragraphs = input.text
		.trim()
		.split(/\n\n+/)
		.map(entry => entry.trim())
		.filter(entry => entry.length > 0)
	paragraphs.forEach((paragraph, paragraphIndex) => {
		const chunks = splitParagraphForStreaming(paragraph)
		chunks.forEach((chunk, chunkIndex) => {
			const prefix = paragraphIndex > 0 && chunkIndex === 0 ? '\n\n' : ''
			input.streamText(`${prefix}${chunk}`)
		})
	})
}

const createStreamEmitter = (protocol: ProtocolEmitter): AgentStreamEmitter => ({
	sendDelta(content) {
		if (typeof content === 'string') {
			if (content.length === 0) return
			protocol.emitMessage({ content, partial: true, final: false })
		} else {
			protocol.emitArtifact({
				artifactId: 'agent-structured-section',
				mimeType: 'application/json',
				content,
				final: false,
			})
		}
	},
	sendFinal(content, options) {
		if (typeof content === 'string') {
			protocol.emitMessage({ content, summary: options?.summary, partial: false, final: true })
		} else {
			protocol.emitArtifact({
				artifactId: 'agent-structured-final',
				mimeType: 'application/json',
				content,
				final: true,
			})
		}
	},
	sendReasoning(content) {
		protocol.emitArtifact({
			artifactId: 'reasoning',
			content,
			mimeType: 'text/markdown',
			final: false,
		})
	},
	sendError(error, overrides) {
		protocol.emitError(error, overrides)
	},
})

const createWorkflowEmitter = (protocol: ProtocolEmitter): AgentWorkflowEmitter => ({
	emitStage(input) {
		protocol.emitArtifact({
			artifactId: PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID,
			mimeType: 'application/json',
			content: toWorkflowStageArtifactPayload({
				runId: input.runId,
				name: input.name,
				status: input.status,
				summary: input.summary,
				finalMessage: input.finalMessage,
				updatedAt: input.updatedAt,
			}),
			final: input.final,
		})
	},
})

const normalizeExecutorBindings = (bindings?: ExternalBindingSet | ExternalBinding[]) => {
	if (!bindings) {
		return undefined
	}
	if (Array.isArray(bindings)) {
		return Object.fromEntries(bindings.map(binding => [binding.name, binding]))
	}
	return bindings
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

export type ProtocolBufferOptions = {
	onEnvelope?: (envelope: AgentProtocolEnvelope) => void | Promise<void>
	identity?: AgentInvocationIdentity
}

export type SkillReferenceSelectionInput = {
	skillName: string
	queries?: string[]
	limit?: number
	relativePathPrefixes?: string[]
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
		const envelope = createEnvelopeFromContext(context, frame, {
			conversationId: config.identity?.conversationId,
		})
		frames.push({ frame, envelope })
		if (config.onEnvelope) {
			flushPromise = flushPromise.then(async () => {
				await config.onEnvelope?.(envelope)
			})
		}
	}
	const pushEnvelope = (envelope: AgentProtocolEnvelope) => {
		frames.push({ frame: envelope.frame, envelope })
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
			if (frame.content.length === 0 && frame.final !== true) {
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
		emitEnvelope(envelope) {
			pushEnvelope(envelope)
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
				details: createProtocolSafeErrorDetails(error),
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

export type ToolInvokeMap = Record<
	string,
	Record<string, Record<string, (payload: unknown, parameter?: unknown) => Promise<unknown>>>
>

export type ModelEmbeddings<Models extends Record<string, ModelProvider>> = {
	[Alias in keyof Models as Models[Alias] extends { embed: (...args: unknown[]) => unknown } ? Alias : never]: {
		name: string
		embed(request: ProviderEmbedRequest): Promise<ProviderEmbedResponse>
		embedMany?(request: ProviderEmbedManyRequest): Promise<ProviderEmbedManyResponse>
	}
}

export type ModelRerankers<Models extends Record<string, ModelProvider>> = {
	[Alias in keyof Models as Models[Alias] extends { rerank: (...args: unknown[]) => unknown } ? Alias : never]: {
		name: string
		rerank<Document = string | Record<string, unknown>>(
			request: ProviderRerankRequest<Document>,
		): Promise<ProviderRerankResponse<Document>>
	}
}

type AgentInvokeVersionMap<
	AgentInvokes extends AgentInvokeList,
	AgentName extends string,
> = AgentName extends keyof AgentInvokes
	? AgentInvokes[AgentName] extends Record<string, unknown>
		? AgentInvokes[AgentName]
		: Record<string, never>
	: Record<string, never>

type AgentInvokeOutputSchema<
	AgentInvokes extends AgentInvokeList,
	AgentName extends string,
	ServiceVersion extends string,
> = AgentInvokeVersionMap<AgentInvokes, AgentName>[ServiceVersion] extends { outputSchema?: infer OutputSchema }
	? OutputSchema extends Schema
		? OutputSchema
		: Schema | undefined
	: Schema | undefined

type AgentInvokeOutput<AgentInvokes extends AgentInvokeList, AgentName extends string, ServiceVersion extends string> =
	AgentInvokeOutputSchema<AgentInvokes, AgentName, ServiceVersion> extends Schema
		? Infer<AgentInvokeOutputSchema<AgentInvokes, AgentName, ServiceVersion>>
		: unknown

export type AgentInvocationOptionsFor<
	AgentInvokes extends AgentInvokeList,
	AgentName extends string,
	ServiceVersion extends string,
> = Omit<AgentInvocationOptions, 'agentName' | 'serviceVersion' | 'outputSchema'> & {
	agentName: AgentName
	serviceVersion: ServiceVersion
	outputSchema?: AgentInvokeOutputSchema<AgentInvokes, AgentName, ServiceVersion>
}

export type AgentInvokeHelpers<AgentInvokes extends AgentInvokeList = AgentInvokeList> = {
	/**
	 * Invokes another agent via EventBridge and returns its emitted envelopes.
	 * Supports both direct options-based calls and typed chained access:
	 * `context.invoke.agents.invoke({ agentName, serviceVersion, payload })`
	 * and `context.invoke.agents.invoke.someAgent['1'].call(payload, parameter)`.
	 */
	invoke: AgentInvokes & ((options: AgentInvocationOptions) => Promise<AgentProtocolEnvelope[]>)
	/**
	 * Invokes another agent as a protocol-first stream pipeline for forwarding,
	 * tapping, collecting, and custom writer composition.
	 */
	stream(options: AgentInvocationOptions): AgentInvocationPipeline
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
	 * Invokes another agent and resolves its canonical structured `output` artifact.
	 */
	runObject<AgentName extends Extract<keyof AgentInvokes, string>, ServiceVersion extends string>(
		options: AgentInvocationOptionsFor<AgentInvokes, AgentName, ServiceVersion>,
	): Promise<AgentInvokeOutput<AgentInvokes, AgentName, ServiceVersion>>
	runObject<T = unknown>(options: AgentInvocationOptions): Promise<T>
}

export type ToolInvoker<ToolInvokes extends ToolInvokeMap = ToolInvokeMap> = {
	list(): AllowedToolDefinition[]
	invoke: ToolInvokes
}

const createToolInvoker = <ToolInvokes extends ToolInvokeMap = ToolInvokeMap>(
	serviceContext: ProtocolContext<any, any, Record<string, unknown>, any, any>,
	tools: AllowedToolDefinition[],
	protocol: ProtocolEmitter,
	executionBudget?: AgentExecutionBudget,
): ToolInvoker<ToolInvokes> => {
	type ServiceInvokeMap = Record<
		string,
		Record<string, Record<string, (payload: unknown, parameter: unknown) => Promise<unknown>>>
	>
	const services = serviceContext.service as ServiceInvokeMap
	const toolMap = new Map<string, AllowedToolDefinition>()
	for (const tool of tools) {
		const key = `${tool.serviceName}.${tool.serviceVersion}.${tool.commandName}`
		toolMap.set(key, tool)
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

	const invokeTool = async (tool: AllowedToolDefinition, payload: unknown, parameter?: unknown) => {
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
				'purista.ai.tool_kind': 'tool',
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

	const invoke: ToolInvokeMap = {}
	for (const tool of tools) {
		if (!invoke[tool.serviceName]) {
			invoke[tool.serviceName] = {}
		}
		if (!invoke[tool.serviceName][tool.serviceVersion]) {
			invoke[tool.serviceName][tool.serviceVersion] = {}
		}
		invoke[tool.serviceName][tool.serviceVersion][tool.commandName] = async (payload: unknown, parameter?: unknown) => {
			return await invokeTool(tool, payload, parameter)
		}
	}

	return {
		list: () => [...tools],
		invoke: invoke as ToolInvokes,
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
		serviceVersion: string
		tenantId?: string
		principalId?: string
		baseSessionId: string
		conversationId: string
		correlationId: string
		traceId: string
		scopedSessionId: string
	}
}

type SessionIdentityInput = {
	identity: AgentInvocationIdentity
}

const createSessionHelpers = (store: ConversationStore, input: SessionIdentityInput): SessionHelpers => {
	const identity = {
		agentName: input.identity.agentName,
		serviceVersion: input.identity.serviceVersion,
		tenantId: input.identity.tenantId,
		principalId: input.identity.principalId,
		baseSessionId: input.identity.baseSessionId,
		conversationId: input.identity.conversationId,
		correlationId: input.identity.correlationId,
		traceId: input.identity.traceId,
		scopedSessionId: input.identity.scopedSessionId,
	}

	const storeScope: ConversationStoreScope = createConversationStoreScope(input.identity)

	const resolveId = (sessionId?: string) =>
		createScopedSessionId({
			agentName: identity.agentName,
			serviceVersion: identity.serviceVersion,
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

/**
 * Typed runtime context injected into attached-agent handlers.
 *
 * This is the canonical public surface for:
 * - run-state + session memory helpers
 * - typed tool/agent invocation
 * - model execution and planner executor factories
 * - protocol stream emission
 */
export type AgentHandlerContext<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = EmptyObject,
	ToolInvokes extends ToolInvokeMap = ToolInvokeMap,
> = {
	/**
	 * Structured logger scoped to the current invocation.
	 */
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
		tools: ToolInvoker<ToolInvokes>
		expose: ExposeHelpers
		agents: AgentInvokeHelpers<AgentInvokes>
	}
	ai: {
		models: Models
		/**
		 * Stream text deltas + final message into the current protocol stream and
		 * return the final text value.
		 */
		streamText<Alias extends Extract<keyof Models, string>>(options: AgentStreamTextOptions<Alias>): Promise<string>
		/**
		 * Stream structured sections/final output and return the validated final object.
		 * Use `schema` in options for typed validation.
		 */
		streamObject<Alias extends Extract<keyof Models, string>, T = unknown, OutputSchema = unknown>(
			options: AgentStreamObjectOptions<Alias, T, OutputSchema>,
		): Promise<ProviderJsonOutputFromSchema<OutputSchema, T>>
		reply(options: AgentReplyTextOptions): string
		reply<Alias extends Extract<keyof Models, string>>(options: AgentReplyModelOptions<Alias>): Promise<string>
		reply(options: AgentReplyStructuredOptions): string
		reply(options: AgentReplyOptions<Extract<keyof Models, string>>): string | Promise<string>
		/**
		 * Generate a typed structured reply, optionally grounding it in the current
		 * conversation history and persisting the assistant-visible message.
		 */
		replyObject<Alias extends Extract<keyof Models, string>, OutputSchema>(
			options: AgentReplyObjectOptions<Alias, OutputSchema>,
		): Promise<ProviderJsonOutputFromSchema<OutputSchema, unknown>>
		/**
		 * Create a reusable planner executor backed by a declared model alias.
		 *
		 * This is the default worker/delegate path for planner execution.
		 *
		 * @example
		 * ```ts
		 * const worker = context.ai.createModelExecutor({
		 *   model: 'openai:gpt-4o-mini',
		 *   systemPrompt: 'You are a support worker.',
		 * })
		 * ```
		 */
		createModelExecutor<Alias extends Extract<keyof Models, string>, OutputSchema = undefined>(
			options: AgentModelExecutorOptions<Alias, OutputSchema>,
		): AgentPlanExecutor<
			AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>,
			AgentModelExecutorResult<OutputSchema>
		>
		/**
		 * Wrap a typed tool invoke call as a planner delegate executor.
		 */
		createToolExecutorFromInvoke<InvokePayload = unknown, InvokeParameter = unknown>(
			call: (payload: InvokePayload, parameter?: InvokeParameter) => Promise<unknown>,
			options: AgentToolExecutorFromInvokeOptions,
		): AgentPlanExecutor<
			AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
		>
		/**
		 * Advanced escape hatch for custom planner executor logic.
		 */
		createToolExecutorLogic(
			options: AgentToolExecutorLogicOptions<
				AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
			>,
		): AgentPlanExecutor<
			AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
		>
		/**
		 * Wrap an allowed child-agent invoke call as a planner delegate executor.
		 */
		createAgentExecutorFromInvoke(
			call: (
				payload: unknown,
				parameter?: unknown,
			) => {
				final(): Promise<unknown>
				[Symbol.asyncIterator](): AsyncIterator<unknown>
			},
			options: AgentAgentExecutorFromInvokeOptions,
		): AgentPlanExecutor<
			AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
		>
		embeddings: ModelEmbeddings<Models>
		rerankers: ModelRerankers<Models>
		skills: {
			available: boolean
			names: string[]
			config?: AgentSkillConfig
			list(): Promise<SkillMetadata[]>
			loadAvailable(): Promise<SkillDocument[]>
			load(skillName: string): Promise<SkillDocument>
			loadMany(skillNames: string[]): Promise<SkillDocument[]>
			loadReferences(skillName: string): Promise<SkillReferenceDocument[]>
			selectReferences(input: SkillReferenceSelectionInput): Promise<SkillReferenceDocument[]>
			search(input?: SkillSearchInput): Promise<SkillDocument[]>
		}
		policy: AgentPolicyHelpers
		reflect: AgentReflectionHelpers
	}
	plan: AgentPlanHelpers<
		AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>,
		Models
	>
	io: {
		stream: AgentStreamEmitter
		tasks: AgentTaskEmitter
		workflow: AgentWorkflowEmitter
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
		sandbox: AgentSandboxHelpers
	}
}

export type CreateAgentHandlerContextInput<
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	Models extends Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	ToolInvokes extends ToolInvokeMap = ToolInvokeMap,
> = {
	serviceContext: ProtocolContext<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>>
	eventBridge: EventBridge
	payload: Payload
	parameter: Parameter
	conversationStore: ConversationStore
	protocol: ProtocolEmitter
	resources: Resources
	models: Models
	embeddings: ModelEmbeddings<Models>
	rerankers: ModelRerankers<Models>
	manifest: AgentManifest
	executionBudget?: AgentExecutionBudget
	toolInvokes?: ToolInvokes
	identity?: AgentInvocationIdentity
	sandbox?: AgentSandboxRuntimeConfig<Resources>
}

export type AgentInvocationOptions = {
	agentName: string
	serviceVersion: string
	payload: unknown
	parameter?: unknown
	outputSchema?: Schema
	timeoutMs?: number
	correlationId?: string
	sessionId?: string
	forwardToCurrentStream?:
		| boolean
		| {
				assistant?: boolean
				reasoning?: boolean
				artifacts?:
					| boolean
					| {
							workflow?: boolean
							output?: boolean
							sources?: boolean
							files?: boolean
							generic?: boolean
					  }
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
	deliveryMode?: import('../types/AgentDefinition.js').AgentInvocationDeliveryMode
}

export type AgentForwardingOptions =
	| true
	| {
			assistant?: boolean
			reasoning?: boolean
			artifacts?:
				| boolean
				| {
						workflow?: boolean
						output?: boolean
						sources?: boolean
						files?: boolean
						generic?: boolean
				  }
			errors?: boolean
			toolEvents?: boolean
	  }

export type AgentForwardInvocationOptions = Omit<AgentInvocationOptions, 'forwardToCurrentStream'> & {
	forward?: AgentForwardingOptions
}

type AgentArtifactForwardingCategory = 'reasoning' | 'workflow' | 'output' | 'sources' | 'files' | 'generic'

const shouldForwardAgentStreamKey = (
	options: AgentForwardingOptions,
	key: 'assistant' | 'reasoning' | 'artifacts' | 'errors' | 'toolEvents',
) => {
	if (options === true) {
		return key !== 'toolEvents'
	}
	return options[key] ?? key !== 'toolEvents'
}

const classifyArtifactForwardingCategory = (
	frame: Extract<AgentProtocolFrame, { kind: 'artifact' }>,
): AgentArtifactForwardingCategory => {
	if (frame.artifactId === 'reasoning') {
		return 'reasoning'
	}
	if (isPuristaAiWorkflowArtifactId(frame.artifactId)) {
		return 'workflow'
	}
	if (frame.artifactId === 'output') {
		return 'output'
	}
	const content =
		typeof frame.content === 'object' && frame.content !== null ? (frame.content as Record<string, unknown>) : undefined
	const typed = typeof content?.type === 'string' ? content.type : undefined
	const mediaType =
		typeof content?.mediaType === 'string'
			? content.mediaType
			: typeof frame.mimeType === 'string'
				? frame.mimeType
				: undefined

	if (typed === 'source-url' || typed === 'source-document') {
		return 'sources'
	}
	if (
		typed === 'file' ||
		mediaType?.startsWith('image/') ||
		mediaType?.startsWith('audio/') ||
		mediaType?.startsWith('video/') ||
		mediaType === 'application/pdf'
	) {
		return 'files'
	}
	return 'generic'
}

const shouldForwardArtifactFrame = (
	options: AgentForwardingOptions,
	frame: Extract<AgentProtocolFrame, { kind: 'artifact' }>,
) => {
	const category = classifyArtifactForwardingCategory(frame)
	if (category === 'reasoning') {
		return shouldForwardAgentStreamKey(options, 'reasoning')
	}
	if (options === true) {
		return true
	}
	const artifactOptions = options.artifacts
	if (artifactOptions === undefined) {
		return true
	}
	if (artifactOptions === true) {
		return true
	}
	if (artifactOptions === false) {
		return false
	}
	return artifactOptions[category] ?? false
}

export type AgentEnvelopeWriter = {
	write(envelope: AgentProtocolEnvelope): void | Promise<void>
}

export type AgentInvocationPipeline = {
	final(): Promise<AgentInvocationFinalResult>
	collect(): Promise<AgentProtocolEnvelope[]>
	tap(listener: (envelope: AgentProtocolEnvelope) => void | Promise<void>): AgentInvocationPipeline
	forwardToCurrentStream(options?: AgentForwardingOptions): AgentInvocationPipeline
	toWriter(writer: AgentEnvelopeWriter): Promise<AgentProtocolEnvelope[]>
	[Symbol.asyncIterator](): AsyncIterator<AgentProtocolEnvelope>
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
	outputSchema?: Schema
}

type DeclaredAgentInvokeApi = Record<string, Record<string, DeclaredAgentBinding> | undefined>

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
	outputSchema?: Schema
}

const hasErrorEnvelope = (envelopes: AgentProtocolEnvelope[]): boolean =>
	envelopes.some(envelope => envelope.frame.kind === 'error')

const toEnvelopeBatch = (value: unknown): AgentProtocolEnvelope[] => {
	if (Array.isArray(value)) {
		return value.flatMap(entry => {
			const parsed = agentProtocolEnvelopeSchema.safeParse(entry)
			return parsed.success ? [parsed.data] : []
		})
	}

	const parsed = agentProtocolEnvelopeSchema.safeParse(value)
	return parsed.success ? [parsed.data] : []
}

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
}): AgentInvokeHelpers<AgentInvokes> => {
	const createDirectBindingInvocation = (
		agentName: string,
		serviceVersion: string,
		payload: unknown,
		parameter: unknown,
		options?: Pick<
			AgentInvocationOptions,
			'timeoutMs' | 'correlationId' | 'sessionId' | 'failOnErrorFrame' | 'deliveryMode'
		>,
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

		const finalPromise = invokeAgentInternal({
			eventBridge: input.eventBridge,
			agentName,
			serviceVersion,
			payload,
			parameter,
			timeoutMs: options?.timeoutMs,
			traceId: input.serviceContext.message.traceId,
			correlationId: options?.correlationId ?? input.serviceContext.message.correlationId,
			principalId: input.serviceContext.message.principalId,
			tenantId: input.serviceContext.message.tenantId,
			otp: input.serviceContext.message.otp,
			sessionId: options?.sessionId ?? input.session.identity.baseSessionId,
			failOnErrorFrame: options?.failOnErrorFrame ?? true,
			deliveryMode: options?.deliveryMode ?? 'prefer-stream',
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

	const resolveDeclaredBinding = (agentName: string, serviceVersion?: string): ResolvedAgentBinding => {
		const resolvedVersion = serviceVersion ?? '1'
		const allowed = input.manifest.allowedAgents?.find(
			agent => agent.agentName === agentName && (agent.serviceVersion ?? '1') === resolvedVersion,
		)
		if (!allowed) {
			throw new HandledError(
				StatusCode.BadRequest,
				`Agent ${agentName}.${resolvedVersion} is not declared via canInvokeAgent(...)`,
			)
		}

		const invokeAgentApi = (input.serviceContext.invokeAgent ?? ({} as EmptyObject)) as AgentInvokes &
			DeclaredAgentInvokeApi
		const versionApi = invokeAgentApi[agentName]
		const binding = versionApi?.[resolvedVersion]
		return {
			call:
				binding?.call ??
				((payload: unknown, parameter?: unknown) =>
					createDirectBindingInvocation(agentName, resolvedVersion, payload, parameter ?? {})),
			payloadSchema: binding?.payloadSchema ?? allowed.payloadSchema,
			parameterSchema: binding?.parameterSchema ?? allowed.parameterSchema,
			outputSchema: binding?.outputSchema ?? allowed.outputSchema,
		}
	}

	const emitStatus = (
		options: Pick<AgentInvocationOptions, 'agentName' | 'serviceVersion' | 'payload'>,
		status: 'invoked' | 'success' | 'error',
		output?: unknown,
		errorCode?: string,
	) => {
		input.protocol.emitToolEvent({
			toolName: `${options.agentName}.${options.serviceVersion}.run`,
			status,
			input: options.payload,
			output,
			errorCode,
		})
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
				shouldForwardAgentStreamKey(options, 'assistant')
			) {
				input.protocol.emitEnvelope(envelope)
				return
			}

			if (frame.kind === 'artifact') {
				if (shouldForwardArtifactFrame(options, frame)) {
					input.protocol.emitEnvelope(envelope)
					return
				}
			}

			if (frame.kind === 'tool' && shouldForwardAgentStreamKey(options, 'toolEvents')) {
				input.protocol.emitEnvelope(envelope)
				return
			}

			if (frame.kind === 'error' && shouldForwardAgentStreamKey(options, 'errors')) {
				input.protocol.emitEnvelope(envelope)
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

	const createStreamPipeline = (invocation: {
		final(): Promise<unknown>
		[Symbol.asyncIterator](): AsyncIterator<unknown>
	}): AgentInvocationPipeline => {
		const listeners = new Set<(envelope: AgentProtocolEnvelope) => void | Promise<void>>()
		const bufferedEnvelopes: AgentProtocolEnvelope[] = []
		const iteratorQueue: AgentProtocolEnvelope[] = []
		const seenMessageIds = new Set<string>()
		let started = false
		let completed = false
		let pipelineError: unknown
		let resolveNext: ((value: IteratorResult<AgentProtocolEnvelope>) => void) | undefined
		let rejectNext: ((error: unknown) => void) | undefined
		let producerPromise: Promise<void> | undefined

		const closeIterator = () => {
			if (completed) {
				return
			}
			completed = true
			if (resolveNext) {
				const resolve = resolveNext
				resolveNext = undefined
				rejectNext = undefined
				resolve({ value: undefined, done: true })
			}
		}

		const failIterator = (error: unknown) => {
			pipelineError = error
			if (rejectNext) {
				const reject = rejectNext
				resolveNext = undefined
				rejectNext = undefined
				reject(error)
			}
		}

		const emitEnvelope = async (envelope: AgentProtocolEnvelope) => {
			if (seenMessageIds.has(envelope.messageId)) {
				return
			}
			seenMessageIds.add(envelope.messageId)
			bufferedEnvelopes.push(envelope)
			for (const listener of listeners) {
				await listener(envelope)
			}
			if (resolveNext) {
				const resolve = resolveNext
				resolveNext = undefined
				rejectNext = undefined
				resolve({ value: envelope, done: false })
				return
			}
			iteratorQueue.push(envelope)
		}

		const ensureStarted = () => {
			if (started) {
				return
			}
			started = true
			producerPromise = (async () => {
				try {
					for await (const value of invocation) {
						for (const envelope of toEnvelopeBatch(value)) {
							await emitEnvelope(envelope)
						}
					}
					closeIterator()
				} catch (error) {
					failIterator(error)
					throw error
				}
			})()
		}

		const waitForCompletion = async (): Promise<AgentInvocationFinalResult> => {
			ensureStarted()
			const normalizedResult = normalizeAgentInvocationFinalResult({
				result: await invocation.final(),
				agentName: bufferedEnvelopes[0]?.actor.agent ?? bufferedEnvelopes[0]?.actor.service ?? 'unknown',
				serviceVersion: bufferedEnvelopes[0]?.actor.version ?? '1',
			})
			for (const envelope of normalizedResult.envelopes) {
				await emitEnvelope(envelope)
			}
			try {
				await producerPromise
			} catch (error) {
				throw pipelineError ?? error
			}
			closeIterator()
			return {
				...normalizedResult,
				envelopes: [...bufferedEnvelopes],
			}
		}

		const pipeline: AgentInvocationPipeline = {
			async final() {
				return await waitForCompletion()
			},
			async collect() {
				return (await waitForCompletion()).envelopes
			},
			tap(listener) {
				listeners.add(listener)
				for (const envelope of bufferedEnvelopes) {
					void listener(envelope)
				}
				return pipeline
			},
			forwardToCurrentStream(options = true) {
				const responder = createForwardingResponder(options)
				return pipeline.tap(async envelope => {
					await responder.onFrame?.(envelope)
				})
			},
			async toWriter(writer) {
				pipeline.tap(async envelope => {
					await writer.write(envelope)
				})
				return (await waitForCompletion()).envelopes
			},
			[Symbol.asyncIterator]: async function* () {
				ensureStarted()
				while (true) {
					if (iteratorQueue.length > 0) {
						yield iteratorQueue.shift() as AgentProtocolEnvelope
						continue
					}
					if (pipelineError) {
						throw pipelineError
					}
					if (completed) {
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

		return pipeline
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
		options: Pick<AgentInvocationOptions, 'agentName' | 'serviceVersion' | 'payload' | 'emitInvocationToolEvents'>,
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
			`ai.agent_invoke:${options.agentName}/${options.serviceVersion}`,
			{
				'purista.ai.agent_name': options.agentName,
				'purista.ai.agent_version': options.serviceVersion,
				'purista.ai.invocation_type': 'binding',
			},
			async () =>
				normalizeAgentInvocationFinalResult({
					result: await invocation.final(),
					agentName: options.agentName,
					serviceVersion: options.serviceVersion,
				}),
		)
			.then(result => {
				if (hasErrorEnvelope(result.envelopes)) {
					if (options.emitInvocationToolEvents !== false) {
						emitStatus(options, 'error', result.envelopes, 'AgentErrorEnvelope')
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
		const binding = resolveDeclaredBinding(options.agentName, options.serviceVersion)
		const payload = withSessionIdInPayload(options.payload, options.sessionId ?? input.session.identity.baseSessionId)
		const parameter = options.parameter ?? {}
		await validateInvocationInput(binding, payload, parameter)
		input.executionBudget?.consumeToolCall({
			toolName: `${options.agentName}.${options.serviceVersion}.run`,
			kind: 'agent',
		})
		if (options.emitInvocationToolEvents !== false) {
			emitStatus(options, 'invoked')
		}
		return await withAiInvocationSpan(
			input.serviceContext,
			`ai.agent_invoke:${options.agentName}/${options.serviceVersion}`,
			{
				'purista.ai.agent_name': options.agentName,
				'purista.ai.agent_version': options.serviceVersion,
				'purista.ai.invocation_type': 'direct',
			},
			async () => {
				try {
					const forwardingResponder = options.forwardToCurrentStream
						? createForwardingResponder(options.forwardToCurrentStream)
						: undefined
					const derivedDeliveryMode =
						options.deliveryMode ?? (options.forwardToCurrentStream ? 'require-stream' : 'prefer-stream')
					const envelopes = await invokeAgentInternal({
						eventBridge: input.eventBridge,
						agentName: options.agentName,
						serviceVersion: options.serviceVersion,
						payload,
						parameter,
						timeoutMs: options.timeoutMs,
						stream: mergeStreamResponders(forwardingResponder, options.stream),
						traceId: input.serviceContext.message.traceId,
						correlationId: options.correlationId ?? input.serviceContext.message.correlationId,
						principalId: input.serviceContext.message.principalId,
						tenantId: input.serviceContext.message.tenantId,
						otp: input.serviceContext.message.otp,
						sessionId: options.sessionId ?? input.session.identity.baseSessionId,
						failOnErrorFrame: options.failOnErrorFrame ?? true,
						deliveryMode: derivedDeliveryMode,
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

	const stream = (options: AgentInvocationOptions) => {
		const binding = resolveDeclaredBinding(options.agentName, options.serviceVersion)
		const payload = withSessionIdInPayload(options.payload, options.sessionId ?? input.session.identity.baseSessionId)
		const parameter = options.parameter ?? {}
		let preparedInvocationPromise: Promise<ReturnType<typeof instrumentInvocation>> | undefined

		const prepareInvocation = async () => {
			preparedInvocationPromise ??= (async () => {
				await validateInvocationInput(binding, payload, parameter)
				input.executionBudget?.consumeToolCall({
					toolName: `${options.agentName}.${options.serviceVersion}.run`,
					kind: 'agent',
				})
				return instrumentInvocation(
					{
						agentName: options.agentName,
						serviceVersion: options.serviceVersion,
						payload,
						emitInvocationToolEvents: options.emitInvocationToolEvents,
					},
					createDirectBindingInvocation(options.agentName, options.serviceVersion, payload, parameter, options),
				)
			})()
			return await preparedInvocationPromise
		}

		const pipeline = createStreamPipeline({
			final: async () => await (await prepareInvocation()).final(),
			[Symbol.asyncIterator]: async function* () {
				const invocation = await prepareInvocation()
				for await (const envelope of invocation) {
					yield envelope
				}
			},
		})

		if (options.forwardToCurrentStream) {
			pipeline.forwardToCurrentStream(options.forwardToCurrentStream)
		}
		if (options.stream) {
			pipeline.tap(async envelope => {
				await options.stream?.onFrame?.(envelope)
			})
		}
		return pipeline
	}

	const runText = async (options: Parameters<typeof invoke>[0]) => {
		const envelopes = await invoke(options)
		return extractFinalAssistantText(envelopes)
	}

	const runObject = async <T = unknown>(options: Parameters<typeof invoke>[0]): Promise<T> => {
		const binding = resolveDeclaredBinding(options.agentName, options.serviceVersion)
		const envelopes = await invoke(options)
		const parsed = extractArtifactContent(envelopes, 'output')
		const outputSchema = options.outputSchema ?? binding.outputSchema
		if (parsed === null) {
			throw new HandledError(
				StatusCode.BadGateway,
				outputSchema
					? 'Invoked agent did not emit the required final output artifact'
					: 'Invoked agent did not emit a final output artifact',
				{
					agentName: options.agentName,
					serviceVersion: options.serviceVersion ?? '1',
				},
			)
		}
		if (!outputSchema) {
			return parsed as T
		}
		const result = await validate(outputSchema, parsed)
		if (!result.success) {
			throw new HandledError(StatusCode.BadGateway, 'Invoked agent output schema validation failed', {
				output: parsed,
				issues: result.issues,
			})
		}
		return result.data as T
	}

	const forward = async (options: AgentForwardInvocationOptions) =>
		await invoke({
			...options,
			forwardToCurrentStream: options.forward ?? true,
			deliveryMode: options.deliveryMode ?? 'require-stream',
			emitInvocationToolEvents: options.emitInvocationToolEvents ?? false,
		})

	type AgentsInvoke = AgentInvokeHelpers<AgentInvokes>['invoke']

	const agentsInvoke: AgentsInvoke = ((options: AgentInvocationOptions) => invoke(options)) as AgentsInvoke

	for (const agent of input.manifest.allowedAgents ?? []) {
		if (!agentsInvoke[agent.agentName]) {
			;(agentsInvoke as Record<string, unknown>)[agent.agentName] = {} as AgentsInvoke[string]
		}
		const binding = resolveDeclaredBinding(agent.agentName, agent.serviceVersion)
		const agentName = agent.agentName
		const serviceVersion = agent.serviceVersion ?? '1'
		;(agentsInvoke[agentName] as Record<string, unknown>)[serviceVersion] = {
			call: (payload: InferIn<Schema>, parameter?: InferIn<Schema>) =>
				instrumentInvocation(
					{
						agentName,
						serviceVersion,
						payload,
					},
					(() => {
						input.executionBudget?.consumeToolCall({
							toolName: `${agentName}.${serviceVersion}.run`,
							kind: 'agent',
						})
						return binding.call(withSessionIdInPayload(payload, input.session.identity.baseSessionId), parameter ?? {})
					})(),
				),
			payloadSchema: binding.payloadSchema,
			parameterSchema: binding.parameterSchema,
			outputSchema: binding.outputSchema,
		}
	}

	return {
		invoke: agentsInvoke,
		stream,
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

const scoreSkillReferenceDocument = (document: SkillReferenceDocument, queries: string[]) => {
	if (queries.length === 0) {
		return 1
	}
	const haystack = `${document.relativePath}\n${document.content}`.toLowerCase()
	let score = 0
	for (const query of queries) {
		if (!query) {
			continue
		}
		if (haystack.includes(query)) {
			score += query.length > 18 ? 5 : 3
		}
		const queryTerms = query.split(/\s+/).filter(Boolean)
		for (const term of queryTerms) {
			if (term.length < 3) {
				continue
			}
			if (haystack.includes(term)) {
				score += 1
			}
		}
	}
	return score
}

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
		selectReferences: async (input: SkillReferenceSelectionInput) => {
			const skillName = input.skillName.trim()
			ensureDeclared([skillName])
			const normalizedPrefixes = uniqueSkillStrings(input.relativePathPrefixes)
			const normalizedQueries = uniqueSkillStrings(input.queries).map(entry => entry.toLowerCase())
			const limit = Math.max(1, input.limit ?? 6)
			const references = await ensureSkillResource().loadReferences(skillName)
			const filtered =
				normalizedPrefixes.length > 0
					? references.filter(reference => normalizedPrefixes.some(prefix => reference.relativePath.startsWith(prefix)))
					: references
			return filtered
				.map(reference => ({
					reference,
					score: scoreSkillReferenceDocument(reference, normalizedQueries),
				}))
				.filter(entry => entry.score > 0)
				.sort(
					(left, right) =>
						right.score - left.score || left.reference.relativePath.localeCompare(right.reference.relativePath),
				)
				.slice(0, limit)
				.map(entry => entry.reference)
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
	ToolInvokes extends ToolInvokeMap = ToolInvokeMap,
>(
	input: CreateAgentHandlerContextInput<Payload, Parameter, Resources, Models, AgentInvokes, ToolInvokes>,
): AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes> => {
	const identity =
		input.identity ??
		resolveAgentInvocationIdentity({
			agentName: input.manifest.agentName,
			serviceVersion: input.manifest.serviceVersion,
			message: input.serviceContext.message,
			payload: input.payload,
		})
	const sessionHelpers = createSessionHelpers(input.conversationStore, {
		identity,
	})
	const conversation = createConversationHelpers(sessionHelpers, input.manifest)
	const tools = createToolInvoker<ToolInvokes>(
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
		identity,
	})
	const agents = createAgentInvocationHelpers<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>>({
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
	const emitTaskStatus = (
		taskId: string,
		status: 'pending' | 'running' | 'completed' | 'failed',
		options?: { detail?: string; summary?: string },
	) => {
		const run = runState.get()
		void run.then(state => {
			if (!state) {
				return
			}
			const task = state.tasks.find(entry => entry.id === taskId)
			if (!task) {
				return
			}
			input.protocol.emitArtifact({
				artifactId: buildTaskArtifactId(taskId),
				content: toTaskArtifactPayload(
					state,
					{
						...task,
						status,
						detail: options?.detail ?? task.detail,
					},
					{ summary: options?.summary },
				) as JsonValue,
				mimeType: 'application/json',
				final: status === 'completed' || status === 'failed',
			})
		})
	}
	let taskChunkSequence = 0
	const tasks: AgentTaskEmitter = {
		sendChunk(taskId, content, options) {
			taskChunkSequence += 1
			input.protocol.emitArtifact({
				artifactId: buildTaskChunkArtifactId(taskId),
				content: toTaskChunkArtifactPayload({
					taskId,
					kind: options?.kind,
					content,
					sequence: options?.sequence ?? taskChunkSequence,
					metadata: options?.metadata,
				}) as JsonValue,
				mimeType: options?.mimeType ?? 'application/json',
				final: options?.final ?? false,
				sequence: options?.sequence ?? taskChunkSequence,
			})
		},
		sendStatus: emitTaskStatus,
	}

	const getDefaultModel = (): Extract<keyof Models, string> | undefined => {
		const keys = Object.keys(input.models) as (keyof Models)[]
		for (const key of keys) {
			const model = input.models[key as keyof Models]
			if (model && typeof model.generateText === 'function') {
				return key as Extract<keyof Models, string>
			}
		}
		return undefined
	}

	const resolveReplyModel = <Alias extends Extract<keyof Models, string>>(
		modelAlias: Alias,
	): NonNullable<Models[Alias]> & { generateText: NonNullable<ModelProvider['generateText']> } => {
		const model = input.models[modelAlias as keyof Models]
		if (!model || typeof model.generateText !== 'function') {
			throw new HandledError(
				StatusCode.InternalServerError,
				`Model ${String(modelAlias)} is not configured for text replies`,
			)
		}
		return model as NonNullable<Models[Alias]> & {
			generateText: NonNullable<ModelProvider['generateText']>
		}
	}

	const resolveStreamObjectModel = <Alias extends Extract<keyof Models, string>>(
		modelAlias: Alias,
	): NonNullable<Models[Alias]> & { streamObject: NonNullable<ModelProvider['streamObject']> } => {
		const model = input.models[modelAlias as keyof Models]
		if (!model || typeof model.streamObject !== 'function') {
			throw new HandledError(
				StatusCode.InternalServerError,
				`Model ${String(modelAlias)} is not configured for object streaming`,
			)
		}
		return model as NonNullable<Models[Alias]> & {
			streamObject: NonNullable<ModelProvider['streamObject']>
		}
	}

	const resolveStreamTextModel = <Alias extends Extract<keyof Models, string>>(
		modelAlias: Alias,
	): NonNullable<Models[Alias]> & { streamText: NonNullable<ModelProvider['streamText']> } => {
		const model = input.models[modelAlias as keyof Models]
		if (!model || typeof model.streamText !== 'function') {
			throw new HandledError(
				StatusCode.InternalServerError,
				`Model ${String(modelAlias)} is not configured for true text streaming`,
			)
		}
		return model as NonNullable<Models[Alias]> & {
			streamText: NonNullable<ModelProvider['streamText']>
		}
	}

	const streamText = async <Alias extends Extract<keyof Models, string>>(
		options: AgentStreamTextOptions<Alias>,
	): Promise<string> => {
		const model = resolveStreamTextModel(options.model)
		const publish = options.publishToCurrentStream
		const streamHandle = model.streamText({
			prompt: options.prompt,
			input: options.input,
			attachments: options.attachments,
			context: options.context,
			developerInstruction: options.developerInstruction,
			skills: options.skills,
			references: options.references,
			bindings: options.bindings,
			metadata: options.metadata,
		})

		for await (const chunk of streamHandle) {
			if (chunk.type === 'reasoning-delta') {
				if (publish?.reasoningAsArtifacts !== false) {
					stream.sendReasoning(chunk.reasoningDelta)
				}
				if (publish?.taskId) {
					tasks.sendChunk(publish.taskId, chunk.reasoningDelta, {
						kind: publish.taskChunkKind ?? 'reasoning',
						mimeType: 'text/markdown',
					})
				}
				await options.onReasoning?.(chunk.reasoningDelta)
				continue
			}

			if (chunk.type === 'text-delta') {
				stream.sendDelta(chunk.textDelta)
				if (publish?.taskId) {
					tasks.sendChunk(publish.taskId, chunk.textDelta, {
						kind: publish.taskChunkKind ?? 'text-delta',
						mimeType: 'text/plain',
					})
				}
				await options.onTextDelta?.(chunk.textDelta)
				continue
			}

			if (chunk.type === 'error') {
				throw chunk.error instanceof Error ? chunk.error : new Error(String(chunk.error))
			}
		}

		const result = await streamHandle.final()
		stream.sendFinal('', publish?.summary ? { summary: publish.summary } : undefined)
		if (publish?.taskId) {
			tasks.sendChunk(publish.taskId, result, {
				kind: 'final-text',
				mimeType: 'text/plain',
				final: true,
			})
		}
		return result.output
	}

	const streamObject = async <Alias extends Extract<keyof Models, string>, T = unknown, OutputSchema = unknown>(
		options: AgentStreamObjectOptions<Alias, T, OutputSchema>,
	): Promise<ProviderJsonOutputFromSchema<OutputSchema, T>> => {
		const model = resolveStreamObjectModel(options.model)
		const objectStream = model.streamObject<T, OutputSchema>({
			prompt: options.prompt,
			input: options.input,
			attachments: options.attachments,
			context: options.context,
			developerInstruction: options.developerInstruction,
			skills: options.skills,
			references: options.references,
			bindings: options.bindings,
			schema: options.schema,
			metadata: options.metadata,
			sections: options.sections as never,
		})

		const publish = options.publishToCurrentStream
		let finalResult: ProviderJsonOutputFromSchema<OutputSchema, T> | undefined

		for await (const chunk of objectStream) {
			if (chunk.type === 'status') {
				if (publish?.statusAsReasoning !== false) {
					stream.sendReasoning(chunk.message)
				}
				if (publish?.taskId) {
					tasks.sendChunk(publish.taskId, chunk.message, {
						kind: publish.taskChunkKind ?? 'status',
						mimeType: 'text/markdown',
					})
				}
				continue
			}
			if (chunk.type === 'section') {
				if (publish?.emitSectionsAsArtifacts !== false) {
					input.protocol.emitArtifact({
						artifactId: publish?.artifactIdPrefix ? `${publish.artifactIdPrefix}-${chunk.section}` : chunk.section,
						mimeType: 'application/json',
						content: chunk.content as JsonValue,
						final: false,
					})
				}
				if (publish?.taskId) {
					tasks.sendChunk(
						publish.taskId,
						{
							section: chunk.section,
							content: chunk.content as JsonValue,
						} as JsonValue,
						{
							kind: publish.taskChunkKind ?? 'section',
						},
					)
				}
				const delta = publish?.renderSectionDelta?.({
					section: chunk.section,
					content: chunk.content,
				})
				if (typeof delta === 'string' && delta.length > 0) {
					stream.sendDelta(delta)
				}
				continue
			}
			if (chunk.type === 'final-object') {
				finalResult = chunk.data
				if (publish?.taskId) {
					tasks.sendChunk(publish.taskId, chunk.data as JsonValue, {
						kind: 'final-object',
						final: true,
					})
				}
				continue
			}
			if (chunk.type === 'error') {
				throw chunk.error instanceof Error ? chunk.error : new Error(String(chunk.error))
			}
		}

		if (finalResult !== undefined) {
			return finalResult
		}

		return (await objectStream.final()).data
	}

	function reply(options: AgentReplyTextOptions): string
	function reply<Alias extends Extract<keyof Models, string>>(options: AgentReplyModelOptions<Alias>): Promise<string>
	function reply(options: AgentReplyStructuredOptions): string
	function reply(options: AgentReplyOptions<Extract<keyof Models, string>>): string | Promise<string> {
		if (options.type === 'text') {
			const normalized = options.content.trim()
			if (normalized.length === 0) {
				stream.sendFinal('', options.summary ? { summary: options.summary } : undefined)
				return normalized
			}
			if (options.chunked !== false) {
				streamReplyText({
					text: normalized,
					streamText: delta => stream.sendDelta(delta),
				})
				stream.sendFinal('', options.summary ? { summary: options.summary } : undefined)
				return normalized
			}
			stream.sendFinal(normalized, options.summary ? { summary: options.summary } : undefined)
			return normalized
		}

		if (options.type === 'structured') {
			const data = typeof options.data === 'string' ? options.data : JSON.stringify(options.data)
			stream.sendFinal(data, options.summary ? { summary: options.summary } : undefined)
			return data
		}

		// type === 'model'
		const modelAlias = options.model ?? getDefaultModel()
		if (!modelAlias) {
			throw new HandledError(
				StatusCode.InternalServerError,
				'No model available for text generation. Configure a model with defineModel() or provide a model in getInstance().',
			)
		}
		const model = resolveReplyModel(modelAlias)
		const shouldStream = options.stream !== false
		const replyTextPromise = model.generateText({
			prompt: options.prompt,
			developerInstruction: options.system,
			onTextDelta: async delta => {
				if (shouldStream) {
					stream.sendDelta(delta)
				}
			},
		})

		return (async () => {
			const replyText = await replyTextPromise
			const normalizedReply = replyText.trim()
			if (normalizedReply.length === 0) {
				throw new HandledError(
					StatusCode.InternalServerError,
					`Model ${String(modelAlias)} generated an empty public reply`,
				)
			}
			if (shouldStream) {
				stream.sendFinal('', options.summary ? { summary: options.summary } : undefined)
			}
			return normalizedReply
		})()
	}

	const replyObject = async <Alias extends Extract<keyof Models, string>, OutputSchema>(
		options: AgentReplyObjectOptions<Alias, OutputSchema>,
	): Promise<ProviderJsonOutputFromSchema<OutputSchema, unknown>> => {
		const model = input.models[options.model as keyof Models]
		if (!model || typeof model.generateObject !== 'function') {
			throw new HandledError(
				StatusCode.InternalServerError,
				`Model ${String(options.model)} is not configured for structured replies`,
			)
		}

		let prompt = options.prompt
		if (options.includeConversationHistory) {
			const history = await conversation.buildPromptInput({
				sessionId: options.sessionId,
			})
			if (history.trim().length > 0) {
				prompt = `${prompt}\n\n${options.historyHeader ?? 'Conversation history:'}\n${history}`
			}
		}

		const result = await model.generateObject({
			prompt,
			developerInstruction: options.system,
			schema: options.schema,
			metadata: options.metadata,
		})
		const output = result.data as ProviderJsonOutputFromSchema<OutputSchema, unknown>

		if (options.persistAssistantMessage) {
			const message = options.selectMessage?.(output)?.trim()
			if (!message) {
				throw new HandledError(
					StatusCode.InternalServerError,
					'persistAssistantMessage requires selectMessage to return a non-empty string',
				)
			}
			await conversation.addAssistant(message, {
				sessionId: options.sessionId,
				metadata: options.assistantMetadata,
			})
		}

		return output
	}

	let modelExecutorCounter = 0

	const createModelExecutor = <Alias extends Extract<keyof Models, string>, OutputSchema = undefined>(
		options: AgentModelExecutorOptions<Alias, OutputSchema>,
	): AgentPlanExecutor<
		AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>,
		AgentModelExecutorResult<OutputSchema>
	> => {
		const resolvedId = options.id ?? `model-${toSlug(String(options.model)) || 'executor'}-${++modelExecutorCounter}`
		const resolvedDescription = options.description ?? `Model executor for ${String(options.model)}`

		return {
			id: resolvedId,
			description: resolvedDescription,
			kind: 'model',
			call: async ({ task }) => {
				const prompt = task.instruction
				if (options.schema !== undefined) {
					const resolvedSections =
						options.sections ?? (await inferSectionsFromSchema(options.schema as unknown)) ?? undefined
					return (await streamObject({
						model: options.model,
						prompt,
						developerInstruction: options.systemPrompt,
						bindings: normalizeExecutorBindings(options.tools),
						skills: options.skills,
						references: options.references,
						metadata: options.metadata,
						schema: options.schema,
						sections: resolvedSections as ProviderObjectStreamRequest<unknown, OutputSchema>['sections'],
						publishToCurrentStream: options.publishToCurrentStream
							? {
									...options.publishToCurrentStream,
									taskId: task.id,
								}
							: undefined,
					})) as AgentModelExecutorResult<OutputSchema>
				}

				return (await resolveReplyModel(options.model).generateText({
					prompt,
					developerInstruction: options.systemPrompt,
					bindings: normalizeExecutorBindings(options.tools),
					skills: options.skills,
					references: options.references,
					metadata: options.metadata,
					onTextDelta: async delta => {
						stream.sendDelta(delta)
						tasks.sendChunk(task.id, delta, {
							kind: 'text-delta',
							mimeType: 'text/plain',
						})
					},
				})) as AgentModelExecutorResult<OutputSchema>
			},
		}
	}

	const createToolExecutorFromInvoke = <InvokePayload = unknown, InvokeParameter = unknown>(
		call: (payload: InvokePayload, parameter?: InvokeParameter) => Promise<unknown>,
		options: AgentToolExecutorFromInvokeOptions,
	): AgentPlanExecutor<
		AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
	> => ({
		id: options.id,
		description: options.description,
		kind: 'tool',
		call: async ({ request, results, task }) => {
			const payload =
				(options.buildPayload ? await options.buildPayload({ task, request, results }) : task.instruction) ?? {}
			const parameter = options.buildParameter ? await options.buildParameter({ task, request, results }) : undefined
			return await call(payload as InvokePayload, parameter as InvokeParameter | undefined)
		},
	})

	const createToolExecutorLogic = (
		options: AgentToolExecutorLogicOptions<
			AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
		>,
	): AgentPlanExecutor<
		AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
	> => ({
		id: options.id,
		description: options.description,
		kind: options.kind ?? 'custom',
		call: async input => await options.call(input),
	})

	const createAgentExecutorFromInvoke = (
		call: (
			payload: unknown,
			parameter?: unknown,
		) => {
			final(): Promise<unknown>
			[Symbol.asyncIterator](): AsyncIterator<unknown>
		},
		options: AgentAgentExecutorFromInvokeOptions,
	): AgentPlanExecutor<
		AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
	> => ({
		id: options.id,
		description: options.description,
		kind: 'agent',
		call: async ({ request, results, task }) => {
			const payload =
				(options.buildPayload ? await options.buildPayload({ task, request, results }) : task.instruction) ?? {}
			const parameter = options.buildParameter ? await options.buildParameter({ task, request, results }) : undefined
			const invocation = call(payload, parameter)
			const finalResult = normalizeAgentInvocationFinalResult({
				result: await invocation.final(),
				agentName: options.id,
				serviceVersion: '1',
			})
			const envelopes = finalResult.envelopes

			const forwardingOptions = options.forwardToCurrentStream
			if (forwardingOptions) {
				for (const envelope of envelopes) {
					const frame = envelope.frame

					if (
						frame.kind === 'message' &&
						frame.role === 'assistant' &&
						typeof frame.content === 'string' &&
						frame.content.length > 0 &&
						shouldForwardAgentStreamKey(forwardingOptions, 'assistant')
					) {
						input.protocol.emitEnvelope(envelope)
						continue
					}

					if (frame.kind === 'artifact') {
						if (shouldForwardArtifactFrame(forwardingOptions, frame)) {
							input.protocol.emitEnvelope(envelope)
							continue
						}
					}

					if (frame.kind === 'tool' && shouldForwardAgentStreamKey(forwardingOptions, 'toolEvents')) {
						input.protocol.emitEnvelope(envelope)
						continue
					}

					if (frame.kind === 'error' && shouldForwardAgentStreamKey(forwardingOptions, 'errors')) {
						input.protocol.emitEnvelope(envelope)
					}
				}
			}

			if ((options.resultMode ?? 'protocol') === 'protocol') {
				return envelopes
			}
			if ((options.resultMode ?? 'protocol') === 'text') {
				const outputMessage =
					finalResult.output && typeof finalResult.output === 'object'
						? typeof (finalResult.output as { message?: unknown }).message === 'string'
							? (finalResult.output as { message: string }).message
							: typeof (finalResult.output as { answer?: unknown }).answer === 'string'
								? (finalResult.output as { answer: string }).answer
								: undefined
						: undefined
				return finalResult.message ?? outputMessage ?? extractFinalAssistantText(envelopes)
			}
			const parsed = finalResult.output ?? extractArtifactContent(envelopes, 'output')
			if (parsed === null) {
				throw new HandledError(
					StatusCode.BadGateway,
					`Agent executor ${options.id} did not emit the required final output artifact`,
				)
			}
			if (!options.outputSchema) {
				return parsed
			}
			const result = await validate(options.outputSchema, parsed)
			if (!result.success) {
				throw new HandledError(StatusCode.BadGateway, 'Delegated agent output schema validation failed', {
					output: parsed,
					issues: result.issues,
				})
			}
			return result.data
		},
	})

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
		serviceVersion: input.manifest.serviceVersion,
		serviceContext: input.serviceContext,
	})
	const sandbox = createAgentSandboxHelpers({
		config: input.sandbox,
		manifest: input.manifest,
		payload: input.payload,
		parameter: input.parameter,
		message: input.serviceContext.message,
		resources: input.resources,
		identity,
	})

	const typedEmbeddings: AgentHandlerContext<
		Payload,
		Parameter,
		Resources,
		Models,
		AgentInvokes,
		EmitPayloads,
		ToolInvokes
	>['ai']['embeddings'] = input.embeddings

	const typedRerankers: AgentHandlerContext<
		Payload,
		Parameter,
		Resources,
		Models,
		AgentInvokes,
		EmitPayloads,
		ToolInvokes
	>['ai']['rerankers'] = input.rerankers

	let handlerContext!: AgentHandlerContext<
		Payload,
		Parameter,
		Resources,
		Models,
		AgentInvokes,
		EmitPayloads,
		ToolInvokes
	>

	const plan = createAgentPlanHelpers({
		getContext: () => handlerContext,
		getDefaultRequest: () => inferRequestFromPayload(input.payload),
		getDefaultTitle: () => `${input.manifest.agentName} workflow`,
		getRunState: () => runState,
		getModels: () => input.models,
		logger: input.serviceContext.logger,
	})

	handlerContext = {
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
			conversation,
			run: runState,
		},
		invoke: {
			tools,
			expose,
			agents,
		},
		ai: {
			models: input.models,
			streamText,
			streamObject,
			reply,
			replyObject,
			createModelExecutor,
			createToolExecutorFromInvoke,
			createToolExecutorLogic,
			createAgentExecutorFromInvoke,
			embeddings: typedEmbeddings,
			rerankers: typedRerankers,
			skills,
			policy,
			reflect,
		},
		plan,
		io: {
			stream,
			tasks,
			workflow: createWorkflowEmitter(input.protocol),
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
			sandbox,
		},
	}
	return handlerContext
}
