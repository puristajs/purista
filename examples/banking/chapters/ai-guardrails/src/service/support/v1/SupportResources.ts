export interface SupportClassificationPolicy {
	canClassify(input: Readonly<{ tenantId: string; principalId: string; messageId: string }>): Promise<boolean>
}
