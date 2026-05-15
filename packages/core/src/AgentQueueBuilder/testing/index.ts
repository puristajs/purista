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
import type { EmptyObject } from '../../core/types/EmptyObject.js'
import type { Logger as PuristaLogger } from '../../core/types/Logger.js'
import type { PuristaMetricContext, PuristaMetricDefinitions } from '../../core/types/PuristaMetrics.js'
import { createAgentExecutor } from '../runtime/executor.js'
import type {
	AgentHandlerContext,
	AgentModelBinding,
	AgentRunIdentity,
	AgentRuntimeModelBindings,
	AttachedAgentDefinition,
} from '../types.js'

export type CreateAgentContextMockInput<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = {
	payload?: Payload
	parameter?: Parameter
	resources?: Resources
	models?: AgentHandlerContext<Payload, Parameter, Resources, Models>['harness']['models']
	metrics?: PuristaMetricContext<Metrics>
	identity?: Partial<AgentRunIdentity>
	logger?: PuristaLogger
}

export function createAgentContextMock<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, AgentModelBinding> = Record<string, never>,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
>(
	input: CreateAgentContextMockInput<Payload, Parameter, Resources, Models, Metrics> = {},
): AgentHandlerContext<Payload, Parameter, Resources, Models, Record<never, never>, Record<never, never>, Metrics> {
	const identity: AgentRunIdentity = {
		transportMessageId: 'test-message',
		serviceName: 'test',
		serviceVersion: '1',
		agentName: 'agent',
		runtimeRevision: 'test',
		runId: 'test-run',
		harnessSessionId: 'test-session',
		...input.identity,
	}

	const resources = (input.resources ?? {}) as Resources
	const message = { id: identity.transportMessageId }
	const emit = async () => undefined
	const service = {}
	const stream = {}
	const queue = {}
	return {
		payload: input.payload as Payload,
		parameter: input.parameter as Parameter,
		identity,
		message,
		emit,
		service,
		stream,
		queue,
		resources,
		metrics: (input.metrics ?? {}) as PuristaMetricContext<Metrics>,
		harness: {
			session: createSessionMock(identity.harnessSessionId),
			models: (input.models ?? {}) as AgentHandlerContext<Payload, Parameter, Resources, Models>['harness']['models'],
			events: {
				emit: async () => undefined,
			},
		},
		invoke: {
			tools: {},
			agents: {},
		},
		logger: input.logger ?? createNoopPuristaLogger(),
		signal: new AbortController().signal,
	}
}

export function createScriptedHarnessModel() {
	return new ScriptedHarnessModelProvider()
}

export type CreateAgentTestHarnessOptions<Models extends Record<string, AgentModelBinding>> = {
	models: AgentRuntimeModelBindings<Models>
	logger?: PuristaLogger
}

export function createAgentTestHarness<Definition extends AttachedAgentDefinition<any>>(
	definition: Definition,
	options: CreateAgentTestHarnessOptions<Definition['manifest']['models']>,
) {
	const executor = createAgentExecutor({
		definition,
		manifest: definition.manifest,
		models: options.models,
		logger: options.logger,
	})
	definition.runtime.current = executor

	return {
		async run(input: { payload?: unknown; parameter?: unknown; message?: Record<string, unknown> }) {
			return executor.executeAggregate({
				appContext: createAppContext(options.logger),
				message: input.message ?? { id: 'test-message' },
				payload: input.payload,
				parameter: input.parameter,
			})
		},
		async stream(input: { payload?: unknown; parameter?: unknown; message?: Record<string, unknown> }) {
			const chunks: unknown[] = []
			let final: unknown
			await executor.executeStream({
				appContext: createAppContext(options.logger),
				message: input.message ?? { id: 'test-message' },
				payload: input.payload,
				parameter: input.parameter,
				writer: {
					write: async chunk => {
						chunks.push(chunk)
					},
					close: async value => {
						final = value
					},
					fail: async error => {
						throw error
					},
					onCancel: () => undefined,
				},
			})
			return { chunks, final }
		},
	}
}

function createSessionMock(id: string) {
	return {
		id,
		agents: {},
		workflows: {},
		memory: {
			read: async () => undefined,
			write: async () => undefined,
			delete: async () => undefined,
			list: async () => [],
		},
		history: {
			list: async () => [],
		},
		clearHistory: async () => undefined,
		replaceHistory: async () => undefined,
		close: async () => undefined,
	}
}

function createAppContext(logger?: PuristaLogger) {
	return {
		message: { id: 'test-message' },
		resources: {},
		emit: async () => undefined,
		service: {},
		stream: {},
		queue: {},
		metrics: {},
		logger: logger ?? createNoopPuristaLogger(),
	}
}

function createNoopPuristaLogger(): PuristaLogger {
	const write = () => undefined
	return {
		info: write,
		fatal: write,
		error: write,
		warn: write,
		debug: write,
		trace: write,
		getChildLogger: () => createNoopPuristaLogger(),
	} as PuristaLogger
}

export class ScriptedHarnessModelProvider implements ModelProvider {
	readonly id = 'scripted'
	readonly genAiSystem = 'scripted'
	readonly requests: Array<TextRequest | ObjectRequest | EmbeddingRequest | RerankRequest> = []
	private readonly textQueue: TextResponse[] = []
	private readonly objectQueue: ObjectResponse[] = []
	private readonly embeddingQueue: EmbeddingResponse[] = []
	private readonly rerankQueue: RerankResponse[] = []
	private readonly textStreamQueue: TextStreamChunk[][] = []
	private readonly objectStreamQueue: ObjectStreamChunk[][] = []

	enqueueText(response: TextResponse): void {
		this.textQueue.push(response)
	}

	enqueueObject(response: ObjectResponse): void {
		this.objectQueue.push(response)
	}

	enqueue(response: ObjectResponse): void {
		this.enqueueObject(response)
	}

	enqueueEmbedding(response: EmbeddingResponse): void {
		this.embeddingQueue.push(response)
	}

	enqueueRerank(response: RerankResponse): void {
		this.rerankQueue.push(response)
	}

	enqueueTextStream(chunks: TextStreamChunk[]): void {
		this.textStreamQueue.push(chunks)
	}

	enqueueObjectStream(chunks: ObjectStreamChunk[]): void {
		this.objectStreamQueue.push(chunks)
	}

	async text(req: TextRequest): Promise<TextResponse> {
		this.requests.push(req)
		return shiftScripted(this.textQueue, 'text')
	}

	async *textStream(req: TextRequest): AsyncIterable<TextStreamChunk> {
		this.requests.push(req)
		for (const chunk of shiftScripted(this.textStreamQueue, 'text stream')) {
			yield chunk
		}
	}

	async object<T extends JsonValue>(req: ObjectRequest<T>): Promise<ObjectResponse<T>> {
		this.requests.push(req)
		return shiftScripted(this.objectQueue, 'object') as ObjectResponse<T>
	}

	async *objectStream<T extends JsonValue>(req: ObjectRequest<T>): AsyncIterable<ObjectStreamChunk<T>> {
		this.requests.push(req)
		for (const chunk of shiftScripted(this.objectStreamQueue, 'object stream')) {
			yield chunk as ObjectStreamChunk<T>
		}
	}

	async embed(req: EmbeddingRequest): Promise<EmbeddingResponse> {
		this.requests.push(req)
		return shiftScripted(this.embeddingQueue, 'embedding')
	}

	async rerank(req: RerankRequest): Promise<RerankResponse> {
		this.requests.push(req)
		return shiftScripted(this.rerankQueue, 'rerank')
	}
}

function shiftScripted<T>(queue: T[], label: string): T {
	const value = queue.shift()
	if (!value) {
		throw new Error(`No scripted ${label} response queued`)
	}
	return value
}
