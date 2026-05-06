import type { Tracer } from '@opentelemetry/api'
import type { Logger } from '@purista/core'
import type { ExternalBinding, ExternalBindingSet } from '../bridge/externalRuntime.js'
import type { AgentAttachment, AgentInputPart } from '../input/types.js'
import { generateText as generateTextWithBounds } from '../providers/runtime/generateText.js'
import type {
	ModelProvider,
	ProviderJsonOutputFromSchema,
	ProviderObjectStreamRequest,
} from '../providers/runtime/ModelProvider.js'
import type { SkillDocument, SkillReferenceDocument } from '../skills/fileSystem.js'
import type {
	AgentModelCallKind,
	AgentModelCallOptions,
	AgentModelCallPrepareInput,
	AgentPrepareCallHook,
	AgentPrepareStepHook,
} from '../types/AgentHandler.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import type { ModelEmbeddings, ModelRerankers } from './context.js'
import { createRuntimeLogContext, createSanitizedErrorDiagnostics, sanitizeUnknown } from './errorDiagnostics.js'
import { type AgentExecutionBudget, createAgentExecutionBudget } from './executionBudget.js'
import type { AgentInvocationIdentity } from './invocationIdentity.js'
import { injectRuntimeAiSdkTelemetry, withRuntimeModelInvocationSpan } from './modelTelemetry.js'

export type ModelRouterOptions<Models extends Record<string, ModelProvider> = Record<string, ModelProvider>> = {
	manifest: AgentManifest
	identity: AgentInvocationIdentity
	models: Models
	logger: Logger
	tracer?: Tracer
	poolId: string
	maxConcurrencyPerInstance: number
	concurrencyHints?: {
		replicaCountHint?: number
	}
	callOptionsSchema?: import('zod').ZodType<AgentModelCallOptions>
	prepareCall?: AgentPrepareCallHook
	prepareStep?: AgentPrepareStepHook
	maxModelSteps?: number
	maxToolCalls?: number
}

type InstrumentedEmbedding = {
	name: string
	embed: (request: { value: string; metadata?: Record<string, unknown> }) => Promise<{
		embedding: number[]
		usage?: { tokens?: number }
		metadata?: Record<string, unknown>
	}>
	embedMany?: (request: { values: string[]; metadata?: Record<string, unknown> }) => Promise<{
		embeddings: number[][]
		usage?: { tokens?: number }
		metadata?: Record<string, unknown>
	}>
}

type InstrumentedReranker = {
	name: string
	rerank: <Document = string | Record<string, unknown>>(request: {
		query: string
		documents: Document[]
		topN?: number
		metadata?: Record<string, unknown>
	}) => Promise<{
		ranking: Array<{ originalIndex: number; score: number; document: Document }>
		rerankedDocuments: Document[]
		metadata?: Record<string, unknown>
	}>
}

export type InstrumentedModels<Models extends Record<string, ModelProvider> = Record<string, ModelProvider>> = Models
export type InstrumentedEmbeddings<Models extends Record<string, ModelProvider> = Record<string, ModelProvider>> =
	ModelEmbeddings<Models>
export type InstrumentedRerankers<Models extends Record<string, ModelProvider> = Record<string, ModelProvider>> =
	ModelRerankers<Models>

export class ModelRouter<Models extends Record<string, ModelProvider> = Record<string, ModelProvider>> {
	private readonly options: ModelRouterOptions<Models>
	private readonly executionBudget: AgentExecutionBudget
	private readonly stepCounters = {
		global: 0,
		byAliasAndKind: new Map<string, number>(),
	}

	constructor(options: ModelRouterOptions<Models>) {
		this.options = options
		this.executionBudget = createAgentExecutionBudget({
			modelSteps: options.maxModelSteps,
			toolCalls: options.maxToolCalls,
		})
	}

	getBudget(): AgentExecutionBudget {
		return this.executionBudget
	}

	private mergeAiSdkMetadata(
		base: Record<string, unknown> | undefined,
		patch: Record<string, unknown> | undefined,
	): Record<string, unknown> {
		const next: Record<string, unknown> = {
			...((base ?? {}) as Record<string, unknown>),
		}
		for (const [key, value] of Object.entries(patch ?? {})) {
			const existing = next[key]
			if (
				existing &&
				typeof existing === 'object' &&
				!Array.isArray(existing) &&
				value &&
				typeof value === 'object' &&
				!Array.isArray(value)
			) {
				next[key] = {
					...(existing as Record<string, unknown>),
					...(value as Record<string, unknown>),
				}
				continue
			}
			next[key] = value
		}
		return next
	}

	private mergeMetadata(
		base: Record<string, unknown> | undefined,
		options: AgentModelCallOptions | undefined,
	): Record<string, unknown> {
		const merged: Record<string, unknown> = {
			...((base ?? {}) as Record<string, unknown>),
			...((options?.metadata ?? {}) as Record<string, unknown>),
		}
		const baseAiSdk =
			merged.aiSdk && typeof merged.aiSdk === 'object' && !Array.isArray(merged.aiSdk)
				? (merged.aiSdk as Record<string, unknown>)
				: undefined
		const mergedAiSdk = this.mergeAiSdkMetadata(baseAiSdk, options?.aiSdk)
		if (Object.keys(mergedAiSdk).length > 0) {
			merged.aiSdk = mergedAiSdk
		}
		return merged
	}

	private instrumentMetadata(
		metadata: Record<string, unknown> | undefined,
		callKind: 'generateText' | 'streamText' | 'generateObject' | 'embed' | 'embedMany' | 'rerank' | 'streamObject',
		alias: string,
	): Record<string, unknown> {
		return injectRuntimeAiSdkTelemetry({
			metadata,
			manifest: this.options.manifest,
			identity: this.options.identity,
			capability: callKind,
			alias,
			poolId: this.options.poolId,
			maxConcurrencyPerInstance: this.options.maxConcurrencyPerInstance,
			concurrencyHints: this.options.concurrencyHints,
			tracer: this.options.tracer,
		})
	}

	private async withInvocationSpan<T>(
		capability: 'generateText' | 'streamText' | 'generateObject' | 'streamObject' | 'embed' | 'embedMany' | 'rerank',
		alias: string,
		providerName: string,
		run: () => Promise<T>,
	): Promise<T> {
		return await withRuntimeModelInvocationSpan({
			tracer: this.options.tracer,
			manifest: this.options.manifest,
			identity: this.options.identity,
			capability,
			alias,
			providerName,
			run,
		})
	}

	private async resolvePreparedMetadata(input: {
		alias: string
		callKind: AgentModelCallKind
		requestMetadata?: Record<string, unknown>
	}): Promise<Record<string, unknown> | undefined> {
		const key = `${input.alias}:${input.callKind}`
		this.stepCounters.global += 1
		const kindStep = (this.stepCounters.byAliasAndKind.get(key) ?? 0) + 1
		this.stepCounters.byAliasAndKind.set(key, kindStep)

		const hookInput: AgentModelCallPrepareInput = {
			alias: input.alias,
			callKind: input.callKind,
			step: this.stepCounters.global,
			stepByAliasAndKind: kindStep,
			requestMetadata: input.requestMetadata,
		}

		const parseOptions = (value: AgentModelCallOptions | undefined): AgentModelCallOptions | undefined => {
			if (!value) {
				return undefined
			}
			if (this.options.callOptionsSchema) {
				return this.options.callOptionsSchema.parse(value)
			}
			return value
		}

		const preparedCall = parseOptions(await this.options.prepareCall?.(hookInput))
		const preparedStep = parseOptions(await this.options.prepareStep?.(hookInput))
		return this.mergeMetadata(this.mergeMetadata(input.requestMetadata, preparedCall), preparedStep)
	}

	private logProviderWarnings(
		capability: 'generateText' | 'streamText' | 'generateObject' | 'streamObject' | 'embed' | 'embedMany' | 'rerank',
		alias: string,
		providerName: string,
		metadata: Record<string, unknown> | undefined,
	): void {
		const warnings = (
			metadata && typeof metadata === 'object' && 'warnings' in metadata
				? (metadata as { warnings?: unknown }).warnings
				: undefined
		) as unknown[] | undefined
		if (!warnings || !Array.isArray(warnings) || warnings.length === 0) {
			return
		}
		this.options.logger.warn(
			{
				...createRuntimeLogContext({
					manifest: this.options.manifest,
					identity: this.options.identity,
					modelAlias: alias,
					provider: providerName,
					capability,
				}),
				warningCount: warnings.length,
				warnings: sanitizeUnknown(warnings),
			},
			'AI provider returned warnings',
		)
	}

	private logProviderFailure(
		capability: 'generateText' | 'streamText' | 'generateObject' | 'streamObject' | 'embed' | 'embedMany' | 'rerank',
		alias: string,
		providerName: string,
		startedAt: number,
		error: unknown,
	): void {
		this.options.logger.error(
			{
				...createRuntimeLogContext({
					manifest: this.options.manifest,
					identity: this.options.identity,
					modelAlias: alias,
					provider: providerName,
					capability,
					durationMs: Date.now() - startedAt,
				}),
				error: createSanitizedErrorDiagnostics(error, { fallbackKind: 'provider' }),
			},
			'AI provider invocation failed',
		)
	}

	instrument(): {
		models: InstrumentedModels<Models>
		embeddings: InstrumentedEmbeddings<Models>
		rerankers: InstrumentedRerankers<Models>
	} {
		const instrumentedModels: Record<string, ModelProvider> = {}
		const instrumentedEmbeddings: Record<string, InstrumentedEmbedding> = {}
		const instrumentedRerankers: Record<string, InstrumentedReranker> = {}

		for (const [alias, provider] of Object.entries(this.options.models)) {
			const modelApi: ModelProvider = {
				name: provider.name,
				capabilities: provider.capabilities,
			}

			if (provider.generateObject) {
				const generateObjectProvider = provider.generateObject.bind(provider)
				modelApi.generateObject = async <T = unknown>(request: {
					prompt: string
					input?: AgentInputPart[]
					attachments?: AgentAttachment[]
					context?: string
					developerInstruction?: string | string[]
					skills?: Array<Pick<SkillDocument, 'name' | 'content'>>
					references?: Array<Pick<SkillReferenceDocument, 'skillName' | 'relativePath' | 'content'>>
					bindings?: ExternalBindingSet | ExternalBinding[]
					schema?: unknown
					metadata?: Record<string, unknown>
				}): Promise<{
					data: T
					text: string
					reasoningText?: string
					tokens?: {
						prompt: number
						completion: number
					}
					metadata?: Record<string, unknown>
				}> => {
					const requestStartedAt = Date.now()
					try {
						this.executionBudget.consumeModelStep({ alias, callKind: 'generateObject' })
						const metadata = this.instrumentMetadata(
							await this.resolvePreparedMetadata({
								alias,
								callKind: 'generateObject',
								requestMetadata: request.metadata,
							}),
							'generateObject',
							alias,
						)
						const result = await this.withInvocationSpan(
							'generateObject',
							alias,
							provider.name,
							async () =>
								await generateObjectProvider<T>({
									...request,
									metadata,
								}),
						)
						if (!result) {
							throw new Error('Model object provider unavailable')
						}
						this.logProviderWarnings('generateObject', alias, provider.name, result.metadata)
						return result
					} catch (error) {
						this.logProviderFailure('generateObject', alias, provider.name, requestStartedAt, error)
						throw error
					}
				}
			}

			if (provider.streamText) {
				const streamProvider = provider.streamText.bind(provider)
				modelApi.streamText = request => {
					const requestStartedAt = Date.now()
					this.executionBudget.consumeModelStep({ alias, callKind: 'streamText' })
					let streamHandlePromise: Promise<ReturnType<NonNullable<ModelProvider['streamText']>>> | undefined
					const resolveStream = async () => {
						streamHandlePromise ??= (async () => {
							try {
								const metadata = this.instrumentMetadata(
									await this.resolvePreparedMetadata({
										alias,
										callKind: 'streamText',
										requestMetadata: request.metadata,
									}),
									'streamText',
									alias,
								)
								const streamHandle = await this.withInvocationSpan('streamText', alias, provider.name, async () =>
									streamProvider({
										...request,
										metadata,
									}),
								)
								if (!streamHandle) {
									throw new Error('Model text stream provider unavailable')
								}
								return streamHandle
							} catch (error) {
								this.logProviderFailure('streamText', alias, provider.name, requestStartedAt, error)
								throw error
							}
						})()
						return await streamHandlePromise
					}

					return {
						final: async () => {
							try {
								const streamHandle = await resolveStream()
								const result = await streamHandle.final()
								this.logProviderWarnings('streamText', alias, provider.name, result.metadata)
								return result
							} catch (error) {
								this.logProviderFailure('streamText', alias, provider.name, requestStartedAt, error)
								throw error
							}
						},
						async *[Symbol.asyncIterator]() {
							const streamHandle = await resolveStream()
							for await (const chunk of streamHandle) {
								yield chunk
							}
						},
					}
				}
			}

			if (provider.streamObject) {
				const streamObjectProvider = provider.streamObject.bind(provider)
				modelApi.streamObject = (<T = unknown, OutputSchema = unknown>(
					request: ProviderObjectStreamRequest<ProviderJsonOutputFromSchema<OutputSchema, T>, OutputSchema>,
				) => {
					type JsonOutput = ProviderJsonOutputFromSchema<OutputSchema, T>
					const typedRequest = request as ProviderObjectStreamRequest<JsonOutput, OutputSchema>
					const requestStartedAt = Date.now()
					this.executionBudget.consumeModelStep({ alias, callKind: 'streamObject' })
					let streamHandlePromise: Promise<ReturnType<NonNullable<ModelProvider['streamObject']>>> | undefined

					const resolveStream = async () => {
						streamHandlePromise ??= (async () => {
							try {
								const metadata = this.instrumentMetadata(
									await this.resolvePreparedMetadata({
										alias,
										callKind: 'streamObject',
										requestMetadata: typedRequest.metadata,
									}),
									'streamObject',
									alias,
								)
								const streamHandle = await this.withInvocationSpan('streamObject', alias, provider.name, async () =>
									streamObjectProvider<T, OutputSchema>({
										...typedRequest,
										metadata,
									}),
								)
								if (!streamHandle) {
									throw new Error('Model structured stream provider unavailable')
								}
								return streamHandle
							} catch (error) {
								this.logProviderFailure('streamObject', alias, provider.name, requestStartedAt, error)
								throw error
							}
						})()
						return await streamHandlePromise
					}

					return {
						final: async () => {
							try {
								const streamHandle = await resolveStream()
								const result = await streamHandle.final()
								this.logProviderWarnings('streamObject', alias, provider.name, result.metadata)
								return result
							} catch (error) {
								this.logProviderFailure('streamObject', alias, provider.name, requestStartedAt, error)
								throw error
							}
						},
						async *[Symbol.asyncIterator]() {
							const streamHandle = await resolveStream()
							for await (const chunk of streamHandle) {
								yield chunk
							}
						},
					}
				}) as NonNullable<ModelProvider['streamObject']>
			}

			if (provider.embed) {
				const embedProvider = provider.embed.bind(provider)
				const embedManyProvider = provider.embedMany?.bind(provider)
				instrumentedEmbeddings[alias] = {
					name: provider.name,
					embed: async request => {
						const requestStartedAt = Date.now()
						try {
							this.executionBudget.consumeModelStep({ alias, callKind: 'embed' })
							const metadata = this.instrumentMetadata(
								await this.resolvePreparedMetadata({
									alias,
									callKind: 'embed',
									requestMetadata: request.metadata,
								}),
								'embed',
								alias,
							)
							const result = await this.withInvocationSpan(
								'embed',
								alias,
								provider.name,
								async () =>
									await embedProvider({
										...request,
										metadata,
									}),
							)
							this.logProviderWarnings('embed', alias, provider.name, result?.metadata)
							return result
						} catch (error) {
							this.logProviderFailure('embed', alias, provider.name, requestStartedAt, error)
							throw error
						}
					},
					embedMany: embedManyProvider
						? async request => {
								const requestStartedAt = Date.now()
								try {
									this.executionBudget.consumeModelStep({ alias, callKind: 'embedMany' })
									const metadata = this.instrumentMetadata(
										await this.resolvePreparedMetadata({
											alias,
											callKind: 'embedMany',
											requestMetadata: request.metadata,
										}),
										'embedMany',
										alias,
									)
									const result = await this.withInvocationSpan(
										'embedMany',
										alias,
										provider.name,
										async () =>
											await embedManyProvider({
												...request,
												metadata,
											}),
									)
									this.logProviderWarnings('embedMany', alias, provider.name, result?.metadata)
									return result
								} catch (error) {
									this.logProviderFailure('embedMany', alias, provider.name, requestStartedAt, error)
									throw error
								}
							}
						: undefined,
				}
			}

			if (provider.rerank) {
				const rerankProvider = provider.rerank.bind(provider)
				instrumentedRerankers[alias] = {
					name: provider.name,
					rerank: async request => {
						const requestStartedAt = Date.now()
						try {
							this.executionBudget.consumeModelStep({ alias, callKind: 'rerank' })
							const metadata = this.instrumentMetadata(
								await this.resolvePreparedMetadata({
									alias,
									callKind: 'rerank',
									requestMetadata: request.metadata,
								}),
								'rerank',
								alias,
							)
							const result = await this.withInvocationSpan(
								'rerank',
								alias,
								provider.name,
								async () =>
									await rerankProvider({
										...request,
										metadata,
									}),
							)
							this.logProviderWarnings('rerank', alias, provider.name, result?.metadata)
							return result
						} catch (error) {
							this.logProviderFailure('rerank', alias, provider.name, requestStartedAt, error)
							throw error
						}
					},
				}
			}

			if (provider.generateText) {
				modelApi.generateText = async request => {
					const requestStartedAt = Date.now()
					const generateText = provider.generateText?.bind(provider)
					if (!generateText) {
						throw new Error(`Provider ${provider.name} does not support generateText`)
					}
					try {
						this.executionBudget.consumeModelStep({ alias, callKind: 'generateText' })
						const result = await this.withInvocationSpan(
							'generateText',
							alias,
							provider.name,
							async () =>
								await generateText({
									...request,
									metadata: this.instrumentMetadata(
										await this.resolvePreparedMetadata({
											alias,
											callKind: 'generateText',
											requestMetadata: request.metadata,
										}),
										'generateText',
										alias,
									),
								}),
						)
						return result
					} catch (error) {
						this.logProviderFailure('generateText', alias, provider.name, requestStartedAt, error)
						throw error
					}
				}
			} else if (modelApi.streamText) {
				modelApi.generateText = async request => {
					const requestStartedAt = Date.now()
					try {
						this.executionBudget.consumeModelStep({ alias, callKind: 'generateText' })
						return await this.withInvocationSpan(
							'generateText',
							alias,
							provider.name,
							async () =>
								await generateTextWithBounds({
									model: {
										streamText: modelApi.streamText,
									},
									request: {
										prompt: request.prompt,
										input: request.input,
										attachments: request.attachments,
										context: request.context,
										developerInstruction: request.developerInstruction,
										skills: request.skills,
										references: request.references,
										bindings: request.bindings,
										metadata: this.instrumentMetadata(
											await this.resolvePreparedMetadata({
												alias,
												callKind: 'generateText',
												requestMetadata: request.metadata,
											}),
											'generateText',
											alias,
										),
									},
									onReasoning: request.onReasoning,
									onTextDelta: request.onTextDelta,
									label: `${this.options.manifest.agentName}.model.${alias}.generateText`,
								}),
						)
					} catch (error) {
						this.logProviderFailure('generateText', alias, provider.name, requestStartedAt, error)
						throw error
					}
				}
			}

			if (modelApi.streamText || modelApi.streamObject || modelApi.generateText || modelApi.generateObject) {
				instrumentedModels[alias] = modelApi
			}
		}

		return {
			models: instrumentedModels as InstrumentedModels<Models>,
			embeddings: instrumentedEmbeddings as InstrumentedEmbeddings<Models>,
			rerankers: instrumentedRerankers as InstrumentedRerankers<Models>,
		}
	}
}
