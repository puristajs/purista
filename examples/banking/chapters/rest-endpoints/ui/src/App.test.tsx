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
	await application.eventBridge.destroy()
})

function useRealHttpBoundary() {
	vi.stubGlobal('fetch', (input: string | URL | Request, init?: RequestInit) =>
		application.http.app.request(typeof input === 'string' ? input : input.toString(), init),
	)
}

describe('Example Bank browser shell', () => {
	test('shows the real profile command result', async () => {
		useRealHttpBoundary()
		render(<App />)

		expect(screen.getByLabelText('Loading public profile')).toBeInTheDocument()
		expect(await screen.findByRole('heading', { name: 'Example Bank' })).toBeInTheDocument()
		expect(screen.getByText('EUR')).toBeInTheDocument()
	})

	test('records a transaction through the generated command endpoint', async () => {
		useRealHttpBoundary()
		render(<App />)
		await screen.findByRole('heading', { name: 'Example Bank' })

		fireEvent.change(screen.getByLabelText('Amount in cents'), { target: { value: '2599' } })
		fireEvent.change(screen.getByLabelText('Counterparty'), { target: { value: 'Northwind Books' } })
		fireEvent.submit(screen.getByRole('form', { name: 'Record transaction' }))

		expect(await screen.findByText('Recorded transaction')).toBeInTheDocument()
		expect(screen.getByText('2599 cents')).toBeInTheDocument()
	})

	test('shows Problem Details returned for invalid command input', async () => {
		useRealHttpBoundary()
		render(<App />)
		await screen.findByRole('heading', { name: 'Example Bank' })

		fireEvent.change(screen.getByLabelText('Amount in cents'), { target: { value: '0' } })
		fireEvent.change(screen.getByLabelText('Counterparty'), { target: { value: 'Northwind Books' } })
		fireEvent.submit(screen.getByRole('form', { name: 'Record transaction' }))

		expect(await screen.findByRole('alert')).toBeInTheDocument()
	})

	test('shows a useful error when the profile command cannot be reached', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
		render(<App />)
		expect(await screen.findByRole('alert')).toHaveTextContent('The public profile is unavailable.')
	})
})
