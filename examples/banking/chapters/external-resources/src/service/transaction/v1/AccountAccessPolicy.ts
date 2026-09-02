export type AccountAction = 'read' | 'record'

export type AccountAccessRequest = {
	accountId: string
	action: AccountAction
	principalId?: string
	tenantId?: string
}

export interface AccountAccessPolicy {
	isAllowed(request: AccountAccessRequest): boolean
}

type AccountRule = {
	tenantId: string
	permissions: Readonly<Record<string, readonly AccountAction[]>>
}

const accountRules: Readonly<Record<string, AccountRule>> = Object.freeze({
	'account-operating': {
		tenantId: 'tenant-example',
		permissions: {
			'principal-alex': ['read', 'record'],
			'principal-sam': ['read'],
		},
	},
	'account-review': {
		tenantId: 'tenant-example',
		permissions: {
			'principal-sam': ['read', 'record'],
		},
	},
})

export const localAccountAccessPolicy: AccountAccessPolicy = {
	isAllowed({ accountId, action, principalId, tenantId }) {
		const rule = accountRules[accountId]
		if (!rule || !principalId || !tenantId || rule.tenantId !== tenantId) return false
		return rule.permissions[principalId]?.includes(action) ?? false
	},
}
