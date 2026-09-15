import { afterEach, expect, test } from 'vitest'
import { SqliteTransactionAnalysisReader } from './SqliteTransactionAnalysisReader.js'

let reader: SqliteTransactionAnalysisReader | undefined
afterEach(async () => {
	await reader?.destroy()
	reader = undefined
})

test('allows only the seeded account owner and returns bounded rows', async () => {
	reader = new SqliteTransactionAnalysisReader(':memory:')
	const ownScope = {
		tenantId: 'tenant-example', principalId: 'principal-alex', accountId: 'account-operating',
	}
	expect(await reader.canReadAccount(ownScope)).toBe(true)
	expect(await reader.canReadAccount({ ...ownScope, principalId: 'principal-other' })).toBe(false)
	const rows = await reader.listRecent(ownScope, 2)
	expect(rows).toHaveLength(2)
	expect(rows[0]?.recordedAt >= rows[1]!.recordedAt).toBe(true)
})

test('honors an already cancelled read', async () => {
	reader = new SqliteTransactionAnalysisReader(':memory:')
	const controller = new AbortController()
	controller.abort()
	await expect(reader.listRecent({
		tenantId: 'tenant-example', principalId: 'principal-alex', accountId: 'account-operating',
	}, 2, controller.signal)).rejects.toMatchObject({ name: 'AbortError' })
})
