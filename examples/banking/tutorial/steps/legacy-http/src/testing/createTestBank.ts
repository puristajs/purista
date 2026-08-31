import { DefaultEventBridge, initLogger } from '@purista/core'
import { AccountAccess } from '../accountAccess.js'
import { createHttpService } from '../httpApp.js'
import type { FixtureActor } from '../identity.js'
import { type LegacyBankClient, LegacyBankHttpClient } from '../legacyBank.js'
import type { LocalSessions } from '../localSessions.js'
import { bankingV1Service } from '../service/banking/v1/bankingV1Service.js'
import { TransactionRepository } from '../transactionRepository.js'

/** Inject only the boundary a test needs to change; keep the real Framework runtime. */
export async function createTestBank(
	options: {
		access?: AccountAccess
		transactions?: TransactionRepository
		sessions?: LocalSessions
		legacyBank?: LegacyBankClient
	} = {},
) {
	const logger = initLogger('error', { enabled: false })
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const access = options.access ?? new AccountAccess()
	const transactions = options.transactions ?? new TransactionRepository(access)
	const banking = await bankingV1Service.getInstance(eventBridge, {
		logger,
		resources: { accountAccess: access, transactions, legacyBank: options.legacyBank ?? new LegacyBankHttpClient() },
	})
	await banking.start()
	const http = await createHttpService({
		eventBridge,
		logger,
		services: [banking],
		sessions: options.sessions,
	})
	const request = (path: string, init?: RequestInit) => http.app.request(path, init)
	// Exercise the service runtime before returning an authentication-only fixture.
	const ready = await request('/api/v1/bank')
	if (ready.status !== 200) throw new Error('Banking service is not ready')

	return {
		request,
		access,
		transactions,
		eventBridge,
		async login(actor: FixtureActor) {
			const response = await request('/auth/login', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ actor }),
			})
			const cookie = response.headers.get('set-cookie')?.split(';', 1)[0]
			if (response.status !== 200 || !cookie) throw new Error('Fixture login failed')
			return {
				cookie,
				request(path: string, init?: RequestInit) {
					const headers = new Headers(init?.headers)
					headers.set('cookie', cookie)
					return request(path, { ...init, headers })
				},
			}
		},
		async destroy() {
			await http.destroy()
			await banking.destroy()
			await eventBridge.destroy()
		},
	}
}
