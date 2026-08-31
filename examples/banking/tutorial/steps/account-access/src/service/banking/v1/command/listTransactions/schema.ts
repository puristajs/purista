import { z } from 'zod'
import { accountIdSchema, accountStatementSchema } from '../../../../../transaction.js'

export const bankingV1ListTransactionsInputPayloadSchema = z.undefined()
export const bankingV1ListTransactionsInputParameterSchema = z.object({ accountId: accountIdSchema })
export const bankingV1ListTransactionsOutputPayloadSchema = accountStatementSchema
