import { HandledError, StatusCode } from '@purista/core'
import type { CreateTransaction } from './transaction.js'

const asciiField = /^[\x20-\x7e]+$/
const decimalEuros = /^([0-9]+)\.([0-9]{2})$/

function invalidRecord(): never {
	throw new HandledError(StatusCode.BadRequest, 'Legacy transaction record is invalid')
}

export function parseLegacyTransaction(record: string): CreateTransaction {
	const parts = record.split('|')
	if (parts.length < 3 || parts.length > 4) return invalidRecord()
	const [direction, amount, counterparty, reference] = parts
	if (direction !== 'credit' && direction !== 'debit') return invalidRecord()
	if (!counterparty || !asciiField.test(counterparty)) return invalidRecord()
	if (reference !== undefined && (!reference || !asciiField.test(reference))) return invalidRecord()

	const match = amount?.match(decimalEuros)
	if (!match) return invalidRecord()
	const amountCents = BigInt(match[1]) * 100n + BigInt(match[2])
	if (amountCents < 1n || amountCents > BigInt(Number.MAX_SAFE_INTEGER)) return invalidRecord()

	return {
		amountCents: Number(amountCents),
		direction,
		counterparty,
		...(reference === undefined ? {} : { reference }),
	}
}
