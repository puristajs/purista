import { HandledError, StatusCode } from '@purista/core'
import type { Identity } from './identity.js'
import { type LegacyTransaction, legacyTransactionSchema } from './legacyTransaction.js'
import type { TransactionInput } from './transaction.js'

export type LegacyBankClient = {
	getBookedTransaction(
		identity: Identity,
		accountId: TransactionInput['accountId'],
		sourceId: string,
	): Promise<LegacyTransaction>
}

const mockCredentials = new Map([
	['tenant-north', 'mock-north'],
	['tenant-south', 'mock-south'],
])
const maximumResponseBytes = 16 * 1024

/** Read a bounded response instead of buffering an arbitrary upstream body. */
async function readJson(response: Response): Promise<unknown> {
	if (!response.body) throw new Error('Missing upstream body')
	const reader = response.body.getReader()
	const decoder = new TextDecoder('utf-8', { fatal: true })
	let bytes = 0
	let text = ''
	try {
		while (true) {
			const chunk = await reader.read()
			if (chunk.done) break
			bytes += chunk.value.byteLength
			if (bytes > maximumResponseBytes) {
				await reader.cancel()
				throw new Error('Upstream body exceeds the limit')
			}
			text += decoder.decode(chunk.value, { stream: true })
		}
		return JSON.parse(text + decoder.decode())
	} finally {
		reader.releaseLock()
	}
}

/** Local tutorial adapter. The application configures the host and source credentials. */
export class LegacyBankHttpClient implements LegacyBankClient {
	constructor(
		private readonly baseUrl = process.env.LEGACY_BANK_URL ?? 'http://127.0.0.1:4010',
		private readonly timeoutMs = 1000,
	) {}

	async getBookedTransaction(identity: Identity, accountId: TransactionInput['accountId'], sourceId: string) {
		const credential = mockCredentials.get(identity.tenantId)
		if (!credential) throw new HandledError(StatusCode.Forbidden, 'No legacy source is configured for this tenant')
		const url = new URL('/transactions/' + encodeURIComponent(sourceId), this.baseUrl)
		url.searchParams.set('accountId', accountId)
		const signal = AbortSignal.timeout(this.timeoutMs)
		try {
			const response = await fetch(url, {
				signal,
				redirect: 'error',
				headers: {
					accept: 'application/json',
					authorization: 'Bearer ' + credential,
					'x-example-principal': identity.principalId,
				},
			})
			if (!response.ok) {
				await response.body?.cancel()
				throw new HandledError(
					response.status === 404 ? StatusCode.NotFound : StatusCode.BadGateway,
					'The legacy bank could not provide this transaction',
				)
			}
			const parsed = legacyTransactionSchema.safeParse(await readJson(response))
			if (!parsed.success || parsed.data.account_ref !== accountId || parsed.data.source_id !== sourceId) {
				throw new HandledError(StatusCode.BadGateway, 'The legacy bank returned an invalid transaction')
			}
			return parsed.data
		} catch (error) {
			if (error instanceof HandledError) throw error
			throw new HandledError(
				signal.aborted ? StatusCode.GatewayTimeout : StatusCode.BadGateway,
				'The legacy bank request failed',
			)
		}
	}
}
