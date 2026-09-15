import { initLogger } from '@purista/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { createApplication } from '../../src/application.js'
import { App } from './App'

let application: Awaited<ReturnType<typeof createApplication>>
beforeAll(async () => { application = await createApplication(initLogger('fatal')) })
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
afterAll(async () => {
	await application.http.prepareDestroy().destroy()
	await application.http.destroy()
	await application.transaction.destroy()
	await application.identity.destroy()
	await application.bankProfile.destroy()
	await application.identityStateStore.destroy()
	await application.transactionRepository.destroy()
	await application.eventBridge.destroy()
})

function useRealHttpBoundary() {
	const fetchMock = vi.fn((input: string | URL | Request, init?: RequestInit) =>
		application.http.app.request(typeof input === 'string' ? input : input.toString(), init))
	vi.stubGlobal('fetch', fetchMock)
	return fetchMock
}

async function logIn(username = 'alex@example.test') {
	fireEvent.change(screen.getByLabelText('Username'), { target: { value: username } })
	fireEvent.submit(screen.getByRole('form', { name: 'Local login' }))
	return screen.findByText(username.startsWith('alex') ? 'Alex Example' : 'Sam Example')
}

describe('Example Bank transform UI', () => {
	test('shows public data and asks for login before protected work', async () => {
		useRealHttpBoundary(); render(<App />)
		expect(await screen.findByRole('heading', { name: 'Example Bank' })).toBeInTheDocument()
		expect(screen.getByText('Log in to call protected commands.')).toBeInTheDocument()
	})

	test('sends exact plain text and displays the returned CSV', async () => {
		const fetchMock = useRealHttpBoundary(); render(<App />)
		await screen.findByRole('heading', { name: 'Example Bank' }); await logIn()
		fireEvent.submit(screen.getByRole('form', { name: 'Import legacy transaction' }))
		expect(await screen.findByText('Imported transaction for account-operating')).toBeInTheDocument()
		const importCall = fetchMock.mock.calls.find(call =>
			call[0] === '/api/v1/accounts/account-operating/transactions/import')
		expect(new Headers(importCall?.[1]?.headers).get('content-type')).toBe('text/plain; charset=utf-8')
		expect(importCall?.[1]?.body).toBe('debit|25.99|Northwind Books|Order 1042')

		fireEvent.click(screen.getByRole('button', { name: 'Export as CSV' }))
		const output = await screen.findByLabelText('CSV export')
		expect(output.textContent).toContain('transactionId,accountId,recordedAt,direction,amountCents,counterparty,reference')
		expect(output.textContent).not.toContain('tenant-example')
	})

	test('shows a business denial after a valid text transform', async () => {
		useRealHttpBoundary(); render(<App />)
		await screen.findByRole('heading', { name: 'Example Bank' }); await logIn('sam@example.test')
		fireEvent.submit(screen.getByRole('form', { name: 'Import legacy transaction' }))
		expect(await screen.findByText('You are signed in, but this account action is not allowed.')).toBeInTheDocument()
	})

	test('logs out through the protected command and clears local results', async () => {
		useRealHttpBoundary(); render(<App />)
		await screen.findByRole('heading', { name: 'Example Bank' }); await logIn()
		fireEvent.click(screen.getByRole('button', { name: 'Log out' }))
		expect(await screen.findByRole('form', { name: 'Local login' })).toBeInTheDocument()
		expect(screen.getByText('Log in to call protected commands.')).toBeInTheDocument()
	})
})
