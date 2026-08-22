import type { RedisClientOptions } from '@redis/client'

/** Minimal Redis commands required by {@link RedisSchedulerProvider}. @group Scheduler */
export interface RedisSchedulerClient {
	/** Whether the client currently has an open Redis connection. */
	readonly isOpen: boolean
	/** Open the Redis connection. */
	connect(): Promise<void>
	/** Close the Redis connection. */
	disconnect(): Promise<void>
	/** Read a Redis string value, returning `null` when the key is absent. */
	get(key: string): Promise<string | null>
	/** Atomically write a value only if absent, with a millisecond expiry. */
	set(key: string, value: string, options: { NX: true; PX: number }): Promise<string | null>
	/** Run an atomic Redis script used to finish or release a claim. */
	eval(script: string, options: { keys: string[]; arguments: string[] }): Promise<unknown>
}

/**
 * Configuration for {@link RedisSchedulerProvider}.
 *
 * A claim is a Redis `SET NX PX` lease. Completion is recorded only when the
 * claim token still matches. A crash after event publication but before
 * completion can therefore lead to a later duplicate trigger; consumers must
 * use `message.schedule.occurrenceId` for idempotent business effects.
 *
 * @group Scheduler
 */
export type RedisSchedulerProviderOptions = {
	/** Node Redis client configuration used when no client is supplied. */
	config?: RedisClientOptions
	/** Key prefix for claims and completed occurrences. */
	keyPrefix?: string
	/** Lease duration for one active publisher. Defaults to 60 seconds. */
	claimTtlMs?: number
	/** Optional injected Redis client for tests or application-managed connections. */
	client?: RedisSchedulerClient
}
