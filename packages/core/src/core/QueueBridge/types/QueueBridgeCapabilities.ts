/**
 * Capability matrix reported by a {@link QueueBridge}.
 *
 * These flags must describe provider guarantees honestly. PURISTA uses them
 * for strict capability validation at service startup; adapters should not
 * silently emulate stronger delivery, ordering, or idempotency guarantees than
 * they can actually enforce.
 *
 * @group Queue bridge
 */
export type QueueBridgeCapabilities = {
	/** Supports delayed or scheduled delivery through `delayMs`. */
	delayedDelivery: boolean
	/** Preserves first-in-first-out ordering for a queue. */
	fifoOrdering: boolean
	/** Supports routing or sharding by partition key. */
	partitions: boolean
	/** Supports priority ordering. */
	priorities: boolean
	/** Provider has native dead-letter queue support. */
	deadLetterNative: boolean
	/** Provider claims exactly-once queue delivery semantics. */
	exactlyOnce: boolean
	/** Largest provider batch size accepted by lease or enqueue operations. */
	maxBatchSize: number
	/** Prefix used by default when deriving dead-letter queue names. */
	defaultDeadLetterPrefix?: string
	/** Suffix used by default when deriving dead-letter queue names. */
	defaultDeadLetterSuffix?: string
	/** Deprecated alias indicating dead-letter inspection capability. */
	deadLetterInspectable: boolean
	/** Supports listing dead-letter messages. */
	deadLetterInspectSupported: boolean
	/** Supports redriving dead-letter messages. */
	deadLetterReplaySupported: boolean
	/** Supports purging dead-letter messages. */
	deadLetterPurgeSupported: boolean
	/** Supports inspecting active leases for diagnostics. */
	leaseInspectionSupported: boolean
	/** Enforces idempotency keys at the provider or adapter boundary. */
	idempotencyEnforcement: boolean
	/** Preserves ordering within a partition. */
	partitionOrdering: boolean
	/** Delayed delivery is handled by the provider rather than local polling. */
	providerManagedDelayedDelivery: boolean
	/** Adapter participates in strict startup capability validation. */
	strictStartupValidation: boolean
}
