import type { Logger } from '@purista/core'
import type { ConversationStore } from '../memory/conversationStore.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import {
	type AgentExecutionInput,
	type AgentExecutionResult,
	executeAgentWorkload,
	type StartActiveSpanFunction,
} from './executeAgentWorkload.js'

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
 *
 * The executor persists typed user parts into conversation history. It does not
 * perform document extraction itself; applications should plug in that logic
 * before invoking the executor.
 */
export class AgentExecutor {
	private readonly maxHistoryFrames = 50

	constructor(private readonly options: AgentExecutionOptions) {}

	async run(input: AgentExecutionInput): Promise<AgentExecutionResult> {
		return await executeAgentWorkload(
			{
				...this.options,
				maxHistoryFrames: this.maxHistoryFrames,
			},
			input,
		)
	}
}
