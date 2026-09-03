import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { KnowledgeChat } from './KnowledgeChat'

const { sendMessage, transports, useChat } = vi.hoisted(() => ({
	sendMessage: vi.fn(),
	transports: [] as Array<Record<string, unknown>>,
	useChat: vi.fn(),
}))

vi.mock('@ai-sdk/react', () => ({ useChat }))
vi.mock('ai', () => ({
	DefaultChatTransport: class {
		constructor(options: Record<string, unknown>) {
			transports.push(options)
		}
	},
}))
vi.mock('@/components/ai-elements/conversation', () => ({
	Conversation: ({ children }: PropsWithChildren) => <div>{children}</div>,
	ConversationContent: ({ children }: PropsWithChildren) => <div>{children}</div>,
	ConversationEmptyState: ({ title, description }: { title: string; description: string }) => (
		<div>
			<strong>{title}</strong>
			<span>{description}</span>
		</div>
	),
	ConversationScrollButton: () => null,
}))
vi.mock('@/components/ai-elements/message', () => ({
	Message: ({ children }: PropsWithChildren) => <article>{children}</article>,
	MessageContent: ({ children }: PropsWithChildren) => <div>{children}</div>,
	MessageResponse: ({ children }: PropsWithChildren) => <p>{children}</p>,
}))
vi.mock('@/components/ai-elements/prompt-input', () => ({
	PromptInput: ({ children, onSubmit }: PropsWithChildren<{ onSubmit: (message: { text: string }) => void }>) => (
		<form
			onSubmit={(event) => {
				event.preventDefault()
				const form = new FormData(event.currentTarget)
				onSubmit({ text: String(form.get('message') ?? '') })
			}}
		>
			{children}
		</form>
	),
	PromptInputTextarea: (properties: React.ComponentProps<'textarea'>) => <textarea name="message" {...properties} />,
	PromptInputSubmit: ({ status: _status, ...properties }: React.ComponentProps<'button'> & { status: string }) => (
		<button type="submit" {...properties} />
	),
}))
vi.mock('@/components/ai-elements/tool', () => ({
	Tool: ({ children }: PropsWithChildren) => <aside>{children}</aside>,
	ToolHeader: ({ toolName, state }: { toolName: string; state: string }) => (
		<p>
			{toolName}: {state}
		</p>
	),
	ToolContent: ({ children }: PropsWithChildren) => <div>{children}</div>,
	ToolInput: ({ input }: { input: unknown }) => <pre>{JSON.stringify(input)}</pre>,
	ToolOutput: ({ output }: { output: unknown }) => <pre>{JSON.stringify(output)}</pre>,
}))

afterEach(cleanup)

describe('KnowledgeChat', () => {
	beforeEach(() => {
		sendMessage.mockReset()
		useChat.mockReset()
		transports.length = 0
		useChat.mockReturnValue({ messages: [], sendMessage, status: 'ready' })
	})

	it('uses the standard endpoint and sends the session identity in the transport', () => {
		render(<KnowledgeChat sessionToken="session-123" />)

		expect(transports).toEqual([
			{
				api: '/api/v1/knowledge/chat',
				headers: { authorization: 'Bearer session-123' },
				body: { collectionId: 'customer-help' },
			},
		])
		expect(screen.getByText('Ask Example Bank')).toBeInTheDocument()
	})

	it('prevents anonymous submission and submits a signed-in question', () => {
		const { rerender } = render(<KnowledgeChat sessionToken="" />)
		const anonymousInput = screen.getByRole('textbox')
		fireEvent.change(anonymousInput, { target: { value: 'How long can a transfer stay pending?' } })
		expect(screen.getByRole('button')).toBeDisabled()

		rerender(<KnowledgeChat sessionToken="session-123" />)
		fireEvent.submit(screen.getByRole('button').closest('form') as HTMLFormElement)

		expect(sendMessage).toHaveBeenCalledWith({ text: 'How long can a transfer stay pending?' })
	})

	it('renders standard retrieval tool status and streamed text parts', () => {
		useChat.mockReturnValue({
			sendMessage,
			status: 'streaming',
			messages: [
				{
					id: 'assistant-1',
					role: 'assistant',
					parts: [
						{
							type: 'dynamic-tool',
							toolCallId: 'search-1',
							toolName: 'search_knowledge',
							state: 'output-available',
							input: { query: 'transfer timing' },
							output: { matches: 1 },
						},
						{ type: 'text', text: 'Up to two business days.' },
					],
				},
			],
		})

		render(<KnowledgeChat sessionToken="session-123" />)

		expect(screen.getByText('search_knowledge: output-available')).toBeInTheDocument()
		expect(screen.getByText('Up to two business days.')).toBeInTheDocument()
		expect(screen.getByText('The answer is streaming.')).toBeInTheDocument()
	})
})
