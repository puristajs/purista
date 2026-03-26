import { describe, expect, it } from 'vitest'

import type { ConversationHistory } from './historyHelpers.js'
import { appendMessage, attachmentToConversationPart, summarizeHistory, trimHistory } from './historyHelpers.js'

describe('history helpers', () => {
	it('appends and trims history', () => {
		let history: ConversationHistory = []
		history = appendMessage(history, { role: 'user', content: 'Hi', timestamp: Date.now() })
		history = appendMessage(history, { role: 'assistant', content: 'Hello', timestamp: Date.now() })
		const trimmed = trimHistory(history, 1)
		expect(trimmed).toHaveLength(1)
		expect(summarizeHistory(history)).toContain('user')
	})

	it('summarizes structured parts when plain content is empty', () => {
		const history: ConversationHistory = [
			{
				role: 'user',
				content: '',
				parts: [
					{
						type: 'text',
						text: 'Please inspect the uploaded file.',
					},
					attachmentToConversationPart({
						attachmentId: 'img-1',
						mediaType: 'image/png',
						filename: 'mockup.png',
						source: {
							kind: 'url',
							url: 'https://example.com/mockup.png',
						},
					}),
				],
				timestamp: Date.now(),
			},
		]

		expect(summarizeHistory(history)).toContain('Please inspect the uploaded file.')
		expect(summarizeHistory(history)).toContain('[attachment:image/png mockup.png]')
	})
})
