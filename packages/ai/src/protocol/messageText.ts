import type { AgentInputPart } from '../input/types.js'

const extractTextFromMessagePart = (part: unknown): string => {
	if (!part || typeof part !== 'object') {
		return ''
	}
	const typedPart = part as Record<string, unknown>
	if (typedPart.type === 'text' && typeof typedPart.text === 'string') {
		return typedPart.text
	}
	if (typedPart.type === 'input_text' && typeof typedPart.text === 'string') {
		return typedPart.text
	}
	if (typeof typedPart.text === 'string') {
		return typedPart.text
	}
	return ''
}

const extractInputPartFromMessagePart = (part: unknown): AgentInputPart | null => {
	if (!part || typeof part !== 'object') {
		return null
	}
	const typedPart = part as Record<string, unknown>
	if (typedPart.type === 'text' && typeof typedPart.text === 'string') {
		return {
			type: 'text',
			text: typedPart.text,
		}
	}
	if (typedPart.type === 'input_text' && typeof typedPart.text === 'string') {
		return {
			type: 'text',
			text: typedPart.text,
		}
	}
	if (
		(typedPart.type === 'image' || typedPart.type === 'input_image') &&
		(typedPart.image instanceof URL ||
			typeof typedPart.image === 'string' ||
			typedPart.image instanceof Uint8Array ||
			typedPart.image instanceof ArrayBuffer)
	) {
		return {
			type: 'image',
			image: typedPart.image,
			mediaType: typeof typedPart.mediaType === 'string' ? typedPart.mediaType : undefined,
		}
	}
	if (
		typedPart.type === 'file' &&
		(typedPart.data instanceof URL ||
			typeof typedPart.data === 'string' ||
			typedPart.data instanceof Uint8Array ||
			typedPart.data instanceof ArrayBuffer) &&
		typeof typedPart.mediaType === 'string'
	) {
		return {
			type: 'file',
			data: typedPart.data,
			mediaType: typedPart.mediaType,
			filename: typeof typedPart.filename === 'string' ? typedPart.filename : undefined,
		}
	}
	return null
}

export const extractLatestUserMessageText = (
	payload: {
		message?: unknown
		messages?: unknown
	} & Record<string, unknown>,
): string => {
	if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
		return payload.message.trim()
	}
	const messages = Array.isArray(payload.messages) ? payload.messages : []
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index] as Record<string, unknown> | undefined
		if (!message || message.role !== 'user') {
			continue
		}
		if (typeof message.content === 'string' && message.content.trim().length > 0) {
			return message.content.trim()
		}
		if (Array.isArray(message.parts)) {
			const content = message.parts.map(extractTextFromMessagePart).join('').trim()
			if (content.length > 0) {
				return content
			}
		}
	}
	return ''
}

export const extractLatestUserMessageInputParts = (
	payload: {
		messages?: unknown
	} & Record<string, unknown>,
): AgentInputPart[] => {
	const messages = Array.isArray(payload.messages) ? payload.messages : []
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index] as Record<string, unknown> | undefined
		if (!message || message.role !== 'user' || !Array.isArray(message.parts)) {
			continue
		}
		const parts = message.parts
			.map(extractInputPartFromMessagePart)
			.filter((part): part is AgentInputPart => part !== null)
		if (parts.length > 0) {
			return parts
		}
	}
	return []
}

export { extractInputPartFromMessagePart, extractTextFromMessagePart }
