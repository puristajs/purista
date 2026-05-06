// @vitest-environment jsdom

import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getStoredTheme, THEME_KEY, uniqueEnvelopes } from './lib/app-state'

vi.mock('@xyflow/react', () => ({
	ReactFlow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	Background: () => <div />,
	Controls: () => <div />,
	MiniMap: () => <div />,
}))

vi.mock('streamdown', () => ({
	Streamdown: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

vi.mock('@ai-sdk/react', () => ({
	useChat: () => ({
		messages: [],
		status: 'ready',
		error: undefined,
		sendMessage: vi.fn(async () => undefined),
		setMessages: vi.fn(),
	}),
}))

vi.mock('ai', () => ({
	DefaultChatTransport: class DefaultChatTransport {},
}))

vi.mock('./components/ai-elements/conversation', () => ({
	Conversation: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ConversationContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ConversationEmptyState: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	ConversationScrollButton: () => <div />,
}))

beforeEach(() => {
	const storage = new Map<string, string>()
	Object.defineProperty(window, 'localStorage', {
		value: {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => {
				storage.set(key, value)
			},
			removeItem: (key: string) => {
				storage.delete(key)
			},
			clear: () => {
				storage.clear()
			},
		},
		configurable: true,
	})
})

describe('App helpers', () => {
	it('deduplicates envelopes by message id', () => {
		const initial = [
			{
				version: 'purista.ai/1.0',
				messageId: 'm1',
				timestamp: '2026-03-04T00:00:00.000Z',
				frame: { kind: 'message', content: 'hello' },
			},
		]
		const merged = uniqueEnvelopes(initial, [...initial])
		expect(merged).toHaveLength(1)
	})

	it('reads stored theme from local storage', () => {
		window.localStorage.setItem(THEME_KEY, 'light')
		expect(getStoredTheme()).toBe('light')
	})
})
