import type { Schema } from '../../../schema/index.js'

export type ScheduleExpression =
	| { kind: 'cron'; value: string; timezone?: string }
	| { kind: 'interval'; everyMs: number }
	| { kind: 'oneShot'; runAt: string | number | Date }

export type ScheduleTargetKind = 'event' | 'queue' | 'command'
export type ScheduleConcurrencyPolicy = 'allow' | 'forbid' | 'replace'
export type ScheduleMissedRunPolicy = 'skip' | 'runOnce' | 'backfill'

/**
 * Provider-neutral schedule metadata exported from PURISTA definitions.
 *
 * PURISTA does not run production schedules. This contract lets external
 * schedulers emit an event, enqueue a queue job, or call a short command.
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
	enabledByDefault: boolean
	providerHints?: Record<string, unknown>
}

export type ScheduleOptions = {
	expression: ScheduleExpression
	timezone?: string
	concurrencyPolicy?: ScheduleConcurrencyPolicy
	missedRunPolicy?: ScheduleMissedRunPolicy
	maxCatchUpCount?: number
	jitterWindowMs?: number
	idempotencyKey?: string
	enabledByDefault?: boolean
	providerHints?: Record<string, unknown>
	payloadSchema?: Schema
	parameterSchema?: Schema
}
