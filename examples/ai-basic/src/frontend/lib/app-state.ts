import type { AgentProtocolEnvelope } from './types'

export type Theme = 'dark' | 'light'

export const THEME_KEY = 'purista.ai.theme'

export const getStoredTheme = (): Theme => {
	if (typeof window === 'undefined') {
		return 'light'
	}
	const stored = window.localStorage.getItem(THEME_KEY)
	return stored === 'dark' ? 'dark' : 'light'
}

export const uniqueEnvelopes = (
	previous: AgentProtocolEnvelope[],
	incoming: AgentProtocolEnvelope[],
): AgentProtocolEnvelope[] => {
	const known = new Set(previous.map(item => item.messageId))
	const result = [...previous]
	for (const envelope of incoming) {
		if (known.has(envelope.messageId)) {
			continue
		}
		known.add(envelope.messageId)
		result.push(envelope)
	}
	return result
}
