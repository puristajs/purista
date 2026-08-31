import { HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'
import type { AccountStatement } from './transaction.js'

export const maximumCsvRows = 1000
export const maximumCsvBytes = 512 * 1024
export const statementCsvSchema = z.string().max(maximumCsvBytes)

/** Quote text cells and keep formula-like values as spreadsheet text. */
function csvCell(value: string | number): string {
	if (typeof value === 'number') return String(value)
	const unsafePrefix = /^[\s\uFEFF]*[=+\-@]/u.test(value) || /^[\t\r\n]/u.test(value)
	const text = unsafePrefix ? "'" + value : value
	return '"' + text.replaceAll('"', '""') + '"'
}

/** Serialize already-authorized data; never query, authorize, or mutate here. */
export function toStatementCsv(statement: AccountStatement): string {
	if (statement.transactions.length > maximumCsvRows) {
		throw new HandledError(StatusCode.PayloadTooLarge, 'This statement is too large for the synchronous CSV export')
	}
	const header = 'transactionId,sourceTransactionId,bookedAt,amountMinor,currency,direction'
	const rows = statement.transactions.map(row =>
		[row.transactionId, row.sourceTransactionId, row.bookedAt, row.amountMinor, row.currency, row.direction]
			.map(csvCell)
			.join(','),
	)
	const csv = [header, ...rows].join('\r\n') + '\r\n'
	if (Buffer.byteLength(csv, 'utf8') > maximumCsvBytes) {
		throw new HandledError(StatusCode.PayloadTooLarge, 'This statement exceeds the CSV byte limit')
	}
	return csv
}
