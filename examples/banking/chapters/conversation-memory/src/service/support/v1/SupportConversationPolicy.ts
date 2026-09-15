export type SupportConversationAction = 'continue' | 'read' | 'clear'

export interface SupportConversationPolicy {
	canAccess(input: {
		tenantId: string
		principalId: string
		conversationId: string
		action: SupportConversationAction
	}): Promise<boolean>
}
