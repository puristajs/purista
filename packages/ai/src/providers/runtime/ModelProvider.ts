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
	 */
	generateText?(request: ProviderGenerateTextRequest): Promise<string>
	generateJson?<T = unknown>(request: ProviderJsonRequest): Promise<ProviderJsonResponse<T>>
	embed?(request: ProviderEmbedRequest): Promise<ProviderEmbedResponse>
	embedMany?(request: ProviderEmbedManyRequest): Promise<ProviderEmbedManyResponse>
	rerank?<Document = string | Record<string, unknown>>(
		request: ProviderRerankRequest<Document>,
	): Promise<ProviderRerankResponse<Document>>
}
