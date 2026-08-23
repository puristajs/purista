import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import { SchedulerRuntime } from '../core/Scheduler/SchedulerRuntime.impl.js'
import type { SchedulerClock, SchedulerProvider, SchedulerRegistration } from '../core/Scheduler/types.js'
import type { EBMessageSenderAddress } from '../core/types/EBMessageSenderAddress.js'
import type { ScheduleManifest } from '../helper/enterpriseInterop.js'

/**
 * Builder for a standalone Core Scheduler Runtime host.
 *
 * It consumes manifest declarations and infrastructure bindings only; it does
 * not instantiate application ServiceBuilder instances or business handlers.
 *
 * @example
 * ```ts
 * const scheduler = new SchedulerBuilder('billing')
 *   .loadManifest(manifest)
 *   .useEventBridge(eventBridge)
 *   .useProvider(redisSchedulerProvider)
 *   .setStrict()
 *   .setRequireDistributedClaims()
 *   .getInstance()
 * await scheduler.start()
 * ```
 *
 * @group Scheduler
 */
export class SchedulerBuilder {
	private registrations: SchedulerRegistration[] = []
	private eventBridge?: EventBridge
	private provider?: SchedulerProvider
	private clock?: SchedulerClock
	private pollIntervalMs?: number
	private maxOccurrencesPerTick?: number
	private sender?: Omit<EBMessageSenderAddress, 'instanceId'>
	private strict = false
	private requireDistributedClaims = false

	/**
	 * Create a builder for one independently deployed scheduler group.
	 *
	 * Groups let deployments split unrelated schedule sets without loading the
	 * business services that declared them.
	 */
	constructor(private readonly schedulerGroup = 'default') {}

	/**
	 * Load provider-neutral schedule declarations exported from application definitions.
	 * Replaces any declarations loaded earlier on this builder.
	 */
	loadManifest(manifest: ScheduleManifest) {
		this.registrations = manifest.schedules.map(schedule => ({
			scheduleKey: `${schedule.targetServiceName ?? 'unknown'}/${schedule.targetServiceVersion ?? 'unknown'}/${schedule.name}`,
			scheduleName: schedule.name,
			targetKind: schedule.targetKind,
			targetName: schedule.targetName,
			expression: schedule.expression,
			timezone: schedule.timezone,
			concurrencyPolicy: schedule.concurrencyPolicy,
			missedRunPolicy: schedule.missedRunPolicy,
			maxCatchUpCount: schedule.maxCatchUpCount,
			enabledByDefault: schedule.enabledByDefault,
			schedulerGroup: schedule.schedulerGroup,
			payloadSchema: schedule.payloadSchema,
		}))
		return this
	}

	/** Bind the EventBridge used solely to publish schedule trigger events. */
	useEventBridge(eventBridge: EventBridge) {
		this.eventBridge = eventBridge
		return this
	}

	/** Bind the provider that owns occurrence claims and durability guarantees. */
	useProvider(provider: SchedulerProvider) {
		this.provider = provider
		return this
	}

	/** Use an injectable clock for deterministic local development and tests. */
	useClock(clock: SchedulerClock) {
		this.clock = clock
		return this
	}

	/** Configure polling granularity in milliseconds. The value must be positive. */
	setPollInterval(pollIntervalMs: number) {
		this.pollIntervalMs = pollIntervalMs
		return this
	}

	/** Bound work performed for one declaration during one scheduler tick. */
	setMaxOccurrencesPerTick(maxOccurrencesPerTick: number) {
		this.maxOccurrencesPerTick = maxOccurrencesPerTick
		return this
	}

	/** Override the sender identity attached to emitted trigger events. */
	setSender(sender: Omit<EBMessageSenderAddress, 'instanceId'>) {
		this.sender = sender
		return this
	}

	/** Require durable provider state during startup validation. */
	setStrict(strict = true) {
		this.strict = strict
		return this
	}

	/** Require a provider with distributed occurrence claims for a replicated scheduler host. */
	setRequireDistributedClaims(required = true) {
		this.requireDistributedClaims = required
		return this
	}

	/**
	 * Create the independent Scheduler Runtime.
	 *
	 * @throws Error when an EventBridge or SchedulerProvider is not configured.
	 */
	getInstance() {
		if (!this.eventBridge) {
			throw new Error('SchedulerBuilder requires an EventBridge')
		}
		if (!this.provider) {
			throw new Error('SchedulerBuilder requires a SchedulerProvider')
		}
		return new SchedulerRuntime({
			registrations: this.registrations,
			eventBridge: this.eventBridge,
			provider: this.provider,
			schedulerGroup: this.schedulerGroup,
			clock: this.clock,
			pollIntervalMs: this.pollIntervalMs,
			maxOccurrencesPerTick: this.maxOccurrencesPerTick,
			sender: this.sender,
			strict: this.strict,
			requireDistributedClaims: this.requireDistributedClaims,
		})
	}
}
