import type { Context, Span, SpanOptions } from '@opentelemetry/api'
import type { Logger } from '@purista/core'
import { PuristaSpanName } from '@purista/core'
import type { ConversationStore, ConversationStoreScope } from '../memory/conversationStore.js'
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
	tenantId?: string
	principalId?: string
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
		const conversationScope = this.createConversationScope(input)
		const sessionRecord = await this.options.conversationStore.load(input.sessionId, conversationScope)
		const existingHistory = (sessionRecord?.data.history as ConversationHistory | undefined) ?? []
		const history = trimHistory(existingHistory, this.maxHistoryFrames)
		const providerContext = this.composeContext(input.context, history)

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

		await this.options.conversationStore.save(
			{
				conversationId: input.sessionId,
				data: {
					...(sessionRecord?.data ?? {}),
					lastOutput: response.output,
					history: updatedHistory,
				},
				updatedAt: Date.now(),
			},
			conversationScope,
		)

		return {
			output: response.output,
			tokens: response.tokens,
			durationMs: Date.now() - startedAt,
		}
	}

	private createConversationScope(input: AgentExecutionInput): ConversationStoreScope {
		return {
			agentName: this.options.manifest.agentName,
			agentVersion: this.options.manifest.agentVersion,
			tenantId: input.tenantId,
			principalId: input.principalId,
		}
	}

	private composeContext(explicitContext: string | undefined, history: ConversationHistory) {
		const segments: string[] = []

		if (explicitContext) {
			segments.push(explicitContext)
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
