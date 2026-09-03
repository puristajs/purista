import { describe, expect, test } from 'vitest'
import { transactionToCsv } from '../../transactionCsv.js'

describe('transaction CSV output transform', () => {
	test('escapes CSV fields and includes only the explicit public columns', () => {
		const csv = transactionToCsv({
			accountId: 'account-operating',
			tenantId: 'tenant-example',
			transactionId: '3bd00f72-8db0-4f39-875d-fd5e251a7f32',
			amountCents: 2599,
			direction: 'debit',
			counterparty: 'Northwind "Books", Berlin',
			reference: 'Order, 1042',
			recordedAt: '2026-09-01T10:00:00.000Z',
		})

		expect(csv).toBe(
			'transactionId,accountId,recordedAt,direction,amountCents,counterparty,reference\n'
			+ '"3bd00f72-8db0-4f39-875d-fd5e251a7f32","account-operating","2026-09-01T10:00:00.000Z","debit",2599,"Northwind ""Books"", Berlin","Order, 1042"',
		)
		expect(csv).not.toContain('tenant-example')
		expect(csv.split('\n')).toHaveLength(2)
	})
})
