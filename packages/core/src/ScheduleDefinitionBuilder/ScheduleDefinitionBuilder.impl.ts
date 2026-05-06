import type { ScheduleDefinition, ScheduleOptions, ScheduleTargetKind } from '../core/types/schedule/index.js'

export class ScheduleDefinitionBuilder {
	constructor(
		private readonly name: string,
		private readonly description: string,
	) {}

	/**
	 * Mark this schedule as emitting a PURISTA custom event.
	 *
	 * @example
	 * ```ts
	 * service
	 *   .getScheduleBuilder('monthlyBillingCycle', 'Monthly billing trigger')
	 *   .emitEvent('billing.monthlyCycleDue', {
	 *     expression: { kind: 'cron', value: '0 2 1 * *' },
	 *   })
	 * ```
	 */
	emitEvent(eventName: string, options: ScheduleOptions) {
		return this.createDefinition('event', eventName, options)
	}

	/**
	 * Mark this schedule as enqueueing one durable queue job.
	 */
	enqueueQueue(queueName: string, options: ScheduleOptions) {
		return this.createDefinition('queue', queueName, options)
	}

	/**
	 * Mark this schedule as invoking short, idempotent command trigger logic.
	 */
	invokeCommand(commandName: string, options: ScheduleOptions) {
		return this.createDefinition('command', commandName, options)
	}

	private createDefinition(targetKind: ScheduleTargetKind, targetName: string, options: ScheduleOptions): ScheduleDefinition {
		if (targetName.trim() === '') {
			throw new Error('ScheduleDefinitionBuilder requires a non-empty target name')
		}
		return {
			name: this.name,
			description: this.description,
			targetKind,
			targetName,
			payloadSchema: options.payloadSchema,
			parameterSchema: options.parameterSchema,
			expression: options.expression,
			timezone: options.timezone,
			concurrencyPolicy: options.concurrencyPolicy ?? 'allow',
			missedRunPolicy: options.missedRunPolicy ?? 'skip',
			maxCatchUpCount: options.maxCatchUpCount,
			jitterWindowMs: options.jitterWindowMs,
			idempotencyKey: options.idempotencyKey,
			enabledByDefault: options.enabledByDefault ?? true,
			providerHints: options.providerHints,
		}
	}
}
