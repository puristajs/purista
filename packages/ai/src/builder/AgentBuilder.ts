import type { CommandFunctionContext, Schema } from '@purista/core'
import { extendApi, HandledError, ServiceBuilder, StatusCode } from '@purista/core'
import { z } from 'zod/v4'

import type { KnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import type { SessionStore } from '../memory/sessionStore.js'
import type { PoolManager } from '../pools/PoolManager.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import { AgentInstance, type AgentInstanceDependencies } from '../runtime/AgentInstance.js'
import type { AgentHandlerContext } from '../runtime/context.js'
import { createAgentHandlerContext, createProtocolBuffer } from '../runtime/context.js'
import type { AgentDefinition, AgentInfo } from '../types/AgentDefinition.js'
import type {
	AgentManifest,
	AgentHistoryPreset,
	AgentSessionConfig,
	AllowedToolDefinition,
	ConcurrencyConfig,
	RetryPolicy,
} from '../types/AgentManifest.js'

type AgentHandlerResultObject = {
	message: string
	summary?: string
	usage?: {
		promptTokens?: number
		completionTokens?: number
		totalTokens?: number
		costUsd?: number
	}
}

export type AgentHandlerResult = string | AgentHandlerResultObject | undefined

export type AgentHandler<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
> = (
	context: AgentHandlerContext<Payload, Parameter, Resources, Models>,
	payload: Payload,
	parameter: Parameter,
) => Promise<AgentHandlerResult> | AgentHandlerResult

type AgentRuntimeConfig = {
	handler: AgentHandler
	manifest: AgentManifest
	sessionStore: SessionStore
	knowledgeAdapters: Record<string, KnowledgeAdapter>
	poolManager: PoolManager
	resources: Record<string, unknown>
	models: Record<string, ModelProvider>
	tracer?: import('@opentelemetry/api').Tracer
	poolId: string
}

const agentRuntimeConfigSchema = extendApi(
	z.object({
		runtime: z.record(z.string(), z.any()).optional(),
	}),
	{ title: 'AgentRuntimeConfig' },
)

const normalizeInfo = (info: AgentInfo): AgentInfo => {
	if (!info.agentName?.trim()) {
		throw new Error('Agent name is required')
	}
	const version = info.agentVersion?.trim() || '1'
	return {
		agentName: info.agentName.trim(),
		agentVersion: version,
		description: info.description?.trim(),
	}
}

const resolveHistoryPresetConfig = (
	info: AgentInfo,
	preset: AgentHistoryPreset,
	overrides?: Partial<AgentSessionConfig>,
): AgentSessionConfig => {
	const defaults: Record<AgentHistoryPreset, Omit<AgentSessionConfig, 'storeName'>> = {
		user: {
			strategy: 'full',
			maxFrames: 40,
		},
		agent: {
			strategy: 'summary',
			maxFrames: 20,
		},
	}
	const storeName = overrides?.storeName ?? `${info.agentName}:${info.agentVersion}:${preset}:history`
	return {
		storeName,
		...defaults[preset],
		...overrides,
	}
}

export class AgentBuilder {
	private readonly info: AgentInfo
	private readonly serviceBuilder: ServiceBuilder
	private readonly commandBuilder: ReturnType<ServiceBuilder['getCommandBuilder']>
	private commandDefinitionAdded = false
	private manifest: AgentManifest
	private handler?: AgentHandler

	private payloadSchema?: Schema
	private parameterSchema?: Schema
	private outputSchema?: Schema
	private contextSchema?: Schema

	constructor(info: AgentInfo) {
		this.info = normalizeInfo(info)
		this.serviceBuilder = new ServiceBuilder({
			serviceName: this.info.agentName,
			serviceVersion: this.info.agentVersion,
			serviceDescription: this.info.description ?? `Agent ${this.info.agentName}`,
		})
		this.serviceBuilder.setConfigSchema(agentRuntimeConfigSchema)
		this.commandBuilder = this.serviceBuilder.getCommandBuilder('run', `Invoke ${this.info.agentName}`)

		this.manifest = {
			agentName: this.info.agentName,
			agentVersion: this.info.agentVersion,
			description: this.info.description,
			eventBridge: 'default',
			allowedTools: [],
		}
	}

	setDescription(description: string) {
		this.manifest.description = description
		return this
	}

	useEventBridge(name: string) {
		this.manifest.eventBridge = name
		return this
	}

	useResource(alias: string, resource: { resourceName: string }) {
		this.manifest.resources = {
			...(this.manifest.resources ?? {}),
			[alias]: resource,
		}
		return this
	}

	defineModel(alias: string) {
		if (!alias.trim()) {
			throw new Error('Model alias must not be empty')
		}
		const models = new Set(this.manifest.models ?? [])
		models.add(alias.trim())
		this.manifest.models = [...models]
		return this
	}

	useSessionStore(config: AgentSessionConfig) {
		this.manifest.session = config
		return this
	}

	useKnowledgeAdapter(adapter: { adapterName: string; options?: Record<string, unknown> }) {
		const existing = this.manifest.knowledge ?? []
		this.manifest.knowledge = [...existing, adapter]
		return this
	}

	/**
	 * Configure conversation/session persistence.
	 *
	 * You can either pass a full config object or use presets:
	 * - `persistHistory('user')` defaults to full strategy with a larger frame budget
	 * - `persistHistory('agent')` defaults to summary strategy with a smaller frame budget
	 *
	 * @example
	 * ```ts
	 * new AgentBuilder({ agentName: 'supportAgent', agentVersion: '1' })
	 *   .persistHistory('user')
	 * ```
	 */
	persistHistory(config: AgentSessionConfig): this
	persistHistory(preset: AgentHistoryPreset, overrides?: Partial<AgentSessionConfig>): this
	persistHistory(
		configOrPreset: AgentSessionConfig | AgentHistoryPreset,
		overrides?: Partial<AgentSessionConfig>,
	): this {
		if (typeof configOrPreset === 'string') {
			return this.useSessionStore(resolveHistoryPresetConfig(this.info, configOrPreset, overrides))
		}
		return this.useSessionStore(configOrPreset)
	}

	setConcurrency(config: ConcurrencyConfig) {
		this.manifest.concurrency = config
		return this
	}

	setRuntime(mode: string) {
		this.manifest.metadata = {
			...this.manifest.metadata,
			runtime: mode,
		}
		return this
	}

	setModelResource(resource: AgentManifest['modelResource']) {
		this.manifest.modelResource = resource
		return this
	}

	setRetryPolicy(policy: RetryPolicy) {
		this.manifest.retryPolicy = policy
		return this
	}

	setMemory(config: AgentManifest['session']) {
		return this.useSessionStore(config as AgentSessionConfig)
	}

	setKnowledge(adapters: AgentManifest['knowledge']) {
		this.manifest.knowledge = adapters ?? []
		return this
	}

	allowTool(tool: AllowedToolDefinition) {
		this.manifest.allowedTools = [...this.manifest.allowedTools, tool]
		return this
	}

	setTelemetry(config: AgentManifest['telemetry']) {
		this.manifest.telemetry = config
		return this
	}

	setEvaluation(profile: Record<string, unknown>) {
		this.manifest.metadata = {
			...this.manifest.metadata,
			evaluation: profile,
		}
		return this
	}

	addPayloadSchema(schema: Schema) {
		this.payloadSchema = schema
		this.commandBuilder.addPayloadSchema(schema)
		this.manifest.payloadSchema = schema
		return this
	}

	setInputSchema(schema: Schema) {
		return this.addPayloadSchema(schema)
	}

	addParameterSchema(schema: Schema) {
		this.parameterSchema = schema
		this.commandBuilder.addParameterSchema(schema)
		this.manifest.parameterSchema = schema
		return this
	}

	addOutputSchema(schema: Schema) {
		this.outputSchema = schema
		this.commandBuilder.addOutputSchema(schema)
		this.manifest.outputSchema = schema
		return this
	}

	addContextSchema(schema: Schema) {
		this.contextSchema = schema
		this.manifest.contextSchema = schema
		return this
	}

	setContextSchema(schema: Schema) {
		return this.addContextSchema(schema)
	}

	exposeAsHttpEndpoint(
		method: string,
		path: string,
		contentTypeRequest?: string,
		contentEncodingRequest?: string,
		contentTypeResponse?: string,
		contentEncodingResponse?: string,
	) {
		this.commandBuilder.exposeAsHttpEndpoint(
			method as never,
			path,
			contentTypeRequest as never,
			contentEncodingRequest,
			contentTypeResponse as never,
			contentEncodingResponse,
		)
		this.manifest.httpExposure = {
			method,
			path,
			streamingMode: 'sse',
			requestContentType: contentTypeRequest,
			requestEncoding: contentEncodingRequest,
			responseContentType: contentTypeResponse,
			responseEncoding: contentEncodingResponse,
		}
		return this
	}

	setStreamingMode(mode: 'sse' | 'chunked' | 'buffered') {
		if (!this.manifest.httpExposure) {
			throw new Error('Call exposeAsHttpEndpoint before configuring the streaming mode')
		}
		this.manifest.httpExposure.streamingMode = mode
		return this
	}

	makeEndpointPublic() {
		this.commandBuilder.makeEndpointPublic()
		if (this.manifest.httpExposure) {
			this.manifest.httpExposure.public = true
		}
		return this
	}

	setHandler<
		Payload = unknown,
		Parameter = unknown,
		Resources extends Record<string, unknown> = Record<string, unknown>,
		Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	>(fn: AgentHandler<Payload, Parameter, Resources, Models>) {
		this.handler = fn as AgentHandler
		this.commandBuilder.setCommandFunction(async function commandImpl(
			this: { config?: { runtime?: AgentRuntimeConfig } },
			context: CommandFunctionContext,
			payload: unknown,
			parameter: unknown,
		) {
			const runtime = this.config?.runtime
			if (!runtime?.handler) {
				throw new HandledError(StatusCode.InternalServerError, 'Agent runtime not configured')
			}

			const poolId = runtime.poolId
			const enqueuedAt = Date.now()
			await runtime.poolManager.acquire(poolId)
			const started = Date.now()

			const protocolBuffer = createProtocolBuffer(context)

			try {
				const usage = {
					provider: undefined as string | undefined,
					promptTokens: 0,
					completionTokens: 0,
					costUsd: 0,
				}

				const instrumentedModels = Object.fromEntries(
					Object.entries(runtime.models).map(([alias, provider]) => [
						alias,
						{
							name: provider.name,
							generate: async (request: { prompt: string; context?: string; metadata?: Record<string, unknown> }) => {
								const metadata = request.metadata ?? {}
								const aiSdkMetadata =
									typeof metadata.aiSdk === 'object' && metadata.aiSdk !== null
										? (metadata.aiSdk as Record<string, unknown>)
										: {}

								const result = await provider.generate({
									...request,
									metadata: {
										...metadata,
										aiSdk: {
											...aiSdkMetadata,
											experimental_telemetry: {
												isEnabled: true,
												functionId: `${runtime.manifest.agentName}.model.generate`,
												metadata: {
													agentName: runtime.manifest.agentName,
													agentVersion: runtime.manifest.agentVersion,
													poolId,
												},
												tracer: runtime.tracer,
											},
										},
									},
								})
								usage.provider = provider.name
								usage.promptTokens += result.tokens?.prompt ?? 0
								usage.completionTokens += result.tokens?.completion ?? 0
								usage.costUsd += result.costUsd ?? 0
								return result
							},
						} satisfies ModelProvider,
					]),
				) as Record<string, ModelProvider>

				const agentContext = createAgentHandlerContext({
					serviceContext: context,
					payload,
					parameter,
					sessionStore: runtime.sessionStore,
					knowledgeAdapters: runtime.knowledgeAdapters,
					protocol: protocolBuffer.protocol,
					resources: runtime.resources,
					models: instrumentedModels,
					manifest: runtime.manifest,
				})

				const result = await runtime.handler(agentContext as AgentHandlerContext, payload, parameter)

				const resultObject =
					typeof result === 'object' && result && 'message' in result ? (result as AgentHandlerResultObject) : undefined

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
					protocolBuffer.protocol.emitTelemetry({
						durationMs: Date.now() - started,
						waitTimeMs: started - enqueuedAt,
						poolId,
						provider: usage.provider ?? runtime.manifest.modelResource?.resourceName,
						usage: resultObject?.usage ?? {
							promptTokens: usage.promptTokens || undefined,
							completionTokens: usage.completionTokens || undefined,
							totalTokens:
								usage.promptTokens || usage.completionTokens ? usage.promptTokens + usage.completionTokens : undefined,
							costUsd: usage.costUsd || undefined,
						},
					})
				}

				return protocolBuffer.toEnvelopes()
			} catch (error) {
				context.logger.error({ err: error, agent: runtime.manifest.agentName }, 'agent handler failed')
				protocolBuffer.protocol.emitError(error)
				return protocolBuffer.toEnvelopes()
			} finally {
				runtime.poolManager.release(poolId)
			}
		})
		return this
	}

	build(): AgentDefinition {
		if (!this.handler) {
			throw new Error('Agent handler is required. Call setHandler() before build().')
		}

		if (!this.commandDefinitionAdded) {
			this.serviceBuilder.addCommandDefinition(this.commandBuilder.getDefinition())
			this.commandDefinitionAdded = true
		}

		const manifest: AgentManifest = {
			...this.manifest,
		}

		manifest.allowedTools = manifest.allowedTools ?? []
		const dependencies: AgentInstanceDependencies = {
			info: this.info,
			manifest,
			serviceBuilder: this.serviceBuilder,
			handler: this.handler,
		}

		return {
			info: this.info,
			manifest,
			schemas: {
				payload: this.payloadSchema,
				parameter: this.parameterSchema,
				output: this.outputSchema,
				context: this.contextSchema,
			},
			getManifest: () => manifest,
			getInstance: async (eventBridge, options) => {
				const instance = new AgentInstance(dependencies, eventBridge, options)
				return instance
			},
		}
	}
}
