import type { Transaction } from './transaction.js'

const quote = (value: string) => `"${value.replaceAll('"', '""')}"`

export function transactionToCsv(transaction: Transaction) {
	const header = 'transactionId,accountId,recordedAt,direction,amountCents,counterparty,reference'
	const row = [
		quote(transaction.transactionId),
		quote(transaction.accountId),
		quote(transaction.recordedAt),
		quote(transaction.direction),
		String(transaction.amountCents),
		quote(transaction.counterparty),
		quote(transaction.reference ?? ''),
	].join(',')
	return `${header}\n${row}`
}
