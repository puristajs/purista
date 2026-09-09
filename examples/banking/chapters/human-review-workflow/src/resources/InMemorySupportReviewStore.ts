import { HandledError, StatusCode } from '@purista/core'
import type { SupportReviewRecord, SupportReviewStore } from '../service/support/v1/SupportReviewResources.js'

export class InMemorySupportReviewStore implements SupportReviewStore {
	private readonly records = new Map<string, SupportReviewRecord>()
	private key(tenantId: string, requestId: string) {
		return `${tenantId}\u0000${requestId}`
	}

	public async create(input: Omit<SupportReviewRecord, 'revision' | 'status'>) {
		const key = this.key(input.tenantId, input.requestId)
		const existing = this.records.get(key)
		if (existing) {
			if (existing.actionDigest !== input.actionDigest || existing.principalId !== input.principalId) {
				throw new HandledError(StatusCode.Conflict, 'Review request conflicts with its existing action')
			}
			return structuredClone(existing)
		}
		const record: SupportReviewRecord = { ...structuredClone(input), revision: 1, status: 'pending' }
		this.records.set(key, record)
		return structuredClone(record)
	}

	public async get(tenantId: string, requestId: string) {
		const record = this.records.get(this.key(tenantId, requestId))
		return record ? structuredClone(record) : undefined
	}

	public async getByAgentRunId(tenantId: string, agentRunId: string) {
		for (const record of this.records.values()) {
			if (record.tenantId === tenantId && record.approvalAgentRunId === agentRunId) return structuredClone(record)
		}
		return undefined
	}

	public async recordApproval(input: {
		tenantId: string
		requestId: string
		runId: string
		interruptId: string
		revision: string
		approvalIds: readonly string[]
		agentRunId: string
	}) {
		const key = this.key(input.tenantId, input.requestId)
		const record = this.records.get(key)
		if (!record || record.runId !== input.runId) throw new HandledError(StatusCode.Conflict, 'Review approval is stale')
		const updated = {
			...record,
			approvalInterruptId: input.interruptId,
			approvalRevision: input.revision,
			approvalIds: [...input.approvalIds],
			approvalAgentRunId: input.agentRunId,
		}
		this.records.set(key, updated)
		return structuredClone(updated)
	}

	public async decide(input: {
		tenantId: string
		requestId: string
		expectedRevision: number
		eventId: string
		outcome: 'approved' | 'rejected'
		principalId: string
	}) {
		const key = this.key(input.tenantId, input.requestId)
		const record = this.records.get(key)
		if (!record) throw new HandledError(StatusCode.NotFound, 'Review request not found')
		if (record.status !== 'pending') {
			if (
				record.decisionEventId === input.eventId &&
				record.status === input.outcome &&
				record.decidedBy === input.principalId
			) {
				return structuredClone(record)
			}
			throw new HandledError(StatusCode.Conflict, 'Review request already has a terminal decision')
		}
		if (record.revision !== input.expectedRevision) {
			throw new HandledError(StatusCode.Conflict, 'Review request revision changed')
		}
		const decided: SupportReviewRecord = {
			...record,
			revision: record.revision + 1,
			status: input.outcome,
			decisionEventId: input.eventId,
			decidedBy: input.principalId,
		}
		this.records.set(key, decided)
		return structuredClone(decided)
	}
}
