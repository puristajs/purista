import type { AgentAttachment } from '../input/types.js'

export type ConversationFramePart =
	| {
			type: 'text'
			text: string
	  }
	| {
			type: 'attachment'
			attachmentId: string
			mediaType: string
			filename?: string
			title?: string
			previewText?: string
			metadata?: Record<string, unknown>
	  }

/**
 * A single frame in a conversation history.
 */
export type ConversationFrame = {
	role: 'user' | 'assistant' | 'system' | 'developer'
	content: string
	parts?: ConversationFramePart[]
	timestamp: number
}

export type ConversationHistory = ConversationFrame[]

/** Append a new message to the history immutably. */
export const appendMessage = (history: ConversationHistory, frame: ConversationFrame): ConversationHistory => {
	return [...history, frame]
}

/** Trims a history to the last `maxTokens` frames. */
export const trimHistory = (history: ConversationHistory, maxTokens: number): ConversationHistory => {
	if (history.length <= maxTokens) {
		return history
	}
	return history.slice(history.length - maxTokens)
}

/** Convert the history into a plain-text transcript for summaries or providers without native memory. */
export const summarizeHistory = (history: ConversationHistory): string => {
	return history
		.map(frame => {
			const derivedContent =
				frame.content ||
				frame.parts
					?.map(part => {
						if (part.type === 'text') {
							return part.text
						}
						return part.previewText ?? `[attachment:${part.mediaType}${part.filename ? ` ${part.filename}` : ''}]`
					})
					.join(' ')
					.trim() ||
				''
			return `${frame.role}: ${derivedContent}`
		})
		.join('\n')
}

export const attachmentToConversationPart = (attachment: AgentAttachment): ConversationFramePart => ({
	type: 'attachment',
	attachmentId: attachment.attachmentId,
	mediaType: attachment.mediaType,
	filename: attachment.filename,
	title: attachment.title,
	metadata: attachment.metadata,
})
