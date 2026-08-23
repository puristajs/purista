import type { ScheduleExpression, ScheduleTriggerMetadata } from '../types/schedule/ScheduleDefinition.js'

/**
 * Provider guarantees used by Scheduler Runtime startup validation.
 *
 * A provider must report only guarantees it can enforce across every scheduler
 * replica that shares the same schedule group.
 *
 * @group Scheduler
 */
export type SchedulerProviderCapabilities = {
	durableOccurrenceState: boolean
	distributedOccurrenceClaims: boolean
	idempotentPublication: boolean
}

/**
 * One normalized schedule registration loaded by a Scheduler Runtime.
 *
 * Registrations normally come from `exportScheduleManifest`. The Core runtime
 * accepts only `event` targets; queue and command registrations remain valid
 * inputs for external scheduler exporters.
 *
 * @group Scheduler
 */
export type SchedulerRegistration = {
	scheduleKey: string
	scheduleName: string
	targetKind: string
	targetName: string
	expression: ScheduleExpression
	timezone?: string
	concurrencyPolicy?: 'allow' | 'forbid' | 'replace'
	missedRunPolicy?: 'skip' | 'runOnce' | 'backfill'
	maxCatchUpCount?: number
	enabledByDefault?: boolean
	schedulerGroup?: string
	payloadSchema?: unknown
}

/** A scheduler occurrence awaiting publication. @group Scheduler */
export type SchedulerOccurrence = Pick<ScheduleTriggerMetadata, 'scheduleKey' | 'occurrenceId' | 'scheduledAt'>

/** Opaque ownership token returned by a SchedulerProvider claim. @group Scheduler */
export type SchedulerOccurrenceClaim = SchedulerOccurrence & { claimId: string }

/** Provider contract for occurrence ownership and recovery. @group Scheduler */
export interface SchedulerProvider {
	readonly name: string
	readonly capabilities: SchedulerProviderCapabilities
	start(): Promise<void>
	claimOccurrence(occurrence: SchedulerOccurrence): Promise<SchedulerOccurrenceClaim | undefined>
	completeOccurrence(claim: SchedulerOccurrenceClaim): Promise<void>
	releaseOccurrence(claim: SchedulerOccurrenceClaim): Promise<void>
	destroy(): Promise<void>
}

/** Clock abstraction used for deterministic Scheduler Runtime tests. @group Scheduler */
export type SchedulerClock = {
	now(): number
	setTimeout(callback: () => void, delayMs: number): ReturnType<typeof setTimeout>
	clearTimeout(timer: ReturnType<typeof setTimeout>): void
}

/** Runtime-visible schedule state. @group Scheduler */
export type SchedulerStatus = {
	scheduleKey: string
	scheduleName: string
	schedulerGroup: string
	/** Declared event-only target, included so operators can identify the registration safely. */
	targetKind: string
	/** Declared event name; no business payload is exposed. */
	targetName: string
	enabled: boolean
	paused: boolean
	lastEvaluatedAt?: string
	lastAttemptedAt?: string
	lastAttemptedOccurrenceId?: string
	lastAttemptedScheduledAt?: string
	lastPublishedAt?: string
	lastPublishedOccurrenceId?: string
	lastPublishedScheduledAt?: string
	/** Observed publication delay for the most recently published occurrence. */
	lastPublicationLagMs?: number
	nextOccurrenceAt?: string
	lastErrorCode?: string
}

/**
 * JSON-safe operational view of one Scheduler Runtime host.
 *
 * This view reports only Core-owned registration and provider capability facts.
 * It does not claim a live distributed owner, health of an external EventBridge,
 * or exactly-once business effects.
 *
 * @group Scheduler
 */
export type SchedulerRuntimeStatus = {
	started: boolean
	schedulerGroup: string
	provider: {
		name: string
		capabilities: SchedulerProviderCapabilities
	}
	schedules: readonly SchedulerStatus[]
}

/** Stable codes emitted when a schedule cannot run in the Core runtime. @group Scheduler */
export type SchedulerDiagnosticCode =
	| 'PURISTA_SCHEDULER_TARGET_UNSUPPORTED'
	| 'PURISTA_SCHEDULER_CONCURRENCY_UNSUPPORTED'
	| 'PURISTA_SCHEDULER_PAYLOAD_UNSUPPORTED'
	| 'PURISTA_SCHEDULER_TIMEZONE_INVALID'
	| 'PURISTA_SCHEDULER_CRON_INVALID'
	| 'PURISTA_SCHEDULER_INTERVAL_INVALID'
	| 'PURISTA_SCHEDULER_ONESHOT_INVALID'
	| 'PURISTA_SCHEDULER_PROVIDER_CAPABILITY_MISSING'
	| 'PURISTA_SCHEDULER_OCCURRENCE_LIMIT_EXCEEDED'

/**
 * Error carrying a stable Scheduler Runtime diagnostic code.
 *
 * Consumers should branch on {@link SchedulerDiagnosticError.code}, not on the
 * human-readable message.
 *
 * @group Scheduler
 */
export class SchedulerDiagnosticError extends Error {
	/** Create a scheduler diagnostic with optional JSON-safe context. */
	constructor(
		public readonly code: SchedulerDiagnosticCode,
		message: string,
		public readonly data?: Record<string, unknown>,
	) {
		super(message)
		this.name = 'SchedulerDiagnosticError'
	}
}
