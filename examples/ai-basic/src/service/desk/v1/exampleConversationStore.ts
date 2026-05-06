import type { ConversationStore, ConversationStoreRecord, ConversationStoreScope } from '@purista/ai'

type ScopedRecord = {
	record: ConversationStoreRecord
	scope?: ConversationStoreScope
}

export type ExampleConversationHistoryEntry = {
	sessionId: string
	scenario: 'chat' | 'research' | 'planner' | 'structured' | 'reflection'
	firstMessage: string
	updatedAt: number
}

export const INTERNAL_CONVERSATION_SESSION_PREFIX = 'internal:'

export const createInternalConversationSessionId = (parentSessionId: string | undefined, scope: string) =>
	`${INTERNAL_CONVERSATION_SESSION_PREFIX}${scope}:${parentSessionId ?? 'ephemeral'}`

const scenarioByAgentName = {
	architectureReviewAgent: 'structured',
	deskChatAgent: 'chat',
	deliveryPlannerAgent: 'planner',
	reflectionAgent: 'reflection',
	researchAgent: 'research',
} as const

type ConversationMessage = {
	role: 'system' | 'developer' | 'user' | 'assistant' | 'tool' | 'tool_result'
	content: string
}

type ConversationState = {
	messages?: ConversationMessage[]
}

class ExampleConversationStore implements ConversationStore {
	private readonly store = new Map<string, ScopedRecord>()

	private getScopeKey(scope?: ConversationStoreScope) {
		if (!scope?.tenantId && !scope?.principalId && !scope?.agentName && !scope?.serviceVersion) {
			return undefined
		}
		return [scope.tenantId ?? '', scope.principalId ?? '', scope.agentName ?? '', scope.serviceVersion ?? ''].join(':')
	}

	private getKey(conversationId: string, scope?: ConversationStoreScope) {
		const scopeKey = this.getScopeKey(scope)
		return `${scopeKey ?? 'global'}::${conversationId}`
	}

	async load(conversationId: string, scope?: ConversationStoreScope) {
		return this.store.get(this.getKey(conversationId, scope))?.record
	}

	async save(record: ConversationStoreRecord, scope?: ConversationStoreScope) {
		this.store.set(this.getKey(record.conversationId, scope), {
			record: { ...record, updatedAt: Date.now() },
			scope,
		})
	}

	async delete(conversationId: string, scope?: ConversationStoreScope) {
		this.store.delete(this.getKey(conversationId, scope))
	}

	async listRecent(limit = 30): Promise<ExampleConversationHistoryEntry[]> {
		return [...this.store.values()]
			.map(({ record, scope }) => {
				if (
					typeof record.conversationId === 'string' &&
					record.conversationId.startsWith(INTERNAL_CONVERSATION_SESSION_PREFIX)
				) {
					return undefined
				}

				const scenario =
					scope?.agentName && scope.agentName in scenarioByAgentName
						? scenarioByAgentName[scope.agentName as keyof typeof scenarioByAgentName]
						: undefined
				if (!scenario) {
					return undefined
				}

				const conversation = record.data.conversation as ConversationState | ConversationMessage[] | undefined
				const messages = Array.isArray(conversation)
					? conversation
					: Array.isArray(conversation?.messages)
						? conversation.messages
						: []
				const firstUserMessage = messages.find(message => message.role === 'user' && message.content.trim().length > 0)
				if (!firstUserMessage) {
					return undefined
				}

				return {
					sessionId: record.conversationId,
					scenario,
					firstMessage: firstUserMessage.content.trim().slice(0, 160),
					updatedAt: record.updatedAt,
				} satisfies ExampleConversationHistoryEntry
			})
			.filter((entry): entry is ExampleConversationHistoryEntry => entry !== undefined)
			.reduce<ExampleConversationHistoryEntry[]>((entries, current) => {
				const existingIndex = entries.findIndex(
					entry => entry.sessionId === current.sessionId && entry.scenario === current.scenario,
				)
				if (existingIndex === -1) {
					entries.push(current)
					return entries
				}
				if (entries[existingIndex].updatedAt < current.updatedAt) {
					entries[existingIndex] = current
				}
				return entries
			}, [])
			.sort((left, right) => right.updatedAt - left.updatedAt)
			.slice(0, limit)
	}
}

let conversationStore = new ExampleConversationStore()

export const getExampleConversationStore = () => conversationStore

export const resetExampleConversationStore = () => {
	conversationStore = new ExampleConversationStore()
	return conversationStore
}
