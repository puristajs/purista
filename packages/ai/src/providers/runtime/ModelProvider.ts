import type { ExternalBinding, ExternalBindingSet } from '../../bridge/externalRuntime.js'
import type { SkillDocument, SkillReferenceDocument } from '../../skills/fileSystem.js'

/**
 * Payload sent to a model provider.
 */
export type ProviderRequest = {
	prompt: string
	context?: string
	/**
	 * Optional high-priority app/developer instruction(s) injected on every call.
	 * Providers may map these to dedicated instruction roles when supported.
	 */
	developerInstruction?: string | string[]
	/**
	 * Optional skill documents that shape reasoning and prompt context.
	 *
	 * In normal PURISTA handler code you can usually omit this field when calling
	 * `context.models['alias'].generateText(...)`. The agent runtime automatically
	 * loads the skills declared via `builder.useSkills([...])` and fills them in.
	 */
	skills?: Array<Pick<SkillDocument, 'name' | 'content'>>
	/**
	 * Optional reference documents belonging to already selected skills.
	 *
	 * References are not auto-loaded because they are usually a more deliberate,
	 * skill-specific choice made by the handler.
	 */
	references?: Array<Pick<SkillReferenceDocument, 'skillName' | 'relativePath' | 'content'>>
	/**
	 * Optional executable bindings for allowlisted PURISTA commands and child agents.
	 *
	 * In normal PURISTA handler code you can usually omit this field when calling
	 * `context.models['alias'].generateText(...)`. The agent runtime automatically
	 * exposes the allowlisted commands and agents declared in the builder.
	 */
	bindings?: ExternalBindingSet | ExternalBinding[]
	metadata?: Record<string, unknown>
}

/**
 * Request input for high-level text generation that auto-selects streaming
 * or non-streaming provider capabilities.
 */
export type ProviderGenerateTextRequest = ProviderRequest & {
	onReasoning?: (text: string) => void | Promise<void>
	onTextDelta?: (delta: string) => void | Promise<void>
}

/**
 * Payload sent to structured JSON generation capable providers.
 */
export type ProviderJsonRequest = {
	prompt: string
	context?: string
	developerInstruction?: string | string[]
	schema?: unknown
	metadata?: Record<string, unknown>
}

/**
 * Payload sent to embedding-capable providers.
 */
export type ProviderEmbedRequest = {
	value: string
	metadata?: Record<string, unknown>
}

/**
 * Payload sent to batch embedding-capable providers.
 */
export type ProviderEmbedManyRequest = {
	values: string[]
	metadata?: Record<string, unknown>
}

/**
 * Payload sent to reranking-capable providers.
 */
export type ProviderRerankRequest<Document = string | Record<string, unknown>> = {
	query: string
	documents: Document[]
	topN?: number
	metadata?: Record<string, unknown>
}

/**
 * Response emitted by a model provider.
 */
export type ProviderResponse = {
	output: string
	reasoningText?: string
	tokens?: {
		prompt: number
		completion: number
	}
	costUsd?: number
	metadata?: Record<string, unknown>
}

export type ProviderJsonResponse<T = unknown> = {
	data: T
	text: string
	reasoningText?: string
	tokens?: {
		prompt: number
		completion: number
	}
	metadata?: Record<string, unknown>
}

/**
 * Response emitted by embedding-capable providers.
 */
export type ProviderEmbedResponse = {
	embedding: number[]
	usage?: {
		tokens?: number
	}
	metadata?: Record<string, unknown>
}

/**
 * Response emitted by batch embedding-capable providers.
 */
export type ProviderEmbedManyResponse = {
	embeddings: number[][]
	usage?: {
		tokens?: number
	}
	metadata?: Record<string, unknown>
}

/**
 * Response emitted by reranking-capable providers.
 */
export type ProviderRerankResponse<Document = string | Record<string, unknown>> = {
	ranking: Array<{
		originalIndex: number
		score: number
		document: Document
	}>
	rerankedDocuments: Document[]
	metadata?: Record<string, unknown>
}

export type ModelProviderCapability =
	| 'text'
	| 'stream'
	| 'embedding'
	| 'rerank'
	| 'json'
	| 'image'
	| 'audio'
	| 'moderation'

export type ModelProviderCapabilities = Partial<Record<ModelProviderCapability, boolean>>

/**
 * Incremental events emitted by {@link ModelProvider.stream}.
 */
export type ProviderStreamChunk =
	| {
			type: 'text-delta'
			textDelta: string
	  }
	| {
			type: 'reasoning-delta'
			reasoningDelta: string
	  }
	| {
			type: 'error'
			error: unknown
	  }

/**
 * Stream handle returned by {@link ModelProvider.stream}.
 * Consumers iterate chunks and call `final()` to obtain usage/metadata.
 */
export type ProviderStream = AsyncIterable<ProviderStreamChunk> & {
	final(): Promise<ProviderResponse>
}

/**
 * Minimal interface providers must satisfy so they can be swapped at runtime.
 */
export interface ModelProvider {
	readonly name: string
	readonly capabilities: ModelProviderCapabilities
	generate?(request: ProviderRequest): Promise<ProviderResponse>
	stream?(request: ProviderRequest): ProviderStream
	/**
	 * High-level helper that yields one final text output while automatically
	 * preferring `stream()` and falling back to `generate()`.
	 *
	 * @example
	 * ```ts
	 * const answer = await context.models['openai:primary'].generateText({
	 *   developerInstruction: 'Use the available tools before answering.',
	 *   prompt: payload.prompt,
	 *   onTextDelta: delta => context.stream.sendChunk(delta),
	 * })
	 * ```
	 *
	 * In normal handler code the PURISTA runtime fills in declared skills and
	 * allowlisted bindings automatically when you omit them.
	 */
	generateText?(request: ProviderGenerateTextRequest): Promise<string>
	generateJson?<T = unknown>(request: ProviderJsonRequest): Promise<ProviderJsonResponse<T>>
	embed?(request: ProviderEmbedRequest): Promise<ProviderEmbedResponse>
	embedMany?(request: ProviderEmbedManyRequest): Promise<ProviderEmbedManyResponse>
	rerank?<Document = string | Record<string, unknown>>(
		request: ProviderRerankRequest<Document>,
	): Promise<ProviderRerankResponse<Document>>
}
