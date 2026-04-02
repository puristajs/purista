import { randomUUID } from 'node:crypto'
import { emitWarning } from 'node:process'

import type {
	QueueBridge,
	QueueBridgeCapabilities,
	QueueDeadLetterListOptions,
	QueueDeadLetterRedriveOptions,
	QueueEnqueueOptions,
	QueueEnqueueResult,
	QueueLease,
	QueueLeaseInspectionRecord,
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
const DEFAULT_ORPHAN_RECOVERY_BATCH_SIZE = 50

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
		deadLetterInspectSupported: true,
		deadLetterReplaySupported: true,
		deadLetterPurgeSupported: true,
		leaseInspectionSupported: true,
		idempotencyEnforcement: false,
		partitionOrdering: false,
		providerManagedDelayedDelivery: true,
		strictStartupValidation: true,
	}

	public readonly instanceId: string

	private client: RedisClientType<M, F, S, RESP, TYPE_MAPPING>

	private readonly keyPrefix: string

	private readonly scheduleBatchSize: number

	private readonly recoveryBatchSize: number

	private readonly orphanRecoveryBatchSize: number

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
		this.orphanRecoveryBatchSize = this.options.recoveryBatchSize ?? DEFAULT_ORPHAN_RECOVERY_BATCH_SIZE
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
		await this.recoverOrphanedProcessing(queueName)
		await this.recoverExpiredLeases(queueName)
		await this.releaseDueJobs(queueName)

		const blockSeconds = this.waitSeconds(options?.waitTimeMs)

		while (true) {
			const jobIdRaw = await client.blMove(
				this.pendingKey(queueName),
				this.processingKey(queueName),
				'RIGHT',
				'LEFT',
				blockSeconds,
			)

			const jobId = this.decodeBulkString(jobIdRaw)
			if (!jobId) {
				return undefined
			}

			const now = Date.now()
			const leaseId = randomUUID()
			const finalizedMessage = await this.finalizeLease(queueName, jobId, leaseId, now)
			if (!finalizedMessage) {
				continue
			}

			const message = JSON.parse(finalizedMessage) as QueueMessage

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
		await this.ackLease(queueName, leaseId)
	}

	async nack(queueName: string, leaseId: string, request: QueueRetryRequest): Promise<void> {
		await this.retryLease(queueName, leaseId, request)
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

	async peekDeadLetter(queueName: string, options?: QueueDeadLetterListOptions): Promise<QueueMessage[]> {
		const client = await this.getClient()
		const offset = options?.offset ?? 0
		const limit = options?.limit ?? 50
		const end = offset + Math.max(0, limit) - 1
		const raw = await client.lRange(this.deadLetterKey(queueName), offset, end)
		return raw
			.map(entry => this.decodeBulkString(entry))
			.filter((entry): entry is string => !!entry)
			.map(entry => JSON.parse(entry) as QueueMessage)
	}

	async redriveDeadLetter(queueName: string, options?: QueueDeadLetterRedriveOptions): Promise<number> {
		const limit = options?.limit ?? 1
		return this.redriveDeadLetterEntries(queueName, limit)
	}

	async purgeDeadLetter(queueName: string): Promise<number> {
		const client = await this.getClient()
		const count = this.normalizeNumber(await client.lLen(this.deadLetterKey(queueName)))
		await client.del(this.deadLetterKey(queueName))
		return count
	}

	async inspectLeases(queueName: string, options?: QueueDeadLetterListOptions): Promise<QueueLeaseInspectionRecord[]> {
		const client = await this.getClient()
		const offset = options?.offset ?? 0
		const limit = options?.limit ?? 50
		const leaseIds = await client.zRange(this.leaseExpiryKey(queueName), offset, offset + Math.max(0, limit) - 1)
		const records: QueueLeaseInspectionRecord[] = []

		for (const leaseIdRaw of leaseIds) {
			const leaseId = this.decodeBulkString(leaseIdRaw)
			if (!leaseId) {
				continue
			}
			const [jobIdRaw, expiresAtRaw] = await Promise.all([
				client.hGet(this.leaseMapKey(queueName), leaseId),
				client.zScore(this.leaseExpiryKey(queueName), leaseId),
			])
			const jobId = this.decodeBulkString(jobIdRaw)
			if (!jobId || expiresAtRaw === null) {
				continue
			}
			records.push({
				leaseId,
				queueName,
				jobId,
				leaseExpiresAt: Number(expiresAtRaw),
			})
		}

		return records
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

	private async releaseDueJobs(queueName: string) {
		await this.releaseScheduledJobs(queueName, Date.now(), this.scheduleBatchSize)
	}

	private async recoverExpiredLeases(queueName: string) {
		await this.recoverExpiredLeaseBatch(queueName, Date.now(), this.recoveryBatchSize)
	}

	private async recoverOrphanedProcessing(queueName: string) {
		const client = await this.getClient()
		await client.eval(
			[
				"local orphaned = redis.call('LRANGE', KEYS[1], 0, tonumber(ARGV[1]) - 1)",
				'if #orphaned == 0 then return 0 end',
				'local moved = 0',
				'for _, jobId in ipairs(orphaned) do',
				"  local leaseId = redis.call('HGET', KEYS[2], jobId)",
				'  if not leaseId then',
				"    redis.call('LREM', KEYS[1], 1, jobId)",
				"    redis.call('LPUSH', KEYS[3], jobId)",
				'    moved = moved + 1',
				'  end',
				'end',
				'return moved',
			].join('\n'),
			{
				keys: [this.processingKey(queueName), this.leaseByJobKey(queueName), this.pendingKey(queueName)],
				arguments: [String(this.orphanRecoveryBatchSize)],
			},
		)
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

	private leaseByJobKey(queueName: string) {
		return `${this.keyPrefix}${queueName}:lease-by-job`
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

	private async finalizeLease(queueName: string, jobId: string, leaseId: string, now: number) {
		const client = await this.getClient()
		const result = await client.eval(
			[
				"local jobData = redis.call('HGET', KEYS[1], ARGV[1])",
				'if not jobData then',
				"  redis.call('LREM', KEYS[2], 0, ARGV[1])",
				'  return false',
				'end',
				'local message = cjson.decode(jobData)',
				'message.attempt = (message.attempt or 0) + 1',
				'local leaseTtl = tonumber(message.leaseTtlMs or ARGV[4])',
				'message.leaseExpiresAt = tonumber(ARGV[3]) + leaseTtl',
				'local encoded = cjson.encode(message)',
				"redis.call('HSET', KEYS[1], ARGV[1], encoded)",
				"redis.call('HSET', KEYS[3], ARGV[2], ARGV[1])",
				"redis.call('HSET', KEYS[4], ARGV[1], ARGV[2])",
				"redis.call('ZADD', KEYS[5], message.leaseExpiresAt, ARGV[2])",
				'return encoded',
			].join('\n'),
			{
				keys: [
					this.jobsKey(queueName),
					this.processingKey(queueName),
					this.leaseMapKey(queueName),
					this.leaseByJobKey(queueName),
					this.leaseExpiryKey(queueName),
				],
				arguments: [jobId, leaseId, String(now), String(DEFAULT_LEASE_TTL_MS)],
			},
		)
		return this.decodeBulkString(result as string | Buffer | null | undefined)
	}

	private async ackLease(queueName: string, leaseId: string) {
		const client = await this.getClient()
		await client.eval(
			[
				"local jobId = redis.call('HGET', KEYS[1], ARGV[1])",
				'if not jobId then return 0 end',
				"redis.call('HDEL', KEYS[1], ARGV[1])",
				"redis.call('HDEL', KEYS[2], jobId)",
				"redis.call('ZREM', KEYS[3], ARGV[1])",
				"redis.call('LREM', KEYS[4], 0, jobId)",
				"redis.call('HDEL', KEYS[5], jobId)",
				'return 1',
			].join('\n'),
			{
				keys: [
					this.leaseMapKey(queueName),
					this.leaseByJobKey(queueName),
					this.leaseExpiryKey(queueName),
					this.processingKey(queueName),
					this.jobsKey(queueName),
				],
				arguments: [leaseId],
			},
		)
	}

	private async retryLease(queueName: string, leaseId: string, request: QueueRetryRequest) {
		const client = await this.getClient()
		await client.eval(
			[
				"local jobId = redis.call('HGET', KEYS[1], ARGV[1])",
				'if not jobId then return 0 end',
				"redis.call('HDEL', KEYS[1], ARGV[1])",
				"redis.call('HDEL', KEYS[2], jobId)",
				"redis.call('ZREM', KEYS[3], ARGV[1])",
				"redis.call('LREM', KEYS[4], 0, jobId)",
				"local jobData = redis.call('HGET', KEYS[5], jobId)",
				'if not jobData then return 0 end',
				'local message = cjson.decode(jobData)',
				'if ARGV[2] ~= "" then',
				'  message.headers = message.headers or {}',
				'  message.headers[ARGV[6]] = ARGV[2]',
				'end',
				'local maxAttempts = tonumber(message.maxAttempts or ARGV[4])',
				'if tonumber(message.attempt or 0) >= maxAttempts then',
				'  if ARGV[2] ~= "" then',
				'    message.headers = message.headers or {}',
				'    message.headers[ARGV[7]] = ARGV[2]',
				'end',
				"  redis.call('RPUSH', KEYS[8], cjson.encode(message))",
				"  redis.call('HDEL', KEYS[5], jobId)",
				"  redis.call('HINCRBY', KEYS[9], 'deadLetter', 1)",
				'  return 1',
				'end',
				'local delayMs = tonumber(ARGV[3])',
				'local now = tonumber(ARGV[5])',
				'message.leaseExpiresAt = 0',
				'message.scheduledAt = delayMs > 0 and (now + delayMs) or now',
				'local encoded = cjson.encode(message)',
				"redis.call('HSET', KEYS[5], jobId, encoded)",
				'if delayMs > 0 then',
				"  redis.call('ZADD', KEYS[6], message.scheduledAt, jobId)",
				'else',
				"  redis.call('LPUSH', KEYS[7], jobId)",
				'end',
				'if tonumber(message.attempt or 0) >= 1 then',
				"  redis.call('HINCRBY', KEYS[9], 'retries', 1)",
				'end',
				'return 1',
			].join('\n'),
			{
				keys: [
					this.leaseMapKey(queueName),
					this.leaseByJobKey(queueName),
					this.leaseExpiryKey(queueName),
					this.processingKey(queueName),
					this.jobsKey(queueName),
					this.scheduledKey(queueName),
					this.pendingKey(queueName),
					this.deadLetterKey(queueName),
					this.statsKey(queueName),
				],
				arguments: [
					leaseId,
					request.reason ?? '',
					String(request.delayMs ?? 0),
					String(DEFAULT_MAX_ATTEMPTS),
					String(Date.now()),
					LAST_RETRY_HEADER,
					DEAD_LETTER_HEADER,
				],
			},
		)
	}

	private async releaseScheduledJobs(queueName: string, now: number, batchSize: number) {
		const client = await this.getClient()
		await client.eval(
			[
				"local jobs = redis.call('ZRANGEBYSCORE', KEYS[1], '-inf', ARGV[1], 'LIMIT', 0, ARGV[2])",
				'if #jobs == 0 then return 0 end',
				'for _, jobId in ipairs(jobs) do',
				"  redis.call('ZREM', KEYS[1], jobId)",
				"  redis.call('LPUSH', KEYS[2], jobId)",
				'end',
				'return #jobs',
			].join('\n'),
			{
				keys: [this.scheduledKey(queueName), this.pendingKey(queueName)],
				arguments: [String(now), String(batchSize)],
			},
		)
	}

	private async recoverExpiredLeaseBatch(queueName: string, now: number, batchSize: number) {
		const client = await this.getClient()
		await client.eval(
			[
				"local leases = redis.call('ZRANGEBYSCORE', KEYS[1], '-inf', ARGV[1], 'LIMIT', 0, ARGV[2])",
				'if #leases == 0 then return 0 end',
				'local recovered = 0',
				'for _, leaseId in ipairs(leases) do',
				"  redis.call('ZREM', KEYS[1], leaseId)",
				"  local jobId = redis.call('HGET', KEYS[2], leaseId)",
				'  if jobId then',
				"    redis.call('HDEL', KEYS[2], leaseId)",
				"    redis.call('HDEL', KEYS[3], jobId)",
				"    redis.call('LREM', KEYS[4], 0, jobId)",
				"    local jobData = redis.call('HGET', KEYS[5], jobId)",
				'    if jobData then',
				'      local message = cjson.decode(jobData)',
				'      local maxAttempts = tonumber(message.maxAttempts or ARGV[3])',
				'      if tonumber(message.attempt or 0) >= maxAttempts then',
				'        message.headers = message.headers or {}',
				"        message.headers[ARGV[5]] = 'lease_expired'",
				"        redis.call('RPUSH', KEYS[6], cjson.encode(message))",
				"        redis.call('HDEL', KEYS[5], jobId)",
				"        redis.call('HINCRBY', KEYS[8], 'deadLetter', 1)",
				'      else',
				'        message.leaseExpiresAt = 0',
				'        message.scheduledAt = tonumber(ARGV[4])',
				'        local encoded = cjson.encode(message)',
				"        redis.call('HSET', KEYS[5], jobId, encoded)",
				"        redis.call('LPUSH', KEYS[7], jobId)",
				'        if tonumber(message.attempt or 0) >= 1 then',
				"          redis.call('HINCRBY', KEYS[8], 'retries', 1)",
				'        end',
				'      end',
				'      recovered = recovered + 1',
				'    end',
				'  end',
				'end',
				'return recovered',
			].join('\n'),
			{
				keys: [
					this.leaseExpiryKey(queueName),
					this.leaseMapKey(queueName),
					this.leaseByJobKey(queueName),
					this.processingKey(queueName),
					this.jobsKey(queueName),
					this.deadLetterKey(queueName),
					this.pendingKey(queueName),
					this.statsKey(queueName),
				],
				arguments: [String(now), String(batchSize), String(DEFAULT_MAX_ATTEMPTS), String(now), DEAD_LETTER_HEADER],
			},
		)
	}

	private async redriveDeadLetterEntries(queueName: string, limit: number) {
		const client = await this.getClient()
		const result = await client.eval(
			[
				'local moved = 0',
				'for i = 1, tonumber(ARGV[1]) do',
				"  local raw = redis.call('LPOP', KEYS[1])",
				'  if not raw then break end',
				'  local message = cjson.decode(raw)',
				'  message.leaseExpiresAt = 0',
				'  message.scheduledAt = tonumber(ARGV[2])',
				'  local encoded = cjson.encode(message)',
				"  redis.call('HSET', KEYS[2], message.id, encoded)",
				"  redis.call('RPUSH', KEYS[3], message.id)",
				'  moved = moved + 1',
				'end',
				'return moved',
			].join('\n'),
			{
				keys: [this.deadLetterKey(queueName), this.jobsKey(queueName), this.pendingKey(queueName)],
				arguments: [String(limit), String(Date.now())],
			},
		)
		return this.normalizeNumber(result as number | `${number}` | null | undefined)
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
