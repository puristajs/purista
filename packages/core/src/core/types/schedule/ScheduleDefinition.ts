import type { Schema } from '../../../schema/index.js'

/** Time expression evaluated by a scheduler. @group Scheduler */
export type ScheduleExpression =
	| { kind: 'cron'; value: string; timezone?: string }
	| { kind: 'interval'; everyMs: number }
	| { kind: 'oneShot'; runAt: string | number | Date }

/** Provider-neutral target kinds retained for Core and external scheduler exports. @group Scheduler */
export type ScheduleTargetKind = 'event' | 'queue' | 'command'
/** Downstream execution policy interpreted by capable external schedulers. @group Scheduler */
export type ScheduleConcurrencyPolicy = 'allow' | 'forbid' | 'replace'
/** Policy for occurrences missed while a capable scheduler is unavailable. @group Scheduler */
export type ScheduleMissedRunPolicy = 'skip' | 'runOnce' | 'backfill'

/**
 * Metadata attached to a custom event emitted by the Core Scheduler Runtime.
 *
 * The scheduler never wraps or mutates the application's event payload. Use
 * `occurrenceId` as the idempotency key for downstream business effects.
 *
 * @group Scheduler
 */
export type ScheduleTriggerMetadata = {
	scheduleKey: string
	scheduleName: string
	occurrenceId: string
	scheduledAt: string
	firedAt: string
	attempt: number
}

/**
 * Provider-neutral schedule metadata exported from PURISTA definitions.
 *
 * The Core Scheduler Runtime consumes event schedules from a separate host.
 * Queue and command schedules remain provider-neutral export contracts for
 * external schedulers.
 *
 * @example
 * ```ts
 * service
 *   .getScheduleBuilder('monthlyBillingCycle', 'Monthly billing trigger')
 *   .emitEvent('billing.monthlyCycleDue', {
 *     expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
 *   })
 * ```
 */
export type ScheduleDefinition = {
	name: string
	description?: string
	targetKind: ScheduleTargetKind
	targetServiceName?: string
	targetServiceVersion?: string
	targetName: string
	payloadSchema?: Schema
	parameterSchema?: Schema
	expression: ScheduleExpression
	timezone?: string
	concurrencyPolicy: ScheduleConcurrencyPolicy
	missedRunPolicy: ScheduleMissedRunPolicy
	maxCatchUpCount?: number
	jitterWindowMs?: number
	idempotencyKey?: string
	/** Scheduler deployment group that owns this schedule. */
	schedulerGroup?: string
	enabledByDefault: boolean
	providerHints?: Record<string, unknown>
}

/** Options used to declare a provider-neutral schedule contract. @group Scheduler */
export type ScheduleOptions = {
	expression: ScheduleExpression
	timezone?: string
	concurrencyPolicy?: ScheduleConcurrencyPolicy
	missedRunPolicy?: ScheduleMissedRunPolicy
	maxCatchUpCount?: number
	jitterWindowMs?: number
	idempotencyKey?: string
	/** Scheduler deployment group that owns this schedule. */
	schedulerGroup?: string
	enabledByDefault?: boolean
	providerHints?: Record<string, unknown>
	payloadSchema?: Schema
	parameterSchema?: Schema
}
