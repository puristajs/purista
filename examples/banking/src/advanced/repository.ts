import type { RecordedTransaction } from '../repository.js'

export type TransactionMonitoringFinding = {
	transactionId: string
	accountId: RecordedTransaction['accountId']
	kind: 'review-required'
	reason: 'amount-at-or-above-training-threshold'
}

export type GeneratedStatement = {
	statementId: string
	accountId: RecordedTransaction['accountId']
	transactionCount: number
	generatedAt: string
}

export type ReconciliationRun = {
	runId: string
	day: string
	transactionCount: number
	findingCount: number
	completedAt: string
}

/**
 * In-memory read model for the advanced tutorial checkpoints.
 *
 * It is intentionally separate from the transaction repository: subscriptions,
 * workers, and commands own different projections of the same business facts.
 */
export class BankingOperationsStore {
	private findings: TransactionMonitoringFinding[] = []
	private statements: GeneratedStatement[] = []
	private reconciliationRuns: ReconciliationRun[] = []

	recordFinding(finding: TransactionMonitoringFinding) {
		if (
			!this.findings.some(
				existing => existing.transactionId === finding.transactionId && existing.kind === finding.kind,
			)
		) {
			this.findings.push(finding)
		}
	}

	listFindings() {
		return [...this.findings]
	}

	saveStatement(statement: GeneratedStatement) {
		const existing = this.statements.find(entry => entry.accountId === statement.accountId)
		if (existing) {
			Object.assign(existing, statement)
			return existing
		}
		this.statements.push(statement)
		return statement
	}

	getStatement(accountId: RecordedTransaction['accountId']) {
		return this.statements.find(statement => statement.accountId === accountId)
	}

	recordReconciliation(run: ReconciliationRun) {
		const existing = this.reconciliationRuns.find(entry => entry.day === run.day)
		if (existing) return existing
		this.reconciliationRuns.push(run)
		return run
	}

	listReconciliationRuns() {
		return [...this.reconciliationRuns]
	}
}
