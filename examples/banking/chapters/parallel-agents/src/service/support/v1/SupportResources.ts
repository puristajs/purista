export interface SupportCasePolicy {
	canAnalyze(input: Readonly<{ tenantId: string; principalId: string; caseId: string }>): Promise<boolean>
}
