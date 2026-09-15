import { HandledError, StatusCode } from '@purista/core'
import { reportingJobRecordSchema, reportingJobStateKey } from '../../reportingJobState.js'
import { reportingV1ServiceBuilder } from '../../reportingV1ServiceBuilder.js'
import { generatedStatementSchema } from '../../statement.js'
import {
	reportingV1GetStatementStatusInputParameterSchema,
	reportingV1GetStatementStatusInputPayloadSchema,
	reportingV1GetStatementStatusOutputPayloadSchema,
} from './schema.js'

async function readJob(context: { states: { getState(...names: string[]): Promise<Record<string, unknown>> } }, jobId: string) {
	const key = reportingJobStateKey(jobId)
	const values = await context.states.getState(key)
	const parsed = reportingJobRecordSchema.safeParse(values[key])
	if (!parsed.success) throw new HandledError(StatusCode.NotFound, 'Statement job not found')
	return parsed.data
}

export const getStatementStatusCommandBuilder = reportingV1ServiceBuilder
	.getCommandBuilder('getStatementStatus', 'Read one statement job result')
	.addPayloadSchema(reportingV1GetStatementStatusInputPayloadSchema)
	.addParameterSchema(reportingV1GetStatementStatusInputParameterSchema)
	.addOutputSchema(reportingV1GetStatementStatusOutputPayloadSchema)
	.exposeAsHttpEndpoint('GET', 'reports/statements/:jobId')
	.setBeforeGuardHooks({
		jobOwner: async function (context, _payload, parameter) {
			const record = await readJob(context, parameter.jobId)
			if (record.tenantId !== context.message.tenantId || record.principalId !== context.message.principalId) {
				throw new HandledError(StatusCode.Forbidden, 'This statement job belongs to another user')
			}
		},
	})
	.setCommandFunction(async function (context, _payload, parameter) {
		const record = await readJob(context, parameter.jobId)
		return {
			jobId: record.jobId,
			status: record.status,
			statement: record.status === 'success' ? generatedStatementSchema.parse(record.result) : undefined,
		}
	})
