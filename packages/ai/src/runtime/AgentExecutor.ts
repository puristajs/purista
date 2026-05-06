import type { Tracer } from '@opentelemetry/api'
import type { AgentInvokeList, EventBridge, Logger, QueueJobContext, QueueMessage, Schema } from '@purista/core'
import { HandledError, StatusCode, UnhandledError, validate } from '@purista/core'
import type { ConversationStore } from '../memory/conversationStore.js'
import type { PoolManager } from '../pools/PoolManager.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import type { AgentSandboxRuntimeConfig } from '../sandbox/provider.js'
import type { AgentHandler, AgentHandlerResultObject } from '../types/AgentHandler.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import { createAgentHandlerContext, createProtocolBuffer, type ProtocolContext, type ToolInvokeMap } from './context.js'
import { createRuntimeLogContext, createSanitizedErrorDiagnostics } from './errorDiagnostics.js'
import { resolveAgentInvocationIdentity } from './invocationIdentity.js'
import { ModelRouter } from './ModelRouter.js'
import { adaptQueueJobContextToProtocolContext } from './protocolContextAdapter.js'
import { createAgentInvocationFinalResult } from './terminalResult.js'

export type AgentExecutorOptions<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = Record<string, unknown>,
	ToolInvokes extends ToolInvokeMap = ToolInvokeMap,
> = {
	manifest: AgentManifest
	handler: AgentHandler<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
	models: Models
	poolManager: PoolManager
	conversationStore: ConversationStore
	logger: Logger
	eventBridge: EventBridge
	tracer?: Tracer
	callOptionsSchema?: import('zod').ZodType<import('../types/AgentHandler.js').AgentModelCallOptions>
	prepareCall?: import('../types/AgentHandler.js').AgentPrepareCallHook
	prepareStep?: import('../types/AgentHandler.js').AgentPrepareStepHook
	poolId?: string
	maxConcurrencyPerInstance?: number
	concurrencyHints?: {
		replicaCountHint?: number
	}
	resources?: Resources
	sandbox?: AgentSandboxRuntimeConfig<Resources>
}

export type AgentExecutionResult = {
	envelopes: AgentProtocolEnvelope[]
}

export class AgentExecutor<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = Record<string, unknown>,
	ToolInvokes extends ToolInvokeMap = ToolInvokeMap,
> {
	private readonly poolId: string
	private readonly maxConcurrencyPerInstance: number
	private readonly concurrencyHints: { replicaCountHint?: number }
	private readonly resources: Resources
	private readonly sandbox?: AgentSandboxRuntimeConfig<Resources>
	private readonly manifest: AgentManifest
	private readonly handler: AgentHandler<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>
	private readonly models: Models
	private readonly poolManager: PoolManager
	private readonly conversationStore: ConversationStore
	private readonly logger: Logger
	private readonly eventBridge: EventBridge
	private readonly tracer?: Tracer
	private readonly callOptionsSchema?: import('zod').ZodType<import('../types/AgentHandler.js').AgentModelCallOptions>
	private readonly prepareCall?: import('../types/AgentHandler.js').AgentPrepareCallHook
	private readonly prepareStep?: import('../types/AgentHandler.js').AgentPrepareStepHook

	constructor(
		options: AgentExecutorOptions<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>,
	) {
		this.poolId = options.poolId ?? `agent:${options.manifest.agentName}`
		this.maxConcurrencyPerInstance = options.maxConcurrencyPerInstance ?? 1
		this.concurrencyHints = options.concurrencyHints ?? {}
		this.resources = (options.resources ?? {}) as Resources
		this.sandbox = options.sandbox
		this.manifest = options.manifest
		this.handler = options.handler
		this.models = options.models
		this.poolManager = options.poolManager
		this.conversationStore = options.conversationStore
		this.logger = options.logger
		this.eventBridge = options.eventBridge
		this.tracer = options.tracer
		this.callOptionsSchema = options.callOptionsSchema
		this.prepareCall = options.prepareCall
		this.prepareStep = options.prepareStep
	}

	async execute(
		jobContext: QueueJobContext,
		message: QueueMessage,
		onEnvelope?: (envelope: AgentProtocolEnvelope) => Promise<void>,
	): Promise<AgentExecutionResult> {
		const protocolContext = adaptQueueJobContextToProtocolContext<Payload, Parameter, Resources, AgentInvokes>(
			jobContext,
			this.manifest,
			this.eventBridge,
		)
		return await this.executeWithProtocolContext(
			protocolContext,
			message.payload as Payload,
			(message.parameter ?? {}) as Parameter,
			onEnvelope,
		)
	}

	async executeWithProtocolContext(
		protocolContext: ProtocolContext<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>>,
		payload: Payload,
		parameter: Parameter,
		onEnvelope?: (envelope: AgentProtocolEnvelope) => Promise<void>,
	): Promise<AgentExecutionResult> {
		const poolId = this.poolId
		const enqueuedAt = Date.now()
		const acquireResult = await this.poolManager.acquire(poolId)
		const started = Date.now()

		const usage = {
			provider: undefined as string | undefined,
			promptTokens: 0,
			completionTokens: 0,
			costUsd: 0,
		}
		const identity = resolveAgentInvocationIdentity({
			agentName: this.manifest.agentName,
			serviceVersion: this.manifest.serviceVersion,
			message: protocolContext.message,
			payload,
		})
		const protocolBuffer = createProtocolBuffer(protocolContext, {
			onEnvelope,
			identity,
		})

		try {
			const modelRouter = new ModelRouter<Models>({
				manifest: this.manifest,
				identity,
				models: this.models,
				logger: this.logger,
				tracer: this.tracer,
				callOptionsSchema: this.callOptionsSchema,
				prepareCall: this.prepareCall,
				prepareStep: this.prepareStep,
				poolId,
				maxConcurrencyPerInstance: this.maxConcurrencyPerInstance,
				concurrencyHints: this.concurrencyHints,
				maxModelSteps: this.manifest.executionPolicy?.maxModelSteps,
				maxToolCalls: this.manifest.executionPolicy?.maxToolCalls,
			})

			const {
				models: instrumentedModels,
				embeddings: instrumentedEmbeddings,
				rerankers: instrumentedRerankers,
			} = modelRouter.instrument()

			const agentContext = createAgentHandlerContext<
				Payload,
				Parameter,
				Resources,
				Models,
				AgentInvokes,
				EmitPayloads,
				ToolInvokes
			>({
				serviceContext: protocolContext,
				eventBridge: this.eventBridge,
				payload,
				parameter,
				conversationStore: this.conversationStore,
				protocol: protocolBuffer.protocol,
				resources: this.resources,
				models: instrumentedModels,
				embeddings: instrumentedEmbeddings,
				rerankers: instrumentedRerankers,
				manifest: this.manifest,
				executionBudget: modelRouter.getBudget(),
				identity,
				sandbox: this.sandbox,
			})

			const result = await this.handler(agentContext, payload, parameter)

			const resultObject =
				typeof result === 'object' && result && 'message' in result ? (result as AgentHandlerResultObject) : undefined

			if (this.manifest.outputSchema) {
				if (resultObject?.output === undefined) {
					throw new UnhandledError(
						StatusCode.InternalServerError,
						'Agent output schema declared but handler did not return output',
					)
				}
				const validationResult = await validate(
					this.manifest.outputSchema as import('@purista/core').Schema,
					resultObject.output,
				)
				if (!validationResult.success) {
					throw new UnhandledError(StatusCode.InternalServerError, 'Agent output schema validation failed', {
						issues: validationResult.issues,
					})
				}
				protocolBuffer.protocol.emitArtifact({
					artifactId: 'output',
					mimeType: 'application/json',
					content: validationResult.data as Record<string, unknown>,
					final: true,
				})
				if (this.manifest.successEventName) {
					await (protocolContext.emit as (eventName: string, payload: unknown) => Promise<void> | void)(
						this.manifest.successEventName,
						validationResult.data,
					)
				}
			}

			if (!protocolBuffer.protocol.has('message')) {
				if (typeof result === 'object' && result && 'message' in result) {
					protocolBuffer.protocol.emitMessage({
						content: result.message,
						summary: result.summary,
						final: true,
					})
				} else {
					protocolBuffer.protocol.emitMessage(result ?? '', { final: true })
				}
			}

			if (!protocolBuffer.protocol.has('telemetry')) {
				const replicaCountHint =
					typeof this.concurrencyHints?.replicaCountHint === 'number' && this.concurrencyHints.replicaCountHint > 0
						? Math.trunc(this.concurrencyHints.replicaCountHint)
						: undefined
				const effectiveMaxConcurrencyHint =
					typeof replicaCountHint === 'number' ? replicaCountHint * this.maxConcurrencyPerInstance : undefined

				protocolBuffer.protocol.emitTelemetry({
					durationMs: Date.now() - started,
					waitTimeMs: acquireResult.waitTimeMs || started - enqueuedAt,
					poolId,
					maxConcurrencyPerInstance: this.maxConcurrencyPerInstance,
					activeWorkers: acquireResult.activeWorkers,
					waitingWorkers: acquireResult.waitingWorkers,
					replicaCountHint,
					effectiveMaxConcurrencyHint,
					provider: usage.provider ?? this.manifest.modelResource?.resourceName,
					usage: resultObject?.usage ?? {
						promptTokens: usage.promptTokens || undefined,
						completionTokens: usage.completionTokens || undefined,
						totalTokens:
							usage.promptTokens || usage.completionTokens ? usage.promptTokens + usage.completionTokens : undefined,
						costUsd: usage.costUsd || undefined,
					},
				})
			}

			await protocolBuffer.flush()
			const envelopes = protocolBuffer.toEnvelopes()
			return createAgentInvocationFinalResult({
				envelopes,
				agentName: this.manifest.agentName,
				serviceVersion: this.manifest.serviceVersion,
			})
		} catch (error) {
			this.logger.error(
				{
					...createRuntimeLogContext({
						manifest: this.manifest,
						identity,
					}),
					error: createSanitizedErrorDiagnostics(error),
				},
				'agent handler failed',
			)
			protocolBuffer.protocol.emitError(error as Error, {
				code: error instanceof HandledError ? String((error as HandledError).errorCode) : undefined,
				handled: error instanceof HandledError,
			})
			await protocolBuffer.flush()
			return createAgentInvocationFinalResult({
				envelopes: protocolBuffer.toEnvelopes(),
				agentName: this.manifest.agentName,
				serviceVersion: this.manifest.serviceVersion,
			})
		} finally {
			this.poolManager.release(poolId)
		}
	}
}
