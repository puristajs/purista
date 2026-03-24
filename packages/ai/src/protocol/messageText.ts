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

export { extractTextFromMessagePart }
