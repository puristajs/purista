import { reportingV1ServiceBuilder } from '../../reportingV1ServiceBuilder.js'
import {
	reportingV1GenerateStatementQueuePayloadSchema,
	reportingV1GenerateStatementQueueParameterSchema,
} from './schema.js'

export const generateStatementQueueBuilder = reportingV1ServiceBuilder
	.getQueueBuilder('generateStatement', 'Generate one transaction statement')
	.addPayloadSchema(reportingV1GenerateStatementQueuePayloadSchema)
	.addParameterSchema(reportingV1GenerateStatementQueueParameterSchema)
	.setLifecycleConfig({ maxAttempts: 3 })
	.setResultPolicy({ mode: 'state', delivery: 'required', ttlMs: 15 * 60 * 1000 })
	.setBeforeEnqueueTransform(async function (_context, payload, parameter) {
		const parsed = reportingV1GenerateStatementQueuePayloadSchema.parse(payload)
		return {
			payload: { ...parsed, accountId: parsed.accountId.trim() },
			parameter,
		}
	})
