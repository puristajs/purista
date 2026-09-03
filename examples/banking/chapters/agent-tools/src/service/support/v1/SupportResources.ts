export interface SupportQuestionPolicy {
	canAsk(
		input: Readonly<{
			tenantId: string
			principalId: string
			accountId: string
			transactionId: string
		}>,
	): Promise<boolean>
}
