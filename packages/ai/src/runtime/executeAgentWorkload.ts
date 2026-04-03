import type { Context, Span, SpanOptions } from '@opentelemetry/api'
import type { Logger } from '@purista/core'
import { PuristaSpanName } from '@purista/core'
import type { AgentAttachment, AgentInputPart } from '../input/types.js'
import { attachmentsToInputParts } from '../input/types.js'
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

export type AgentExecutionInput = {
	sessionId: string
	prompt: string
	input?: AgentInputPart[]
	attachments?: AgentAttachment[]
	context?: string
	metadata?: ProviderRequest['metadata']
	tenantId?: string
	principalId?: string
}

export type AgentExecutionResult = {
	output: string
	tokens?: {
		prompt: number
		completion: number
	}
	durationMs?: number
}

export type ExecuteAgentWorkloadOptions = {
	manifest: AgentManifest
	provider: ModelProvider
	conversationStore: ConversationStore
	logger: Logger
	startActiveSpan: StartActiveSpanFunction
	maxHistoryFrames?: number
}

const createConversationScope = (manifest: AgentManifest, input: AgentExecutionInput): ConversationStoreScope => ({
	agentName: manifest.agentName,
	agentVersion: manifest.agentVersion,
	tenantId: input.tenantId,
	principalId: input.principalId,
})

const composeContext = (explicitContext: string | undefined, history: ConversationHistory) => {
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

export const executeAgentWorkload = async (
	options: ExecuteAgentWorkloadOptions,
	input: AgentExecutionInput,
): Promise<AgentExecutionResult> => {
	const { manifest, provider, logger } = options
	logger.debug({ manifest: manifest.agentName, sessionId: input.sessionId }, 'running agent workload')
	if (!provider.generate) {
		throw new Error(`Provider "${provider.name}" does not support text generation`)
	}
	const generate = provider.generate
	const startedAt = Date.now()
	const conversationScope = createConversationScope(manifest, input)
	const sessionRecord = await options.conversationStore.load(input.sessionId, conversationScope)
	const existingHistory = (sessionRecord?.data.history as ConversationHistory | undefined) ?? []
	const history = trimHistory(existingHistory, options.maxHistoryFrames ?? 50)
	const providerContext = composeContext(input.context, history)
	const response = await options.startActiveSpan(PuristaSpanName.EventBridgeInvokeCommand, {}, undefined, async () =>
		generate({
			prompt: input.prompt,
			input: input.input,
			attachments: input.attachments,
			context: providerContext,
			metadata: input.metadata,
		}),
	)
	const userParts = [
		...(input.prompt.trim().length > 0
			? [
					{
						type: 'text' as const,
						text: input.prompt,
					},
				]
			: []),
		...(input.input ?? []),
		...attachmentsToInputParts(input.attachments),
	].map(part => {
		if (part.type === 'text') {
			return part
		}
		return {
			type: 'attachment' as const,
			attachmentId: part.attachmentId ?? 'input',
			mediaType: part.type === 'image' ? (part.mediaType ?? 'image/*') : part.mediaType,
			filename: part.filename,
			title: part.title,
		}
	})
	const userFrame = appendMessage(history, {
		role: 'user',
		content: input.prompt,
		parts: userParts,
		timestamp: Date.now(),
	})
	const updatedHistory = appendMessage(userFrame, {
		role: 'assistant',
		content: response.output,
		parts: [
			{
				type: 'text',
				text: response.output,
			},
		],
		timestamp: Date.now(),
	})
	await options.conversationStore.save(
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
