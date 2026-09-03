export interface SupportClassificationPolicy {
	canClassify(input: Readonly<{ tenantId: string; principalId: string }>): Promise<boolean>
}
