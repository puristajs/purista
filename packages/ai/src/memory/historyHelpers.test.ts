import { describe, expect, it } from 'vitest'

import type { ConversationHistory } from './historyHelpers.js'
import { appendMessage, summarizeHistory, trimHistory } from './historyHelpers.js'

describe('history helpers', () => {
	it('appends and trims history', () => {
		let history: ConversationHistory = []
		history = appendMessage(history, { role: 'user', content: 'Hi', timestamp: Date.now() })
		history = appendMessage(history, { role: 'assistant', content: 'Hello', timestamp: Date.now() })
		const trimmed = trimHistory(history, 1)
		expect(trimmed).toHaveLength(1)
		expect(summarizeHistory(history)).toContain('user')
	})
})
