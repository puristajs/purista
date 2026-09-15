import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'

vi.mock('./KnowledgeChat.js', () => ({
	KnowledgeChat: () => <section aria-label="Knowledge chat" />,
}))

vi.mock('./KnowledgeSource.js', () => ({
	KnowledgeSource: () => <section aria-label="Knowledge source" />,
}))

afterEach(cleanup)

describe('App', () => {
	it('provides labeled controls and a responsive one-to-two-column layout', () => {
		const { container } = render(<App />)

		expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
		expect(screen.getByRole('main')).toHaveClass('max-w-6xl')
		expect(container.querySelector('.grid')).toHaveClass('grid', 'lg:grid-cols-[0.85fr_1.15fr]')
	})
})
