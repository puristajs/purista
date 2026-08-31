import { z } from 'zod'
import { accountIdSchema, accountStatementSchema } from '../../../../../transaction.js'

export const bankingV1ExportStatementInputPayloadSchema = z.undefined()
export const bankingV1ExportStatementInputParameterSchema = z.object({ accountId: accountIdSchema })
export const bankingV1ExportStatementOutputPayloadSchema = accountStatementSchema
