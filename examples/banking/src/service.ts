import { HandledError, ServiceBuilder, type ServiceInfoType, StatusCode } from '@purista/core'
import { z } from 'zod'

import { BankingTutorialEvent, transactionRecordedEventSchema } from './advanced/contracts.js'
import {
	legacyBankImportRequestSchema,
	legacyBankTransactionSchema,
	type LegacyBankClient,
} from './legacy-bank.js'
import type { BankingRepository, RecordedTransaction, TransactionDirection } from './repository.js'

export const accountIdSchema = z.enum(['account-a', 'account-c'])
const transactionSchema = z.object({
	accountId: accountIdSchema,
	sourceTransactionId: z.string().min(1).max(80),
	bookedAt: z.string().datetime(),
	amountMinor: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	currency: z.literal('EUR'),
	direction: z.enum(['debit', 'credit']),
})
export const accountStatementSchema = z.object({
	accountId: accountIdSchema,
	transactions: z.array(transactionSchema.extend({ transactionId: z.string() })),
})
const emptyParameterSchema = z.object({})

const serviceInfo = {
	serviceName: 'banking',
	serviceVersion: '1',
	serviceDescription: 'Example Bank transaction operations',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo)
	.defineResource<'bankingRepository', BankingRepository>()
	.defineResource<'legacyBankClient', LegacyBankClient>()

const requireReadableAccount = async function (
	context: { message: { principalId?: string }; resources: { bankingRepository: BankingRepository } },
	payload: { accountId: RecordedTransaction['accountId'] },
) {
	if (!context.resources.bankingRepository.canRead(context.message.principalId, payload.accountId)) {
		throw new HandledError(StatusCode.Forbidden, 'You may not read this account')
	}
}

const requirePostingAccess = async function (
	context: { message: { principalId?: string }; resources: { bankingRepository: BankingRepository } },
	payload: { accountId: RecordedTransaction['accountId'] },
) {
	if (!context.resources.bankingRepository.canRecord(context.message.principalId, payload.accountId)) {
		throw new HandledError(StatusCode.Forbidden, 'You may not record transactions for this account')
	}
}

const listTransactions = builder
	.getCommandBuilder('listTransactions', 'Returns the caller-authorized transaction history for one account')
	.addPayloadSchema(z.undefined())
	.addParameterSchema(z.object({ accountId: accountIdSchema }))
	.addOutputSchema(accountStatementSchema)
	.exposeAsHttpEndpoint('GET', 'accounts/:accountId/transactions')
	.setBeforeGuardHooks({
		accountRead: async function (context, _payload, parameter) {
			await requireReadableAccount(context, { accountId: parameter.accountId })
		},
	})
	.setCommandFunction(async function (context, _payload, parameter) {
		return {
			accountId: parameter.accountId,
			transactions: context.resources.bankingRepository.list(parameter.accountId),
		}
	})

const recordTransaction = builder
	.getCommandBuilder('recordTransaction', 'Records an already-posted synthetic transaction')
	.addPayloadSchema(transactionSchema)
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(transactionSchema.extend({ transactionId: z.string() }))
	.canEmit(BankingTutorialEvent.transactionRecorded, transactionRecordedEventSchema)
	.exposeAsHttpEndpoint('POST', 'transactions')
	.setBeforeGuardHooks({ postingAccess: requirePostingAccess })
	.setCommandFunction(async function (context, payload) {
		const transaction = context.resources.bankingRepository.record(payload)
		await context.emit(BankingTutorialEvent.transactionRecorded, {
			transactionId: transaction.transactionId,
			accountId: transaction.accountId,
			amountMinor: transaction.amountMinor,
			currency: transaction.currency,
			direction: transaction.direction,
			bookedAt: transaction.bookedAt,
		})
		return transaction
	})

const importLegacyTransaction = builder
	.getCommandBuilder('importLegacyTransaction', 'Normalizes a documented legacy transaction representation')
	.addPayloadSchema(transactionSchema)
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(transactionSchema.extend({ transactionId: z.string() }))
	.setTransformInput(legacyBankTransactionSchema, emptyParameterSchema, async function (_context, payload, parameter) {
		const [whole, fraction] = payload.amount.split('.')
		const amountMinor = Number(whole) * 100 + Number(fraction)
		if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
			throw new HandledError(StatusCode.BadRequest, 'The legacy amount is outside the supported range')
		}
		return {
			payload: {
				accountId: payload.account_ref,
				sourceTransactionId: payload.source_id,
				bookedAt: payload.booked_at,
				amountMinor,
				currency: payload.currency,
				direction: (payload.dc === 'D' ? 'debit' : 'credit') satisfies TransactionDirection,
			},
			parameter,
		}
	})
	.canEmit(BankingTutorialEvent.transactionRecorded, transactionRecordedEventSchema)
	.exposeAsHttpEndpoint('POST', 'legacy/transactions')
	.setBeforeGuardHooks({ postingAccess: requirePostingAccess })
	.setCommandFunction(async function (context, payload) {
		const transaction = context.resources.bankingRepository.record(payload)
		await context.emit(BankingTutorialEvent.transactionRecorded, {
			transactionId: transaction.transactionId,
			accountId: transaction.accountId,
			amountMinor: transaction.amountMinor,
			currency: transaction.currency,
			direction: transaction.direction,
			bookedAt: transaction.bookedAt,
		})
		return transaction
	})

const importLegacyBankTransaction = builder
	.getCommandBuilder('importLegacyBankTransaction', 'Imports one booked transaction through the injected legacy-bank adapter')
	.addPayloadSchema(transactionSchema)
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(transactionSchema.extend({ transactionId: z.string() }))
	.setTransformInput(legacyBankImportRequestSchema, emptyParameterSchema, async function (context, payload, parameter) {
		const legacyTransaction = await context.resources.legacyBankClient.getBookedTransaction(payload.sourceId)
		const [whole, fraction] = legacyTransaction.amount.split('.')
		const amountMinor = Number(whole) * 100 + Number(fraction)
		if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
			throw new HandledError(StatusCode.BadRequest, 'The legacy amount is outside the supported range')
		}
		return {
			payload: {
				accountId: legacyTransaction.account_ref,
				sourceTransactionId: legacyTransaction.source_id,
				bookedAt: legacyTransaction.booked_at,
				amountMinor,
				currency: legacyTransaction.currency,
				direction: (legacyTransaction.dc === 'D' ? 'debit' : 'credit') satisfies TransactionDirection,
			},
			parameter,
		}
	})
	.canEmit(BankingTutorialEvent.transactionRecorded, transactionRecordedEventSchema)
	.exposeAsHttpEndpoint('POST', 'legacy-bank/imports')
	.setBeforeGuardHooks({ postingAccess: requirePostingAccess })
	.setCommandFunction(async function (context, payload) {
		const transaction = context.resources.bankingRepository.record(payload)
		await context.emit(BankingTutorialEvent.transactionRecorded, {
			transactionId: transaction.transactionId,
			accountId: transaction.accountId,
			amountMinor: transaction.amountMinor,
			currency: transaction.currency,
			direction: transaction.direction,
			bookedAt: transaction.bookedAt,
		})
		return transaction
	})

const exportStatement = builder
	.getCommandBuilder('exportStatement', 'Exports an authorized account statement as CSV')
	.addPayloadSchema(z.undefined())
	.addParameterSchema(z.object({ accountId: accountIdSchema }))
	.addOutputSchema(accountStatementSchema)
	.setAfterGuardHooks({
		statementScope: async function (_context, result, _payload, parameter) {
			if (
				result.accountId !== parameter.accountId ||
				result.transactions.some(transaction => transaction.accountId !== parameter.accountId)
			) {
				throw new HandledError(StatusCode.Forbidden, 'The statement contains data outside the authorized account')
			}
		},
	})
	.setTransformOutput(
		z.string(),
		async function (_context, result) {
			const rows = result.transactions.map(transaction =>
				[
					transaction.transactionId,
					transaction.bookedAt,
					transaction.amountMinor,
					transaction.currency,
					transaction.direction,
				].join(','),
			)
			return ['transactionId,bookedAt,amountMinor,currency,direction', ...rows].join('\n')
		},
		'text/csv',
	)
	.exposeAsHttpEndpoint('GET', 'accounts/:accountId/statement')
	.setBeforeGuardHooks({
		accountRead: async function (context, _payload, parameter) {
			await requireReadableAccount(context, { accountId: parameter.accountId })
		},
	})
	.setCommandFunction(async function (context, _payload, parameter) {
		return {
			accountId: parameter.accountId,
			transactions: context.resources.bankingRepository.list(parameter.accountId),
		}
	})

export const bankingService = builder.addCommandDefinition(
	listTransactions.getDefinition(),
	recordTransaction.getDefinition(),
	importLegacyTransaction.getDefinition(),
	importLegacyBankTransaction.getDefinition(),
	exportStatement.getDefinition(),
)
