import { initLogger } from '@purista/core'
import { cleanup, render, screen } from '@testing-library/react'
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
	await application.bankProfile.destroy()
	await application.eventBridge.destroy()
})

describe('Example Bank browser shell', () => {
	test('shows the loading state and then the real command result', async () => {
		vi.stubGlobal('fetch', (input: string | URL | Request) =>
			application.http.app.request(typeof input === 'string' ? input : input.toString()),
		)
		render(<App />)

		expect(screen.getByLabelText('Loading public profile')).toBeInTheDocument()
		expect(await screen.findByRole('heading', { name: 'Example Bank' })).toBeInTheDocument()
		expect(screen.getByText('EUR')).toBeInTheDocument()
		expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument()
	})

	test('shows a useful error when the command cannot be reached', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
		render(<App />)

		expect(await screen.findByRole('alert')).toHaveTextContent('The public profile is unavailable.')
	})
})
