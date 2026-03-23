import { randomUUID } from 'node:crypto'
import type { ConversationStoreRecord, ConversationStoreRecordData } from '../memory/conversationStore.js'
import { type ConversationFrame, summarizeHistory } from '../memory/historyHelpers.js'
import type { AgentManifest } from '../types/AgentManifest.js'

const DEFAULT_MAX_FRAMES = 40

export type ConversationRole = 'system' | 'developer' | 'user' | 'assistant' | 'tool' | 'tool_result'

export type ConversationMessage = {
	id: string
	role: ConversationRole
	content: string
	createdAt: number
	toolName?: string
	toolCallId?: string
	metadata?: Record<string, unknown>
}

export type ConversationState = {
	messages: ConversationMessage[]
	summary?: string
	metadata?: Record<string, unknown>
}

export type ConversationSessionHelpers = {
	load(sessionId?: string): Promise<ConversationStoreRecord | undefined>
	save(record: { conversationId?: string; data: ConversationStoreRecordData; updatedAt?: number }): Promise<void>
}

export type ConversationHelpers = {
	get(sessionId?: string): Promise<ConversationState>
	getMessages(sessionId?: string): Promise<ConversationMessage[]>
	getSummary(sessionId?: string): Promise<string | undefined>
	append(message: Omit<ConversationMessage, 'id' | 'createdAt'>, sessionId?: string): Promise<ConversationState>
	addSystem(
		content: string,
		options?: { metadata?: Record<string, unknown>; sessionId?: string },
	): Promise<ConversationState>
	addDeveloper(
		content: string,
		options?: { metadata?: Record<string, unknown>; sessionId?: string },
	): Promise<ConversationState>
	addUser(
		content: string,
		options?: { metadata?: Record<string, unknown>; sessionId?: string },
	): Promise<ConversationState>
	addAssistant(
		content: string,
		options?: { metadata?: Record<string, unknown>; sessionId?: string },
	): Promise<ConversationState>
	addTool(
		content: string,
		options?: { toolName?: string; toolCallId?: string; metadata?: Record<string, unknown>; sessionId?: string },
	): Promise<ConversationState>
	addToolResult(
		content: string,
		options?: { toolName?: string; toolCallId?: string; metadata?: Record<string, unknown>; sessionId?: string },
	): Promise<ConversationState>
	setSummary(summary: string, sessionId?: string): Promise<ConversationState>
	revertLast(options?: { sessionId?: string; role?: ConversationRole }): Promise<ConversationState>
	buildPromptInput(options?: { includeSummary?: boolean; sessionId?: string }): Promise<string>
}

const toSummaryFrame = (message: ConversationMessage): ConversationFrame => ({
	role: message.role === 'tool' || message.role === 'tool_result' ? 'assistant' : message.role,
	content: message.content,
	timestamp: message.createdAt,
})

const normalizeState = (data: ConversationStoreRecordData | undefined): ConversationState => {
	const raw = data?.conversation
	if (!raw) {
		return { messages: [] }
	}
	if (Array.isArray(raw)) {
		return {
			messages: raw.filter(entry => entry && typeof entry === 'object').map(entry => entry as ConversationMessage),
		}
	}
	if (typeof raw === 'object' && raw !== null) {
		const state = raw as Partial<ConversationState>
		return {
			messages: Array.isArray(state.messages) ? state.messages : [],
			summary: typeof state.summary === 'string' ? state.summary : undefined,
			metadata: typeof state.metadata === 'object' && state.metadata ? state.metadata : undefined,
		}
	}
	return { messages: [] }
}

const applyRetention = (
	state: ConversationState,
	options: {
		maxFrames: number
		strategy: 'full' | 'summary'
	},
): ConversationState => {
	if (state.messages.length <= options.maxFrames) {
		return state
	}
	const overflowCount = state.messages.length - options.maxFrames
	const overflow = state.messages.slice(0, overflowCount)
	const recent = state.messages.slice(overflowCount)
	if (options.strategy !== 'summary') {
		return {
			...state,
			messages: recent,
		}
	}
	const droppedSummary = summarizeHistory(overflow.map(toSummaryFrame))
	const mergedSummary = [state.summary, droppedSummary].filter(Boolean).join('\n')
	return {
		...state,
		messages: recent,
		summary: mergedSummary || undefined,
	}
}

export const createConversationHelpers = (
	session: ConversationSessionHelpers,
	manifest: AgentManifest,
): ConversationHelpers => {
	const maxFrames = manifest.session?.maxFrames ?? DEFAULT_MAX_FRAMES
	const strategy = manifest.session?.strategy ?? 'full'

	const loadState = async (sessionId?: string) => {
		const record = await session.load(sessionId)
		return {
			record,
			state: normalizeState(record?.data),
		}
	}

	const saveState = async (state: ConversationState, sessionId?: string) => {
		const { record } = await loadState(sessionId)
		await session.save({
			conversationId: sessionId,
			data: {
				...(record?.data ?? {}),
				conversation: state,
			},
		})
		return state
	}

	const append = async (message: Omit<ConversationMessage, 'id' | 'createdAt'>, sessionId?: string) => {
		const { state } = await loadState(sessionId)
		const next = applyRetention(
			{
				...state,
				messages: [
					...state.messages,
					{
						id: randomUUID(),
						createdAt: Date.now(),
						...message,
					},
				],
			},
			{ maxFrames, strategy },
		)
		return saveState(next, sessionId)
	}

	const addByRole = (
		role: ConversationRole,
		content: string,
		options?: { metadata?: Record<string, unknown>; sessionId?: string; toolName?: string; toolCallId?: string },
	) =>
		append(
			{
				role,
				content,
				metadata: options?.metadata,
				toolName: options?.toolName,
				toolCallId: options?.toolCallId,
			},
			options?.sessionId,
		)

	return {
		async get(sessionId) {
			const { state } = await loadState(sessionId)
			return state
		},
		async getMessages(sessionId) {
			const { state } = await loadState(sessionId)
			return state.messages
		},
		async getSummary(sessionId) {
			const { state } = await loadState(sessionId)
			return state.summary
		},
		append,
		addSystem(content, options) {
			return addByRole('system', content, options)
		},
		addDeveloper(content, options) {
			return addByRole('developer', content, options)
		},
		addUser(content, options) {
			return addByRole('user', content, options)
		},
		addAssistant(content, options) {
			return addByRole('assistant', content, options)
		},
		addTool(content, options) {
			return addByRole('tool', content, options)
		},
		addToolResult(content, options) {
			return addByRole('tool_result', content, options)
		},
		async setSummary(summary, sessionId) {
			const { state } = await loadState(sessionId)
			return saveState(
				{
					...state,
					summary,
				},
				sessionId,
			)
		},
		async revertLast(options) {
			const { state } = await loadState(options?.sessionId)
			const matchRole = options?.role
			let index = -1
			if (matchRole === undefined) {
				index = state.messages.length - 1
			} else {
				for (let i = state.messages.length - 1; i >= 0; i -= 1) {
					if (state.messages[i]?.role === matchRole) {
						index = i
						break
					}
				}
			}
			if (index < 0) {
				return state
			}
			const nextMessages = [...state.messages]
			nextMessages.splice(index, 1)
			return saveState(
				{
					...state,
					messages: nextMessages,
				},
				options?.sessionId,
			)
		},
		async buildPromptInput(options) {
			const { state } = await loadState(options?.sessionId)
			const lines = state.messages.map(message => `${message.role}: ${message.content}`)
			if (options?.includeSummary !== false && state.summary) {
				lines.unshift(`summary: ${state.summary}`)
			}
			return lines.join('\n')
		},
	}
}
