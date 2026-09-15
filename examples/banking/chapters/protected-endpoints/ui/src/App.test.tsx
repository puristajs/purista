import { initLogger } from '@purista/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { createApplication } from '../../src/application.js'
import { App } from './App'

let application: Awaited<ReturnType<typeof createApplication>>

beforeAll(async () => {
	application = await createApplication(initLogger('fatal'))
})

afterEach(() => {
	cleanup()
	vi.unstubAllGlobals()
})

afterAll(async () => {
	await application.http.prepareDestroy().destroy()
	await application.http.destroy()
	await application.transaction.destroy()
	await application.bankProfile.destroy()
	await application.transactionRepository.destroy()
	await application.eventBridge.destroy()
})

function useRealHttpBoundary() {
	const fetchMock = vi.fn((input: string | URL | Request, init?: RequestInit) =>
		application.http.app.request(typeof input === 'string' ? input : input.toString(), init),
	)
	vi.stubGlobal('fetch', fetchMock)
	return fetchMock
}

async function fillTransactionForm(apiKey = 'demo-bank-key', amountCents = '2599') {
	fireEvent.change(screen.getByLabelText('Demo API key'), { target: { value: apiKey } })
	fireEvent.change(screen.getByLabelText('Amount in cents'), { target: { value: amountCents } })
	fireEvent.change(screen.getByLabelText('Counterparty'), { target: { value: 'Northwind Books' } })
	fireEvent.submit(screen.getByRole('form', { name: 'Record transaction' }))
}

describe('Example Bank browser shell', () => {
	test('shows the public profile without a credential', async () => {
		useRealHttpBoundary()
		render(<App />)

		expect(screen.getByLabelText('Loading public profile')).toBeInTheDocument()
		expect(await screen.findByRole('heading', { name: 'Example Bank' })).toBeInTheDocument()
		expect(screen.getByText('EUR')).toBeInTheDocument()
	})

	test('requires a key before calling the protected command', async () => {
		const fetchMock = useRealHttpBoundary()
		render(<App />)
		await screen.findByRole('heading', { name: 'Example Bank' })

		await fillTransactionForm('')

		expect(await screen.findByRole('alert')).toHaveTextContent('Enter the demo API key')
		expect(fetchMock.mock.calls.some(call => call[0] === '/api/v1/transactions')).toBe(false)
	})

	test('records with Authorization and sends no caller identity headers', async () => {
		const fetchMock = useRealHttpBoundary()
		render(<App />)
		await screen.findByRole('heading', { name: 'Example Bank' })

		await fillTransactionForm()

		expect(await screen.findByText('Recorded transaction')).toBeInTheDocument()
		expect(screen.getByText('2599 cents')).toBeInTheDocument()
		const request = fetchMock.mock.calls.find(call => call[0] === '/api/v1/transactions')
		const headers = new Headers(request?.[1]?.headers)
		expect(headers.get('authorization')).toBe('Bearer demo-bank-key')
		expect(headers.get('x-principal-id')).toBeNull()
		expect(headers.get('x-tenant-id')).toBeNull()
	})

	test('shows the authentication problem for an invalid key', async () => {
		useRealHttpBoundary()
		render(<App />)
		await screen.findByRole('heading', { name: 'Example Bank' })

		await fillTransactionForm('wrong-key')

		expect(await screen.findByRole('alert')).toHaveTextContent('A valid demo API key is required')
	})

	test('shows command validation problems after authentication', async () => {
		useRealHttpBoundary()
		render(<App />)
		await screen.findByRole('heading', { name: 'Example Bank' })

		await fillTransactionForm('demo-bank-key', '0')

		expect(await screen.findByRole('alert')).toBeInTheDocument()
	})

	test('shows a useful error when the profile command cannot be reached', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
		render(<App />)
		expect(await screen.findByRole('alert')).toHaveTextContent('The public profile is unavailable.')
	})
})
