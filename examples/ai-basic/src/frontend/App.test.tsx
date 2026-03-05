import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { App, getStoredTheme, THEME_KEY, uniqueEnvelopes } from './App'

vi.mock('@xyflow/react', () => ({
	ReactFlow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	Background: () => <div />,
	Controls: () => <div />,
	MiniMap: () => <div />,
}))

vi.mock('streamdown', () => ({
	Streamdown: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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

describe('App theme toggle', () => {
	it('persists theme changes', () => {
		render(<App />)
		const button = screen.getByRole('button', { name: /Theme:/i })
		fireEvent.click(button)
		expect(window.localStorage.getItem(THEME_KEY)).toBe('light')
	})
})
