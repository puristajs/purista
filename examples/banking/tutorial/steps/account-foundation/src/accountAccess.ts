import { HandledError, StatusCode } from '@purista/core'
import type { Identity } from './identity.js'
import type { TransactionInput } from './transaction.js'

export type AccountAction = 'read' | 'record'
type AccountId = TransactionInput['accountId']
type Account = { ownerId: string; postingEnabled: boolean }
const accountKey = (tenantId: string, accountId: AccountId) => JSON.stringify([tenantId, accountId])
const grantKey = (identity: Identity, accountId: AccountId) =>
	JSON.stringify([identity.tenantId, identity.principalId, accountId])

/** Current account permissions. Stored separately from session identity. */
export class AccountAccess {
	private readonly accounts = new Map<string, Account>([
		[accountKey('tenant-north', 'account-a'), { ownerId: 'alice', postingEnabled: true }],
		[accountKey('tenant-north', 'account-c'), { ownerId: 'carol', postingEnabled: true }],
		[accountKey('tenant-south', 'account-a'), { ownerId: 'south-owner', postingEnabled: true }],
	])
	private readonly grants = new Map<string, Set<AccountAction>>([
		[grantKey({ tenantId: 'tenant-north', principalId: 'bob' }, 'account-a'), new Set(['read'])],
		[grantKey({ tenantId: 'tenant-north', principalId: 'dana' }, 'account-a'), new Set(['read', 'record'])],
		[grantKey({ tenantId: 'tenant-south', principalId: 'dana' }, 'account-a'), new Set(['read', 'record'])],
	])

	assertAllowed(identity: Identity, accountId: AccountId, action: AccountAction): void {
		const account = this.accounts.get(accountKey(identity.tenantId, accountId))
		const ownerRead = action === 'read' && account?.ownerId === identity.principalId
		const granted = this.grants.get(grantKey(identity, accountId))?.has(action)
		const stateAllows = action === 'read' || account?.postingEnabled
		if (!account || !stateAllows || (!ownerRead && !granted)) {
			throw new HandledError(StatusCode.Forbidden, 'You may not perform this action on this account')
		}
	}

	/** Application-owned control used to demonstrate a changed permission in tests. */
	revoke(identity: Identity, accountId: AccountId, action: AccountAction): void {
		this.grants.get(grantKey(identity, accountId))?.delete(action)
	}

	/** Freeze posting while keeping authorized history reads available. */
	freeze(tenantId: string, accountId: AccountId): void {
		const account = this.accounts.get(accountKey(tenantId, accountId))
		if (account) account.postingEnabled = false
	}
}
