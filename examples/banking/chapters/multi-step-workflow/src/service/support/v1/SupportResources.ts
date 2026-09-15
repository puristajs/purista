export interface SupportCasePolicy {
	canResolve(input: Readonly<{ tenantId: string; principalId: string; caseId: string }>): Promise<boolean>
}
