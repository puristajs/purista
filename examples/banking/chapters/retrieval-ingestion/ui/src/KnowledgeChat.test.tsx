import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { KnowledgeChat } from './KnowledgeChat'

const { addToolApprovalResponse, sendMessage, stop, transports, useChat } = vi.hoisted(() => ({
	addToolApprovalResponse: vi.fn(),
	sendMessage: vi.fn(),
	stop: vi.fn(),
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
	lastAssistantMessageIsCompleteWithApprovalResponses: vi.fn(),
}))
vi.mock('@/components/ai-elements/confirmation', () => ({
	Confirmation: ({ children }: PropsWithChildren) => <section>{children}</section>,
	ConfirmationAction: (properties: React.ComponentProps<'button'>) => <button {...properties} />,
	ConfirmationActions: ({ children }: PropsWithChildren) => <div>{children}</div>,
	ConfirmationRequest: ({ children }: PropsWithChildren) => <p>{children}</p>,
}))
vi.mock('@/components/ai-elements/sources', () => ({
	Source: ({ href, title }: { href?: string; title: string }) =>
		href ? <a href={href}>{title}</a> : <span>{title}</span>,
	Sources: ({ children }: PropsWithChildren) => <section aria-label="Retrieved sources">{children}</section>,
	SourcesContent: ({ children }: PropsWithChildren) => <div>{children}</div>,
	SourcesTrigger: ({ count }: { count: number }) => <button type="button">{count} sources</button>,
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
	PromptInputSubmit: ({
		onStop,
		status,
		...properties
	}: React.ComponentProps<'button'> & { onStop?: () => void; status: string }) => (
		<button
			aria-label={status === 'streaming' || status === 'submitted' ? 'Stop' : 'Submit'}
			onClick={status === 'streaming' || status === 'submitted' ? onStop : undefined}
			type={status === 'streaming' || status === 'submitted' ? 'button' : 'submit'}
			{...properties}
		/>
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
		addToolApprovalResponse.mockReset()
		sendMessage.mockReset()
		stop.mockReset()
		useChat.mockReset()
		transports.length = 0
		useChat.mockReturnValue({ addToolApprovalResponse, messages: [], sendMessage, status: 'ready', stop })
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
		expect(screen.getByRole('textbox', { name: 'Knowledge question' })).toBeInTheDocument()
	})

	it('renders standard retrieval tool status and streamed text parts', () => {
		useChat.mockReturnValue({
			addToolApprovalResponse,
			sendMessage,
			status: 'streaming',
			stop,
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

	it('renders retrieval citations, stream status, and standard source parts', () => {
		useChat.mockReturnValue({
			addToolApprovalResponse,
			sendMessage,
			status: 'streaming',
			stop,
			messages: [
				{
					id: 'assistant-1',
					role: 'assistant',
					parts: [
						{ type: 'data-status', id: 'status-1', data: { phase: 'tool-running' } },
						{
							type: 'source-document',
							sourceId: 'transfer-guide',
							mediaType: 'text/plain',
							title: 'International transfer timing',
						},
						{
							type: 'dynamic-tool',
							toolCallId: 'search-1',
							toolName: 'searchKnowledge',
							state: 'output-available',
							input: {},
							output: { matches: [{ documentId: 'transfer-guide', chunkIndex: 0 }] },
						},
					],
				},
			],
		})

		render(<KnowledgeChat sessionToken="session-123" />)

		expect(screen.getByText('Searching the authorized knowledge collection.')).toBeInTheDocument()
		expect(screen.getByText('International transfer timing')).toBeInTheDocument()
		expect(screen.getByText('[transfer-guide#0]')).toBeInTheDocument()
		expect(screen.queryByRole('link', { name: 'International transfer timing' })).not.toBeInTheDocument()
		expect(screen.queryByRole('link', { name: '[transfer-guide#0]' })).not.toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
		expect(stop).toHaveBeenCalledOnce()
	})

	it('accepts and rejects only manual tool approval requests', () => {
		useChat.mockReturnValue({
			addToolApprovalResponse,
			sendMessage,
			status: 'ready',
			stop,
			messages: [
				{
					id: 'assistant-1',
					role: 'assistant',
					parts: [
						{
							type: 'dynamic-tool',
							toolCallId: 'search-1',
							toolName: 'searchKnowledge',
							state: 'approval-requested',
							input: {},
							approval: { id: 'approval-1', requestReason: 'Search the customer-help collection?', isAutomatic: false },
						},
					],
				},
			],
		})

		render(<KnowledgeChat sessionToken="session-123" />)

		fireEvent.click(screen.getByRole('button', { name: 'Approve' }))
		expect(addToolApprovalResponse).toHaveBeenCalledWith({ id: 'approval-1', approved: true })
		fireEvent.click(screen.getByRole('button', { name: 'Reject' }))
		expect(addToolApprovalResponse).toHaveBeenCalledWith({ id: 'approval-1', approved: false })
	})

	it('shows automatic approval state without sending an approval response', () => {
		useChat.mockReturnValue({
			addToolApprovalResponse,
			sendMessage,
			status: 'ready',
			stop,
			messages: [
				{
					id: 'assistant-1',
					role: 'assistant',
					parts: [
						{
							type: 'dynamic-tool',
							toolCallId: 'search-1',
							toolName: 'searchKnowledge',
							state: 'approval-requested',
							input: {},
							approval: { id: 'approval-1', isAutomatic: true },
						},
					],
				},
			],
		})

		render(<KnowledgeChat sessionToken="session-123" />)

		expect(screen.getByText('searchKnowledge: approval-requested')).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Reject' })).not.toBeInTheDocument()
	})

	it('announces transport failures', () => {
		useChat.mockReturnValue({
			addToolApprovalResponse,
			error: new Error('The stream connection was lost.'),
			messages: [],
			sendMessage,
			status: 'error',
			stop,
		})

		render(<KnowledgeChat sessionToken="session-123" />)

		expect(screen.getByRole('alert')).toHaveTextContent('The stream connection was lost.')
	})
})
