import { HandledError, StatusCode } from '@purista/core'
import type { AccountAccess } from './accountAccess.js'
import { requireIdentity } from './identity.js'
import type { AccountStatement, TransactionInput } from './transaction.js'

type GuardContext = {
	message: { tenantId?: string; principalId?: string }
	resources: { accountAccess: AccountAccess }
}

export async function requirePostingAccess(context: GuardContext, payload: TransactionInput) {
	context.resources.accountAccess.assertAllowed(requireIdentity(context.message), payload.accountId, 'record')
}

export async function requireReadableAccount(
	context: GuardContext,
	_payload: undefined,
	parameter: { accountId: TransactionInput['accountId'] },
) {
	context.resources.accountAccess.assertAllowed(requireIdentity(context.message), parameter.accountId, 'read')
}

/** An extra read-result check; it cannot undo a handler's mutations. */
export async function requireStatementScope(
	context: GuardContext,
	result: AccountStatement,
	_payload: undefined,
	parameter: { accountId: TransactionInput['accountId'] },
) {
	const identity = requireIdentity(context.message)
	if (
		result.tenantId !== identity.tenantId ||
		result.accountId !== parameter.accountId ||
		result.transactions.some(
			transaction => transaction.tenantId !== identity.tenantId || transaction.accountId !== parameter.accountId,
		)
	) {
		throw new HandledError(StatusCode.Forbidden, 'The statement contains data outside the permitted scope')
	}
}
