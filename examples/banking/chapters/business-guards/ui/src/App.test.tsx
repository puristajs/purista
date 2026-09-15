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

async function fillTransaction() {
	fireEvent.change(screen.getByLabelText('Amount in cents'), { target: { value: '2599' } })
	fireEvent.change(screen.getByLabelText('Counterparty'), { target: { value: 'Northwind Books' } })
	fireEvent.submit(screen.getByRole('form', { name: 'Record transaction' }))
}

describe('Example Bank guarded UI', () => {
	test('shows public data and asks for login before protected work', async () => {
		useRealHttpBoundary(); render(<App />)
		expect(await screen.findByRole('heading', { name: 'Example Bank' })).toBeInTheDocument()
		expect(screen.getByText('Log in to call protected commands.')).toBeInTheDocument()
	})

	test('uses the public login and protected current-session commands', async () => {
		const fetchMock = useRealHttpBoundary(); render(<App />); await screen.findByRole('heading', { name: 'Example Bank' })
		await logIn()
		expect(screen.getByText('Signed in for tenant-example')).toBeInTheDocument()
		const currentCall = fetchMock.mock.calls.find(call => call[0] === '/api/v1/session' && !call[1]?.method)
		expect(new Headers(currentCall?.[1]?.headers).get('authorization')).toMatch(/^Bearer [0-9a-f-]{36}$/)
	})

	test('calls the guarded account route with the opaque token', async () => {
		const fetchMock = useRealHttpBoundary(); render(<App />); await screen.findByRole('heading', { name: 'Example Bank' }); await logIn()
		await fillTransaction()
		expect(await screen.findByText('Recorded transaction for account-operating')).toBeInTheDocument()
		const request = fetchMock.mock.calls.find(call => call[0] === '/api/v1/accounts/account-operating/transactions')
		expect(new Headers(request?.[1]?.headers).get('authorization')).toMatch(/^Bearer [0-9a-f-]{36}$/)
		expect(new Headers(request?.[1]?.headers).get('x-principal-id')).toBeNull()
	})

	test('shows a business denial for an authenticated principal', async () => {
		useRealHttpBoundary(); render(<App />); await screen.findByRole('heading', { name: 'Example Bank' }); await logIn('sam@example.test')
		await fillTransaction()
		expect(await screen.findByText('You are signed in, but this account action is not allowed.')).toBeInTheDocument()
	})

	test('logs out through the protected command and clears the UI session', async () => {
		useRealHttpBoundary(); render(<App />); await screen.findByRole('heading', { name: 'Example Bank' }); await logIn()
		fireEvent.click(screen.getByRole('button', { name: 'Log out' }))
		expect(await screen.findByRole('form', { name: 'Local login' })).toBeInTheDocument()
		expect(screen.getByText('Log in to call protected commands.')).toBeInTheDocument()
	})
})
