import type { Tracer } from '@opentelemetry/api'
import type { EmbeddingModel, LanguageModel, LanguageModelMiddleware, RerankingModel } from 'ai'
import {
	generateText as aiGenerateText,
	embed,
	embedMany,
	generateObject,
	rerank,
	streamText,
	wrapLanguageModel,
} from 'ai'
import { generateText as generateTextWithFallback } from './generateText.js'
import type {
	ModelProvider,
	ModelProviderCapabilities,
	ProviderEmbedManyRequest,
	ProviderEmbedManyResponse,
	ProviderEmbedRequest,
	ProviderEmbedResponse,
	ProviderGenerateTextRequest,
	ProviderJsonRequest,
	ProviderJsonResponse,
	ProviderRequest,
	ProviderRerankRequest,
	ProviderRerankResponse,
	ProviderResponse,
	ProviderStream,
} from './ModelProvider.js'

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
	 */
	defaults?: AiSdkProviderOverrides
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
 * to override call settings per invocation.
 *
 * @example
 * ```ts
 * await provider.generate({
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
		| (AiSdkProviderOverrides & {
				generate?: AiSdkProviderOverrides
				embed?: AiSdkEmbedOverrides
				embedMany?: AiSdkEmbedManyOverrides
				rerank?: AiSdkRerankOverrides
				generateJson?: AiSdkGenerateJsonOverrides
		  })
		| undefined
}

/**
 * Supported overrides extracted from the AI SDK `generateText` call signature.
 */
type GenerateTextArgs = Parameters<typeof aiGenerateText>[0]
export type AiSdkProviderOverrides = Partial<Omit<GenerateTextArgs, 'model' | 'prompt' | 'system' | 'messages'>>
type EmbedArgs = Parameters<typeof embed>[0]
type EmbedManyArgs = Parameters<typeof embedMany>[0]
type RerankArgs = Parameters<typeof rerank>[0]

export type AiSdkEmbedOverrides = Partial<Omit<EmbedArgs, 'model' | 'value'>>
export type AiSdkEmbedManyOverrides = Partial<Omit<EmbedManyArgs, 'model' | 'values'>>
export type AiSdkRerankOverrides = Partial<Omit<RerankArgs, 'model' | 'documents' | 'query' | 'topN'>>
export type AiSdkGenerateJsonOverrides = Partial<
	Omit<GenerateTextArgs, 'model' | 'prompt' | 'system' | 'messages' | 'output'>
>

const isMetadata = (value: Record<string, unknown> | undefined): value is AiSdkProviderMetadata => {
	return !!value && typeof value === 'object' && 'aiSdk' in value
}

const composeSystemPrompt = (systemPrompt?: string, context?: string) => {
	const parts = [systemPrompt, context].filter(part => typeof part === 'string' && part.trim().length)
	if (!parts.length) {
		return undefined
	}
	return parts.join('\n\n')
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
 * const result = await provider.generate({ prompt: 'Reset password instructions?' })
 * console.log(result.output)
 * ```
 */
export class AiSdkProvider implements ModelProvider {
	readonly name: string
	readonly capabilities: ModelProviderCapabilities

	private readonly model: LanguageModel
	private readonly embeddingModel?: EmbeddingModel
	private readonly rerankingModel?: RerankingModel
	private readonly systemPrompt?: string
	private readonly defaults: AiSdkProviderOverrides
	private readonly embeddingDefaults: AiSdkEmbedOverrides
	private readonly embeddingManyDefaults: AiSdkEmbedManyOverrides
	private readonly rerankDefaults: AiSdkRerankOverrides
	private readonly tracer?: Tracer

	constructor(options: AiSdkProviderOptions) {
		const shouldWrapModel =
			typeof options.model !== 'string' &&
			!!options.middleware &&
			(Array.isArray(options.middleware) ? options.middleware.length > 0 : true)
		this.model = shouldWrapModel
			? (wrapLanguageModel({
					model: options.model as any,
					middleware: options.middleware as LanguageModelMiddleware | LanguageModelMiddleware[],
				}) as LanguageModel)
			: options.model
		this.embeddingModel = options.embeddingModel
		this.rerankingModel = options.rerankingModel
		this.systemPrompt = options.systemPrompt
		this.defaults = options.defaults ?? {}
		this.embeddingDefaults = {}
		this.embeddingManyDefaults = {}
		this.rerankDefaults = {}
		this.tracer = options.tracer
		this.name = options.name ?? (typeof options.model === 'string' ? options.model : 'ai-sdk-provider')
		this.capabilities = {
			text: true,
			stream: true,
			json: true,
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
					...topLevel,
					...(generate as Record<string, unknown>),
				}
			}
			return topLevel
		}
		return aiSdk
	}

	private getEmbedOverrides(metadata: Record<string, unknown> | undefined): AiSdkEmbedOverrides {
		if (!isMetadata(metadata)) {
			return {}
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object' || !('embed' in aiSdk)) {
			return {}
		}
		return typeof aiSdk.embed === 'object' && aiSdk.embed ? aiSdk.embed : {}
	}

	private getEmbedManyOverrides(metadata: Record<string, unknown> | undefined): AiSdkEmbedManyOverrides {
		if (!isMetadata(metadata)) {
			return {}
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object' || !('embedMany' in aiSdk)) {
			return {}
		}
		return typeof aiSdk.embedMany === 'object' && aiSdk.embedMany ? aiSdk.embedMany : {}
	}

	private getRerankOverrides(metadata: Record<string, unknown> | undefined): AiSdkRerankOverrides {
		if (!isMetadata(metadata)) {
			return {}
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object' || !('rerank' in aiSdk)) {
			return {}
		}
		return typeof aiSdk.rerank === 'object' && aiSdk.rerank ? aiSdk.rerank : {}
	}

	private getGenerateJsonOverrides(metadata: Record<string, unknown> | undefined): AiSdkGenerateJsonOverrides {
		if (!isMetadata(metadata)) {
			return {}
		}
		const aiSdk = metadata.aiSdk
		if (!aiSdk || typeof aiSdk !== 'object' || !('generateJson' in aiSdk)) {
			return {}
		}
		return typeof aiSdk.generateJson === 'object' && aiSdk.generateJson ? aiSdk.generateJson : {}
	}

	private getCallInput(request: ProviderRequest): GenerateTextArgs {
		const metadataOverrides = this.getTextOverrides(request.metadata)
		return {
			...this.defaults,
			...metadataOverrides,
			model: this.model,
			prompt: request.prompt,
			system: composeSystemPrompt(this.systemPrompt, request.context),
			experimental_telemetry: {
				isEnabled: true,
				...(this.tracer ? { tracer: this.tracer } : {}),
				...(this.defaults.experimental_telemetry ?? {}),
				...(metadataOverrides.experimental_telemetry ?? {}),
			},
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

	async generate(request: ProviderRequest): Promise<ProviderResponse> {
		const callInput = this.getCallInput(request)
		const result = await aiGenerateText(callInput)
		const { usage } = result

		return {
			output: result.text,
			reasoningText: result.reasoningText,
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

	async generateJson<T = unknown>(request: ProviderJsonRequest): Promise<ProviderJsonResponse<T>> {
		const metadataOverrides = this.getGenerateJsonOverrides(request.metadata)
		const { output: _ignoredOutput, ...defaultsWithoutOutput } = this.defaults as Record<string, unknown>
		const { output: _ignoredOverrideOutput, ...metadataWithoutOutput } = metadataOverrides as Record<string, unknown>
		const objectRequest = request.schema
			? {
					schema: request.schema as never,
				}
			: {
					output: 'no-schema' as const,
				}
		const result = await generateObject({
			...defaultsWithoutOutput,
			...metadataWithoutOutput,
			model: this.model,
			prompt: request.prompt,
			system: composeSystemPrompt(this.systemPrompt, request.context),
			...objectRequest,
			experimental_telemetry: {
				isEnabled: true,
				...(this.tracer ? { tracer: this.tracer } : {}),
				...(this.defaults.experimental_telemetry ?? {}),
				...(metadataOverrides.experimental_telemetry ?? {}),
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
			data: result.object as T,
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

	stream(request: ProviderRequest): ProviderStream {
		const callInput = this.getCallInput(request)
		const result = streamText(callInput)
		let finalResponsePromise: Promise<ProviderResponse> | undefined

		return {
			async final() {
				finalResponsePromise ??= (async () => {
					const [usage, outputText, requestMetadata, responseMetadata, providerMetadata, warnings] = await Promise.all([
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
				})()

				return finalResponsePromise
			},
			async *[Symbol.asyncIterator]() {
				for await (const part of result.fullStream) {
					if (part.type === 'text-delta' && part.text.length > 0) {
						yield {
							type: 'text-delta',
							textDelta: part.text,
						}
					}
					const reasoningDelta = (() => {
						if (part.type !== 'reasoning-delta') {
							return ''
						}
						const withText = part as { text?: unknown }
						if (typeof withText.text === 'string') {
							return withText.text
						}
						const withDelta = part as unknown as { delta?: unknown }
						return typeof withDelta.delta === 'string' ? withDelta.delta : ''
					})()
					if (part.type === 'reasoning-delta' && reasoningDelta.length > 0) {
						yield {
							type: 'reasoning-delta',
							reasoningDelta,
						}
					}
					if (part.type === 'error') {
						yield {
							type: 'error',
							error: part.error,
						}
					}
				}
			},
		}
	}

	async generateText(request: ProviderGenerateTextRequest): Promise<string> {
		return await generateTextWithFallback({
			model: this,
			request: {
				prompt: request.prompt,
				context: request.context,
				metadata: request.metadata,
			},
			onReasoning: request.onReasoning,
			onTextDelta: request.onTextDelta,
		})
	}

	async embed(request: ProviderEmbedRequest): Promise<ProviderEmbedResponse> {
		const callInput = this.getEmbedInput(request)
		const result = await embed(callInput)
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
		const result = await embedMany(callInput)
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
		const result = await rerank(callInput)
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
