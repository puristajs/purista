import type { Infer, Schema } from '@purista/core'
import type { ExternalBinding, ExternalBindingSet } from '../../bridge/externalRuntime.js'
import type { AgentAttachment, AgentInputPart } from '../../input/types.js'
import type { SkillDocument, SkillReferenceDocument } from '../../skills/fileSystem.js'
import type { ModelInvocationPolicy, ModelInvocationRetryPolicy } from './modelInvocation.js'

/**
 * Payload sent to a model provider.
 *
 * `prompt` remains the convenience field for pure text requests.
 * `input` and `attachments` are the canonical multimodal surfaces.
 *
 * Applications should pass already-normalized parts into providers.
 * File extraction itself belongs behind a file-ingestion adapter and is not
 * built into the framework for PDF/Office formats.
 */
export type ProviderRequest = {
	prompt: string
	input?: AgentInputPart[]
	attachments?: AgentAttachment[]
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
 *
 * The runtime compiles Standard Schema or plain JSON Schema inputs into
 * provider-safe structured-output schemas before the request reaches the SDK.
 *
 * `input` and `attachments` follow the same multimodal rules as
 * {@link ProviderRequest}.
 */
export type ProviderJsonRequest<OutputSchema = unknown> = {
	prompt: string
	input?: AgentInputPart[]
	attachments?: AgentAttachment[]
	context?: string
	developerInstruction?: string | string[]
	skills?: Array<Pick<SkillDocument, 'name' | 'content'>>
	references?: Array<Pick<SkillReferenceDocument, 'skillName' | 'relativePath' | 'content'>>
	bindings?: ExternalBindingSet | ExternalBinding[]
	schema?: OutputSchema
	metadata?: Record<string, unknown>
}

export type ProviderJsonOutputFromSchema<OutputSchema, Fallback = unknown> = OutputSchema extends Schema
	? Infer<OutputSchema>
	: Fallback

export type ProviderObjectSections<T = unknown> =
	| Record<string, unknown | undefined>
	| ((partial: T) => Record<string, unknown | undefined>)

export type ProviderObjectStreamRequest<T = unknown, OutputSchema = unknown> = ProviderJsonRequest<OutputSchema> & {
	sections?: ProviderObjectSections<T>
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

export type ProviderObjectSectionChunk = {
	type: 'section'
	section: string
	content: unknown
}

export type ProviderObjectStatusChunk = {
	type: 'status'
	message: string
}

export type ProviderObjectFinalChunk<T = unknown> = {
	type: 'final-object'
	data: T
	text: string
	reasoningText?: string
	tokens?: {
		prompt: number
		completion: number
	}
	metadata?: Record<string, unknown>
}

export type ProviderObjectErrorChunk = {
	type: 'error'
	error: unknown
}

export type ProviderObjectStreamChunk<T = unknown> =
	| ProviderObjectSectionChunk
	| ProviderObjectStatusChunk
	| ProviderObjectFinalChunk<T>
	| ProviderObjectErrorChunk

export type ProviderObjectStream<T = unknown> = AsyncIterable<ProviderObjectStreamChunk<T>> & {
	final(): Promise<ProviderJsonResponse<T>>
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

export type ModelProviderCapability = 'text' | 'text-stream' | 'object' | 'object-stream' | 'embedding' | 'rerank'

export type ModelProviderCapabilities = Partial<Record<ModelProviderCapability, boolean>>

export type ProviderInvocationMode =
	| 'text'
	| 'object'
	| 'text-stream'
	| 'structured-object-strict'
	| 'structured-object-relaxed'

export type ProviderInvocationPolicy = ModelInvocationPolicy & {
	mode?: ProviderInvocationMode
	retry?: ModelInvocationRetryPolicy
}

/**
 * Incremental events emitted by {@link ModelProvider.streamText}.
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
 * Stream handle returned by {@link ModelProvider.streamText}.
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
	/**
	 * High-level helper that yields one final text output while automatically
	 * preferring `streamText()` when available.
	 *
	 * @example
	 * ```ts
	 * const answer = await context.models['openai:primary'].generateText({
	 *   developerInstruction: 'Use the available tools before answering.',
	 *   prompt: payload.prompt,
	 *   onTextDelta: delta => context.stream.sendDelta(delta),
	 * })
	 * ```
	 *
	 * In normal handler code the PURISTA runtime fills in declared skills and
	 * allowlisted bindings automatically when you omit them.
	 */
	generateText?(request: ProviderGenerateTextRequest): Promise<string>
	streamText?(request: ProviderRequest): ProviderStream
	generateObject?<T = unknown, OutputSchema = unknown>(
		request: ProviderJsonRequest<OutputSchema>,
	): Promise<ProviderJsonResponse<ProviderJsonOutputFromSchema<OutputSchema, T>>>
	streamObject?<T = unknown, OutputSchema = unknown>(
		request: ProviderObjectStreamRequest<ProviderJsonOutputFromSchema<OutputSchema, T>, OutputSchema>,
	): ProviderObjectStream<ProviderJsonOutputFromSchema<OutputSchema, T>>
	embed?(request: ProviderEmbedRequest): Promise<ProviderEmbedResponse>
	embedMany?(request: ProviderEmbedManyRequest): Promise<ProviderEmbedManyResponse>
	rerank?<Document = string | Record<string, unknown>>(
		request: ProviderRerankRequest<Document>,
	): Promise<ProviderRerankResponse<Document>>
}

type CapabilityMethodKeys = {
	text: 'generateText'
	'text-stream': 'streamText' | 'generateText'
	object: 'generateObject'
	'object-stream': 'streamObject'
	embedding: 'embed'
	rerank: 'rerank'
}

type MethodKeysForCapabilities<Capabilities extends readonly ModelProviderCapability[]> =
	Capabilities[number] extends infer Capability
		? Capability extends keyof CapabilityMethodKeys
			? CapabilityMethodKeys[Capability]
			: never
		: never

export type ModelProviderForCapabilities<Capabilities extends readonly ModelProviderCapability[]> = Pick<
	ModelProvider,
	'name' | 'capabilities'
> &
	Required<Pick<ModelProvider, MethodKeysForCapabilities<Capabilities>>>
