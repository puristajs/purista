import { createHash, randomUUID } from 'node:crypto'

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
	QueueMetrics,
	QueueRetryRequest,
} from '@purista/core/adapter'
import { StatusCode, UnhandledError } from '@purista/core/adapter'
import type { Consumer, JetStreamClient, JetStreamManager, JsMsg, KV, NatsConnection, StoredMsg } from 'nats'
import { AckPolicy, connect, DeliverPolicy, JSONCodec, nanos, RetentionPolicy, StorageType } from 'nats'

import type { NatsQueueBridgeOptions } from './types.js'

const DEFAULT_SUBJECT_PREFIX = 'purista.queue'
const DEFAULT_MAX_ATTEMPTS = 10
const DEFAULT_LEASE_TTL_MS = 30_000
const DEFAULT_RELEASE_BATCH_SIZE = 25
const DEFAULT_IDEMPOTENCY_PENDING_TIMEOUT_MS = 5_000
const LAST_RETRY_HEADER = 'x-purista-last-retry-reason'
const DEAD_LETTER_REASON_HEADER = 'x-purista-dead-letter-reason'

type LeaseEntry = {
	queueName: string
	message: QueueMessage
	msg: JsMsg
	leaseExpiresAt: number
}

type IdempotencyRecord = {
	state: 'publishing' | 'published'
	result: QueueEnqueueResult
	message: QueueMessage
	updatedAt: number
}

/**
 * Strict QueueBridge implementation backed by NATS JetStream streams and KV.
 *
 * The bridge requires JetStream at startup and exposes strict queue
 * capabilities: delayed delivery, FIFO delivery per queue subject,
 * inspectable dead-letter streams, lease inspection, and idempotent enqueue.
 * It does not claim exactly-once execution; workers must keep side effects
 * idempotent because leased jobs can be retried after failures or lease expiry.
 *
 * Payloads are persisted through NATS `JSONCodec`. Do not enqueue secrets,
 * tokens, or unnecessary personal data unless your broker storage and backups
 * are protected appropriately.
 *
 * @example
 * ```typescript
 * import { NatsQueueBridge } from '@purista/nats-queue-bridge'
 *
 * const queueBridge = new NatsQueueBridge({
 *   connectionOptions: { servers: 'nats://localhost:4222' },
 *   defaultMaxAttempts: 5,
 * })
 *
 * await queueBridge.start()
 * ```
 *
 * @example
 * ```typescript
 * const first = await queueBridge.enqueue({
 *   queueName: 'billing.invoice-email',
 *   payload: { invoiceId: 'inv_123' },
 *   idempotencyKey: 'invoice-email:inv_123',
 * })
 *
 * const duplicate = await queueBridge.enqueue({
 *   queueName: 'billing.invoice-email',
 *   payload: { invoiceId: 'inv_123' },
 *   idempotencyKey: 'invoice-email:inv_123',
 * })
 *
 * first.jobId === duplicate.jobId
 * ```
 */
export class NatsQueueBridge implements QueueBridge {
	/** Stable bridge name reported to PURISTA runtime diagnostics. */
	public readonly name = 'NatsQueueBridge'

	/**
	 * Queue capabilities supported by this JetStream bridge.
	 *
	 * `idempotencyEnforcement` and `strictStartupValidation` are true. The
	 * bridge still reports `exactlyOnce: false` because handler side effects can
	 * be executed more than once after redelivery or process failure.
	 */
	public readonly capabilities: QueueBridgeCapabilities = {
		delayedDelivery: true,
		fifoOrdering: true,
		partitions: false,
		priorities: false,
		deadLetterNative: false,
		exactlyOnce: false,
		maxBatchSize: 1,
		defaultDeadLetterPrefix: '',
		defaultDeadLetterSuffix: '.dead-letter',
		deadLetterInspectable: true,
		deadLetterInspectSupported: true,
		deadLetterReplaySupported: true,
		deadLetterPurgeSupported: true,
		leaseInspectionSupported: true,
		idempotencyEnforcement: true,
		partitionOrdering: false,
		providerManagedDelayedDelivery: true,
		strictStartupValidation: true,
	}

	/** Unique bridge instance identifier for diagnostics and lease ownership. */
	public readonly instanceId = randomUUID()

	private connection?: NatsConnection
	private jsm?: JetStreamManager
	private js?: JetStreamClient
	private idempotencyKv?: KV

	private readonly codec = JSONCodec<QueueMessage>()
	private readonly idempotencyCodec = JSONCodec<IdempotencyRecord>()
	private readonly leases = new Map<string, LeaseEntry>()
	private readonly pendingConsumers = new Map<string, Consumer>()
	private readonly scheduledConsumers = new Map<string, Consumer>()
	private readonly queueAckWaitMs = new Map<string, number>()
	private readonly subjectPrefix: string
	private readonly defaultLeaseTtlMs: number
	private readonly defaultMaxAttempts: number
	private readonly storageType: StorageType
	private readonly releaseBatchSize: number
	private readonly idempotencyPendingTimeoutMs: number

	/** Creates a NATS JetStream queue bridge with the provided options. */
	constructor(private readonly options: NatsQueueBridgeOptions = {}) {
		this.subjectPrefix = options.subjectPrefix ?? DEFAULT_SUBJECT_PREFIX
		this.defaultLeaseTtlMs = options.defaultLeaseTtlMs ?? DEFAULT_LEASE_TTL_MS
		this.defaultMaxAttempts = options.defaultMaxAttempts ?? DEFAULT_MAX_ATTEMPTS
		this.storageType = options.storageType === 'memory' ? StorageType.Memory : StorageType.File
		this.releaseBatchSize = options.releaseBatchSize ?? DEFAULT_RELEASE_BATCH_SIZE
		this.idempotencyPendingTimeoutMs = options.idempotencyPendingTimeoutMs ?? DEFAULT_IDEMPOTENCY_PENDING_TIMEOUT_MS
	}

	/**
	 * Connects to NATS and initializes JetStream clients.
	 *
	 * Startup fails if the configured NATS server does not provide JetStream.
	 */
	async start() {
		if (!this.connection) {
			this.connection = await connect(this.options.connectionOptions)
			this.jsm = await this.connection.jetstreamManager()
			this.js = this.connection.jetstream()
		}
	}

	/**
	 * Drains and closes the NATS connection and clears local lease/consumer caches.
	 */
	async destroy() {
		this.pendingConsumers.clear()
		this.scheduledConsumers.clear()
		this.leases.clear()
		if (this.connection) {
			await this.connection.drain()
			await this.connection.close()
			this.connection = undefined
			this.jsm = undefined
			this.js = undefined
			this.idempotencyKv = undefined
		}
	}

	/**
	 * Indicates whether the bridge has an open NATS connection.
	 */
	async isReady() {
		return !!this.connection && !this.connection.isClosed()
	}

	/**
	 * Performs a lightweight connection flush to verify broker health.
	 */
	async isHealthy() {
		if (!this.connection) {
			return false
		}
		try {
			await this.connection.flush()
			return true
		} catch {
			return false
		}
	}

	/**
	 * Enqueues a job, optionally scheduled for later delivery.
	 *
	 * When `idempotencyKey` is provided, duplicate enqueue calls for the same
	 * queue and key return the original `jobId`. The job is stored as JSON in
	 * JetStream; keep payloads minimal and avoid secrets.
	 */
	async enqueue(options: QueueEnqueueOptions<unknown, unknown>): Promise<QueueEnqueueResult> {
		await this.ensureQueueTopology(options.queueName, options.leaseTtlMs)
		const now = Date.now()
		const scheduledAt = options.delayMs ? now + options.delayMs : now
		const jobId = options.idempotencyKey
			? this.idempotencyJobId(options.queueName, options.idempotencyKey)
			: randomUUID()
		const message: QueueMessage = {
			id: jobId,
			queueName: options.queueName,
			payload: options.payload,
			parameter: options.parameter,
			headers: options.headers ?? {},
			createdAt: now,
			scheduledAt,
			priority: options.priority,
			attempt: 0,
			maxAttempts: options.maxAttempts ?? this.defaultMaxAttempts,
			leaseExpiresAt: 0,
			leaseTtlMs: options.leaseTtlMs ?? this.defaultLeaseTtlMs,
			idempotencyKey: options.idempotencyKey,
		}

		const result = { jobId, queueName: options.queueName, scheduledAt }

		if (!options.idempotencyKey) {
			await this.publishQueueMessage(options.queueName, message)
			return result
		}

		return this.publishIdempotentQueueMessage(options.queueName, options.idempotencyKey, message, result)
	}

	/**
	 * Leases the next available job from a queue.
	 *
	 * Scheduled jobs that are due are released before leasing. A leased job must
	 * be completed with {@link ack}, retried with {@link nack}, or extended with
	 * {@link extendLease}; otherwise JetStream redelivery can make it available
	 * again.
	 */
	async leaseNext(queueName: string, options?: QueueLeaseOptions): Promise<QueueLease | undefined> {
		await this.ensureQueueTopology(queueName)
		await this.releaseDueJobs(queueName, options?.waitTimeMs)

		const consumer = await this.getPendingConsumer(queueName)
		const expires = Math.max(1_000, options?.waitTimeMs ?? 1_000)
		const msg = await consumer.next({ expires })
		if (!msg) {
			return undefined
		}

		const message = this.decodeJsMessage(msg)
		const attempt = Math.max((message.attempt ?? 0) + 1, msg.info.deliveryCount)
		message.attempt = attempt
		message.leaseExpiresAt = Date.now() + (message.leaseTtlMs ?? this.defaultLeaseTtlMs)

		const leaseId = randomUUID()
		this.leases.set(leaseId, {
			queueName,
			message,
			msg,
			leaseExpiresAt: message.leaseExpiresAt,
		})

		return {
			id: message.id,
			queueName,
			message,
			leaseId,
			leasedAt: Date.now(),
			leaseExpiresAt: message.leaseExpiresAt,
		}
	}

	/**
	 * Extends a currently tracked lease.
	 *
	 * Unknown or already completed leases are ignored to keep worker shutdown
	 * and duplicate acknowledgements safe.
	 */
	async extendLease(queueName: string, leaseId: string, extensionMs: number): Promise<void> {
		const lease = this.leases.get(leaseId)
		if (!lease || lease.queueName !== queueName) {
			return
		}

		lease.msg.working()
		lease.leaseExpiresAt = Date.now() + extensionMs
		lease.message.leaseExpiresAt = lease.leaseExpiresAt
	}

	/**
	 * Acknowledges successful processing and removes the local lease tracking.
	 */
	async ack(queueName: string, leaseId: string): Promise<void> {
		const lease = this.leases.get(leaseId)
		if (!lease || lease.queueName !== queueName) {
			return
		}
		lease.msg.ack()
		this.leases.delete(leaseId)
	}

	/**
	 * Retries or dead-letters a leased job.
	 *
	 * The job is republished with an optional delay until `maxAttempts` is
	 * reached, then moved to the dead-letter stream with the retry reason in
	 * message headers.
	 */
	async nack(queueName: string, leaseId: string, request: QueueRetryRequest): Promise<void> {
		const lease = this.leases.get(leaseId)
		if (!lease || lease.queueName !== queueName) {
			return
		}

		const message = {
			...lease.message,
			headers: {
				...lease.message.headers,
				...(request.reason ? { [LAST_RETRY_HEADER]: request.reason } : {}),
			},
			leaseExpiresAt: 0,
			scheduledAt: request.delayMs ? Date.now() + request.delayMs : Date.now(),
		}

		this.leases.delete(leaseId)

		if (message.attempt >= message.maxAttempts) {
			await this.moveToDeadLetter(queueName, message, request.reason ?? 'max_attempts_exceeded')
			lease.msg.ack()
			return
		}

		await this.publishQueueMessage(queueName, message)
		lease.msg.ack()
	}

	/**
	 * Moves a message directly to the queue dead-letter stream.
	 */
	async moveToDeadLetter(queueName: string, message: QueueMessage, reason?: string): Promise<void> {
		await this.ensureDeadLetterTopology(queueName)
		const js = this.getJetStreamClient()
		const enrichedMessage: QueueMessage = {
			...message,
			leaseExpiresAt: 0,
			headers: {
				...message.headers,
				...(reason ? { [DEAD_LETTER_REASON_HEADER]: reason } : {}),
			},
		}
		await js.publish(this.deadLetterSubject(queueName), this.codec.encode(enrichedMessage))
	}

	/**
	 * Reads dead-lettered jobs without redriving or deleting them.
	 */
	async peekDeadLetter(queueName: string, options?: QueueDeadLetterListOptions): Promise<QueueMessage[]> {
		await this.ensureDeadLetterTopology(queueName)
		const stream = await this.getStream(this.deadLetterStreamName(queueName))
		const storedMessages = await this.readStoredMessages(stream, options)
		return storedMessages.map(message => this.decodeStoredMessage(message))
	}

	/**
	 * Redrives dead-lettered jobs back to the pending queue and removes them
	 * from the dead-letter stream.
	 */
	async redriveDeadLetter(queueName: string, options?: QueueDeadLetterRedriveOptions): Promise<number> {
		await this.ensureDeadLetterTopology(queueName)
		await this.ensureQueueTopology(queueName)
		const stream = await this.getStream(this.deadLetterStreamName(queueName))
		const storedMessages = await this.readStoredMessages(stream, { limit: options?.limit ?? 50, offset: 0 }, true)
		let moved = 0

		for (const stored of storedMessages) {
			const message = this.decodeStoredMessage(stored)
			message.leaseExpiresAt = 0
			message.scheduledAt = Date.now()
			await this.publishQueueMessage(queueName, message)
			await stream.deleteMessage(stored.seq)
			moved += 1
		}

		return moved
	}

	/**
	 * Deletes all jobs in the queue dead-letter stream and returns the deleted count.
	 */
	async purgeDeadLetter(queueName: string): Promise<number> {
		await this.ensureDeadLetterTopology(queueName)
		const jsm = this.getJetStreamManager()
		const streamName = this.deadLetterStreamName(queueName)
		const streamInfo = await jsm.streams.info(streamName)
		await jsm.streams.purge(streamName)
		return streamInfo.state.messages
	}

	/**
	 * Returns leases currently tracked by this bridge instance.
	 */
	async inspectLeases(queueName: string, options?: QueueDeadLetterListOptions): Promise<QueueLeaseInspectionRecord[]> {
		const offset = options?.offset ?? 0
		const limit = options?.limit ?? Number.MAX_SAFE_INTEGER
		return Array.from(this.leases.entries())
			.filter(([, lease]) => lease.queueName === queueName)
			.slice(offset, offset + limit)
			.map(([leaseId, lease]) => ({
				leaseId,
				queueName,
				jobId: lease.message.id,
				leaseExpiresAt: lease.leaseExpiresAt,
			}))
	}

	/**
	 * Returns broker-derived queue metrics for pending, in-flight, and
	 * dead-lettered jobs.
	 */
	async metrics(queueName: string): Promise<QueueMetrics> {
		await this.ensureQueueTopology(queueName)
		await this.ensureDeadLetterTopology(queueName)
		const jsm = this.getJetStreamManager()
		const pendingStreamName = this.pendingStreamName(queueName)
		const consumerName = this.pendingConsumerName(queueName)
		const [streamInfo, consumerInfo, deadLetterInfo] = await Promise.all([
			jsm.streams.info(pendingStreamName),
			jsm.consumers.info(pendingStreamName, consumerName),
			jsm.streams.info(this.deadLetterStreamName(queueName)),
		])

		const inflight = consumerInfo.num_ack_pending ?? 0
		const pending = Math.max(0, streamInfo.state.messages - inflight)
		return {
			pending,
			inflight,
			deadLetter: deadLetterInfo.state.messages,
			retries: 0,
		}
	}

	private async releaseDueJobs(queueName: string, _waitTimeMs?: number) {
		const consumer = await this.getScheduledConsumer(queueName)
		for (let index = 0; index < this.releaseBatchSize; index += 1) {
			const streamInfo = await this.getJetStreamManager().streams.info(this.scheduledStreamName(queueName))
			if ((streamInfo.state.messages ?? 0) <= 0) {
				return
			}

			const msg = await consumer.next({ expires: 1_000 })
			if (!msg) {
				return
			}

			const message = this.decodeJsMessage(msg)
			const scheduledAt = message.scheduledAt ?? 0
			if (scheduledAt > Date.now()) {
				msg.nak(scheduledAt - Date.now())
				return
			}

			message.scheduledAt = Date.now()
			await this.publishImmediate(queueName, message)
			msg.ack()
		}
	}

	private async publishQueueMessage(queueName: string, message: QueueMessage) {
		if ((message.scheduledAt ?? 0) > Date.now()) {
			return this.publishScheduled(queueName, message)
		}
		return this.publishImmediate(queueName, message)
	}

	private async publishImmediate(queueName: string, message: QueueMessage) {
		const js = this.getJetStreamClient()
		await this.ensureQueueTopology(queueName)
		await js.publish(this.pendingSubject(queueName), this.codec.encode(message))
	}

	private async publishScheduled(queueName: string, message: QueueMessage) {
		const js = this.getJetStreamClient()
		await this.ensureQueueTopology(queueName)
		await js.publish(this.scheduledSubject(queueName), this.codec.encode(message))
	}

	private async publishIdempotentQueueMessage(
		queueName: string,
		idempotencyKey: string,
		message: QueueMessage,
		result: QueueEnqueueResult,
	) {
		const kv = await this.getIdempotencyStore()
		const key = this.idempotencyRecordKey(queueName, idempotencyKey)
		const record: IdempotencyRecord = {
			state: 'publishing',
			result,
			message,
			updatedAt: Date.now(),
		}

		try {
			const revision = await kv.create(key, this.idempotencyCodec.encode(record))
			try {
				await this.publishQueueMessage(queueName, message)
			} catch (err) {
				await kv.delete(key)
				throw err
			}
			await kv.update(
				key,
				this.idempotencyCodec.encode({
					...record,
					state: 'published',
					updatedAt: Date.now(),
				}),
				revision,
			)
			return result
		} catch (err) {
			if (!this.isIdempotencyConflict(err)) {
				throw err
			}
		}

		return this.resolveExistingIdempotentResult(kv, key)
	}

	private async resolveExistingIdempotentResult(kv: KV, key: string) {
		const deadline = Date.now() + this.idempotencyPendingTimeoutMs
		let lastRecord: IdempotencyRecord | undefined

		while (Date.now() <= deadline) {
			const existing = await kv.get(key)
			if (existing) {
				const record = this.idempotencyCodec.decode(existing.value)
				lastRecord = record
				if (record.state === 'published') {
					return record.result
				}
			}
			await this.delay(25)
		}

		if (lastRecord) {
			throw new UnhandledError(
				StatusCode.ServiceUnavailable,
				`NATS idempotent enqueue for key "${key}" is still pending and could not be confirmed`,
			)
		}

		throw new UnhandledError(StatusCode.InternalServerError, 'NATS idempotency record could not be read')
	}

	private decodeJsMessage(msg: JsMsg) {
		return this.codec.decode(msg.data)
	}

	private decodeStoredMessage(msg: StoredMsg) {
		return this.codec.decode(msg.data)
	}

	private async readStoredMessages(
		stream: Awaited<ReturnType<NatsQueueBridge['getStream']>>,
		options?: QueueDeadLetterListOptions,
		includeSeq = false,
	): Promise<Array<StoredMsg>> {
		const info = await stream.info()
		const offset = options?.offset ?? 0
		const limit = options?.limit ?? 50
		const messages: StoredMsg[] = []
		let skipped = 0

		for (let seq = info.state.first_seq; seq <= info.state.last_seq && messages.length < limit; seq += 1) {
			try {
				const stored = await stream.getMessage({ seq })
				if (skipped < offset) {
					skipped += 1
					continue
				}
				messages.push(stored)
			} catch {}
		}

		return includeSeq ? messages : messages
	}

	private getJetStreamManager() {
		if (!this.jsm) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'JetStream manager is not available')
		}
		return this.jsm
	}

	private getJetStreamClient() {
		if (!this.js) {
			throw new UnhandledError(StatusCode.ServiceUnavailable, 'JetStream client is not available')
		}
		return this.js
	}

	private async getIdempotencyStore() {
		if (this.idempotencyKv) {
			return this.idempotencyKv
		}
		const js = this.getJetStreamClient()
		this.idempotencyKv = await js.views.kv(this.idempotencyBucketName(), {
			storage: this.storageType,
			history: 1,
		})
		return this.idempotencyKv
	}

	private async getStream(streamName: string) {
		return this.getJetStreamClient().streams.get(streamName)
	}

	private async getPendingConsumer(queueName: string) {
		const existing = this.pendingConsumers.get(queueName)
		if (existing) {
			return existing
		}
		await this.ensureQueueTopology(queueName)
		const stream = await this.getStream(this.pendingStreamName(queueName))
		const consumer = await stream.getConsumer(this.pendingConsumerName(queueName))
		this.pendingConsumers.set(queueName, consumer)
		return consumer
	}

	private async getScheduledConsumer(queueName: string) {
		const existing = this.scheduledConsumers.get(queueName)
		if (existing) {
			return existing
		}
		await this.ensureQueueTopology(queueName)
		const stream = await this.getStream(this.scheduledStreamName(queueName))
		const consumer = await stream.getConsumer(this.scheduledConsumerName(queueName))
		this.scheduledConsumers.set(queueName, consumer)
		return consumer
	}

	private async ensureQueueTopology(queueName: string, requestedLeaseTtlMs?: number) {
		const jsm = this.getJetStreamManager()
		const ackWaitMs = Math.max(50, requestedLeaseTtlMs ?? this.queueAckWaitMs.get(queueName) ?? this.defaultLeaseTtlMs)
		this.queueAckWaitMs.set(queueName, ackWaitMs)

		await this.ensureStream(
			this.pendingStreamName(queueName),
			this.pendingSubject(queueName),
			RetentionPolicy.Workqueue,
		)
		await this.ensureStream(
			this.scheduledStreamName(queueName),
			this.scheduledSubject(queueName),
			RetentionPolicy.Workqueue,
		)
		await this.ensureConsumer(
			this.pendingStreamName(queueName),
			this.pendingConsumerName(queueName),
			this.pendingSubject(queueName),
			ackWaitMs,
			queueName,
		)
		await this.ensureConsumer(
			this.scheduledStreamName(queueName),
			this.scheduledConsumerName(queueName),
			this.scheduledSubject(queueName),
			this.defaultLeaseTtlMs,
			queueName,
		)

		// Touch the manager so startup failures surface here instead of on first lease attempt.
		await jsm.getAccountInfo()
	}

	private async ensureDeadLetterTopology(queueName: string) {
		await this.ensureStream(
			this.deadLetterStreamName(queueName),
			this.deadLetterSubject(queueName),
			RetentionPolicy.Limits,
		)
	}

	private async ensureStream(streamName: string, subject: string, retention: RetentionPolicy) {
		const jsm = this.getJetStreamManager()
		try {
			await jsm.streams.info(streamName)
			return
		} catch {
			await jsm.streams.add({
				name: streamName,
				subjects: [subject],
				retention,
				storage: this.storageType,
			})
		}
	}

	private async ensureConsumer(
		streamName: string,
		consumerName: string,
		subject: string,
		ackWaitMs: number,
		queueName?: string,
	) {
		const jsm = this.getJetStreamManager()
		try {
			const existing = await jsm.consumers.info(streamName, consumerName)
			const existingAckWait = Number(existing.config.ack_wait ?? nanos(this.defaultLeaseTtlMs)) / 1_000_000
			if (Math.round(existingAckWait) !== Math.round(ackWaitMs)) {
				await jsm.consumers.update(streamName, consumerName, {
					ack_wait: nanos(ackWaitMs),
					max_deliver: -1,
					max_ack_pending: 1_024,
				})
				if (queueName) {
					this.pendingConsumers.delete(queueName)
					this.scheduledConsumers.delete(queueName)
				}
			}
			return
		} catch {
			await jsm.consumers.add(streamName, {
				name: consumerName,
				durable_name: consumerName,
				filter_subject: subject,
				ack_policy: AckPolicy.Explicit,
				deliver_policy: DeliverPolicy.All,
				ack_wait: nanos(ackWaitMs),
				max_deliver: -1,
				max_ack_pending: 1_024,
			})
		}
	}

	private sanitize(value: string) {
		return value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 200)
	}

	private idempotencyBucketName() {
		return this.sanitize(`${this.subjectPrefix}_idempotency`)
	}

	private idempotencyRecordKey(queueName: string, idempotencyKey: string) {
		return createHash('sha256').update(`${queueName}\0${idempotencyKey}`).digest('hex')
	}

	private idempotencyJobId(queueName: string, idempotencyKey: string) {
		return `idem-${this.idempotencyRecordKey(queueName, idempotencyKey)}`
	}

	private isIdempotencyConflict(err: unknown) {
		const candidate = err as { api_error?: { err_code?: number }; message?: string }
		return candidate.api_error?.err_code === 10071 || candidate.message?.includes('wrong last sequence') === true
	}

	private delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	private pendingSubject(queueName: string) {
		return `${this.subjectPrefix}.${queueName}.pending`
	}

	private scheduledSubject(queueName: string) {
		return `${this.subjectPrefix}.${queueName}.scheduled`
	}

	private deadLetterSubject(queueName: string) {
		return `${this.subjectPrefix}.${queueName}.dead-letter`
	}

	private pendingStreamName(queueName: string) {
		return this.sanitize(`${this.subjectPrefix}_${queueName}_pending`)
	}

	private scheduledStreamName(queueName: string) {
		return this.sanitize(`${this.subjectPrefix}_${queueName}_scheduled`)
	}

	private deadLetterStreamName(queueName: string) {
		return this.sanitize(`${this.subjectPrefix}_${queueName}_dead_letter`)
	}

	private pendingConsumerName(queueName: string) {
		return this.sanitize(`${queueName}_pending_consumer`)
	}

	private scheduledConsumerName(queueName: string) {
		return this.sanitize(`${queueName}_scheduled_consumer`)
	}
}
