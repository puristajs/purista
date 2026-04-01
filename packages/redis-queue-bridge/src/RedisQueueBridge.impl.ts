import { randomUUID } from 'node:crypto'
import { emitWarning } from 'node:process'

import type {
	QueueBridge,
	QueueBridgeCapabilities,
	QueueEnqueueOptions,
	QueueEnqueueResult,
	QueueLease,
	QueueLeaseOptions,
	QueueMessage,
	QueueRetryRequest,
} from '@purista/core'
import type {
	RedisClientType,
	RedisFunctions,
	RedisModules,
	RedisScripts,
	RespVersions,
	TypeMapping,
} from '@redis/client'
import { createClient } from '@redis/client'

import type { RedisQueueBridgeOptions } from './types.js'

const DEFAULT_KEY_PREFIX = 'purista:queue:'
const DEFAULT_MAX_ATTEMPTS = 10
const DEFAULT_LEASE_TTL_MS = 15 * 60 * 1000

const DEAD_LETTER_HEADER = 'x-purista-dead-letter-reason'
const LAST_RETRY_HEADER = 'x-purista-last-retry-reason'

export class RedisQueueBridge<
	M extends RedisModules = RedisModules,
	F extends RedisFunctions = RedisFunctions,
	S extends RedisScripts = RedisScripts,
	RESP extends RespVersions = RespVersions,
	TYPE_MAPPING extends TypeMapping = TypeMapping,
> implements QueueBridge
{
	public readonly name = 'RedisQueueBridge'

	public readonly capabilities: QueueBridgeCapabilities = {
		delayedDelivery: true,
		fifoOrdering: true,
		partitions: false,
		priorities: false,
		deadLetterNative: true,
		exactlyOnce: false,
		maxBatchSize: 1,
		defaultDeadLetterPrefix: '',
		defaultDeadLetterSuffix: ':dead-letter',
		deadLetterInspectable: true,
	}

	public readonly instanceId: string

	private client: RedisClientType<M, F, S, RESP, TYPE_MAPPING>

	private readonly keyPrefix: string

	private readonly scheduleBatchSize: number

	private readonly recoveryBatchSize: number

	constructor(private readonly options: RedisQueueBridgeOptions<M, F, S, RESP, TYPE_MAPPING> = {}) {
		this.instanceId = randomUUID()
		this.client = createClient(this.options.config)
		this.client.on('error', err => {
			const warning = err instanceof Error ? err : new Error(`Redis queue bridge client error: ${String(err)}`)
			emitWarning(warning, 'RedisQueueBridge')
		})
		this.keyPrefix = this.options.keyPrefix ?? DEFAULT_KEY_PREFIX
		this.scheduleBatchSize = this.options.scheduleBatchSize ?? 50
		this.recoveryBatchSize = this.options.recoveryBatchSize ?? 50
	}

	async start() {
		if (!this.client.isOpen) {
			await this.client.connect()
		}
	}

	async destroy() {
		if (this.client.isOpen) {
			await this.client.disconnect()
		}
	}

	async isReady() {
		return this.client.isReady
	}

	async isHealthy() {
		try {
			await this.client.ping()
			return true
		} catch {
			return false
		}
	}

	async enqueue(options: QueueEnqueueOptions<unknown, unknown>): Promise<QueueEnqueueResult> {
		const client = await this.getClient()
		const now = Date.now()
		const jobId = randomUUID()
		const scheduledAt = options.delayMs ? now + options.delayMs : now
		const queueName = options.queueName

		const message: QueueMessage = {
			id: jobId,
			queueName,
			payload: options.payload,
			parameter: options.parameter,
			headers: options.headers ?? {},
			createdAt: now,
			scheduledAt,
			priority: options.priority,
			attempt: 0,
			maxAttempts: options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
			leaseExpiresAt: 0,
			leaseTtlMs: options.leaseTtlMs ?? DEFAULT_LEASE_TTL_MS,
			idempotencyKey: options.idempotencyKey,
		}

		await client.hSet(this.jobsKey(queueName), jobId, JSON.stringify(message))

		if (scheduledAt > now) {
			await client.zAdd(this.scheduledKey(queueName), {
				score: scheduledAt,
				value: jobId,
			})
		} else {
			await client.lPush(this.pendingKey(queueName), jobId)
		}

		return {
			jobId,
			queueName,
			scheduledAt,
		}
	}

	async leaseNext(queueName: string, options?: QueueLeaseOptions): Promise<QueueLease | undefined> {
		const client = await this.getClient()
		await this.recoverExpiredLeases(queueName)
		await this.releaseDueJobs(queueName)

		const blockSeconds = this.waitSeconds(options?.waitTimeMs)

		while (true) {
			const jobIdRaw = await client.brPopLPush(this.pendingKey(queueName), this.processingKey(queueName), blockSeconds)

			const jobId = this.decodeBulkString(jobIdRaw)
			if (!jobId) {
				return undefined
			}

			const jobDataRaw = await client.hGet(this.jobsKey(queueName), jobId)
			const jobData = this.decodeBulkString(jobDataRaw)
			if (!jobData) {
				await client.lRem(this.processingKey(queueName), 0, jobId)
				continue
			}

			const message = JSON.parse(jobData) as QueueMessage
			message.attempt += 1
			const now = Date.now()
			const leaseTtl = message.leaseTtlMs ?? DEFAULT_LEASE_TTL_MS
			message.leaseExpiresAt = now + leaseTtl

			await client.hSet(this.jobsKey(queueName), jobId, JSON.stringify(message))

			const leaseId = randomUUID()
			await client
				.multi()
				.hSet(this.leaseMapKey(queueName), leaseId, jobId)
				.zAdd(this.leaseExpiryKey(queueName), { score: message.leaseExpiresAt, value: leaseId })
				.exec()

			return {
				id: jobId,
				queueName,
				message,
				leaseId,
				leasedAt: now,
				leaseExpiresAt: message.leaseExpiresAt,
			}
		}
	}

	async extendLease(queueName: string, leaseId: string, extensionMs: number): Promise<void> {
		const client = await this.getClient()
		const jobId = this.decodeBulkString(await client.hGet(this.leaseMapKey(queueName), leaseId))
		if (!jobId) {
			return
		}
		const jobData = this.decodeBulkString(await client.hGet(this.jobsKey(queueName), jobId))
		if (!jobData) {
			return
		}

		const message = JSON.parse(jobData) as QueueMessage
		message.leaseExpiresAt = Date.now() + extensionMs
		await client
			.multi()
			.hSet(this.jobsKey(queueName), jobId, JSON.stringify(message))
			.zAdd(this.leaseExpiryKey(queueName), { score: message.leaseExpiresAt, value: leaseId })
			.exec()
	}

	async ack(queueName: string, leaseId: string): Promise<void> {
		const client = await this.getClient()
		const jobId = this.decodeBulkString(await client.hGet(this.leaseMapKey(queueName), leaseId))
		if (!jobId) {
			return
		}

		await client
			.multi()
			.hDel(this.leaseMapKey(queueName), leaseId)
			.zRem(this.leaseExpiryKey(queueName), leaseId)
			.lRem(this.processingKey(queueName), 0, jobId)
			.hDel(this.jobsKey(queueName), jobId)
			.exec()
	}

	async nack(queueName: string, leaseId: string, request: QueueRetryRequest): Promise<void> {
		const client = await this.getClient()
		const jobId = this.decodeBulkString(await client.hGet(this.leaseMapKey(queueName), leaseId))
		if (!jobId) {
			return
		}

		await client
			.multi()
			.hDel(this.leaseMapKey(queueName), leaseId)
			.zRem(this.leaseExpiryKey(queueName), leaseId)
			.lRem(this.processingKey(queueName), 0, jobId)
			.exec()

		await this.requeueJob(queueName, jobId, request.delayMs, request.reason)
	}

	async moveToDeadLetter(queueName: string, message: QueueMessage, reason?: string): Promise<void> {
		const client = await this.getClient()
		const enrichedMessage = {
			...message,
			headers: {
				...message.headers,
				[DEAD_LETTER_HEADER]: reason ?? message.headers?.[DEAD_LETTER_HEADER],
			},
		}
		await client.rPush(this.deadLetterKey(queueName), JSON.stringify(enrichedMessage))
	}

	async metrics(queueName: string) {
		const client = await this.getClient()
		const pending = this.normalizeNumber(await client.lLen(this.pendingKey(queueName)))
		const inflight = this.normalizeNumber(await client.lLen(this.processingKey(queueName)))
		const deadLetter = this.normalizeNumber(await client.lLen(this.deadLetterKey(queueName)))
		const retriesRaw = await client.hGet(this.statsKey(queueName), 'retries')
		const retries = retriesRaw ? Number(this.decodeBulkString(retriesRaw) ?? 0) : 0
		const oldestJobId = this.decodeBulkString(await client.lIndex(this.pendingKey(queueName), -1))
		let oldestAgeMs: number | undefined
		if (oldestJobId) {
			const raw = this.decodeBulkString(await client.hGet(this.jobsKey(queueName), oldestJobId))
			if (raw) {
				const message = JSON.parse(raw) as QueueMessage
				oldestAgeMs = Date.now() - (message.createdAt ?? Date.now())
			}
		}

		return {
			pending,
			inflight,
			deadLetter,
			retries,
			oldestAgeMs,
		}
	}

	private async requeueJob(queueName: string, jobId: string, delayMs = 0, reason?: string) {
		const client = await this.getClient()
		const jobData = this.decodeBulkString(await client.hGet(this.jobsKey(queueName), jobId))
		if (!jobData) {
			return
		}
		const message = JSON.parse(jobData) as QueueMessage
		if (reason) {
			message.headers = {
				...message.headers,
				[LAST_RETRY_HEADER]: reason,
			}
		}

		const maxAttempts = message.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
		if (message.attempt >= maxAttempts) {
			await this.moveToDeadLetter(queueName, message, reason)
			await client.hDel(this.jobsKey(queueName), jobId)
			await client.hIncrBy(this.statsKey(queueName), 'deadLetter', 1)
			return
		}

		message.leaseExpiresAt = 0
		message.scheduledAt = delayMs > 0 ? Date.now() + delayMs : Date.now()

		const multi = client.multi().hSet(this.jobsKey(queueName), jobId, JSON.stringify(message))
		if (delayMs > 0) {
			multi.zAdd(this.scheduledKey(queueName), { score: message.scheduledAt, value: jobId })
		} else {
			multi.lPush(this.pendingKey(queueName), jobId)
		}
		await multi.exec()

		if (message.attempt >= 1) {
			await client.hIncrBy(this.statsKey(queueName), 'retries', 1)
		}
	}

	private async releaseDueJobs(queueName: string) {
		const client = await this.getClient()
		const dueJobs = await this.claimScheduledJobs(queueName, Date.now(), this.scheduleBatchSize)
		if (!dueJobs.length) {
			return
		}

		const multi = client.multi()
		for (const entry of dueJobs) {
			multi.lPush(this.pendingKey(queueName), entry.value)
		}
		await multi.exec()
	}

	private async recoverExpiredLeases(queueName: string) {
		const client = await this.getClient()
		const expired = await this.claimExpiredLeaseIds(queueName, Date.now(), this.recoveryBatchSize)
		if (!expired.length) {
			return
		}

		for (const leaseId of expired) {
			const jobId = this.decodeBulkString(await client.hGet(this.leaseMapKey(queueName), leaseId))
			await client.multi().hDel(this.leaseMapKey(queueName), leaseId).exec()

			if (jobId) {
				await client.lRem(this.processingKey(queueName), 0, jobId)
				await this.requeueJob(queueName, jobId)
			}
		}
	}

	private waitSeconds(waitTimeMs = 1000) {
		if (waitTimeMs <= 0) {
			return 0
		}
		return Math.max(1, Math.ceil(waitTimeMs / 1000))
	}

	private pendingKey(queueName: string) {
		return `${this.keyPrefix}${queueName}:pending`
	}

	private processingKey(queueName: string) {
		return `${this.keyPrefix}${queueName}:processing`
	}

	private scheduledKey(queueName: string) {
		return `${this.keyPrefix}${queueName}:scheduled`
	}

	private jobsKey(queueName: string) {
		return `${this.keyPrefix}${queueName}:jobs`
	}

	private leaseMapKey(queueName: string) {
		return `${this.keyPrefix}${queueName}:leases`
	}

	private leaseExpiryKey(queueName: string) {
		return `${this.keyPrefix}${queueName}:lease-expiry`
	}

	private deadLetterKey(queueName: string) {
		return `${this.keyPrefix}${queueName}:dead-letter`
	}

	private statsKey(queueName: string) {
		return `${this.keyPrefix}${queueName}:stats`
	}

	private decodeBulkString(value: string | Buffer | null | undefined) {
		if (value === null || value === undefined) {
			return undefined
		}
		return typeof value === 'string' ? value : value.toString('utf-8')
	}

	private async claimScheduledJobs(queueName: string, now: number, batchSize: number) {
		const result = await this.client.eval(
			[
				"local jobs = redis.call('ZRANGEBYSCORE', KEYS[1], '-inf', ARGV[1], 'LIMIT', 0, ARGV[2])",
				'if #jobs == 0 then return jobs end',
				"for _, jobId in ipairs(jobs) do redis.call('ZREM', KEYS[1], jobId) end",
				'return jobs',
			].join('\n'),
			{
				keys: [this.scheduledKey(queueName)],
				arguments: [String(now), String(batchSize)],
			},
		)
		return this.normalizeEvalStringArray(result).map(value => ({ value, score: now }))
	}

	private async claimExpiredLeaseIds(queueName: string, now: number, batchSize: number) {
		const result = await this.client.eval(
			[
				"local leases = redis.call('ZRANGEBYSCORE', KEYS[1], '-inf', ARGV[1], 'LIMIT', 0, ARGV[2])",
				'if #leases == 0 then return leases end',
				"for _, leaseId in ipairs(leases) do redis.call('ZREM', KEYS[1], leaseId) end",
				'return leases',
			].join('\n'),
			{
				keys: [this.leaseExpiryKey(queueName)],
				arguments: [String(now), String(batchSize)],
			},
		)
		return this.normalizeEvalStringArray(result)
	}

	private normalizeEvalStringArray(value: unknown) {
		if (!Array.isArray(value)) {
			return [] as string[]
		}
		return value
			.map(entry => this.decodeBulkString(entry as string | Buffer | null | undefined))
			.filter((entry): entry is string => !!entry)
	}

	private normalizeNumber(value: number | `${number}` | null | undefined) {
		if (typeof value === 'number') {
			return value
		}
		if (typeof value === 'string') {
			return Number(value)
		}
		return 0
	}

	private async getClient() {
		if (!this.client.isOpen) {
			await this.client.connect()
		}
		return this.client
	}
}
