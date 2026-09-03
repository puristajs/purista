export function latestUserText(messages: ReadonlyArray<{ role: string; parts: unknown[] }>): string {
	for (let messageIndex = messages.length - 1; messageIndex >= 0; messageIndex -= 1) {
		const message = messages[messageIndex]
		if (message?.role !== 'user') continue
		for (let partIndex = message.parts.length - 1; partIndex >= 0; partIndex -= 1) {
			const part = message.parts[partIndex]
			if (part && typeof part === 'object' && 'type' in part && 'text' in part) {
				const candidate = part as { type?: unknown; text?: unknown }
				if (candidate.type === 'text' && typeof candidate.text === 'string' && candidate.text.trim()) {
					return candidate.text.trim()
				}
			}
		}
	}
	throw new TypeError('The chat request needs a user text message.')
}
