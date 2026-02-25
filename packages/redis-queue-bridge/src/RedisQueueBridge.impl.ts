import { randomUUID } from 'node:crypto'

import type {
	QueueBridge,
	QueueBridgeCapabilities,
	QueueEnqueueOptions,
	QueueEnqueueResult,
	QueueLease,
	QueueLeaseOptions,
	QueueRetryRequest,
	QueueMessage,
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

type RedisBulk = string | Buffer
type RedisScoredEntry = { value: RedisBulk; score: number | string }

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
		defaultDeadLetterSuffix: ':dlq',
		deadLetterInspectable: true,
	}

	public readonly instanceId: string

	private client: RedisClientType<M, F, S, RESP, TYPE_MAPPING>

	private readonly keyPrefix: string

	private readonly scheduleBatchSize: number

	private readonly recoveryBatchSize: number

	constructor(
		private readonly options: RedisQueueBridgeOptions<M, F, S, RESP, TYPE_MAPPING> = {},
	) {
		this.instanceId = randomUUID()
		this.client = createClient(this.options.config)
		this.client.on('error', err => {
			// eslint-disable-next-line no-console
			console.error({ err }, 'Redis queue bridge client error')
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
			const jobIdRaw = await client.brPopLPush(
				this.pendingKey(queueName),
				this.processingKey(queueName),
				blockSeconds,
			)

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
		const now = Date.now()
		const rawDueJobs = (await client.zRangeByScoreWithScores(
			this.scheduledKey(queueName),
			0,
			now,
			{
				LIMIT: {
					offset: 0,
					count: this.scheduleBatchSize,
				},
			},
		)) as RedisScoredEntry[] | null

		const dueJobs = this.normalizeScoredEntries(rawDueJobs)

		if (!dueJobs.length) {
			return
		}

		const multi = client.multi()
		for (const entry of dueJobs) {
			multi.zRem(this.scheduledKey(queueName), entry.value)
			multi.lPush(this.pendingKey(queueName), entry.value)
		}
		await multi.exec()
	}

	private async recoverExpiredLeases(queueName: string) {
		const client = await this.getClient()
		const now = Date.now()
		const rawExpired = (await client.zRangeByScoreWithScores(
			this.leaseExpiryKey(queueName),
			0,
			now,
			{
				LIMIT: {
					offset: 0,
					count: this.recoveryBatchSize,
				},
			},
		)) as RedisScoredEntry[] | null

		const expired = this.normalizeScoredEntries(rawExpired)

		if (!expired.length) {
			return
		}

		for (const entry of expired) {
			const leaseId = entry.value
			const jobId = this.decodeBulkString(await client.hGet(this.leaseMapKey(queueName), leaseId))
			await client
				.multi()
				.zRem(this.leaseExpiryKey(queueName), leaseId)
				.hDel(this.leaseMapKey(queueName), leaseId)
				.exec()

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

	private normalizeScoredEntries(entries: RedisScoredEntry[] | null | undefined) {
		if (!entries) {
			return [] as Array<{ value: string; score: number }>
		}
		return entries
			.map(entry => {
				const value = this.decodeBulkString(entry.value)
				if (!value) {
					return undefined
				}
				const score = typeof entry.score === 'number' ? entry.score : Number(entry.score)
				return { value, score }
			})
			.filter((entry): entry is { value: string; score: number } => !!entry)
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
