export interface AnalysisPolicy {
	canRun(input: Readonly<{ tenantId: string; principalId: string; analysisId: string }>): Promise<boolean>
}
