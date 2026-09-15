import { describe, expect, test } from 'vitest'
import { createTransactionSchema, transactionSchema } from './transaction.js'

const validInput = {
	amountCents: 2599,
	direction: 'debit' as const,
	counterparty: 'Northwind Books',
	reference: 'Order 1042',
}

describe('transaction schemas', () => {
	test('accepts caller-owned transaction input', () => {
		expect(createTransactionSchema.parse(validInput)).toEqual(validInput)
	})

	test('rejects invalid cents and server-owned fields', () => {
		expect(createTransactionSchema.safeParse({ ...validInput, amountCents: 0 }).success).toBe(false)
		expect(createTransactionSchema.safeParse({ ...validInput, transactionId: crypto.randomUUID() }).success).toBe(false)
	})

	test('requires server-owned fields in a stored transaction', () => {
		expect(transactionSchema.safeParse(validInput).success).toBe(false)
	})
})
