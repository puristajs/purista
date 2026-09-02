export type ReportAccess = {
	tenantId: string
	principalId: string
	accountId: string
}

export function canGenerateStatement(access: ReportAccess) {
	return access.tenantId === 'tenant-example'
		&& access.principalId === 'principal-alex'
		&& access.accountId === 'account-operating'
}
