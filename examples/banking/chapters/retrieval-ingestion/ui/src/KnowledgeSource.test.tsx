import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { KnowledgeSource } from './KnowledgeSource'

afterEach(() => {
	cleanup()
	vi.unstubAllGlobals()
})

describe('KnowledgeSource', () => {
	it('calls the protected ingestion command before enabling retrieval', async () => {
		const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ chunkCount: 1 }), { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)
		const onIngested = vi.fn()
		render(<KnowledgeSource sessionToken="session-123" onIngested={onIngested} />)

		fireEvent.submit(screen.getByRole('button', { name: 'Ingest source' }).closest('form') as HTMLFormElement)

		await waitFor(() => expect(onIngested).toHaveBeenCalledOnce())
		expect(fetchMock).toHaveBeenCalledWith(
			'/api/v1/knowledge/documents',
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({ authorization: 'Bearer session-123' }),
			}),
		)
		expect(screen.getByText('The source is ready for retrieval.')).toBeInTheDocument()
	})
})
