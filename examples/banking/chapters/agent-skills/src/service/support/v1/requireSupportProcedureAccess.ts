import { HandledError, StatusCode } from '@purista/core'
import type { SupportProcedurePolicy } from './SupportProcedurePolicy.js'

export async function requireSupportProcedureAccess(
	policy: SupportProcedurePolicy,
	identity: Readonly<{ tenantId?: string; principalId?: string }>,
	caseId: string,
) {
	if (!identity.tenantId || !identity.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	if (
		!(await policy.canAnswer({
			tenantId: identity.tenantId,
			principalId: identity.principalId,
			caseId,
		}))
	) {
		throw new HandledError(StatusCode.Forbidden, 'This support procedure is not available')
	}
}

export function supportProcedureSessionId(
	identity: Readonly<{ tenantId?: string; principalId?: string }>,
	caseId: string,
) {
	if (!identity.tenantId || !identity.principalId) {
		throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
	}
	return `support-procedure:${identity.tenantId}:${identity.principalId}:${caseId}`
}
