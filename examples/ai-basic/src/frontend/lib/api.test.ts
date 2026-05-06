import { afterEach, describe, expect, it, vi } from 'vitest'

import { getMcpTools, loadConversationHistory, loadRecentConversationHistory, toApiUrl } from './api'

describe('getMcpTools', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('calls the MCP tool descriptor endpoint', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			json: async () => ({ tools: [] }),
		} as Response)
		await getMcpTools()
		expect(fetchMock).toHaveBeenCalledWith(toApiUrl('/api/v1/desk/mcp/tools'), {
			method: 'GET',
			headers: { accept: 'application/json' },
		})
	})

	it('calls the conversation history endpoint', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			json: async () => ({ found: true, messages: [] }),
		} as Response)
		await loadConversationHistory({ sessionId: 's1', scenario: 'chat' })
		expect(fetchMock).toHaveBeenCalledWith(toApiUrl('/api/v1/desk/history/load'), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ sessionId: 's1', scenario: 'chat' }),
		})
	})

	it('calls the recent conversation history endpoint', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			json: async () => ({ items: [] }),
		} as Response)
		await loadRecentConversationHistory(12)
		expect(fetchMock).toHaveBeenCalledWith(toApiUrl('/api/v1/desk/history/recent'), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ limit: 12 }),
		})
	})
})
