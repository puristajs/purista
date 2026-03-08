import type { Context, Span, SpanOptions } from '@opentelemetry/api'
import type { Logger } from '@purista/core'
import { PuristaSpanName } from '@purista/core'
import type { KnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import type { ConversationStore } from '../memory/conversationStore.js'
import type { ConversationHistory } from '../memory/historyHelpers.js'
import { appendMessage, summarizeHistory, trimHistory } from '../memory/historyHelpers.js'
import type { ModelProvider, ProviderRequest } from '../providers/runtime/ModelProvider.js'
import type { AgentManifest } from '../types/AgentManifest.js'

export type StartActiveSpanFunction = <T>(
	name: string,
	options?: SpanOptions,
	context?: Context,
	fn?: (span: Span) => Promise<T>,
) => Promise<T>

/**
 * Dependencies required for running an agent workload.
 */
export type AgentExecutionOptions = {
	manifest: AgentManifest
	provider: ModelProvider
	conversationStore: ConversationStore
	knowledgeAdapters: Record<string, KnowledgeAdapter>
	logger: Logger
	startActiveSpan: StartActiveSpanFunction
}

/**
 * Payload the executor receives whenever a run is initiated.
 */
export type AgentExecutionInput = {
	sessionId: string
	prompt: string
	context?: string
	metadata?: ProviderRequest['metadata']
}

/**
 * Result emitted by the executor after the provider finishes.
 */
export type AgentExecutionResult = {
	output: string
	tokens?: {
		prompt: number
		completion: number
	}
	durationMs?: number
}

/**
 * Runs prompts against the configured {@link ModelProvider}, writes session state,
 * and captures telemetry spans using the provided logger/span factory.
 *
 * @example
 * ```ts
 * const executor = new AgentExecutor({
 *   manifest,
 *   provider: myModelProvider,
 *   conversationStore: new InMemoryConversationStore(),
 *   knowledgeAdapters: { default: new InMemoryKnowledgeAdapter() },
 *   logger,
 *   startActiveSpan: startActiveSpanFn,
 * })
 *
 * const result = await executor.run({ sessionId: 'demo', prompt: 'Hello agent!' })
 * console.log(result.output)
 * ```
 */
export class AgentExecutor {
	private readonly maxHistoryFrames = 50

	constructor(private readonly options: AgentExecutionOptions) {}

	async run(input: AgentExecutionInput): Promise<AgentExecutionResult> {
		const { manifest, provider, logger } = this.options

		logger.debug({ manifest: manifest.agentName, sessionId: input.sessionId }, 'running agent workload')
		if (!provider.generate) {
			throw new Error(`Provider "${provider.name}" does not support text generation`)
		}
		const generate = provider.generate

		const startedAt = Date.now()
		const sessionRecord = await this.options.conversationStore.load(input.sessionId)
		const existingHistory = (sessionRecord?.data.history as ConversationHistory | undefined) ?? []
		const history = trimHistory(existingHistory, this.maxHistoryFrames)
		const knowledgeContext = await this.collectKnowledge(manifest, input.prompt)
		const providerContext = this.composeContext(input.context, history, knowledgeContext)

		const response = await this.options.startActiveSpan(
			PuristaSpanName.EventBridgeInvokeCommand,
			{},
			undefined,
			async () => generate({ prompt: input.prompt, context: providerContext, metadata: input.metadata }),
		)

		const userFrame = appendMessage(history, {
			role: 'user',
			content: input.prompt,
			timestamp: Date.now(),
		})
		const updatedHistory = appendMessage(userFrame, {
			role: 'assistant',
			content: response.output,
			timestamp: Date.now(),
		})

		await this.options.conversationStore.save({
			conversationId: input.sessionId,
			data: {
				...(sessionRecord?.data ?? {}),
				lastOutput: response.output,
				history: updatedHistory,
			},
			updatedAt: Date.now(),
		})

		return {
			output: response.output,
			tokens: response.tokens,
			durationMs: Date.now() - startedAt,
		}
	}

	private async collectKnowledge(manifest: AgentManifest, prompt: string) {
		if (!manifest.knowledge?.length) {
			return []
		}

		const snippets: string[] = []

		for (const entry of manifest.knowledge) {
			const adapter = this.options.knowledgeAdapters[entry.adapterName]
			if (!adapter) {
				this.options.logger.warn(
					{ adapterName: entry.adapterName, agent: manifest.agentName },
					'missing knowledge adapter',
				)
				continue
			}
			const documents = await adapter.query({
				query: prompt,
				limit: 5,
				options: entry.options,
			})
			for (const doc of documents) {
				snippets.push(`[${adapter.id}:${doc.id}] ${doc.content}`)
			}
		}

		return snippets
	}

	private composeContext(explicitContext: string | undefined, history: ConversationHistory, knowledge: string[]) {
		const segments: string[] = []

		if (explicitContext) {
			segments.push(explicitContext)
		}

		if (knowledge.length) {
			segments.push(`Knowledge:\n${knowledge.join('\n')}`)
		}

		if (history.length) {
			segments.push(`History:\n${summarizeHistory(history)}`)
		}

		if (!segments.length) {
			return undefined
		}

		return segments.join('\n\n')
	}
}
