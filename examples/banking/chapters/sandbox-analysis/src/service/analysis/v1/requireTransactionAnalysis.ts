import { createHash } from 'node:crypto'
import { HandledError, StatusCode } from '@purista/core'
import type { AnalysisPolicy } from './AnalysisResources.js'

export async function requireTransactionAnalysis(
	policy: AnalysisPolicy,
	input: Readonly<{ tenantId?: string; principalId?: string; analysisId: string }>,
) {
	if (!input.tenantId || !input.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	if (
		!(await policy.canRun({
			tenantId: input.tenantId,
			principalId: input.principalId,
			analysisId: input.analysisId,
		}))
	) {
		throw new HandledError(StatusCode.Forbidden, 'Transaction analysis is not allowed')
	}
}

export function transactionAnalysisSessionId(
	identity: Readonly<{ tenantId?: string; principalId?: string }>,
	analysisId: string,
) {
	if (!identity.tenantId || !identity.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	const digest = createHash('sha256')
		.update(`${identity.tenantId}:${identity.principalId}:${analysisId}:transaction-analysis-v1`)
		.digest('hex')
	return `transaction-analysis:${digest}`
}
