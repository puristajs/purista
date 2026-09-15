export interface SupportProcedurePolicy {
	canAnswer(input: Readonly<{ tenantId: string; principalId: string; caseId: string }>): Promise<boolean>
}
