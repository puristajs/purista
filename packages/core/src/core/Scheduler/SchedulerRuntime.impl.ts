import { createHash } from 'node:crypto'

import { CronExpressionParser } from 'cron-parser'

import type { EventBridge } from '../EventBridge/types/EventBridge.js'
import type { CustomMessage } from '../types/CustomMessage.js'
import type { EBMessageSenderAddress } from '../types/EBMessageSenderAddress.js'
import { EBMessageType } from '../types/EBMessageType.enum.js'
import type { ScheduleTriggerMetadata } from '../types/schedule/ScheduleDefinition.js'
import type {
	SchedulerClock,
	SchedulerDiagnosticCode,
	SchedulerOccurrence,
	SchedulerProvider,
	SchedulerRegistration,
	SchedulerRuntimeStatus,
	SchedulerStatus,
} from './types.js'
import { SchedulerDiagnosticError } from './types.js'

const systemClock: SchedulerClock = {
	now: () => Date.now(),
	setTimeout: (callback, delayMs) => setTimeout(callback, delayMs),
	clearTimeout: timer => clearTimeout(timer),
}

const defaultMaxOccurrencesPerTick = 1_000

/** Configuration for one independently deployed Scheduler Runtime host. @group Scheduler */
export type SchedulerRuntimeOptions = {
	/** Schedule declarations, usually loaded from an exported JSON manifest. */
	registrations: readonly SchedulerRegistration[]
	/** EventBridge used only to publish regular schedule trigger events. */
	eventBridge: EventBridge
	/** Provider responsible for occurrence ownership and durable state. */
	provider: SchedulerProvider
	/** Deployment group owned by this host. Defaults to `default`. */
	schedulerGroup?: string
	/** Poll cadence in milliseconds. Defaults to one second. */
	pollIntervalMs?: number
	/** Maximum occurrences evaluated for one schedule in one tick. Defaults to 1,000. */
	maxOccurrencesPerTick?: number
	/** Injectable time source for deterministic tests. */
	clock?: SchedulerClock
	/** Sender identity attached to emitted events. */
	sender?: Omit<EBMessageSenderAddress, 'instanceId'>
	/** Require durable provider state at startup. */
	strict?: boolean
	/** Require distributed occurrence claims at startup for a replicated scheduler host. */
	requireDistributedClaims?: boolean
}

type RuntimeSchedule = SchedulerRegistration & {
	scheduleKey: string
	scheduleName: string
	schedulerGroup: string
	concurrencyPolicy: 'allow' | 'forbid' | 'replace'
	missedRunPolicy: 'skip' | 'runOnce' | 'backfill'
}

/**
 * Core-owned scheduler loop that publishes regular PURISTA custom events.
 *
 * This runtime never loads business services or handlers. It can be hosted in
 * a small standalone process with an EventBridge and a SchedulerProvider.
 *
 * @group Scheduler
 */
export class SchedulerRuntime {
	private readonly clock: SchedulerClock
	private readonly pollIntervalMs: number
	private readonly maxOccurrencesPerTick: number
	private readonly schedulerGroup: string
	private readonly sender: Omit<EBMessageSenderAddress, 'instanceId'>
	private readonly schedules: RuntimeSchedule[]
	private readonly paused = new Set<string>()
	private readonly status = new Map<string, SchedulerStatus>()
	private readonly attempts = new Map<string, number>()
	private timer?: ReturnType<typeof setTimeout>
	private started = false

	constructor(private readonly options: SchedulerRuntimeOptions) {
		this.clock = options.clock ?? systemClock
		this.pollIntervalMs = options.pollIntervalMs ?? 1_000
		this.maxOccurrencesPerTick = options.maxOccurrencesPerTick ?? defaultMaxOccurrencesPerTick
		this.schedulerGroup = options.schedulerGroup ?? 'default'
		this.sender = options.sender ?? {
			serviceName: 'purista-scheduler',
			serviceVersion: '1',
			serviceTarget: this.schedulerGroup,
		}
		if (!Number.isFinite(this.pollIntervalMs) || this.pollIntervalMs <= 0) {
			throw new TypeError('SchedulerRuntime pollIntervalMs must be a positive finite number')
		}
		if (!Number.isSafeInteger(this.maxOccurrencesPerTick) || this.maxOccurrencesPerTick <= 0) {
			throw new TypeError('SchedulerRuntime maxOccurrencesPerTick must be a positive safe integer')
		}
		this.schedules = options.registrations
			.filter(schedule => (schedule.schedulerGroup ?? 'default') === this.schedulerGroup)
			.map(schedule => this.normalizeSchedule(schedule))
	}

	/**
	 * Validate registrations, start the provider and event bridge, and begin the
	 * independent scheduling loop. Calling this more than once is safe.
	 */
	async start() {
		if (this.started) {
			return
		}
		this.validateSchedules()
		await this.options.provider.start()
		await this.options.eventBridge.start()
		this.started = true
		const now = this.clock.now()
		for (const schedule of this.schedules) {
			this.status.set(schedule.scheduleKey, {
				scheduleKey: schedule.scheduleKey,
				scheduleName: schedule.scheduleName,
				schedulerGroup: schedule.schedulerGroup,
				targetKind: schedule.targetKind,
				targetName: schedule.targetName,
				enabled: schedule.enabledByDefault !== false,
				paused: false,
				lastEvaluatedAt: new Date(now).toISOString(),
				nextOccurrenceAt: this.toIsoOrUndefined(this.getNextOccurrence(schedule, now)),
			})
		}
		this.scheduleNextTick()
	}

	/**
	 * Stop future ticks and release runtime-owned provider and bridge resources.
	 * The runtime host owns these bindings, so do not share them with a business
	 * service that requires a longer lifecycle.
	 */
	async destroy() {
		if (this.timer) {
			this.clock.clearTimeout(this.timer)
			this.timer = undefined
		}
		this.started = false
		await this.options.provider.destroy()
		await this.options.eventBridge.destroy()
	}

	/**
	 * Evaluate all registrations once. This is primarily useful for deterministic
	 * hosts and tests; normal deployments use the loop started by {@link start}.
	 *
	 * @throws Error when called before {@link start}, or when a publication fails.
	 */
	async tick(now = this.clock.now()) {
		if (!this.started) {
			throw new Error('SchedulerRuntime must be started before ticking')
		}
		let firstError: unknown
		for (const schedule of this.schedules) {
			try {
				await this.evaluateSchedule(schedule, now)
			} catch (error) {
				const status = this.status.get(schedule.scheduleKey)
				if (status) {
					status.lastErrorCode =
						error instanceof SchedulerDiagnosticError ? error.code : 'PURISTA_SCHEDULER_PUBLISH_FAILED'
				}
				firstError ??= error
			}
		}
		if (firstError) {
			throw firstError
		}
	}

	/** Pause automatic publication for one known schedule without removing its registration. */
	pause(scheduleKey: string) {
		this.assertScheduleExists(scheduleKey)
		this.paused.add(scheduleKey)
		const status = this.status.get(scheduleKey)
		if (status) {
			status.paused = true
		}
	}

	/** Resume automatic publication for a schedule paused with {@link pause}. */
	resume(scheduleKey: string) {
		this.assertScheduleExists(scheduleKey)
		this.paused.delete(scheduleKey)
		const status = this.status.get(scheduleKey)
		if (status) {
			status.paused = false
		}
	}

	/**
	 * Publish one explicit occurrence immediately, even if the registration is
	 * paused or disabled. Consumers must still use the occurrence idempotency key.
	 */
	async triggerNow(scheduleKey: string) {
		const schedule = this.schedules.find(candidate => candidate.scheduleKey === scheduleKey)
		if (!schedule) {
			throw new Error(`Unknown schedule ${scheduleKey}`)
		}
		const now = this.clock.now()
		await this.publishOccurrence(schedule, now)
	}

	/** Return sorted, JSON-safe status records without provider secrets or payloads. */
	listStatus(): readonly SchedulerStatus[] {
		return [...this.status.values()]
			.map(value => ({ ...value }))
			.sort((left, right) => left.scheduleKey.localeCompare(right.scheduleKey))
	}

	/**
	 * Return a JSON-safe operator view for this runtime host.
	 *
	 * Provider capabilities are declarations, not proof of a currently healthy
	 * backend. Use provider-specific health checks for live infrastructure state.
	 */
	getRuntimeStatus(): SchedulerRuntimeStatus {
		return {
			started: this.started,
			schedulerGroup: this.schedulerGroup,
			provider: {
				name: this.options.provider.name,
				capabilities: { ...this.options.provider.capabilities },
			},
			schedules: this.listStatus(),
		}
	}

	private scheduleNextTick() {
		this.timer = this.clock.setTimeout(() => {
			void this.tick()
				.catch(() => undefined)
				.finally(() => {
					if (this.started) {
						this.scheduleNextTick()
					}
				})
		}, this.pollIntervalMs)
	}

	private async evaluateSchedule(schedule: RuntimeSchedule, now: number) {
		const status = this.status.get(schedule.scheduleKey)
		if (!status || schedule.enabledByDefault === false || this.paused.has(schedule.scheduleKey)) {
			return
		}
		const lastEvaluatedAt = status.lastEvaluatedAt ? Date.parse(status.lastEvaluatedAt) : now
		const gapMs = now - lastEvaluatedAt
		const selected = this.getSelectedOccurrences(schedule, lastEvaluatedAt, now, gapMs)

		for (const scheduledAt of selected) {
			await this.publishOccurrence(schedule, scheduledAt)
		}

		status.lastEvaluatedAt = new Date(now).toISOString()
		status.nextOccurrenceAt = this.toIsoOrUndefined(this.getNextOccurrence(schedule, now))
	}

	private async publishOccurrence(schedule: RuntimeSchedule, scheduledAt: number) {
		const occurrence: SchedulerOccurrence = {
			scheduleKey: schedule.scheduleKey,
			occurrenceId: this.getOccurrenceId(schedule.scheduleKey, scheduledAt),
			scheduledAt: new Date(scheduledAt).toISOString(),
		}
		const claim = await this.options.provider.claimOccurrence(occurrence)
		if (!claim) {
			return
		}

		const attemptedAt = new Date(this.clock.now()).toISOString()
		const status = this.status.get(schedule.scheduleKey)
		if (status) {
			status.lastAttemptedAt = attemptedAt
			status.lastAttemptedOccurrenceId = occurrence.occurrenceId
			status.lastAttemptedScheduledAt = occurrence.scheduledAt
		}

		const attempt = (this.attempts.get(occurrence.occurrenceId) ?? 0) + 1
		this.attempts.set(occurrence.occurrenceId, attempt)
		const scheduleMetadata: ScheduleTriggerMetadata = {
			...occurrence,
			scheduleName: schedule.scheduleName,
			firedAt: new Date(this.clock.now()).toISOString(),
			attempt,
		}

		try {
			const message: Omit<CustomMessage, 'id' | 'timestamp' | 'correlationId'> = {
				messageType: EBMessageType.CustomMessage,
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				sender: {
					...this.sender,
					instanceId: this.options.eventBridge.instanceId,
				},
				eventName: schedule.targetName,
				schedule: scheduleMetadata,
			}
			await this.options.eventBridge.emitMessage(message)
			await this.options.provider.completeOccurrence(claim)
			this.attempts.delete(occurrence.occurrenceId)
			if (status) {
				status.lastPublishedAt = scheduleMetadata.firedAt
				status.lastPublishedOccurrenceId = occurrence.occurrenceId
				status.lastPublishedScheduledAt = occurrence.scheduledAt
				status.lastPublicationLagMs = Math.max(
					0,
					Date.parse(scheduleMetadata.firedAt) - Date.parse(occurrence.scheduledAt),
				)
				status.lastErrorCode = undefined
			}
		} catch (error) {
			await this.options.provider.releaseOccurrence(claim)
			if (status) {
				status.lastErrorCode =
					error instanceof SchedulerDiagnosticError ? error.code : 'PURISTA_SCHEDULER_PUBLISH_FAILED'
			}
			throw error
		}
	}

	private getSelectedOccurrences(schedule: RuntimeSchedule, from: number, to: number, gapMs: number) {
		if (gapMs <= this.pollIntervalMs * 2) {
			return this.getOccurrences(schedule, from, to, this.maxOccurrencesPerTick)
		}
		switch (schedule.missedRunPolicy) {
			case 'skip': {
				const occurrences = this.getOccurrences(schedule, from, to, 2, true)
				return occurrences.length <= 1 ? occurrences : []
			}
			case 'runOnce': {
				const occurrence = this.getLatestOccurrence(schedule, from, to)
				return occurrence === undefined ? [] : [occurrence]
			}
			case 'backfill':
				return this.getOccurrences(
					schedule,
					from,
					to,
					Math.min(schedule.maxCatchUpCount ?? 1, this.maxOccurrencesPerTick),
					true,
				)
		}
	}

	private getOccurrences(
		schedule: RuntimeSchedule,
		from: number,
		to: number,
		limit: number,
		truncate = false,
	): number[] {
		if (to <= from) {
			return []
		}
		const { expression } = schedule
		switch (expression.kind) {
			case 'interval': {
				const first = (Math.floor(from / expression.everyMs) + 1) * expression.everyMs
				const occurrences: number[] = []
				for (let timestamp = first; timestamp <= to; timestamp += expression.everyMs) {
					if (occurrences.length === limit) {
						if (truncate) {
							return occurrences
						}
						this.throwDiagnostic(
							'PURISTA_SCHEDULER_OCCURRENCE_LIMIT_EXCEEDED',
							`Schedule exceeded the per-tick occurrence limit of ${limit}`,
							schedule,
						)
					}
					occurrences.push(timestamp)
				}
				return occurrences
			}
			case 'oneShot': {
				const runAt = this.parseOneShot(expression.runAt)
				return runAt > from && runAt <= to ? [runAt] : []
			}
			case 'cron': {
				const interval = CronExpressionParser.parse(expression.value, {
					currentDate: new Date(from),
					endDate: new Date(to),
					tz: expression.timezone ?? schedule.timezone,
				})
				const occurrences: number[] = []
				while (true) {
					try {
						const next = interval.next().toDate().getTime()
						if (next > to) {
							return occurrences
						}
						if (occurrences.length === limit) {
							if (truncate) {
								return occurrences
							}
							this.throwDiagnostic(
								'PURISTA_SCHEDULER_OCCURRENCE_LIMIT_EXCEEDED',
								`Schedule exceeded the per-tick occurrence limit of ${limit}`,
								schedule,
							)
						}
						occurrences.push(next)
					} catch {
						return occurrences
					}
				}
			}
		}
	}

	private getLatestOccurrence(schedule: RuntimeSchedule, from: number, to: number) {
		switch (schedule.expression.kind) {
			case 'interval': {
				const occurrence = Math.floor(to / schedule.expression.everyMs) * schedule.expression.everyMs
				return occurrence > from ? occurrence : undefined
			}
			case 'oneShot': {
				const occurrence = this.parseOneShot(schedule.expression.runAt)
				return occurrence > from && occurrence <= to ? occurrence : undefined
			}
			case 'cron':
				try {
					const occurrence = CronExpressionParser.parse(schedule.expression.value, {
						currentDate: new Date(to),
						startDate: new Date(from),
						tz: schedule.expression.timezone ?? schedule.timezone,
					})
						.prev()
						.toDate()
						.getTime()
					return occurrence > from ? occurrence : undefined
				} catch {
					return undefined
				}
		}
	}

	private getNextOccurrence(schedule: RuntimeSchedule, now: number) {
		switch (schedule.expression.kind) {
			case 'interval':
				return (Math.floor(now / schedule.expression.everyMs) + 1) * schedule.expression.everyMs
			case 'oneShot': {
				const runAt = this.parseOneShot(schedule.expression.runAt)
				return runAt > now ? runAt : undefined
			}
			case 'cron':
				try {
					return CronExpressionParser.parse(schedule.expression.value, {
						currentDate: new Date(now),
						tz: schedule.expression.timezone ?? schedule.timezone,
					})
						.next()
						.toDate()
						.getTime()
				} catch {
					return undefined
				}
		}
	}

	private normalizeSchedule(schedule: SchedulerRegistration): RuntimeSchedule {
		return {
			...schedule,
			scheduleKey: schedule.scheduleKey,
			scheduleName: schedule.scheduleName,
			schedulerGroup: schedule.schedulerGroup ?? 'default',
			concurrencyPolicy: schedule.concurrencyPolicy ?? 'allow',
			missedRunPolicy: schedule.missedRunPolicy ?? 'skip',
		}
	}

	private validateSchedules() {
		for (const schedule of this.schedules) {
			if (schedule.targetKind !== 'event') {
				this.throwDiagnostic(
					'PURISTA_SCHEDULER_TARGET_UNSUPPORTED',
					'Core Scheduler Runtime supports event schedules only',
					schedule,
				)
			}
			if (schedule.concurrencyPolicy !== 'allow') {
				this.throwDiagnostic(
					'PURISTA_SCHEDULER_CONCURRENCY_UNSUPPORTED',
					'Event-only scheduler runtime cannot control downstream business concurrency',
					schedule,
				)
			}
			if (schedule.payloadSchema !== undefined) {
				this.throwDiagnostic(
					'PURISTA_SCHEDULER_PAYLOAD_UNSUPPORTED',
					'Event-only scheduler runtime emits trigger events without a business payload',
					schedule,
				)
			}
			this.validateTimezone(schedule)
			this.validateExpression(schedule)
		}

		if (this.options.strict && !this.options.provider.capabilities.durableOccurrenceState) {
			this.throwDiagnostic(
				'PURISTA_SCHEDULER_PROVIDER_CAPABILITY_MISSING',
				'Strict Scheduler Runtime requires durable occurrence state',
				{ provider: this.options.provider.name },
			)
		}
		if (this.options.requireDistributedClaims && !this.options.provider.capabilities.distributedOccurrenceClaims) {
			this.throwDiagnostic(
				'PURISTA_SCHEDULER_PROVIDER_CAPABILITY_MISSING',
				'Replicated Scheduler Runtime requires distributed occurrence claims',
				{ provider: this.options.provider.name },
			)
		}
	}

	private validateTimezone(schedule: RuntimeSchedule) {
		const expressionTimezone = schedule.expression.kind === 'cron' ? schedule.expression.timezone : undefined
		if (expressionTimezone && schedule.timezone && expressionTimezone !== schedule.timezone) {
			this.throwDiagnostic(
				'PURISTA_SCHEDULER_TIMEZONE_INVALID',
				'Schedule timezone must not conflict with cron timezone',
				schedule,
			)
		}
		const timezone = expressionTimezone ?? schedule.timezone
		if (!timezone) {
			return
		}
		try {
			new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format()
		} catch {
			this.throwDiagnostic('PURISTA_SCHEDULER_TIMEZONE_INVALID', `Invalid IANA timezone ${timezone}`, schedule)
		}
	}

	private validateExpression(schedule: RuntimeSchedule) {
		switch (schedule.expression.kind) {
			case 'cron': {
				if (schedule.expression.value.trim().split(/\s+/).length !== 5) {
					this.throwDiagnostic(
						'PURISTA_SCHEDULER_CRON_INVALID',
						'Scheduler Runtime accepts five-field cron expressions',
						schedule,
					)
				}
				try {
					CronExpressionParser.parse(schedule.expression.value, {
						currentDate: new Date(this.clock.now()),
						tz: schedule.expression.timezone ?? schedule.timezone,
					})
				} catch {
					this.throwDiagnostic('PURISTA_SCHEDULER_CRON_INVALID', 'Invalid cron expression', schedule)
				}
				return
			}
			case 'interval':
				if (!Number.isFinite(schedule.expression.everyMs) || schedule.expression.everyMs <= 0) {
					this.throwDiagnostic(
						'PURISTA_SCHEDULER_INTERVAL_INVALID',
						'Interval everyMs must be a positive finite number',
						schedule,
					)
				}
				return
			case 'oneShot':
				this.parseOneShot(schedule.expression.runAt, schedule)
		}
	}

	private parseOneShot(value: string | number | Date, schedule?: RuntimeSchedule) {
		const result = value instanceof Date ? value.getTime() : typeof value === 'number' ? value : Date.parse(value)
		if (!Number.isFinite(result)) {
			this.throwDiagnostic(
				'PURISTA_SCHEDULER_ONESHOT_INVALID',
				'One-shot runAt must be a valid timestamp',
				schedule ?? {},
			)
		}
		return result
	}

	private getOccurrenceId(scheduleKey: string, scheduledAt: number) {
		return createHash('sha256')
			.update(`${scheduleKey}:${new Date(scheduledAt).toISOString()}`)
			.digest('base64url')
	}

	private assertScheduleExists(scheduleKey: string) {
		if (!this.status.has(scheduleKey)) {
			throw new Error(`Unknown schedule ${scheduleKey}`)
		}
	}

	private toIsoOrUndefined(timestamp: number | undefined) {
		return timestamp === undefined ? undefined : new Date(timestamp).toISOString()
	}

	private throwDiagnostic(code: SchedulerDiagnosticCode, message: string, context: Record<string, unknown>) {
		throw new SchedulerDiagnosticError(code, message, {
			scheduleKey: context.scheduleKey,
			scheduleName: context.scheduleName,
			...context,
		})
	}
}
