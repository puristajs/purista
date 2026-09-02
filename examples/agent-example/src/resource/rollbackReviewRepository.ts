import { createHash } from 'node:crypto'
import type { Pool, PoolClient } from 'pg'

import {
	type SupportV1RollbackReviewAction,
	supportV1RollbackReviewActionSchema,
} from '../service/support/v1/schema.js'

export type RollbackReviewStatus = 'pending' | 'approved' | 'rejected'

export type RollbackReviewRecord = {
	readonly action: SupportV1RollbackReviewAction
	readonly actionDigest: string
	readonly status: RollbackReviewStatus
	readonly createdAt: string
	readonly decisionId?: string
	readonly reviewerId?: string
	readonly decidedAt?: string
	readonly executionId?: string
	readonly receiptId?: string
}

export interface RollbackReviewRepository {
	getOrCreate(action: SupportV1RollbackReviewAction): Promise<RollbackReviewRecord>
	get(reviewId: string): Promise<RollbackReviewRecord | undefined>
	decide(input: {
		reviewId: string
		decisionId: string
		reviewerId: string
		decision: 'approved' | 'rejected'
	}): Promise<RollbackReviewRecord>
	claimExecution(input: {
		reviewId: string
		actionDigest: string
		targetRevision: number
	}): Promise<RollbackReviewRecord & { executionId: string }>
	recordReceipt(executionId: string, receiptId: string): Promise<RollbackReviewRecord & { receiptId: string }>
}

export function rollbackActionDigest(action: SupportV1RollbackReviewAction): string {
	return createHash('sha256')
		.update(JSON.stringify(supportV1RollbackReviewActionSchema.parse(action)))
		.digest('hex')
}

export class InMemoryRollbackReviewRepository implements RollbackReviewRepository {
	private readonly records = new Map<string, RollbackReviewRecord>()

	async getOrCreate(input: SupportV1RollbackReviewAction): Promise<RollbackReviewRecord> {
		const action = supportV1RollbackReviewActionSchema.parse(input)
		const digest = rollbackActionDigest(action)
		const existing = this.records.get(action.reviewId)
		if (existing) {
			if (existing.actionDigest !== digest) throw new Error('review_id_conflict')
			return existing
		}
		const record: RollbackReviewRecord = {
			action,
			actionDigest: digest,
			status: 'pending',
			createdAt: new Date().toISOString(),
		}
		this.records.set(action.reviewId, record)
		return record
	}

	async get(reviewId: string): Promise<RollbackReviewRecord | undefined> {
		return this.records.get(reviewId)
	}

	async decide(input: {
		reviewId: string
		decisionId: string
		reviewerId: string
		decision: 'approved' | 'rejected'
	}): Promise<RollbackReviewRecord> {
		const current = requiredRecord(this.records.get(input.reviewId))
		if (current.status !== 'pending') {
			if (current.decisionId === input.decisionId && current.status === input.decision) return current
			throw new Error('review_already_decided')
		}
		if (Date.parse(current.action.expiresAt) <= Date.now()) throw new Error('review_expired')
		const next: RollbackReviewRecord = {
			...current,
			status: input.decision,
			decisionId: input.decisionId,
			reviewerId: input.reviewerId,
			decidedAt: new Date().toISOString(),
		}
		this.records.set(input.reviewId, next)
		return next
	}

	async claimExecution(input: {
		reviewId: string
		actionDigest: string
		targetRevision: number
	}): Promise<RollbackReviewRecord & { executionId: string }> {
		const current = requiredRecord(this.records.get(input.reviewId))
		assertExecutable(current, input)
		const executionId = current.executionId ?? `rollback:${sha256(current.action.reviewId)}`
		const next = { ...current, executionId }
		this.records.set(input.reviewId, next)
		return next
	}

	async recordReceipt(executionId: string, receiptId: string): Promise<RollbackReviewRecord & { receiptId: string }> {
		const current = [...this.records.values()].find(record => record.executionId === executionId)
		if (!current) throw new Error('execution_not_found')
		if (current.receiptId && current.receiptId !== receiptId) throw new Error('receipt_conflict')
		const next = { ...current, receiptId }
		this.records.set(current.action.reviewId, next)
		return next
	}
}

export class PostgresRollbackReviewRepository implements RollbackReviewRepository {
	private migration: Promise<void> | undefined

	constructor(private readonly pool: Pool) {}

	async getOrCreate(input: SupportV1RollbackReviewAction): Promise<RollbackReviewRecord> {
		const action = supportV1RollbackReviewActionSchema.parse(input)
		const digest = rollbackActionDigest(action)
		await this.ensureMigration()
		await this.pool.query(
			`insert into purista_rollback_reviews
			 (review_id, action_json, action_digest, target_revision, status, created_at, expires_at)
			 values ($1, $2::jsonb, $3, $4, 'pending', $5, $6)
			 on conflict (review_id) do nothing`,
			[
				action.reviewId,
				JSON.stringify(action),
				digest,
				action.targetRevision,
				new Date().toISOString(),
				action.expiresAt,
			],
		)
		const record = await this.get(action.reviewId)
		if (!record || record.actionDigest !== digest) throw new Error('review_id_conflict')
		return record
	}

	async get(reviewId: string): Promise<RollbackReviewRecord | undefined> {
		await this.ensureMigration()
		const result = await this.pool.query('select * from purista_rollback_reviews where review_id = $1', [reviewId])
		return result.rows[0] ? rowToReview(result.rows[0]) : undefined
	}

	async decide(input: {
		reviewId: string
		decisionId: string
		reviewerId: string
		decision: 'approved' | 'rejected'
	}): Promise<RollbackReviewRecord> {
		return this.transaction(async client => {
			const current = await readForUpdate(client, input.reviewId)
			if (current.status !== 'pending') {
				if (current.decisionId === input.decisionId && current.status === input.decision) return current
				throw new Error('review_already_decided')
			}
			if (Date.parse(current.action.expiresAt) <= Date.now()) throw new Error('review_expired')
			const result = await client.query(
				`update purista_rollback_reviews
				 set status = $1, decision_id = $2, reviewer_id = $3, decided_at = $4
				 where review_id = $5 returning *`,
				[input.decision, input.decisionId, input.reviewerId, new Date().toISOString(), input.reviewId],
			)
			return rowToReview(result.rows[0])
		})
	}

	async claimExecution(input: {
		reviewId: string
		actionDigest: string
		targetRevision: number
	}): Promise<RollbackReviewRecord & { executionId: string }> {
		return this.transaction(async client => {
			const current = await readForUpdate(client, input.reviewId)
			assertExecutable(current, input)
			const executionId = current.executionId ?? `rollback:${sha256(current.action.reviewId)}`
			const result = await client.query(
				'update purista_rollback_reviews set execution_id = $1 where review_id = $2 returning *',
				[executionId, input.reviewId],
			)
			return { ...rowToReview(result.rows[0]), executionId }
		})
	}

	async recordReceipt(executionId: string, receiptId: string): Promise<RollbackReviewRecord & { receiptId: string }> {
		return this.transaction(async client => {
			const result = await client.query('select * from purista_rollback_reviews where execution_id = $1 for update', [
				executionId,
			])
			const current = requiredRecord(result.rows[0] ? rowToReview(result.rows[0]) : undefined)
			if (current.receiptId && current.receiptId !== receiptId) throw new Error('receipt_conflict')
			const updated = await client.query(
				'update purista_rollback_reviews set receipt_id = $1 where execution_id = $2 returning *',
				[receiptId, executionId],
			)
			return { ...rowToReview(updated.rows[0]), receiptId }
		})
	}

	private async transaction<T>(operation: (client: PoolClient) => Promise<T>): Promise<T> {
		await this.ensureMigration()
		const client = await this.pool.connect()
		try {
			await client.query('begin')
			const result = await operation(client)
			await client.query('commit')
			return result
		} catch (error) {
			await client.query('rollback')
			throw error
		} finally {
			client.release()
		}
	}

	private ensureMigration(): Promise<void> {
		this.migration ??= this.pool.connect().then(async client => {
			try {
				await client.query('select pg_advisory_lock($1)', [1_944_731_602])
				await client.query(`create table if not exists purista_rollback_reviews (
					review_id text primary key,
					action_json jsonb not null,
					action_digest text not null,
					target_revision integer not null,
					status text not null check (status in ('pending', 'approved', 'rejected')),
					decision_id text unique,
					reviewer_id text,
					decided_at text,
					execution_id text unique,
					receipt_id text unique,
					created_at text not null,
					expires_at text not null
				)`)
			} finally {
				await client.query('select pg_advisory_unlock($1)', [1_944_731_602]).catch(() => undefined)
				client.release()
			}
		})
		return this.migration
	}
}

async function readForUpdate(client: PoolClient, reviewId: string): Promise<RollbackReviewRecord> {
	const result = await client.query('select * from purista_rollback_reviews where review_id = $1 for update', [
		reviewId,
	])
	return requiredRecord(result.rows[0] ? rowToReview(result.rows[0]) : undefined)
}

function rowToReview(row: Record<string, unknown>): RollbackReviewRecord {
	const action = supportV1RollbackReviewActionSchema.parse(row.action_json)
	return {
		action,
		actionDigest: String(row.action_digest),
		status: String(row.status) as RollbackReviewStatus,
		createdAt: String(row.created_at),
		...(row.decision_id ? { decisionId: String(row.decision_id) } : {}),
		...(row.reviewer_id ? { reviewerId: String(row.reviewer_id) } : {}),
		...(row.decided_at ? { decidedAt: String(row.decided_at) } : {}),
		...(row.execution_id ? { executionId: String(row.execution_id) } : {}),
		...(row.receipt_id ? { receiptId: String(row.receipt_id) } : {}),
	}
}

function assertExecutable(record: RollbackReviewRecord, input: { actionDigest: string; targetRevision: number }): void {
	if (record.status !== 'approved') throw new Error('review_not_approved')
	if (record.actionDigest !== input.actionDigest) throw new Error('stale_action')
	if (record.action.targetRevision !== input.targetRevision) throw new Error('stale_target_revision')
	if (Date.parse(record.action.expiresAt) <= Date.now()) throw new Error('review_expired')
}

function requiredRecord(record: RollbackReviewRecord | undefined): RollbackReviewRecord {
	if (!record) throw new Error('review_not_found')
	return record
}

function sha256(value: string): string {
	return createHash('sha256').update(value).digest('hex').slice(0, 48)
}
