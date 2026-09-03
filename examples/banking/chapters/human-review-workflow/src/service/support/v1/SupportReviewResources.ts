import type { ExternalWaitOutcome, ExternalWaitSignalResult } from '@purista/harness'
import type { ReviewWorkflowInput } from './schema.js'

export interface SupportReviewRecord {
	requestId: string
	cardId: string
	reason: string
	tenantId: string
	principalId: string
	revision: number
	status: 'pending' | ExternalWaitOutcome
	waitId: string
	runId: string
	sessionId: string
	actionDigest: string
	workflowInput: ReviewWorkflowInput
	decisionEventId?: string
	decidedBy?: string
}

export interface SupportReviewStore {
	create(input: Omit<SupportReviewRecord, 'revision' | 'status'>): Promise<SupportReviewRecord>
	get(tenantId: string, requestId: string): Promise<SupportReviewRecord | undefined>
	getByWaitId(tenantId: string, waitId: string): Promise<SupportReviewRecord | undefined>
	decide(
		input: Readonly<{
			tenantId: string
			requestId: string
			expectedRevision: number
			eventId: string
			outcome: 'approved' | 'rejected'
			principalId: string
		}>,
	): Promise<SupportReviewRecord>
}

export interface SupportReviewPolicy {
	canRequest(input: Readonly<{ tenantId: string; principalId: string; cardId: string }>): Promise<boolean>
	canReview(input: Readonly<{ tenantId: string; principalId: string; requestId: string }>): Promise<boolean>
}

export interface ReviewWaitSignal {
	signal(
		input: Readonly<{
			waitId: string
			eventId: string
			outcome: 'approved' | 'rejected'
		}>,
	): Promise<ExternalWaitSignalResult>
}
