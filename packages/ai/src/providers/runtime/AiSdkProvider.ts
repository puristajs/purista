import type { Tracer } from '@opentelemetry/api'
import type {
	EmbeddingModel,
	LanguageModel,
	LanguageModelMiddleware,
	ModelMessage,
	RerankingModel,
	SystemModelMessage,
} from 'ai'
import {
	generateText as aiGenerateText,
	streamObject as aiStreamObject,
	embed,
	embedMany,
	generateObject,
	rerank,
	streamText,
	wrapLanguageModel,
} from 'ai'
import { createAiSdkRequest } from '../../bridge/aiSdk.js'
import type {
	ModelProvider,
	ModelProviderCapabilities,
	ProviderEmbedManyRequest,
	ProviderEmbedManyResponse,
	ProviderEmbedRequest,
	ProviderEmbedResponse,
	ProviderGenerateTextRequest,
	ProviderInvocationPolicy,
	ProviderJsonOutputFromSchema,
	ProviderJsonRequest,
	ProviderJsonResponse,
	ProviderObjectStream,
	ProviderObjectStreamRequest,
	ProviderRequest,
	ProviderRerankRequest,
	ProviderRerankResponse,
	ProviderResponse,
	ProviderStream,
} from './ModelProvider.js'
import { runBoundedModelInvocation } from './modelInvocation.js'
import { compileProviderAiSdkSchema } from './providerJsonSchema.js'
import { normalizeReasoningDelta, reasoningDelta, textDelta } from './streamNormalization.js'

/**
 * Options accepted by {@link AiSdkProvider}.
 */
export type AiSdkProviderOptions = {
	/**
	 * Language model instance (or provider id) created via the Vercel AI SDK (e.g. `openai('')`).
	 */
	model: LanguageModel
	/**
	 * Optional embedding model used for `embed` / `embedMany` capability calls.
	 */
	embeddingModel?: EmbeddingModel
	/**
	 * Optional reranking model used for `rerank` capability calls.
	 */
	rerankingModel?: RerankingModel
	/**
	 * Optional readable name that shows up in telemetry. Defaults to the model identifier.
	 */
	name?: string
	/**
	 * Static system prompt prepended to every request.
	 */
	systemPrompt?: string
	/**
	 * Default call options forwarded to `generateText` (temperature, maxOutputTokens, tools, ...).
	 * Use `invocation` for bounded timeout/retry policy.
	 */
	defaults?: AiSdkProviderDefaults
	/**
	 * Optional tracer injected by the runtime. When set, AI SDK telemetry uses this tracer.
	 */
	tracer?: Tracer
	/**
	 * Optional AI SDK language model middleware chain.
	 */
	middleware?: LanguageModelMiddleware | LanguageModelMiddleware[]
}

/**
 * Request metadata field understood by {@link AiSdkProvider}. Attach it to {@link ProviderRequest.metadata}
 * to override call settings per invocation, including bounded invocation policy.
 *
 * @example
 * ```ts
 * await provider.generateText({
 *   prompt: 'Summarise the ticket',
 *   metadata: {
 *     aiSdk: {
 *       temperature: 0.2,
 *       maxOutputTokens: 512,
 *     },
 *   },
 * })
 * ```
 */
export type AiSdkProviderMetadata = {
	aiSdk?:
		| (AiSdkProviderDefaults & {
				generate?: AiSdkProviderOverrides
				embed?: AiSdkEmbedOverrides
				embedMany?: AiSdkEmbedManyOverrides
				rerank?: AiSdkRerankOverrides
				generateObject?: AiSdkGenerateJsonOverrides
		  })
		| undefined
}

/**
 * Supported overrides extracted from the AI SDK `generateText` call signature.
 */
export type GenerateTextArgs = Parameters<typeof aiGenerateText>[0]
export type AiSdkProviderOverrides = Partial<Omit<GenerateTextArgs, 'model' | 'prompt' | 'system' | 'messages'>>
export type AiSdkProviderDefaults = AiSdkProviderOverrides & {
	invocation?: ProviderInvocationPolicy
}
export type EmbedArgs = Parameters<typeof embed>[0]
export type EmbedManyArgs = Parameters<typeof embedMany>[0]
export type RerankArgs = Parameters<typeof rerank>[0]

export type AiSdkEmbedOverrides = Partial<Omit<EmbedArgs, 'model' | 'value'>>
export type AiSdkEmbedManyOverrides = Partial<Omit<EmbedManyArgs, 'model' | 'values'>>
export type AiSdkRerankOverrides = Partial<Omit<RerankArgs, 'model' | 'documents' | 'query' | 'topN'>>
export type AiSdkGenerateJsonOverrides = Partial<
	Omit<GenerateTextArgs, 'model' | 'prompt' | 'system' | 'messages' | 'output'>
>

const isMetadata = (value: Record<string, unknown> | undefined): value is AiSdkProviderMetadata => {
	return !!value && typeof value === 'object' && 'aiSdk' in value
}

const stripInvocationField = <T extends Record<string, unknown>>(value: T): T => {
	const { invocation: _ignoredInvocation, ...rest } = value
	return rest as T
}

const composeSystemPrompt = (systemPrompt?: string, context?: string) => {
	const parts = [systemPrompt, context].filter(part => typeof part === 'string' && part.trim().length)
	if (!parts.length) {
		return undefined
	}
	return parts.join('\n\n')
}

const normalizeDeveloperInstructions = (developerInstruction?: string | string[]) => {
	if (typeof developerInstruction === 'string') {
		const value = developerInstruction.trim()
		return value.length > 0 ? [value] : []
	}
	if (!Array.isArray(developerInstruction)) {
		return []
	}
	return developerInstruction
		.filter((entry): entry is string => typeof entry === 'string')
		.map(entry => entry.trim())
		.filter(entry => entry.length > 0)
}

const composeSystemMessages = (
	systemPrompt?: string,
	context?: string,
	developerInstruction?: string | string[],
): string | SystemModelMessage[] | undefined => {
	const developerMessages = normalizeDeveloperInstructions(developerInstruction)
	if (developerMessages.length === 0) {
		return composeSystemPrompt(systemPrompt, context)
	}

	const systemMessages: SystemModelMessage[] = []
	const systemContent = composeSystemPrompt(systemPrompt, context)
	if (systemContent) {
		systemMessages.push({
			role: 'system',
			content: systemContent,
			providerOptions: {
				openai: {
					systemMessageMode: 'system',
				},
			},
		})
	}

	for (const instruction of developerMessages) {
		systemMessages.push({
			role: 'system',
			content: instruction,
			providerOptions: {
				openai: {
					systemMessageMode: 'developer',
				},
			},
		})
	}

	return systemMessages.length > 0 ? systemMessages : undefined
}

const resolveObjectSections = <T>(
	sections: ProviderObjectStreamRequest<T>['sections'],
	partial: T,
): Record<string, unknown | undefined> => {
	if (!sections) {
		return {}
	}
	return typeof sections === 'function' ? sections(partial) : sections
}

/**
 * Wraps any Vercel AI SDK {@link LanguageModel} and exposes it through the lightweight {@link ModelProvider} interface
 * consumed by the PURISTA agent runtime.
 *
 * @example
 * ```ts
 * import { openai } from '@ai-sdk/openai'
 * import { AiSdkProvider } from '@purista/ai'
 *
 * const provider = new AiSdkProvider({
 *   model: openai(''),
 *   systemPrompt: 'You are a helpful support engineer',
 * })
 *
 * const result = await provider.generateText({ prompt: 'Reset password instructions?' })
 * console.log(result)
 * ```
 */
export class AiSdkProvider implements ModelProvider {
	readonly name: string
	readonly capabilities: ModelProviderCapabilities

	private readonly model: LanguageModel
	private readonly embeddingModel?: EmbeddingModel
	private readonly rerankingModel?: RerankingModel
	private readonly systemPrompt?: string
	private readonly defaults: AiSdkProviderDefaults
	private readonly embeddingDefaults: AiSdkEmbedOverrides
	private readonly embeddingManyDefaults: AiSdkEmbedManyOverrides
	private readonly rerankDefaults: AiSdkRerankOverrides
	private readonly invocationDefaults: ProviderInvocationPolicy
	private readonly tracer?: Tracer

	constructor(options: AiSdkProviderOptions) {
		const shouldWrapModel =
			typeof options.model !== 'string' &&
			!!options.middleware &&
			(Array.isArray(options.middleware) ? options.middleware.length > 0 : true)
		const middleware = options.middleware
			? Array.isArray(options.middleware)
				? options.middleware
				: [options.middleware]
			: undefined
		this.model =
			shouldWrapModel && middleware
				? (wrapLanguageModel({
						model: options.model as Parameters<typeof wrapLanguageModel>[0]['model'],
						middleware: middleware as Parameters<typeof wrapLanguageModel>[0]['middleware'],
					}) as LanguageModel)
				: options.model
		this.embeddingModel = options.embeddingModel
		this.rerankingModel = options.rerankingModel
		this.systemPrompt = options.systemPrompt
		this.defaults = options.defaults ?? {}
		this.embeddingDefaults = {}
		this.embeddingManyDefaults = {}
		this.rerankDefaults = {}
		this.invocationDefaults = options.defaults?.invocation ?? {}
		this.tracer = options.tracer
		this.name = options.name ?? (typeof options.model === 'string' ? options.model : 'ai-sdk-provider')
		this.capabilities = {
			text: true,
			'text-stream': true,
			object: true,
			'object-stream': true,
			embedding: !!this.embeddingModel,
			rerank: !!this.rerankingModel,
		}
	}

	private getTextOverrides(metadata: Record<string, unknown> | undefined): AiSdkProviderOverrides {
		if (!isMetadata(metadata)) {
			return {}
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object') {
			return {}
		}
		if ('generate' in aiSdk) {
			const { generate, ...topLevel } = aiSdk as Record<string, unknown>
			if (generate && typeof generate === 'object') {
				return {
					...stripInvocationField(topLevel),
					...stripInvocationField(generate as Record<string, unknown>),
				}
			}
			return stripInvocationField(topLevel)
		}
		return stripInvocationField(aiSdk as Record<string, unknown>)
	}

	private getEmbedOverrides(metadata: Record<string, unknown> | undefined): AiSdkEmbedOverrides {
		if (!isMetadata(metadata)) {
			return {}
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object' || !('embed' in aiSdk)) {
			return {}
		}
		return typeof aiSdk.embed === 'object' && aiSdk.embed
			? stripInvocationField(aiSdk.embed as Record<string, unknown>)
			: {}
	}

	private getEmbedManyOverrides(metadata: Record<string, unknown> | undefined): AiSdkEmbedManyOverrides {
		if (!isMetadata(metadata)) {
			return {}
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object' || !('embedMany' in aiSdk)) {
			return {}
		}
		return typeof aiSdk.embedMany === 'object' && aiSdk.embedMany
			? stripInvocationField(aiSdk.embedMany as Record<string, unknown>)
			: {}
	}

	private getRerankOverrides(metadata: Record<string, unknown> | undefined): AiSdkRerankOverrides {
		if (!isMetadata(metadata)) {
			return {}
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object' || !('rerank' in aiSdk)) {
			return {}
		}
		return typeof aiSdk.rerank === 'object' && aiSdk.rerank
			? stripInvocationField(aiSdk.rerank as Record<string, unknown>)
			: {}
	}

	private getGenerateObjectOverrides(metadata: Record<string, unknown> | undefined): AiSdkGenerateJsonOverrides {
		if (!isMetadata(metadata)) {
			return {}
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object' || !('generateObject' in aiSdk)) {
			return {}
		}
		return typeof aiSdk.generateObject === 'object' && aiSdk.generateObject
			? stripInvocationField(aiSdk.generateObject as Record<string, unknown>)
			: {}
	}

	private getInvocationPolicy(metadata: Record<string, unknown> | undefined): ProviderInvocationPolicy {
		if (!isMetadata(metadata)) {
			return this.invocationDefaults
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object') {
			return this.invocationDefaults
		}
		const invocation =
			'invocation' in aiSdk ? (aiSdk as { invocation?: ProviderInvocationPolicy }).invocation : undefined
		if (!invocation || typeof invocation !== 'object') {
			return this.invocationDefaults
		}
		return {
			...this.invocationDefaults,
			...invocation,
			retry: invocation.retry
				? {
						...(this.invocationDefaults.retry ?? {}),
						...invocation.retry,
					}
				: this.invocationDefaults.retry,
		}
	}

	private getCallInput(request: ProviderRequest): GenerateTextArgs {
		const adaptedRequest = createAiSdkRequest({
			prompt: request.prompt,
			input: request.input,
			attachments: request.attachments,
			skills: request.skills,
			references: request.references,
			bindings: request.bindings,
			metadata: request.metadata,
		})
		const metadataOverrides = this.getTextOverrides(adaptedRequest.metadata)
		const { invocation: _ignoredInvocation, ...defaultsWithoutInvocation } = this.defaults as Record<string, unknown>
		const baseInput = {
			...defaultsWithoutInvocation,
			...metadataOverrides,
			model: this.model,
			system: composeSystemMessages(this.systemPrompt, request.context, request.developerInstruction),
			experimental_telemetry: {
				isEnabled: true,
				...(this.tracer ? { tracer: this.tracer } : {}),
				...(defaultsWithoutInvocation.experimental_telemetry ?? {}),
				...(metadataOverrides.experimental_telemetry ?? {}),
			},
		}
		if (adaptedRequest.messages) {
			return {
				...baseInput,
				messages: adaptedRequest.messages as ModelMessage[],
			}
		}
		return {
			...baseInput,
			prompt: adaptedRequest.prompt ?? '',
		}
	}

	private getEmbedInput(request: ProviderEmbedRequest): EmbedArgs {
		if (!this.embeddingModel) {
			throw new Error('Embedding model is not configured for this provider')
		}
		const metadataOverrides = this.getEmbedOverrides(request.metadata)
		return {
			...this.embeddingDefaults,
			...metadataOverrides,
			model: this.embeddingModel,
			value: request.value,
			experimental_telemetry: {
				isEnabled: true,
				...(this.tracer ? { tracer: this.tracer } : {}),
				...(this.embeddingDefaults.experimental_telemetry ?? {}),
				...(metadataOverrides.experimental_telemetry ?? {}),
			},
		}
	}

	private getEmbedManyInput(request: ProviderEmbedManyRequest): EmbedManyArgs {
		if (!this.embeddingModel) {
			throw new Error('Embedding model is not configured for this provider')
		}
		const metadataOverrides = this.getEmbedManyOverrides(request.metadata)
		return {
			...this.embeddingManyDefaults,
			...metadataOverrides,
			model: this.embeddingModel,
			values: request.values,
			experimental_telemetry: {
				isEnabled: true,
				...(this.tracer ? { tracer: this.tracer } : {}),
				...(this.embeddingManyDefaults.experimental_telemetry ?? {}),
				...(metadataOverrides.experimental_telemetry ?? {}),
			},
		}
	}

	private getRerankInput<Document>(request: ProviderRerankRequest<Document>): RerankArgs {
		if (!this.rerankingModel) {
			throw new Error('Reranking model is not configured for this provider')
		}
		const metadataOverrides = this.getRerankOverrides(request.metadata)
		return {
			...this.rerankDefaults,
			...metadataOverrides,
			model: this.rerankingModel,
			documents: request.documents as RerankArgs['documents'],
			query: request.query,
			topN: request.topN,
			experimental_telemetry: {
				isEnabled: true,
				...(this.tracer ? { tracer: this.tracer } : {}),
				...(this.rerankDefaults.experimental_telemetry ?? {}),
				...(metadataOverrides.experimental_telemetry ?? {}),
			},
		}
	}

	async generateObject<T = unknown, OutputSchema = unknown>(
		request: ProviderJsonRequest<OutputSchema>,
	): Promise<ProviderJsonResponse<ProviderJsonOutputFromSchema<OutputSchema, T>>> {
		const metadataOverrides = this.getGenerateObjectOverrides(request.metadata)
		const {
			output: _ignoredOutput,
			invocation: _ignoredInvocation,
			...defaultsWithoutOutput
		} = this.defaults as Record<string, unknown>
		const { output: _ignoredOverrideOutput, ...metadataWithoutOutput } = metadataOverrides as Record<string, unknown>
		const result = await runBoundedModelInvocation({
			label: `${this.name}:generateObject`,
			policy: this.getInvocationPolicy(request.metadata),
			operation: async () => {
				const compiledSchema = await compileProviderAiSdkSchema(request.schema)
				const objectRequest = compiledSchema
					? {
							schema: compiledSchema,
						}
					: {
							output: 'no-schema' as const,
						}
				const adaptedRequest = createAiSdkRequest({
					prompt: request.prompt,
					input: request.input,
					attachments: request.attachments,
					skills: request.skills,
					references: request.references,
					bindings: request.bindings,
					metadata: request.metadata,
				})
				const promptInput = adaptedRequest.messages
					? {
							messages: adaptedRequest.messages as ModelMessage[],
						}
					: {
							prompt: adaptedRequest.prompt ?? '',
						}
				return await generateObject({
					...defaultsWithoutOutput,
					...metadataWithoutOutput,
					model: this.model,
					system: composeSystemMessages(this.systemPrompt, request.context, request.developerInstruction),
					...promptInput,
					...objectRequest,
					experimental_telemetry: {
						isEnabled: true,
						...(this.tracer ? { tracer: this.tracer } : {}),
						...(defaultsWithoutOutput.experimental_telemetry ?? {}),
						...(metadataOverrides.experimental_telemetry ?? {}),
					},
				})
			},
		})
		const { usage } = result
		const rawReasoning = (result as { reasoning?: unknown }).reasoning
		const reasoningFromParts = Array.isArray(rawReasoning)
			? rawReasoning
					.map(part => {
						if (!part || typeof part !== 'object') {
							return ''
						}
						const text = (part as { text?: unknown }).text
						return typeof text === 'string' ? text : ''
					})
					.join('')
					.trim() || undefined
			: undefined
		const reasoningText =
			(result as { reasoningText?: string }).reasoningText ??
			(reasoningFromParts && reasoningFromParts.length > 0 ? reasoningFromParts : undefined)
		return {
			data: result.object as ProviderJsonOutputFromSchema<OutputSchema, T>,
			text: JSON.stringify(result.object ?? {}),
			reasoningText,
			tokens: {
				prompt: usage?.inputTokens ?? 0,
				completion: usage?.outputTokens ?? 0,
			},
			metadata: {
				request: result.request,
				response: result.response,
				providerMetadata: result.providerMetadata,
				warnings: (result as { warnings?: unknown }).warnings,
			},
		}
	}

	streamText(request: ProviderRequest): ProviderStream {
		const callInput = this.getCallInput(request)
		const result = streamText(callInput)
		const policy = this.getInvocationPolicy(request.metadata)
		const providerName = this.name
		let finalResponsePromise: Promise<ProviderResponse> | undefined

		return {
			async final() {
				finalResponsePromise ??= runBoundedModelInvocation({
					label: `${providerName}:stream.final`,
					policy,
					operation: async () => {
						const [usage, outputText, requestMetadata, responseMetadata, providerMetadata, warnings] =
							await Promise.all([
								result.usage,
								result.text,
								result.request,
								result.response,
								result.providerMetadata,
								(result as { warnings?: Promise<unknown> | unknown }).warnings,
							])

						return {
							output: outputText,
							reasoningText: undefined,
							tokens: {
								prompt: usage?.inputTokens ?? 0,
								completion: usage?.outputTokens ?? 0,
							},
							metadata: {
								request: requestMetadata,
								response: responseMetadata,
								providerMetadata,
								warnings,
							},
						}
					},
				})

				return finalResponsePromise
			},
			async *[Symbol.asyncIterator]() {
				try {
					for await (const part of result.fullStream) {
						if (part.type === 'text-delta' && part.text.length > 0) {
							yield textDelta(part.text)
						}
						const normalizedReasoningDelta = part.type === 'reasoning-delta' ? normalizeReasoningDelta(part) : ''
						if (part.type === 'reasoning-delta' && normalizedReasoningDelta.length > 0) {
							yield reasoningDelta(normalizedReasoningDelta)
						}
						if (part.type === 'error') {
							yield {
								type: 'error',
								error: part.error,
							}
						}
					}
				} catch (error) {
					yield {
						type: 'error',
						error,
					}
				}
			},
		}
	}

	streamObject<T = unknown, OutputSchema = unknown>(
		request: ProviderObjectStreamRequest<ProviderJsonOutputFromSchema<OutputSchema, T>, OutputSchema>,
	): ProviderObjectStream<ProviderJsonOutputFromSchema<OutputSchema, T>> {
		type JsonOutput = ProviderJsonOutputFromSchema<OutputSchema, T>
		let finalResponsePromise: Promise<ProviderJsonResponse<JsonOutput>> | undefined
		let aiStreamPromise: Promise<Awaited<ReturnType<typeof aiStreamObject>>> | undefined

		const resolveFallbackFinal = async (): Promise<ProviderJsonResponse<JsonOutput>> => {
			finalResponsePromise ??= this.generateObject<T, OutputSchema>(request)
			return await finalResponsePromise
		}

		const resolveAiStream = async () => {
			aiStreamPromise ??= runBoundedModelInvocation({
				label: `${this.name}:streamObject`,
				policy: this.getInvocationPolicy(request.metadata),
				operation: async () => {
					const metadataOverrides = this.getGenerateObjectOverrides(request.metadata)
					const {
						output: _ignoredOutput,
						invocation: _ignoredInvocation,
						...defaultsWithoutOutput
					} = this.defaults as Record<string, unknown>
					const { output: _ignoredOverrideOutput, ...metadataWithoutOutput } = metadataOverrides as Record<
						string,
						unknown
					>
					const compiledSchema = await compileProviderAiSdkSchema(request.schema)
					const objectRequest = compiledSchema
						? ({
								schema: compiledSchema,
							} as const)
						: ({
								output: 'no-schema' as const,
							} as const)
					const adaptedRequest = createAiSdkRequest({
						prompt: request.prompt,
						input: request.input,
						attachments: request.attachments,
						skills: request.skills,
						references: request.references,
						bindings: request.bindings,
						metadata: request.metadata,
					})
					const promptInput = adaptedRequest.messages
						? {
								messages: adaptedRequest.messages as ModelMessage[],
							}
						: {
								prompt: adaptedRequest.prompt ?? '',
							}
					return aiStreamObject({
						...defaultsWithoutOutput,
						...metadataWithoutOutput,
						model: this.model,
						system: composeSystemMessages(this.systemPrompt, request.context, request.developerInstruction),
						...promptInput,
						...objectRequest,
						experimental_telemetry: {
							isEnabled: true,
							...(this.tracer ? { tracer: this.tracer } : {}),
							...(defaultsWithoutOutput.experimental_telemetry ?? {}),
							...(metadataOverrides.experimental_telemetry ?? {}),
						},
					})
				},
			})
			return await aiStreamPromise
		}

		return {
			async final(): Promise<ProviderJsonResponse<JsonOutput>> {
				if (finalResponsePromise) {
					return await finalResponsePromise
				}
				try {
					const result = await resolveAiStream()
					const [usage, object, requestMetadata, responseMetadata, providerMetadata, warnings] = await Promise.all([
						result.usage,
						result.object,
						result.request,
						result.response,
						result.providerMetadata,
						(result as { warnings?: Promise<unknown> | unknown }).warnings,
					])
					const finalResponse: ProviderJsonResponse<JsonOutput> = {
						data: object as JsonOutput,
						text: JSON.stringify(object ?? {}),
						tokens: {
							prompt: usage?.inputTokens ?? 0,
							completion: usage?.outputTokens ?? 0,
						},
						metadata: {
							request: requestMetadata,
							response: responseMetadata,
							providerMetadata,
							warnings,
						},
					}
					finalResponsePromise = Promise.resolve(finalResponse)
					return finalResponse
				} catch {
					return await resolveFallbackFinal()
				}
			},
			async *[Symbol.asyncIterator]() {
				try {
					const result = await resolveAiStream()
					const seen = new Map<string, string>()
					for await (const partial of result.partialObjectStream) {
						const sections = resolveObjectSections(request.sections, partial as JsonOutput)
						for (const [section, content] of Object.entries(sections)) {
							if (content === undefined) {
								continue
							}
							const fingerprint = JSON.stringify(content)
							if (seen.get(section) === fingerprint) {
								continue
							}
							seen.set(section, fingerprint)
							yield {
								type: 'section' as const,
								section,
								content,
							}
						}
					}
					const final = await this.final()
					yield {
						type: 'final-object' as const,
						data: final.data,
						text: final.text,
						reasoningText: final.reasoningText,
						tokens: final.tokens,
						metadata: final.metadata,
					}
				} catch {
					const final = await resolveFallbackFinal()
					const sections = resolveObjectSections(request.sections, final.data)
					for (const [section, content] of Object.entries(sections)) {
						if (content === undefined) {
							continue
						}
						yield {
							type: 'section' as const,
							section,
							content,
						}
					}
					yield {
						type: 'final-object' as const,
						data: final.data,
						text: final.text,
						reasoningText: final.reasoningText,
						tokens: final.tokens,
						metadata: final.metadata,
					}
				}
			},
		}
	}

	async generateText(request: ProviderGenerateTextRequest): Promise<string> {
		const callInput = this.getCallInput(request)
		const result = await runBoundedModelInvocation({
			label: `${this.name}:generateText`,
			policy: this.getInvocationPolicy(request.metadata),
			operation: async () => await aiGenerateText(callInput),
		})
		if (result.reasoningText?.trim()) {
			await request.onReasoning?.(result.reasoningText)
		}
		if (result.text.length > 0) {
			await request.onTextDelta?.(result.text)
		}
		return result.text
	}

	async embed(request: ProviderEmbedRequest): Promise<ProviderEmbedResponse> {
		const callInput = this.getEmbedInput(request)
		const result = await runBoundedModelInvocation({
			label: `${this.name}:embed`,
			policy: this.getInvocationPolicy(request.metadata),
			operation: async () => await embed(callInput),
		})
		return {
			embedding: result.embedding,
			usage: {
				tokens: result.usage?.tokens,
			},
			metadata: {
				response: result.response,
				providerMetadata: result.providerMetadata,
			},
		}
	}

	async embedMany(request: ProviderEmbedManyRequest): Promise<ProviderEmbedManyResponse> {
		const callInput = this.getEmbedManyInput(request)
		const result = await runBoundedModelInvocation({
			label: `${this.name}:embedMany`,
			policy: this.getInvocationPolicy(request.metadata),
			operation: async () => await embedMany(callInput),
		})
		return {
			embeddings: result.embeddings,
			usage: {
				tokens: result.usage?.tokens,
			},
			metadata: {
				responses: result.responses,
				providerMetadata: result.providerMetadata,
			},
		}
	}

	async rerank<Document = string | Record<string, unknown>>(
		request: ProviderRerankRequest<Document>,
	): Promise<ProviderRerankResponse<Document>> {
		const callInput = this.getRerankInput(request)
		const result = await runBoundedModelInvocation({
			label: `${this.name}:rerank`,
			policy: this.getInvocationPolicy(request.metadata),
			operation: async () => await rerank(callInput),
		})
		return {
			ranking: result.ranking as ProviderRerankResponse<Document>['ranking'],
			rerankedDocuments: result.rerankedDocuments as Document[],
			metadata: {
				response: result.response,
				providerMetadata: result.providerMetadata,
			},
		}
	}
}
