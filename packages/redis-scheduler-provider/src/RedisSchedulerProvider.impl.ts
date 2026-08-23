import { randomUUID } from 'node:crypto'

import type {
	SchedulerOccurrence,
	SchedulerOccurrenceClaim,
	SchedulerProvider,
	SchedulerProviderCapabilities,
} from '@purista/core/adapter'
import { createClient } from '@redis/client'

import type { RedisSchedulerClient, RedisSchedulerProviderOptions } from './types.js'

const DEFAULT_KEY_PREFIX = 'purista:scheduler:'
const DEFAULT_CLAIM_TTL_MS = 60_000

const completeScript = [
	"if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end",
	"local completedAt = redis.call('GET', KEYS[2])",
	"if (not completedAt) or completedAt < ARGV[2] then redis.call('SET', KEYS[2], ARGV[2]) end",
	"redis.call('DEL', KEYS[1])",
	'return 1',
].join('\n')

const releaseScript = [
	"if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end",
	"redis.call('DEL', KEYS[1])",
	'return 1',
].join('\n')

/**
 * Redis-backed distributed occurrence provider for standalone Scheduler hosts.
 *
 * The provider stores the most recently completed UTC timestamp per schedule
 * and gives active publishers a token-checked Redis lease. This keeps durable
 * state bounded by the number of schedules, prevents concurrent publication by
 * replicas, and supports failover after lease expiry. It provides at-least-once
 * trigger delivery only: a process crash between EventBridge publication and
 * durable completion may produce a duplicate trigger after the lease expires.
 *
 * @example
 * ```ts
 * const provider = new RedisSchedulerProvider({ config: { url: process.env.REDIS_URL } })
 * ```
 *
 * @group Scheduler
 */
export class RedisSchedulerProvider implements SchedulerProvider {
	/** Stable provider name used by scheduler diagnostics. */
	readonly name = 'RedisSchedulerProvider'

	/** Truthful guarantees supplied by Redis completion records and leases. */
	readonly capabilities: SchedulerProviderCapabilities = {
		durableOccurrenceState: true,
		distributedOccurrenceClaims: true,
		idempotentPublication: false,
	}

	private readonly client: RedisSchedulerClient
	private readonly ownsClient: boolean
	private readonly keyPrefix: string
	private readonly claimTtlMs: number

	/** Create a provider with an owned or application-managed Redis client. */
	constructor(options: RedisSchedulerProviderOptions = {}) {
		if (
			!Number.isSafeInteger(options.claimTtlMs ?? DEFAULT_CLAIM_TTL_MS) ||
			(options.claimTtlMs ?? DEFAULT_CLAIM_TTL_MS) <= 0
		) {
			throw new TypeError('RedisSchedulerProvider claimTtlMs must be a positive safe integer')
		}
		this.keyPrefix = options.keyPrefix ?? DEFAULT_KEY_PREFIX
		this.claimTtlMs = options.claimTtlMs ?? DEFAULT_CLAIM_TTL_MS
		this.ownsClient = options.client === undefined
		if (options.client) {
			this.client = options.client
		} else {
			const client = createClient(options.config)
			client.on('error', () => undefined)
			this.client = client as unknown as RedisSchedulerClient
		}
	}

	/** Connect the owned Redis client when it is not already open. */
	async start(): Promise<void> {
		if (!this.client.isOpen) {
			await this.client.connect()
		}
	}

	/** Acquire a token-checked distributed lease unless this occurrence is completed or already claimed. */
	async claimOccurrence(occurrence: SchedulerOccurrence): Promise<SchedulerOccurrenceClaim | undefined> {
		if (await this.isCompleted(occurrence)) {
			return undefined
		}
		const claimId = randomUUID()
		const acquired = await this.client.set(this.claimKey(occurrence.occurrenceId), claimId, {
			NX: true,
			PX: this.claimTtlMs,
		})
		if (acquired !== 'OK') {
			return undefined
		}
		if (await this.isCompleted(occurrence)) {
			await this.releaseClaim(occurrence.occurrenceId, claimId)
			return undefined
		}
		return { ...occurrence, claimId }
	}

	/** Persist completion only when this provider still owns the lease token. */
	async completeOccurrence(claim: SchedulerOccurrenceClaim): Promise<void> {
		await this.client.eval(completeScript, {
			keys: [this.claimKey(claim.occurrenceId), this.completedKey(claim.scheduleKey)],
			arguments: [claim.claimId, claim.scheduledAt],
		})
	}

	/** Relinquish a failed publication claim only when the token still matches. */
	async releaseOccurrence(claim: SchedulerOccurrenceClaim): Promise<void> {
		await this.releaseClaim(claim.occurrenceId, claim.claimId)
	}

	/** Disconnect only a client constructed by this provider. */
	async destroy(): Promise<void> {
		if (this.ownsClient && this.client.isOpen) {
			await this.client.disconnect()
		}
	}

	private async releaseClaim(occurrenceId: string, claimId: string): Promise<void> {
		await this.client.eval(releaseScript, {
			keys: [this.claimKey(occurrenceId)],
			arguments: [claimId],
		})
	}

	private claimKey(occurrenceId: string): string {
		return `${this.keyPrefix}claim:${occurrenceId}`
	}

	private async isCompleted(occurrence: SchedulerOccurrence): Promise<boolean> {
		const completedAt = await this.client.get(this.completedKey(occurrence.scheduleKey))
		return completedAt !== null && completedAt >= occurrence.scheduledAt
	}

	private completedKey(scheduleKey: string): string {
		return `${this.keyPrefix}completed:${scheduleKey}`
	}
}
