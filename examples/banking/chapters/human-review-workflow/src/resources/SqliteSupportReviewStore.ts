import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { HandledError, StatusCode } from '@purista/core'
import type { SupportReviewRecord, SupportReviewStore } from '../service/support/v1/SupportReviewResources.js'
import type { ReviewWorkflowInput } from '../service/support/v1/schema.js'

interface ReviewRow {
	tenant_id: string
	request_id: string
	card_id: string
	reason: string
	principal_id: string
	revision: number
	status: SupportReviewRecord['status']
	wait_id: string
	run_id: string
	session_id: string
	action_digest: string
	workflow_input: string
	decision_event_id: string | null
	decided_by: string | null
}

export class SqliteSupportReviewStore implements SupportReviewStore {
	private readonly database: DatabaseSync

	public constructor(file: string) {
		mkdirSync(dirname(file), { recursive: true })
		this.database = new DatabaseSync(file)
		this.database.exec('PRAGMA journal_mode = WAL')
		this.database.exec(`
			CREATE TABLE IF NOT EXISTS support_reviews (
				tenant_id TEXT NOT NULL,
				request_id TEXT NOT NULL,
				card_id TEXT NOT NULL,
				reason TEXT NOT NULL,
				principal_id TEXT NOT NULL,
				revision INTEGER NOT NULL,
				status TEXT NOT NULL,
				wait_id TEXT NOT NULL,
				run_id TEXT NOT NULL,
				session_id TEXT NOT NULL,
				action_digest TEXT NOT NULL,
				workflow_input TEXT NOT NULL,
				decision_event_id TEXT,
				decided_by TEXT,
				PRIMARY KEY (tenant_id, request_id),
				UNIQUE (tenant_id, wait_id)
			)
		`)
	}

	public async create(input: Omit<SupportReviewRecord, 'revision' | 'status'>) {
		this.database
			.prepare(`
				INSERT OR IGNORE INTO support_reviews (
					tenant_id, request_id, card_id, reason, principal_id, revision, status,
					wait_id, run_id, session_id, action_digest, workflow_input
				) VALUES (?, ?, ?, ?, ?, 1, 'pending', ?, ?, ?, ?, ?)
			`)
			.run(
				input.tenantId,
				input.requestId,
				input.cardId,
				input.reason,
				input.principalId,
				input.waitId,
				input.runId,
				input.sessionId,
				input.actionDigest,
				JSON.stringify(input.workflowInput),
			)
		const record = await this.get(input.tenantId, input.requestId)
		if (!record) throw new Error('The review record could not be loaded after insertion')
		if (record.actionDigest !== input.actionDigest || record.principalId !== input.principalId) {
			throw new HandledError(StatusCode.Conflict, 'Review request conflicts with its existing action')
		}
		return record
	}

	public async get(tenantId: string, requestId: string) {
		const row = this.database
			.prepare('SELECT * FROM support_reviews WHERE tenant_id = ? AND request_id = ?')
			.get(tenantId, requestId) as unknown as ReviewRow | undefined
		return row ? this.toRecord(row) : undefined
	}

	public async getByWaitId(tenantId: string, waitId: string) {
		const row = this.database
			.prepare('SELECT * FROM support_reviews WHERE tenant_id = ? AND wait_id = ?')
			.get(tenantId, waitId) as unknown as ReviewRow | undefined
		return row ? this.toRecord(row) : undefined
	}

	public async decide(input: {
		tenantId: string
		requestId: string
		expectedRevision: number
		eventId: string
		outcome: 'approved' | 'rejected'
		principalId: string
	}) {
		this.database.exec('BEGIN IMMEDIATE')
		try {
			const current = await this.get(input.tenantId, input.requestId)
			if (!current) throw new HandledError(StatusCode.NotFound, 'Review request not found')
			if (current.status !== 'pending') {
				if (
					current.decisionEventId === input.eventId &&
					current.status === input.outcome &&
					current.decidedBy === input.principalId
				) {
					this.database.exec('COMMIT')
					return current
				}
				throw new HandledError(StatusCode.Conflict, 'Review request already has a terminal decision')
			}
			if (current.revision !== input.expectedRevision) {
				throw new HandledError(StatusCode.Conflict, 'Review request revision changed')
			}
			const result = this.database
				.prepare(`
					UPDATE support_reviews
					SET status = ?, revision = revision + 1, decision_event_id = ?, decided_by = ?
					WHERE tenant_id = ? AND request_id = ? AND revision = ? AND status = 'pending'
				`)
				.run(input.outcome, input.eventId, input.principalId, input.tenantId, input.requestId, input.expectedRevision)
			if (result.changes !== 1) throw new HandledError(StatusCode.Conflict, 'Review request revision changed')
			const decided = await this.get(input.tenantId, input.requestId)
			if (!decided) throw new Error('The decided review record could not be loaded')
			this.database.exec('COMMIT')
			return decided
		} catch (error) {
			this.database.exec('ROLLBACK')
			throw error
		}
	}

	public close() {
		this.database.close()
	}

	private toRecord(row: ReviewRow): SupportReviewRecord {
		return {
			requestId: row.request_id,
			cardId: row.card_id,
			reason: row.reason,
			tenantId: row.tenant_id,
			principalId: row.principal_id,
			revision: row.revision,
			status: row.status,
			waitId: row.wait_id,
			runId: row.run_id,
			sessionId: row.session_id,
			actionDigest: row.action_digest,
			workflowInput: JSON.parse(row.workflow_input) as ReviewWorkflowInput,
			decisionEventId: row.decision_event_id ?? undefined,
			decidedBy: row.decided_by ?? undefined,
		}
	}
}
