import type {
	EmbeddingRequest,
	EmbeddingResponse,
	JsonValue,
	ModelProvider,
	ObjectRequest,
	ObjectResponse,
	ObjectStreamChunk,
	RerankRequest,
	RerankResponse,
	TextRequest,
	TextResponse,
	TextStreamChunk,
} from '@purista/harness'

type QueuedResponse =
	| { method: 'object'; response: ObjectResponse }
	| { method: 'text'; response: TextResponse }
	| { method: 'embed'; response: EmbeddingResponse }
	| { method: 'rerank'; response: RerankResponse }

const emptyUsage = () => ({ inputTokens: 0, outputTokens: 0, totalTokens: 0 })

/**
 * A deterministic in-memory Harness model provider for PURISTA agent tests.
 *
 * Queue responses with the `enqueue*` methods, then pass the instance to
 * `createAgentTestHarness`. The implementation deliberately has no test-runner
 * dependency, so importing `@purista/core` never requires Vitest at runtime.
 *
 * @example
 * ```ts
 * const model = new FakeModelProvider()
 * model.enqueueObject({ object: { answer: 'ok' }, usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 }, toolCalls: [], finishReason: 'stop' })
 * ```
 */
export class FakeModelProvider implements ModelProvider {
	private readonly queue: QueuedResponse[] = []
	private readonly textStreamQueue: TextStreamChunk[][] = []
	private readonly objectStreamQueue: ObjectStreamChunk[][] = []
	/** Requests received in call order; use this to assert the agent's model interaction. */
	readonly requests: Array<TextRequest | ObjectRequest | EmbeddingRequest | RerankRequest> = []
	/** Stable provider identifier reported to Harness telemetry and diagnostics. */
	readonly id = 'fake'
	/** Stable provider-system label reported to Harness telemetry and diagnostics. */
	readonly genAiSystem = 'fake'

	/** Queue the next response returned by `object(...)`. */
	enqueueObject(response: ObjectResponse): void {
		this.queue.push({ method: 'object', response })
	}

	/** Queue the next response returned by `text(...)`. */
	enqueueText(response: TextResponse): void {
		this.queue.push({ method: 'text', response })
	}

	/** Queue the next response returned by `embed(...)`. */
	enqueueEmbedding(response: EmbeddingResponse): void {
		this.queue.push({ method: 'embed', response })
	}

	/** Queue the next response returned by `rerank(...)`. */
	enqueueRerank(response: RerankResponse): void {
		this.queue.push({ method: 'rerank', response })
	}

	/** Queue chunks yielded by the next `textStream(...)` call. */
	enqueueTextStream(chunks: TextStreamChunk[]): void {
		this.textStreamQueue.push(chunks)
	}

	/** Queue chunks yielded by the next `objectStream(...)` call. */
	enqueueObjectStream(chunks: ObjectStreamChunk[]): void {
		this.objectStreamQueue.push(chunks)
	}

	/** Backward-compatible alias for `enqueueObject(...)`. */
	enqueue(response: ObjectResponse): void {
		this.enqueueObject(response)
	}

	/** Record a text request and return the next queued text response, or an empty successful response. */
	async text(request: TextRequest): Promise<TextResponse> {
		this.requests.push(request)
		const next = this.take('text') as TextResponse | undefined
		return next ?? { content: '', usage: emptyUsage(), toolCalls: [], finishReason: 'stop' }
	}

	/** Record a text-stream request and yield its queued chunks, or a single finish chunk. */
	async *textStream(request: TextRequest): AsyncIterable<TextStreamChunk> {
		this.requests.push(request)
		for (const chunk of this.textStreamQueue.shift() ?? [
			{ kind: 'finish', usage: emptyUsage(), finishReason: 'stop' },
		]) {
			yield chunk
		}
	}

	/** Record an object request and return the next queued object response, or an empty successful response. */
	async object<Value extends JsonValue = JsonValue>(request: ObjectRequest<Value>): Promise<ObjectResponse<Value>> {
		this.requests.push(request)
		const next = this.take('object') as ObjectResponse<Value> | undefined
		return (
			next ??
			({ object: '' as Value, usage: emptyUsage(), toolCalls: [], finishReason: 'stop' } as ObjectResponse<Value>)
		)
	}

	/** Record an object-stream request and yield its queued chunks, or a single finish chunk. */
	async *objectStream<Value extends JsonValue = JsonValue>(
		request: ObjectRequest<Value>,
	): AsyncIterable<ObjectStreamChunk<Value>> {
		this.requests.push(request)
		const chunks = this.objectStreamQueue.shift() ?? [
			{ kind: 'finish', object: '', usage: emptyUsage(), finishReason: 'stop' },
		]
		for (const chunk of chunks) {
			yield chunk as ObjectStreamChunk<Value>
		}
	}

	/** Record an embedding request and return the next queued response, or zero-vector embeddings. */
	async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
		this.requests.push(request)
		const next = this.take('embed') as EmbeddingResponse | undefined
		if (next) {
			return next
		}
		const inputCount = Array.isArray(request.input) ? request.input.length : 1
		return {
			embeddings: Array.from({ length: inputCount }, (_, index) => ({ index, vector: [0] })),
			usage: emptyUsage(),
		}
	}

	/** Record a rerank request and return the next queued response, or a deterministic input-order ranking. */
	async rerank(request: RerankRequest): Promise<RerankResponse> {
		this.requests.push(request)
		const next = this.take('rerank') as RerankResponse | undefined
		if (next) {
			return next
		}
		return {
			results: request.documents
				.map((document, index) => ({
					id: document.id,
					index,
					score: request.documents.length - index,
					...(document.metadata ? { metadata: document.metadata } : {}),
				}))
				.slice(0, request.topN ?? request.documents.length),
		}
	}

	private take(method: QueuedResponse['method']): QueuedResponse['response'] | undefined {
		const next = this.queue.shift()
		if (!next) {
			return undefined
		}
		if (next.method === method) {
			return next.response
		}
		this.queue.unshift(next)
		return undefined
	}
}
