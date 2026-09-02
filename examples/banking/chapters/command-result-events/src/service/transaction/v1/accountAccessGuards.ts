import { HandledError, StatusCode } from '@purista/core'
import type { AccountAccessPolicy, AccountAccessRequest } from './AccountAccessPolicy.js'

export function requireAccountAction(policy: AccountAccessPolicy, request: AccountAccessRequest) {
	if (policy.isAllowed(request)) return
	throw new HandledError(StatusCode.Forbidden, 'Account action is not allowed')
}
