import { QueueDefinitionBuilder } from './QueueDefinitionBuilder.impl.js'

describe('QueueDefinitionBuilder', () => {
	it('applies long-running execution profile defaults', async () => {
		const definition = await new QueueDefinitionBuilder('billing.monthlyClosing', 'Monthly closing')
			.setExecutionProfile('longRunning', { maxRuntimeMs: 6 * 60 * 60_000 })
			.getDefinition()

		expect(definition.executionProfile).toEqual({
			name: 'longRunning',
			maxRuntimeMs: 6 * 60 * 60_000,
			strict: undefined,
			shutdown: { graceMs: 60_000, onTimeout: 'letLeaseExpire' },
			onLeaseLost: 'abort',
		})
		expect(definition.lifecycle).toMatchObject({
			visibilityTimeoutMs: 5 * 60_000,
			heartbeatIntervalMs: 60_000,
			autoHeartbeat: true,
			maxAttempts: 3,
			retryWindowMs: 24 * 60 * 60_000,
		})
		expect(definition.lifecycle?.maxLeaseExtensions).toBe(71)
	})

	it('stores result event policy and schedulable metadata', async () => {
		const definition = await new QueueDefinitionBuilder('billing.monthlyClosing', 'Monthly closing')
			.emitResultAsEvent('billing.monthlyClosing.completed', {
				failureEventName: 'billing.monthlyClosing.failed',
				delivery: 'required',
			})
			.markSchedulable({
				name: 'monthly-closing',
				expression: { kind: 'cron', value: '0 2 1 * *', timezone: 'Europe/Berlin' },
				concurrencyPolicy: 'forbid',
				missedRunPolicy: 'runOnce',
			})
			.getDefinition()

		expect(definition.resultPolicy).toMatchObject({
			mode: 'event',
			successEventName: 'billing.monthlyClosing.completed',
			failureEventName: 'billing.monthlyClosing.failed',
			delivery: 'required',
			eventId: 'jobIdAndStatus',
		})
		expect(definition.schedules).toEqual([
			expect.objectContaining({
				name: 'monthly-closing',
				targetKind: 'queue',
				targetName: 'billing.monthlyClosing',
				concurrencyPolicy: 'forbid',
				missedRunPolicy: 'runOnce',
			}),
		])
	})
})
